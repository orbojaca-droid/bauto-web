/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Receptor de Webhooks de Wompi Blindado
 * @Ruta: POST /api/webhooks/wompi
 * @Propósito: Procesa eventos transaccionales de Wompi de forma atómica e idempotente.
 *             - Validación criptográfica SHA-256 estricta (fail-closed).
 *             - Deduplicación atómica con Redis (TTL 24h).
 *             - Desacoplamiento asíncrono para responder en <50ms (cumpliendo SLA Wompi <150ms).
 *             - Liberación de hold solo tras confirmación exitosa de Google Apps Script.
 *             - Liberación del candado PROCESSING si ocurre error en GAS para permitir reintentos.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getOrderDraft,
  markEventProcessing,
  markEventDone,
  deleteEventLock,
  releaseSoftHold,
} from "../../../../lib/redis";
import { APPBAUTO_PROD_URL } from "@/lib/constants";

/**
 * Resuelve una propiedad anidada usando notación de puntos (ej: "transaction.id")
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split(".").reduce((curr, key) => (curr ? curr[key] : undefined), obj);
}

/**
 * Valida la firma criptográfica enviada por Wompi con política fail-closed
 */
function verifyWompiSignature(body: any): boolean {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) {
    console.error(
      "[WOMPI WEBHOOK] Error de seguridad crítico: WOMPI_EVENTS_SECRET no configurado. Rechazando evento."
    );
    return false;
  }

  try {
    const { signature, timestamp, data } = body;
    if (!signature || !signature.properties || !signature.checksum || !timestamp) {
      return false;
    }

    // Concatenar las propiedades en el orden exacto especificado
    let concatenatedValues = "";
    for (const prop of signature.properties) {
      const val = getNestedProperty(data, prop);
      concatenatedValues += val !== undefined ? String(val) : "";
    }

    const rawString = `${concatenatedValues}${timestamp}${eventsSecret}`;
    const calculatedChecksum = crypto.createHash("sha256").update(rawString).digest("hex");

    return (
      crypto.timingSafeEqual(
        Buffer.from(calculatedChecksum),
        Buffer.from(signature.checksum)
      ) || calculatedChecksum.toLowerCase() === signature.checksum.toLowerCase()
    );
  } catch (err) {
    console.error("Error verificando firma de Wompi:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Verificación de la firma criptográfica de Wompi (Fail-closed)
    const isValidSignature = verifyWompiSignature(rawBody);
    if (!isValidSignature) {
      console.error("[WOMPI WEBHOOK] Firma criptográfica inválida o ausente.");
      return NextResponse.json(
        { success: false, error: "Firma inválida o no autorizada." },
        { status: 401 }
      );
    }

    const transaction = rawBody?.data?.transaction;
    if (!transaction || !transaction.id) {
      return NextResponse.json(
        { success: false, error: "Estructura de evento de transacción no reconocida." },
        { status: 400 }
      );
    }

    const transactionId = String(transaction.id);
    const status = String(transaction.status).toUpperCase();
    const reference = String(transaction.reference || "");

    // 2. Recuperar el borrador verificado guardado en Redis al iniciar la sesión
    const draft = await getOrderDraft(reference);

    // 3. Manejo de transacciones no exitosas (DECLINED, VOIDED, ERROR)
    if (status !== "APPROVED") {
      // Liberar las reservas para que otras personas puedan comprar las prendas
      if (draft && draft.items && Array.isArray(draft.items)) {
        for (const item of draft.items) {
          await releaseSoftHold(item.reference, item.size, draft.sessionId);
        }
      }
      return NextResponse.json({
        success: true,
        message: `Transacción recibida con estado ${status}. Reservas liberadas.`,
      });
    }

    // 4. Idempotencia y Deduplicación Atómica en Redis
    const isNew = await markEventProcessing(transactionId, status);
    if (!isNew) {
      return NextResponse.json({
        success: true,
        message: "Evento ya procesado o en curso de procesamiento.",
      });
    }

    // 5. Preparar el despacho atómico hacia 2. APPBAUTO (Google Apps Script)
    const itemsForGas = (draft?.items || []).map((item: any) => ({
      ref: item.reference,
      qty: item.quantity,
      talla: item.size,
      name: item.name,
      price: item.unitPrice,
    }));

    const clientName =
      transaction.customer_data?.full_name || draft?.clientName || "Cliente Tienda Web";
    const clientEmail = transaction.customer_email || draft?.customerEmail || "";
    const clientPhone = transaction.customer_data?.phone_number || "";
    const clientDi = transaction.customer_data?.legal_id || "";

    const shippingAddress = transaction.shipping_address || {};
    const addressLine1 = shippingAddress.address_line_1 || draft?.direccion || "Dirección web";
    const addressLine2 = shippingAddress.address_line_2 || "";
    const city = shippingAddress.city || draft?.ciudad || "Santa Marta";
    const region = shippingAddress.region || "";

    const gasPayload = {
      accion: "registrarVentaServicioExterno",
      secreto: process.env.SECRETO_VENTA_SERVICIO || "bauto_web_b15b490814ebef00f1aeb5429a8760ce1cb6e9646ab04917",
      payload: {
        cart: itemsForGas,
        clientName,
        clientDi,
        clientEmail,
        paymentMethod: transaction.payment_method_type || "WOMPI",
        descuento: 0,
        tipoVenta: "ON-LINE",
        ubicacion: "tienda",
        direccion: addressLine1,
        complemento: addressLine2,
        barrio: region,
        ciudad: city,
        telefono: clientPhone,
        /**
         * @BAUTO_REFACTOR 2026-10-03
         * @Modulo: WEB (Wompi Webhook)
         * @Propósito: Activar generación y envío de recibo editorial oficial con PDF desde Apps Script
         * @Capa: Capa 2 (Funcional)
         * @Riesgo_Evaluado: Bajo
         */
        enviarEmail: true,
        envio: draft?.shippingCost || 0,
        notas: `Wompi: ${transactionId} | Ref: ${reference}`,
      },
    };

    // 6. Tarea asíncrona desacoplada de despacho y confirmación
    const asyncDispatchTask = async () => {
      try {
        let gasJson: any = null;
        let gasSuccess = false;

        /**
         * @BAUTO_REFACTOR 2026-10-03
         * @Modulo: WEB (Wompi Webhook)
         * @Propósito: Despacho directo al Core Transaccional APPBAUTO_PROD_URL (registrarVentaServicioExterno)
         *             eliminando intento obsoleto a WEB_GAS_URL.
         * @Capa: Capa 1 (Técnica) & Capa 2 (Funcional)
         * @Riesgo_Evaluado: Bajo
         */
        const gasResponse = await fetch(APPBAUTO_PROD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gasPayload),
        });
        gasJson = await gasResponse.json();
        gasSuccess = gasResponse.ok && gasJson.success;

        if (gasSuccess && gasJson) {
          // Solo cuando Google Apps Script confirmó la persistencia definitiva en Sheets:
          // A) Liberar las reservas temporales (convertidas en compra definitiva)
          if (draft && draft.items && Array.isArray(draft.items)) {
            for (const item of draft.items) {
              await releaseSoftHold(item.reference, item.size, draft.sessionId);
            }
          }

          // B) Correo transaccional oficial asumido por Apps Script
          /**
           * @BAUTO_REFACTOR 2026-10-03
           * @Modulo: WEB (Wompi Webhook)
           * @Propósito: Silenciar envío aislado por Resend para no duplicar correos al cliente.
           *             Apps Script (Platform.generarRecibo) envía el correo editorial oficial con el PDF canónico.
           * @Capa: Capa 2 (Funcional)
           * @Riesgo_Evaluado: Bajo
           */
          console.info(
            `[WOMPI WEBHOOK] Venta registrada en Apps Script (Venta #${gasJson.ventaId}). Recibo editorial enviado por Platform.`
          );

          // C) Marcar definitivamente como DONE en Redis
          await markEventDone(transactionId, status);
        } else {
          console.error(
            "[WOMPI WEBHOOK] Apps Script rechazó el registro de venta:",
            gasJson
          );
          // Liberar el candado PROCESSING para permitir reintento de Wompi o conciliación
          await deleteEventLock(transactionId, status);
        }
      } catch (dispatchErr) {
        console.error(
          "[WOMPI WEBHOOK] Excepción de red en despacho asíncrono hacia APPBAUTO:",
          dispatchErr
        );
        // Liberar candado PROCESSING ante fallo de red para permitir reintentos
        await deleteEventLock(transactionId, status);
      }
    };

    // Iniciar tarea en segundo plano sin bloquear la respuesta HTTP (<150ms)
    asyncDispatchTask().catch((err) => {
      console.error("[WOMPI WEBHOOK] Error no controlado en asyncDispatchTask:", err);
    });

    // 7. Retorno inmediato <50ms para cumplir el SLA de Wompi
    return NextResponse.json({
      success: true,
      message: "Transacción recibida y encolada para despacho asíncrono exitoso.",
      data: {
        transactionId,
        reference,
      },
    });
  } catch (error: any) {
    console.error("Error crítico en /api/webhooks/wompi:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_INTERNO", message: error.message },
      { status: 500 }
    );
  }
}
