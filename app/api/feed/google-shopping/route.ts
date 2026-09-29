/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Feed Dinámico para Google Merchant Center / Shopping ($0)
 * @Ruta: GET /api/feed/google-shopping
 * @Propósito: Exporta el catálogo activo en formato estándar XML RSS 2.0 (Google Shopping)
 *             para presencia gratuita en la pestaña Shopping de Google sin costos fijos.
 */

import { NextResponse } from "next/server";
import { fetchStockProducts } from "../../../../lib/sheets";

export const revalidate = 3600; // 1 hora de caché en CDN

function escapeXml(unsafe: string = ""): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const products = await fetchStockProducts();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bauto.com.co";

    const itemsXml = products
      .map((p) => {
        const productUrl = `${siteUrl}/catalogo/producto/${p.slug}`;
        const priceFormatted = `${p.price}.00 COP`;
        const availability = p.totalStock > 0 ? "in stock" : "out of stock";
        const primaryImg = p.primaryImage.startsWith("http")
          ? p.primaryImage
          : `${siteUrl}/logo-bauto.png`;

        return `
    <item>
      <g:id>${escapeXml(p.reference)}</g:id>
      <g:title><![CDATA[${p.name} - BAUTO Resort Wear]]></g:title>
      <g:description><![CDATA[${p.description} Confeccionado en ${p.material}.]]></g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(primaryImg)}</g:image_link>
      <g:brand>BAUTO</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${priceFormatted}</g:price>
      <g:product_type><![CDATA[Apparel &amp; Accessories > Clothing > ${p.tipologia}]]></g:product_type>
      <g:material><![CDATA[${p.material}]]></g:material>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>BAUTO Resort Wear - Catálogo Oficial</title>
    <link>${siteUrl}</link>
    <description>Prendas de lujo Resort Wear inspiradas en el confort y movimiento del Caribe. Santa Marta, Colombia.</description>
    <language>es-CO</language>${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error: any) {
    console.error("Error generando feed de Google Shopping:", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}
