/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Endpoint Unificado de Catálogo y Filtros
 * @Ruta: GET /api/catalog
 * @Propósito: Entrega el inventario consolidado en JSON con soporte de filtros por tipología,
 *             talla y búsqueda textual para abastecer al frontend con máxima velocidad.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchStockProducts } from "../../../lib/sheets";
import { DEFAULT_TIPOLOGIAS } from "../../../types/catalog";
import { slugify } from "../../../lib/grammar";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipologiaParam = (searchParams.get("tipologia") || "").trim().toLowerCase();
    const tallaParam = (searchParams.get("talla") || "").trim().toUpperCase();
    const queryParam = (searchParams.get("q") || searchParams.get("search") || "").trim().toLowerCase();
    const limitParam = parseInt(searchParams.get("limit") || "0", 10);

    const allProducts = await fetchStockProducts();

    // 1. Filtrado dinámico
    let filtered = allProducts;

    if (tipologiaParam) {
      filtered = filtered.filter(
        (p) =>
          p.tipologia.toLowerCase() === tipologiaParam ||
          slugify(p.tipologia) === slugify(tipologiaParam)
      );
    }

    if (tallaParam) {
      filtered = filtered.filter((p) => (p.stockPerSize[tallaParam] || 0) > 0);
    }

    if (queryParam) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(queryParam) ||
          p.reference.toLowerCase().includes(queryParam) ||
          p.material.toLowerCase().includes(queryParam) ||
          p.description.toLowerCase().includes(queryParam)
      );
    }

    if (limitParam > 0) {
      filtered = filtered.slice(0, limitParam);
    }

    // 2. Extraer tipologías que tienen productos activos
    const activeTipologiasSet = new Set<string>();
    let totalStockAll = 0;

    allProducts.forEach((p) => {
      if (p.tipologia) activeTipologiasSet.add(p.tipologia);
      totalStockAll += p.totalStock;
    });

    const tipologiasList = DEFAULT_TIPOLOGIAS.filter((t) => activeTipologiasSet.has(t));

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        totalProductsInCatalog: allProducts.length,
        totalStockUnits: totalStockAll,
        tipologias: tipologiasList,
        products: filtered,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Error en /api/catalog:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_CATALOG_API", message: error.message },
      { status: 500 }
    );
  }
}
