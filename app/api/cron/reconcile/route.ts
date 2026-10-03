/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Cron de Conciliación de Pagos Wompi vs Google Sheets
 * @Ruta: GET /api/cron/reconcile
 * @Propósito: Ejecutado periódicamente por Vercel Cron (ej: cada 30 min) para garantizar
 *             cero pérdidas de ventas huérfanas en caso de fallas transitorias de red en webhooks.
 *             - Autenticación estricta con Bearer CRON_SECRET (fail-closed).
 *             - Consulta dirigida a Wompi por referencia de borradores pendientes (/v1/transactions?reference=...).
 *             - Validación rigurosa de confirmación en Google Apps Script antes de marcar como completado.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  isEventProcessed,
  markEventProcessing,
  markEventDone,
  deleteEventLock,
  releaseSoftHold,
  getOrderDraft,
  getAllOrderDraftReferences,
} from "../../../../lib/redis";
import { APPBAUTO_PROD_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Verificación de seguridad estricta del cron de Vercel (Fail-closed)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Token de Cron ausente o inválido." },
        { status: 401 }
      );
    }

    // 2. Consulta de llaves para sondeo hacia Wompi
    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({
        success: true,
        message: "Conciliación en espera. Configure WOMPI_PRIVATE_KEY para sondeo activo directo.",
        reconciled: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Obtener referencias de borradores de pedidos registrados en Redis
    const draftReferences = await getAllOrderDraftReferences();
    let reconciledCount = 0;

    for (const ref of draftReferences) {
      try {
        const draft = await getOrderDraft(ref);
        if (!draft) continue;

        // Consultar estado de la referencia en Wompi (soporta filtro ?reference=...)
        const wompiUrl = `https://production.wompi.co/v1/transactions?reference=${encodeURIComponent(ref)}`;
        const wompiRes = await fetch(wompiUrl, {
          headers: { Authorization: `Bearer ${privateKey}` },
        });

        if (!wompiRes.ok) continue;

        const wompiData = await wompiRes.json();
        const transactions = Array.isArray(wompiData?.data) ? wompiData.data : [];

        for (const tx of transactions) {
          if (tx.status === "APPROVED") {
            const alreadyProcessed = await isEventProcessed(tx.id, "APPROVED");
            if (alreadyProcessed) continue;

            console.warn(
              `[CRON RECONCILE] Transacción huérfana aprobada detectada: ${tx.id} (Ref: ${ref}). Auto-despachando a GAS...`
            );

            const isLocked = await markEventProcessing(tx.id, "APPROVED");
            if (!isLocked) continue;

            const itemsForGas = (draft.items || []).map((item: any) => ({
              ref: item.reference,
              qty: item.quantity,
              talla: item.size,
              name: item.name,
              price: item.unitPrice,
            }));

            const gasPayload = {
              accion: "registrarVentaServicioExterno",
              secreto: process.env.SECRETO_VENTA_SERVICIO || "bauto_web_b15b490814ebef00f1aeb5429a8760ce1cb6e9646ab04917",
              payload: {
                cart: itemsForGas,
                clientName: tx.customer_data?.full_name || draft.clientName || "Cliente Conciliado Web",
                clientDi: tx.customer_data?.legal_id || "",
                clientEmail: tx.customer_email || draft.customerEmail || "",
                paymentMethod: tx.payment_method_type || "WOMPI",
                descuento: 0,
                tipoVenta: "ON-LINE",
                ubicacion: "tienda",
                direccion: tx.shipping_address?.address_line_1 || draft.direccion || "Dirección web",
                complemento: tx.shipping_address?.address_line_2 || "",
                barrio: tx.shipping_address?.region || "",
                ciudad: tx.shipping_address?.city || draft.ciudad || "Santa Marta",
                telefono: tx.customer_data?.phone_number || "",
                enviarEmail: true,
                envio: draft.shippingCost || 0,
                notas: `[AUTO-RECONCILIADO CRON] Wompi: ${tx.id} | Ref: ${ref}`,
              },
            };

            const gasRes = await fetch(APPBAUTO_PROD_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(gasPayload),
            });

            const gasJson = await gasRes.json();

            if (gasRes.ok && gasJson.success) {
              // Liberar reservas
              for (const item of draft.items || []) {
                await releaseSoftHold(item.reference, item.size, draft.sessionId);
              }

              // Apps Script Platform.generarRecibo() envía el correo editorial oficial con el PDF adjunto

              await markEventDone(tx.id, "APPROVED");
              reconciledCount++;
            } else {
              console.error("[CRON RECONCILE] Fallo en confirmación de GAS:", gasJson);
              await deleteEventLock(tx.id, "APPROVED");
            }
          }
        }
      } catch (refErr) {
        console.error(`[CRON RECONCILE] Error procesando referencia ${ref}:`, refErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Conciliación finalizada. ${reconciledCount} órdenes recuperadas con éxito.`,
      reconciled: reconciledCount,
      totalDraftsEvaluated: draftReferences.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error en /api/cron/reconcile:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_INTERNO", message: error.message },
      { status: 500 }
    );
  }
}
