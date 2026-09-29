/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Conector de Master DB (Google Sheets)
 * @Propósito: Extrae productos activos, tipologías oficiales, tallas (XS a XXL) y stock en vivo.
 *             AUDITORÍA: Incorpora la talla XS y restringe la detección de fotos a columnas
 *             estrictamente de imágenes, evitando falsos positivos con URLs de fichas técnicas.
 */

import { Product, StockPorTalla, Talla } from "../types/catalog";
import { formatCOP, slugify } from "./grammar";
import { getOptimizedImageUrl } from "./images";
import { WEB_GAS_URL } from "./constants";

export const MASTER_STOCK_SHEET_ID = "1cKL-Rt04R6e_Xdesg_2RkQufN6DKmTcSQpxVVTySZxg";
export const DEFAULT_STOCK_GID = "1027393668";

export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let insideQuotes = false;
  let currentValue = "";

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentValue += '"';
          i++;
        } else {
          insideQuotes = false;
        }
      } else {
        currentValue += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentValue);
        currentValue = "";
      } else if (char === "\r" || char === "\n") {
        if (char === "\r" && nextChar === "\n") {
          i++;
        }
        currentRow.push(currentValue);
        rows.push(currentRow);
        currentRow = [];
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
  }
  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }
  return rows;
}

export function findColumnIndexes(headerRow: string[]) {
  let skuIdx = 1;
  let materialIdx = 2;
  let categoryIdx = 3;
  let nameIdx = 5;
  let priceIdx = 8;
  let imageIdx = -1;
  const imageIdxs: number[] = [];
  let descriptionIdx = -1;

  // AUDITORÍA: Se incluye XS en el mapa de índices de tallas
  const sizeIndices: Record<Talla, number> = {
    XS: 45,
    S: 46,
    M: 47,
    L: 48,
    XL: 49,
    XXL: 50,
    ÚNICA: 51,
  };

  const hasCreativeName = headerRow.some(
    (h) => h.trim().toUpperCase() === "NOMBRE CREATIVO"
  );

  headerRow.forEach((col, idx) => {
    const norm = col.trim().toUpperCase();
    if (norm === "REFERENCIA" || norm === "SKU" || norm === "REF") {
      skuIdx = idx;
    } else if (
      hasCreativeName
        ? norm === "NOMBRE CREATIVO"
        : norm === "PRODUCTO" || norm === "NOMBRE" || norm === "PRENDA"
    ) {
      nameIdx = idx;
    } else if (norm === "PRECIO" || norm === "VALOR" || norm === "PRECIO VENTA") {
      priceIdx = idx;
    } else if (
      norm === "MATERIAL" ||
      norm === "TELA" ||
      norm === "COMPOSICIÓN" ||
      norm === "COMPOSICION"
    ) {
      materialIdx = idx;
    } else if (
      norm === "TIPOLOGIA" ||
      norm === "TIPOLOGÍA" ||
      norm === "CATEGORIA" ||
      norm === "CATEGORÍA" ||
      norm === "TIPO"
    ) {
      categoryIdx = idx;
    } else if (
      norm === "DESCRIPCION" ||
      norm === "DESCRIPCIÓN" ||
      norm.includes("DESCRIPCION IA") ||
      norm.includes("DESCRIPCIÓN IA")
    ) {
      descriptionIdx = idx;
    } else if (
      // AUDITORÍA: Filtro estricto para evitar falsos positivos con columnas como "URL FICHA"
      norm.includes("FOTO") ||
      norm.includes("IMAGEN") ||
      norm.includes("PORTADA") ||
      norm === "DRIVE" ||
      norm === "FOTO DRIVE" ||
      norm === "IMAGEN DRIVE"
    ) {
      if (imageIdx === -1) imageIdx = idx;
      imageIdxs.push(idx);
    } else if (norm === "XS" || norm === "STO-XS" || norm === "STOCK XS") {
      sizeIndices["XS"] = idx;
    } else if (norm === "S" || norm === "STO-S" || norm === "STOCK S") {
      sizeIndices["S"] = idx;
    } else if (norm === "M" || norm === "STO-M" || norm === "STOCK M") {
      sizeIndices["M"] = idx;
    } else if (norm === "L" || norm === "STO-L" || norm === "STOCK L") {
      sizeIndices["L"] = idx;
    } else if (norm === "XL" || norm === "STO-XL" || norm === "STOCK XL") {
      sizeIndices["XL"] = idx;
    } else if (norm === "XXL" || norm === "STO-XXL" || norm === "STOCK XXL") {
      sizeIndices["XXL"] = idx;
    } else if (norm === "U" || norm === "Ú" || norm === "UNICA" || norm === "ÚNICA") {
      sizeIndices["ÚNICA"] = idx;
    }
  });

  return {
    skuIdx,
    nameIdx,
    priceIdx,
    materialIdx,
    categoryIdx,
    imageIdx,
    imageIdxs,
    descriptionIdx,
    sizeIndices,
  };
}

export async function fetchStockProducts(
  spreadsheetId: string = MASTER_STOCK_SHEET_ID,
  gid: string = DEFAULT_STOCK_GID,
  options?: { noCache?: boolean }
): Promise<Product[]> {
  try {
    // 1. Intento primario: Gateway soberano y confidencial de Google Apps Script (WEB)
    try {
      const gasRes = await fetch(WEB_GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "obtenerCatalogoWeb",
          secreto: process.env.SECRETO_VENTA_SERVICIO || "SECRETO_VENTA_SERVICIO",
        }),
        ...(options?.noCache ? { cache: "no-store" } : { next: { revalidate: 60 } }),
      });

      if (gasRes.ok) {
        const data = await gasRes.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          return data.products.map((p: any) => ({
            id: p.reference,
            reference: p.reference,
            slug: `${slugify(p.name)}-${slugify(p.reference)}`,
            name: p.name,
            price: p.price,
            formattedPrice: formatCOP(p.price),
            usdPrice: Math.round(p.price / 4000),
            description:
              p.description ||
              `Prenda confeccionada en ${p.material} de tacto suave y corte caribeño.`,
            tipologia: p.tipologia || "Prenda",
            material: p.material || "Lino",
            images: p.images || [],
            primaryImage: getOptimizedImageUrl(p.primaryImage || p.images[0] || "", 800, 85),
            secondaryImage: p.secondaryImage
              ? getOptimizedImageUrl(p.secondaryImage, 800, 85)
              : undefined,
            sizes: p.sizes || [],
            stockPerSize: p.stockPerSize || {},
            totalStock: p.totalStock || 0,
            isExclusiveInStore: p.isExclusiveInStore || false,
          }));
        }
      }
    } catch (gasErr) {
      console.warn("Aviso: Fallback temporal desde Google Apps Script:", gasErr);
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const fetchOptions: RequestInit = options?.noCache
      ? { cache: "no-store" }
      : { next: { revalidate: 60 } };

    const res = await fetch(exportUrl, fetchOptions);

    if (!res.ok) {
      throw new Error(`Error HTTP al consultar Master DB: ${res.status}`);
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) return [];

    const header = rows[0];
    const {
      skuIdx,
      nameIdx,
      priceIdx,
      materialIdx,
      categoryIdx,
      imageIdx,
      imageIdxs,
      descriptionIdx,
      sizeIndices,
    } = findColumnIndexes(header);

    const products: Product[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length <= skuIdx) continue;

      const ref = (row[skuIdx] || "").trim();
      const rawName = (row[nameIdx] || "").trim();
      if (!ref || !rawName) continue;

      const rawPrice = (row[priceIdx] || "").replace(/[^0-9]/g, "");
      const price = parseInt(rawPrice, 10) || 0;
      if (price <= 0) continue;

      const tipologia = (row[categoryIdx] || "Prenda").trim();
      const material = (row[materialIdx] || "Lino").trim();
      const description =
        descriptionIdx !== -1 && row[descriptionIdx]
          ? row[descriptionIdx].trim()
          : `Prenda confeccionada en ${material} de tacto suave y corte caribeño.`;

      const images: string[] = [];
      imageIdxs.forEach((colIdx) => {
        const val = (row[colIdx] || "").trim();
        if (val && val.startsWith("http")) {
          images.push(val);
        }
      });
      const primaryImage = images[0] || (row[imageIdx] ? row[imageIdx].trim() : "");

      const stockPerSize: StockPorTalla = {};
      const availableSizes: Talla[] = [];
      let totalStock = 0;

      for (const [talla, colIdx] of Object.entries(sizeIndices)) {
        const rawStock = parseInt((row[colIdx] || "0").replace(/[^0-9-]/g, ""), 10) || 0;
        const count = Math.max(0, rawStock);
        stockPerSize[talla] = count;
        totalStock += count;

        if (count > 0) {
          availableSizes.push(talla);
        }
      }

      if (totalStock === 0) continue;

      const isExclusiveInStore = totalStock === 1;
      const slug = `${slugify(rawName)}-${slugify(ref)}`;

      products.push({
        id: ref,
        reference: ref,
        slug,
        name: rawName,
        price,
        formattedPrice: formatCOP(price),
        usdPrice: Math.round(price / 4000),
        description,
        tipologia,
        material,
        images,
        primaryImage: getOptimizedImageUrl(primaryImage, 800, 85),
        secondaryImage: images[1] ? getOptimizedImageUrl(images[1], 800, 85) : undefined,
        sizes: availableSizes,
        stockPerSize,
        totalStock,
        isExclusiveInStore,
      });
    }

    return products;
  } catch (error) {
    console.error("Error al obtener stock desde Google Sheets:", error);
    return [];
  }
}
