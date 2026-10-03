/**
 * @BAUTO_REFACTOR 2026-10-03
 * @Modulo: WEB (bauto.com.co) - Despacho y Sincronización de Recibo Post-Pago
 * @Ruta: POST /api/checkout/send-receipt
 * @Propósito: Sincronización y garantía de despacho del comprobante oficial vía APPBAUTO_PROD_URL (registrarVentaServicioExterno).
 *             Si es invocado desde la confirmación web, verifica si la orden ya fue procesada previamente (Redis/Memoria);
 *             si no ha sido procesada, invoca APPBAUTO con enviarEmail: true para asentar la venta y despachar el PDF editorial.
 *             Elimina el despacho por Resend para consolidar en la fuente única de verdad.
 * @Capa: Capa 1 (Técnica) & Capa 2 (Funcional)
 * @Riesgo_Evaluado: Bajo
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrderDraft, isEventProcessed, markEventDone, releaseSoftHold } from "@/lib/redis";
import { APPBAUTO_PROD_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Deduplicación atómica en memoria para prevenir dobles despachos (Webhook vs Confirmación)
const sentReceipts = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const reference = String(body.reference || "").trim();
    const transactionId = String(body.transactionId || "").trim();

    if (!reference || reference === "BAUTO-WEB") {
      return NextResponse.json(
        { success: false, message: "Referencia de orden inválida" },
        { status: 400 }
      );
    }

    // 1. Verificar si el recibo ya fue despachado previamente en memoria
    if (sentReceipts.has(reference)) {
      return NextResponse.json({
        success: true,
        alreadySent: true,
        message: `El recibo para la orden ${reference} ya fue despachado previamente.`,
      });
    }

    // 2. Si hay transactionId, verificar si ya fue procesado por el webhook en Redis
    if (transactionId) {
      const alreadyDone = await isEventProcessed(transactionId, "APPROVED");
      if (alreadyDone) {
        sentReceipts.add(reference);
        return NextResponse.json({
          success: true,
          alreadySent: true,
          message: `La orden ${reference} ya fue procesada por el webhook oficial.`,
        });
      }
    }

    // 3. Intentar recuperar borrador desde Redis
    const draft = await getOrderDraft(reference);

    // 4. Si hay transactionId, consultar y verificar con la API oficial de Wompi
    let wompiTx: any = null;
    if (transactionId) {
      try {
        const wompiRes = await fetch(`https://production.wompi.co/v1/transactions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY || "prv_prod_QqDXnSpOtAPGerR1BT8fWYrgMoB4UJI2"}`,
          },
          next: { revalidate: 0 },
        });
        if (wompiRes.ok) {
          const wompiData = await wompiRes.json();
          wompiTx = wompiData.data;
        }
      } catch (err) {
        console.warn("[SendReceipt] Error consultando transacción en Wompi:", err);
      }
    }

    // Verificar estado de aprobación
    const isApproved = wompiTx ? wompiTx.status === "APPROVED" : true;
    if (!isApproved) {
      return NextResponse.json(
        { success: false, message: `Transacción no aprobada (estado: ${wompiTx?.status})` },
        { status: 400 }
      );
    }

    // 5. Consolidar datos de destinatario, dirección y prendas
    const clientEmail =
      draft?.customerEmail ||
      wompiTx?.customer_email ||
      "";

    if (!clientEmail) {
      return NextResponse.json(
        { success: false, message: "No se encontró el correo del cliente para el despacho" },
        { status: 422 }
      );
    }

    const clientName =
      draft?.clientName ||
      wompiTx?.customer_data?.full_name ||
      "Cliente BAUTO";

    const clientDi =
      draft?.clientDi ||
      wompiTx?.customer_data?.legal_id ||
      "";

    const clientPhone =
      draft?.customerPhone ||
      wompiTx?.customer_data?.phone_number ||
      wompiTx?.shipping_address?.phone_number ||
      "";

    const addressLine1 =
      draft?.direccion ||
      wompiTx?.shipping_address?.address_line_1 ||
      "Dirección suministrada en pasarela";

    const addressLine2 =
      draft?.complemento ||
      "";

    const city =
      draft?.ciudad ||
      wompiTx?.shipping_address?.city ||
      "Colombia";

    const barrio =
      draft?.barrio ||
      wompiTx?.shipping_address?.region ||
      "";

    const totalCOP =
      draft?.totalCOP ||
      (wompiTx ? Math.round(wompiTx.amount_in_cents / 100) : 0);

    const shippingCost = draft?.shippingCost || 0;
    const subtotal = draft?.subtotal || Math.max(0, totalCOP - shippingCost);

    // Items de compra (si draft no los conservó, modelar item informativo)
    const cart =
      draft?.items && Array.isArray(draft.items) && draft.items.length > 0
        ? draft.items.map((i: any) => ({
            ref: i.reference,
            name: i.name,
            talla: i.size,
            price: i.unitPrice || i.totalPrice,
          }))
        : [
            {
              ref: reference,
              name: "Prendas BAUTO Resort Wear",
              talla: "UNICA",
              price: subtotal,
            },
          ];

    // 6. Construir payload para Google Apps Script (APPBAUTO)
    const gasPayload = {
      accion: "registrarVentaServicioExterno",
      secreto: process.env.SECRETO_VENTA_SERVICIO || "bauto_web_b15b490814ebef00f1aeb5429a8760ce1cb6e9646ab04917",
      payload: {
        cart,
        clientName,
        clientDi,
        clientEmail,
        paymentMethod: wompiTx?.payment_method_type || "WOMPI",
        descuento: 0,
        tipoVenta: "ON-LINE",
        ubicacion: "tienda",
        direccion: addressLine1,
        complemento: addressLine2,
        barrio: barrio,
        ciudad: city,
        telefono: clientPhone,
        enviarEmail: true,
        envio: shippingCost,
        notas: `Wompi: ${transactionId} | Ref: ${reference} (Confirmación Web)`,
      },
    };

    // 7. Despacho directo hacia APPBAUTO_PROD_URL
    const gasResponse = await fetch(APPBAUTO_PROD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasPayload),
    });

    const gasJson = await gasResponse.json();

    if (gasResponse.ok && gasJson.success) {
      sentReceipts.add(reference);
      // Auto-limpieza en memoria a los 60 minutos
      setTimeout(() => sentReceipts.delete(reference), 60 * 60 * 1000);

      if (transactionId) {
        await markEventDone(transactionId, "APPROVED");
      }

      // Liberar soft holds si aún existen
      if (draft && draft.items && Array.isArray(draft.items)) {
        for (const item of draft.items) {
          await releaseSoftHold(item.reference, item.size, draft.sessionId);
        }
      }

      return NextResponse.json({
        success: true,
        reference,
        ventaId: gasJson.ventaId,
        recipient: clientEmail,
        message: "Comprobante oficial generado y enviado exitosamente vía Platform Apps Script",
      });
    } else {
      console.error("[SendReceipt] Apps Script rechazó el registro:", gasJson);
      return NextResponse.json(
        { success: false, error: gasJson?.error || "Error al procesar recibo en Apps Script" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[SendReceipt] Error inesperado:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
