'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Selector interactivo de tallas con disponibilidad en vivo de Master DB
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de selección con feedback háptico
 */

import React from 'react';
import { Ruler, Sparkles } from 'lucide-react';
import { Talla, StockPorTalla } from '../../types/catalog';
import { playHapticClick } from '../../lib/sound';

interface SizeSelectorProps {
  stockPorTalla: StockPorTalla;
  selectedSize: Talla | null;
  onSelectSize: (size: Talla) => void;
  onOpenSizeGuide?: () => void;
}

const ALL_SIZES: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function SizeSelector({
  stockPorTalla,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}: SizeSelectorProps) {
  // Si la prenda solo tiene talla ÚNICA
  const isOnlyUnica = (stockPorTalla.UNICA || 0) > 0 && ALL_SIZES.every((s) => (stockPorTalla[s] || 0) === 0);
  const displaySizes: Talla[] = isOnlyUnica ? ['UNICA'] : ALL_SIZES;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-bauto-carbon">
          Seleccionar Talla:{' '}
          {selectedSize && (
            <strong className="text-bauto-terracota font-semibold font-mono">
              {selectedSize}
            </strong>
          )}
        </span>

        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={() => {
              playHapticClick();
              onOpenSizeGuide();
            }}
            className="inline-flex items-center gap-1 text-[11px] text-bauto-piedra hover:text-bauto-terracota transition-colors underline underline-offset-2"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Guía de Medidas (cm)</span>
          </button>
        )}
      </div>

      {/* Cuadrícula de Cápsulas de Tallas */}
      <div className="flex flex-wrap gap-2">
        {displaySizes.map((size) => {
          const stock = stockPorTalla[size] || 0;
          const isAvailable = stock > 0;
          const isSelected = selectedSize === size;
          const isLowStock = stock === 1;

          return (
            <button
              key={size}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable) {
                  playHapticClick();
                  onSelectSize(size);
                }
              }}
              className={`relative min-w-[50px] sm:min-w-[56px] h-11 px-3 rounded-card-sm text-xs font-mono font-semibold transition-all duration-200 flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-bauto-terracota text-white shadow-sm ring-2 ring-bauto-terracota/20'
                  : isAvailable
                  ? 'bg-bauto-perla text-bauto-carbon hover:bg-bauto-perla/80 border border-bauto-carbon/10'
                  : 'bg-bauto-carbon/5 text-bauto-piedra/40 cursor-not-allowed border border-dashed border-bauto-carbon/10 line-through'
              }`}
            >
              <span>{size}</span>

              {isAvailable && isLowStock && !isSelected && (
                <span className="text-[8px] font-sans text-bauto-terracota font-medium leading-none -mt-0.5">
                  1 und
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje de Disponibilidad */}
      {selectedSize && (
        <div className="text-[11px] text-bauto-piedra flex items-center gap-1.5 mt-0.5">
          <Sparkles className="w-3 h-3 text-bauto-terracota" />
          <span>
            {stockPorTalla[selectedSize] === 1
              ? 'Pieza exclusiva disponible en taller'
              : `${stockPorTalla[selectedSize]} unidades disponibles en esta talla`}
          </span>
        </div>
      )}
    </div>
  );
}
