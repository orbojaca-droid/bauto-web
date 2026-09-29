/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Constantes Globales del Ecosistema
 * @Propósito: Centraliza endpoints de servicios satélite (GAS AppBauto, MiPaquete)
 *             evitando exportaciones inválidas dentro de los route handlers de Next.js App Router.
 * @Capa: Técnica
 * @Riesgo_Evaluado: Bajo - Archivo de constantes inmutables
 */

export const APPBAUTO_PROD_URL =
  process.env.APPBAUTO_GAS_URL ||
  "https://script.google.com/macros/s/AKfycbzB6gSJwqTC7xHgzzYhR1V6nfsTJEgva83pvIvVxjb7xjvrnEjeuZGhJdv3kJpw2KA/exec";

export const MIPAPE_BASE_URL =
  process.env.MIPAQUETE_API_URL || "https://api-v2.mpr.mipaquete.com";

export const BAUTO_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "573505731220";

export const BAUTO_WHATSAPP_URL = `https://wa.me/${BAUTO_WHATSAPP_PHONE}`;
