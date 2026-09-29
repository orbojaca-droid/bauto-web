'use client';
 
/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Barra de cortesía nacional estilizada como hairline minimalista y texto editorial
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Conexión íntegra con Zustand
 */

import React from 'react';
import { useCartStore } from '../../lib/cartStore';
import { formatCOP } from '../../lib/grammar';

export function FreeShippingBar() {
  const isHydrated = useCartStore((state) => state.isHydrated);
  const getFreeShippingProgress = useCartStore((state) => state.getFreeShippingProgress);

  if (!isHydrated) return null;

  const { isQualified, amountNeeded, percentage } = getFreeShippingProgress();

  return (
    <div className="w-full px-6 py-3 bg-[#FAF6F0]/50 border-b border-bauto-carbon/5 font-body">
      <div className="flex items-center justify-between text-xs mb-2">
        {isQualified ? (
          <span className="text-bauto-carbon font-normal tracking-wide">
            Disfrutas de entrega nacional de cortesía
          </span>
        ) : (
          <span className="text-bauto-piedra">
            Añade <span className="text-bauto-carbon font-normal">{formatCOP(amountNeeded)}</span> para entrega de cortesía
          </span>
        )}
      </div>

      {/* Barra de Progreso Hairline en Negro Carbón */}
      <div className="w-full h-[1.5px] bg-bauto-carbon/10 overflow-hidden">
        <div
          className="h-full bg-bauto-carbon transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
}
