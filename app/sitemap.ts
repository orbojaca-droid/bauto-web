/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Sitemap Dinámico Nativo de Next.js (SEO)
 * @Ruta: /sitemap.xml
 * @Propósito: Mapea todas las URLs estáticas, tipologías oficiales y fichas de producto (PDP)
 *             para indexación instantánea en los motores de búsqueda (Google Indexing).
 */

import { MetadataRoute } from "next";
import { fetchStockProducts } from "../lib/sheets";
import { DEFAULT_TIPOLOGIAS } from "../types/catalog";
import { slugify } from "../lib/grammar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bauto.com.co";
  const now = new Date();

  // 1. Páginas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalogo`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tienda-santa-marta`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/rastreo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/filosofia`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ayuda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Rutas dinámicas por tipología oficial
  const tipologiaRoutes: MetadataRoute.Sitemap = DEFAULT_TIPOLOGIAS.map((tipo) => ({
    url: `${siteUrl}/catalogo/${slugify(tipo)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 3. Rutas dinámicas de cada producto activo
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchStockProducts();
    productRoutes = products.map((p) => ({
      url: `${siteUrl}/catalogo/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Error generando rutas de productos en sitemap:", error);
  }

  return [...staticRoutes, ...tipologiaRoutes, ...productRoutes];
}
