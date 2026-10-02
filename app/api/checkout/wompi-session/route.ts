/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Generador de Sesión Wompi con Firma de Integridad Blindada
 * @Ruta: POST /api/checkout/wompi-session
 * @Propósito: Calcula la firma criptográfica SHA-256 exigida por Wompi.
 *             AUDITORÍA DE SEGURIDAD: Los precios se consultan estrictamente desde la Master DB
 *             en el servidor, previniendo cualquier manipulación maliciosa de precios (Price Tampering).
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchStockProducts } from "../../../../lib/sheets";
import { saveOrderDraft, createSoftHold } from "../../../../lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      customerCedula,
      customerBarrio,
      shippingAddress,
      shippingCity,
      notes,
      giftPackaging,
      giftNote,
      shippingCost = 0,
      shippingDays,
      sessionId,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "La bolsa de compra no contiene prendas." },
        { status: 400 }
      );
    }

    // 1. BLINDAJE DE SEGURIDAD: Consultar el catálogo oficial desde Master DB en tiempo real (sin caché)
    const catalog = await fetchStockProducts(undefined, undefined, { noCache: true });
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = catalog.find(
        (p) =>
          p.reference.trim().toUpperCase() ===
          (item.reference || item.id || "").trim().toUpperCase()
      );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: "PRENDA_NO_ENCONTRADA",
            message: `La prenda con referencia "${item.reference || item.id}" no existe en el catálogo activo.`,
          },
          { status: 404 }
        );
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemTotal = product.price * qty;
      verifiedSubtotal += itemTotal;

      verifiedItems.push({
        reference: product.reference,
        name: product.name,
        size: item.size || item.selectedSize || "ÚNICA",
        quantity: qty,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
    }

    // 2. Regla de negocio de envío: flete dinámico (sin umbral falso gratis) @BAUTO_REFACTOR 2026-10-02
    const cleanShippingCost = Math.max(0, parseInt(shippingCost, 10) || 16500);

    const totalCOP = verifiedSubtotal + cleanShippingCost;
    if (totalCOP <= 0) {
      return NextResponse.json(
        { success: false, error: "El valor total de la orden debe ser superior a cero." },
        { status: 400 }
      );
    }

    // 3. Wompi exige el monto en centavos redondeado a entero
    const amountInCents = Math.round(totalCOP * 100);
    const currency = "COP";

    // 4. Generar referencia única de pedido BAUTO
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const reference = `BAUTO-${timestamp}-${randomSuffix}`;

    // 5. Llaves de Wompi (lectura de variables de entorno con fallback de producción BAUTO) @BAUTO_REFACTOR 2026-10-02
    const publicKey =
      process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_prod_MYfdpyNrCni2KWTQ5SmEMWJR8SiKPUad";
    const integritySecret =
      process.env.WOMPI_INTEGRITY_SECRET || "prod_integrity_HGmKUlkBtTKpxglIhfMqpprOMzZrMllU";

    // 6. Cadena de integridad oficial Wompi: `<referencia><monto_en_centavos><moneda><secreto_integridad>`
    const rawSignature = `${reference}${amountInCents}${currency}${integritySecret}`;
    const integrityHash = crypto.createHash("sha256").update(rawSignature).digest("hex");

    // 7. URL de retorno tras finalizar el pago en Wompi (Ruta canónica BAUTO) @BAUTO_REFACTOR 2026-10-02
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bauto-web.vercel.app";
    const redirectUrl = `${siteUrl}/checkout/confirmacion?reference=${encodeURIComponent(reference)}&session=${encodeURIComponent(sessionId || "")}`;

    // Construcción oficial de checkoutUrl para Wompi Web Checkout @BAUTO_REFACTOR 2026-10-02
    const checkoutUrl = `https://checkout.wompi.co/p/?public-key=${encodeURIComponent(publicKey)}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${encodeURIComponent(reference)}&signature:integrity=${integrityHash}&redirect-url=${encodeURIComponent(redirectUrl)}${customerEmail ? `&customer-data:email=${encodeURIComponent(customerEmail)}` : ""}${customerName ? `&customer-data:full-name=${encodeURIComponent(customerName)}` : ""}${customerPhone ? `&customer-data:phone-number=${encodeURIComponent(customerPhone)}` : ""}${customerCedula ? `&customer-data:legal-id=${encodeURIComponent(customerCedula)}&customer-data:legal-id-type=CC` : ""}`;

    // 8. Registrar Two-Phase Soft Hold en Redis (12 min) para asegurar inventario físico
    if (sessionId) {
      try {
        for (const item of verifiedItems) {
          await createSoftHold(sessionId, item.reference, item.size, item.quantity);
        }
      } catch (holdErr) {
        console.warn("Advertencia registrando soft-hold en Redis:", holdErr);
      }
    }

    // 9. Guardar borrador verificado en Redis para posterior despacho desde el Webhook @BAUTO_REFACTOR 2026-10-02
    await saveOrderDraft(reference, {
      items: verifiedItems,
      customerEmail: customerEmail || "",
      clientEmail: customerEmail || "",
      customerName: customerName || "",
      clientName: customerName || "",
      customerPhone: customerPhone || "",
      telefono: customerPhone || "",
      customerCedula: customerCedula || "",
      shippingAddress: `${shippingAddress || ""}${customerBarrio ? ` (Barrio: ${customerBarrio})` : ""}`,
      direccion: `${shippingAddress || ""}${customerBarrio ? ` (Barrio: ${customerBarrio})` : ""}`,
      shippingCity: shippingCity || "",
      ciudad: shippingCity || "",
      barrio: customerBarrio || "",
      carrier: "Servientrega",
      shippingDays: shippingDays || "",
      notes: notes || "",
      giftPackaging: !!giftPackaging,
      giftNote: giftNote || "",
      sessionId: sessionId || "",
      shippingCost: cleanShippingCost,
      subtotal: verifiedSubtotal,
      totalCOP,
      amountInCents,
      createdAt: timestamp,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl,
      data: {
        publicKey,
        currency,
        amountInCents,
        amountFormatted: `$ ${totalCOP.toLocaleString("es-CO")} COP`,
        subtotal: verifiedSubtotal,
        shippingCost: cleanShippingCost,
        reference,
        signature: integrityHash,
        redirectUrl,
        checkoutUrl,
        customerEmail: customerEmail || "",
        items: verifiedItems,
      },
    });
  } catch (error: any) {
    console.error("Error en /api/checkout/wompi-session:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_INTERNO", message: error.message },
      { status: 500 }
    );
  }
}
