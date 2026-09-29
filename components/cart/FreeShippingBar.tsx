'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Barra reactiva minimalista para entrega de cortesía nacional ($300.000 COP)
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente visual conectado a Zustand
 */

import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../lib/cartStore';
import { formatCOP } from '../../lib/grammar';

export function FreeShippingBar() {
  const isHydrated = useCartStore((state) => state.isHydrated);
  const getFreeShippingProgress = useCartStore((state) => state.getFreeShippingProgress);

  if (!isHydrated) return null;

  const { isQualified, amountNeeded, percentage } = getFreeShippingProgress();

  return (
    <div className="w-full px-4 py-3 bg-bauto-perla/80 border-b border-bauto-carbon/5">
      <div className="flex items-center justify-between text-xs mb-1.5">
        {isQualified ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-bauto-terracota">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disfrutas de entrega de cortesía nacional</span>
          </span>
        ) : (
          <span className="text-bauto-piedra">
            Añade <strong className="font-mono text-bauto-carbon">{formatCOP(amountNeeded)}</strong> para envío de cortesía
          </span>
        )}
        <span className="font-mono text-[10px] text-bauto-piedra font-semibold">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Barra de Progreso en Terracota */}
      <div className="w-full h-1.5 bg-bauto-carbon/10 rounded-pill overflow-hidden">
        <div
          className="h-full bg-bauto-terracota transition-all duration-500 ease-out rounded-pill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
