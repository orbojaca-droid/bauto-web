/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Endpoint de Reserva Temporal (Soft Hold)
 * @Ruta: POST /api/checkout/reserve
 * @Propósito: Bloquea temporalmente por 12 minutos las prendas seleccionadas para evitar
 *             sobreventas concurrentes. AUDITORÍA: Pasa el sessionId del comprador actual
 *             para no auto-bloquear al usuario si recarga la página.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchStockProducts } from "../../../../lib/sheets";
import { createSoftHold, getActiveHoldsCount } from "../../../../lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, sessionId } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Parámetros inválidos. Se requiere sessionId e items." },
        { status: 400 }
      );
    }

    // 1. Consultar el inventario físico actual desde Master DB en tiempo real (sin caché)
    const currentProducts = await fetchStockProducts(undefined, undefined, { noCache: true });
    const outOfStockItems: Array<{ ref: string; size: string; requested: number; available: number }> = [];

    // 2. Verificar disponibilidad real considerando bloqueos activos de OTROS compradores
    for (const item of items) {
      const product = currentProducts.find(
        (p) => p.reference.trim().toUpperCase() === (item.reference || item.id || "").trim().toUpperCase()
      );
      const physicalStock = product?.stockPerSize[item.size] || 0;
      // Excluir la propia sesión del comprador actual
      const activeHoldsOfOthers = await getActiveHoldsCount(item.reference, item.size, sessionId);
      const availableStock = Math.max(0, physicalStock - activeHoldsOfOthers);

      if (availableStock < item.quantity) {
        outOfStockItems.push({
          ref: item.reference,
          size: item.size,
          requested: item.quantity,
          available: availableStock,
        });
      }
    }

    // 3. Si alguna prenda no tiene inventario disponible, rechazar la reserva
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "STOCK_INSUFICIENTE",
          message: "Una o más prendas seleccionadas se han agotado o están en proceso de compra.",
          outOfStockItems,
        },
        { status: 409 }
      );
    }

    // 4. Crear o refrescar los bloqueos suaves en Redis (12 minutos)
    const reservations = [];
    for (const item of items) {
      const hold = await createSoftHold(item.reference, item.size, sessionId, item.quantity);
      reservations.push(hold);
    }

    return NextResponse.json({
      success: true,
      message: "Reserva temporal confirmada por 12 minutos.",
      sessionId,
      expiresAt: reservations[0]?.expiresAt || Date.now() + 12 * 60 * 1000,
    });
  } catch (error: any) {
    console.error("Error en /api/checkout/reserve:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_INTERNO", message: error.message },
      { status: 500 }
    );
  }
}
