/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Utilidades Gramaticales & Mensajes
 * @Propósito: Mapeo gramatical de artículos por tipología, generador de slugs SEO y
 *             formateador de mensajes para WhatsApp. AUDITORÍA: Corrige la colisión
 *             de prefijo ("pantaloneta" vs "pantalón") ordenando las claves por longitud.
 */

import { CartItem } from "../types/catalog";

// Diccionario gramatical consolidado del catálogo de BAUTO
export const ARTICULO_POR_TIPOLOGIA: Record<string, "el" | "la"> = {
  "saco capotero": "el",
  pantaloneta: "la",
  pantalón: "el",
  pantalon: "el",
  chaqueta: "la",
  pañoleta: "la",
  camisón: "el",
  camison: "el",
  sombrero: "el",
  vestido: "el",
  bermuda: "la",
  postal: "la",
  camisa: "la",
  toalla: "la",
  kimono: "el",
  short: "el",
  tula: "la",
};

/**
 * Retorna el artículo gramaticalmente correcto ("el" o "la") para una prenda dada.
 * Evalúa las claves más largas primero para evitar falsas coincidencias (ej. "pantaloneta" antes que "pantalón").
 */
export function getArticleForTipologia(tipologia?: string, name?: string): "el" | "la" {
  const t = (tipologia || "").toLowerCase().trim();
  const sortedKeys = Object.keys(ARTICULO_POR_TIPOLOGIA).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (t.includes(key)) return ARTICULO_POR_TIPOLOGIA[key];
  }

  const n = (name || "").toLowerCase().trim();
  for (const key of sortedKeys) {
    if (n.includes(key)) return ARTICULO_POR_TIPOLOGIA[key];
  }

  const firstWord = n.split(" ")[0] || "";
  if (firstWord.endsWith("a") || firstWord.endsWith("as")) return "la";
  return "el";
}

/**
 * Formatea un valor numérico a moneda colombiana oficial (COP).
 * Ej. 280000 -> "$ 280.000 COP"
 */
export function formatCOP(value: number): string {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

  return `${formatted} COP`;
}

/**
 * Convierte un nombre de producto o tipología en un slug limpio para la URL.
 * Ej. "Camisa Guayabera Lino 100%" -> "camisa-guayabera-lino-100"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Construye el mensaje de WhatsApp estructurado para el bot AGENTE y asesores en Santa Marta.
 */
export function buildWhatsAppOrderMessage(items: CartItem[]): string {
  if (!items || items.length === 0) return "";

  if (items.length === 1) {
    const item = items[0];
    const articulo = getArticleForTipologia(item.product.tipologia, item.product.name);
    const qtyStr = item.quantity > 1 ? ` (x${item.quantity} unidades)` : "";
    return `Hola BAUTO ✨ Me interesa ${articulo} *${item.product.name}* (Ref: "${item.product.reference}"), en talla *${item.selectedSize}*${qtyStr}. Valor: ${formatCOP(item.totalPrice)}. ¿Sigue disponible para despacho?`;
  }

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}* (Ref: "${item.product.reference}") — Talla: *${item.selectedSize}* (x${item.quantity}) — ${formatCOP(item.totalPrice)}`
    )
    .join("\n");

  return `Hola BAUTO ✨ Quisiera consultar la disponibilidad de mi bolsa de compra:\n\n${itemsText}\n\n*Total estimado:* ${formatCOP(total)}\n\n¿Me pueden confirmar el costo del envío hacia mi ciudad?`;
}
