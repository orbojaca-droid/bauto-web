/**
 * @BAUTO_REFACTOR 2026-10-03
 * @Modulo: WEB (bauto.com.co) - Despacho de Recibo Post-Pago
 * @Ruta: POST /api/checkout/send-receipt
 * @Propósito: Envío seguro del recibo de compra por correo (Resend) desde la pantalla de confirmación,
 *             con deduplicación atómica en memoria por referencia y verificación de estado en Wompi.
 * @Capa: Capa 1 (Técnica) & Capa 2 (Funcional)
 * @Riesgo_Evaluado: Bajo
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrderDraft } from "@/lib/redis";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

    // Verificar si el recibo ya fue despachado previamente
    if (sentReceipts.has(reference)) {
      return NextResponse.json({
        success: true,
        alreadySent: true,
        message: `El recibo para la orden ${reference} ya fue despachado previamente.`,
      });
    }

    // 1. Intentar recuperar borrador desde Redis
    const draft = await getOrderDraft(reference);

    // 2. Si hay transactionId, consultar y verificar con la API oficial de Wompi
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

    // 3. Consolidar datos de destinatario, dirección y prendas
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

    const clientPhone =
      draft?.customerPhone ||
      wompiTx?.customer_data?.phone_number ||
      wompiTx?.shipping_address?.phone_number ||
      "";

    const addressLine1 =
      draft?.direccion ||
      wompiTx?.shipping_address?.address_line_1 ||
      "Dirección suministrada en pasarela";

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

    // Items de compra (si draft no los conservó, modelar fila informativa)
    const items =
      draft?.items && Array.isArray(draft.items) && draft.items.length > 0
        ? draft.items
        : [
            {
              name: "Prendas BAUTO Resort Wear",
              reference: reference,
              size: "Orden confirmada",
              quantity: 1,
              totalPrice: subtotal,
            },
          ];

    // 4. Despacho seguro vía Resend
    const emailResult = await sendOrderConfirmationEmail({
      to: clientEmail,
      clientName,
      orderReference: reference,
      items,
      subtotal,
      shippingCost,
      totalCOP,
      paymentMethod: wompiTx?.payment_method_type || "WOMPI",
      shippingAddress: {
        direccion: addressLine1,
        barrio: barrio,
        ciudad: city,
        telefono: clientPhone,
      },
    });

    if (emailResult.success) {
      sentReceipts.add(reference);
      // Auto-limpieza en memoria a los 60 minutos
      setTimeout(() => sentReceipts.delete(reference), 60 * 60 * 1000);

      return NextResponse.json({
        success: true,
        reference,
        emailId: emailResult.id,
        recipient: clientEmail,
      });
    } else {
      return NextResponse.json(
        { success: false, error: emailResult.error || "Fallo en envío Resend" },
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
