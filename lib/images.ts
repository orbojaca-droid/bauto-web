/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co)
 * @Propósito: Optimización de imágenes y conversión a WebP en tiempo real sin servidor propio.
 *             AUDITORÍA: Emplea el endpoint de alto rendimiento de Google Drive (lh3.googleusercontent.com)
 *             para evitar límites de cuota de descarga directa.
 */

export const BAUTO_IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect width='100%' height='100%' fill='%23FAF7F1'/><text x='50%' y='50%' font-family='sans-serif' font-size='22' font-weight='400' fill='%236E6E6E' text-anchor='middle' letter-spacing='4'>BAUTO</text></svg>";

export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
}

/**
 * Transforma URLs públicas o de Google Drive en imágenes WebP comprimidas y redimensionadas
 * utilizando el servicio global de caché y optimización wsrv.nl (100% gratuito).
 */
export function getOptimizedImageUrl(
  url?: string | null,
  widthOrOptions: number | ImageOptimizationOptions = 600,
  qualityArg: number = 80
): string {
  if (!url) return BAUTO_IMAGE_FALLBACK;

  let width = 600;
  let quality = 80;

  if (typeof widthOrOptions === 'object' && widthOrOptions !== null) {
    if (widthOrOptions.width !== undefined) width = widthOrOptions.width;
    if (widthOrOptions.quality !== undefined) quality = widthOrOptions.quality;
  } else if (typeof widthOrOptions === 'number') {
    width = widthOrOptions;
    quality = qualityArg;
  }

  if (url.startsWith("data:") || url.includes("wsrv.nl") || !url.startsWith("http")) {
    return url;
  }

  try {
    let cleanUrl = url;

    // Normalizar URLs de Google Drive hacia el CDN rápido lh3.googleusercontent.com
    const driveMatch =
      cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (driveMatch && driveMatch[1]) {
      cleanUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }

    return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=${quality}&output=webp`;
  } catch (error) {
    console.error("Error optimizando imagen:", error);
    return url;
  }
}
