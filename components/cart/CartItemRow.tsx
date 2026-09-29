'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Fila interactiva de prenda en la bolsa bajo estética Quiet Luxury (tipografía serena y proporción 3:4)
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Preservación de controles de cantidad y eliminación en Zustand
 */

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem } from '../../types/catalog';
import { useCartStore } from '../../lib/cartStore';
import { getOptimizedImageUrl } from '../../lib/images';
import { formatCOP } from '../../lib/grammar';
import { playHapticClick } from '../../lib/sound';

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const imageUrl = getOptimizedImageUrl(item.product.primaryImage || (item.product.images && item.product.images[0]) || '', {
    width: 200,
    quality: 80,
  });

  const handleDecrease = () => {
    playHapticClick();
    if (item.quantity > 1) {
      updateQuantity(item.id, -1);
    } else {
      removeItem(item.id);
    }
  };

  const handleIncrease = () => {
    playHapticClick();
    updateQuantity(item.id, 1);
  };

  const handleRemove = () => {
    playHapticClick();
    removeItem(item.id);
  };

  return (
    <div className={`flex gap-4 py-4 border-b border-bauto-carbon/5 items-center font-body ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Miniatura de la Prenda con Proporción Limpia */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden bg-bauto-perla shrink-0">
        <img
          src={imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Información de la Prenda */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-bauto-piedra block font-body">
              {item.product.tipologia || 'Silueta BAUTO'}
            </span>
            <h4 className="font-normal text-bauto-carbon text-xs sm:text-sm truncate max-w-[170px] sm:max-w-[220px]">
              {item.product.name}
            </h4>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="w-8 h-8 flex items-center justify-center -mr-1 text-bauto-piedra/60 hover:text-bauto-carbon transition-colors"
            title="Quitar de la bolsa"
            aria-label="Quitar de la bolsa"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>

        {/* Talla y Referencia */}
        <div className="flex items-center gap-2 text-[11px] text-bauto-piedra font-body">
          <span className="text-bauto-carbon font-normal">
            Talla {item.selectedSize}
          </span>
          <span className="text-bauto-carbon/20">/</span>
          <span className="text-bauto-piedra/70 text-[10px]">
            {item.product.reference}
          </span>
        </div>

        {/* Precio y Controles de Cantidad */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="font-normal text-xs sm:text-sm text-bauto-carbon font-body">
            {formatCOP(item.product.price * item.quantity)}
          </span>

          <div className="flex items-center border border-bauto-carbon/15  px-1 py-0.5">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-7 h-7 flex items-center justify-center text-bauto-carbon hover:text-bauto-piedra active:scale-95 transition-transform"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3 h-3 stroke-[1.5]" />
            </button>

            <span className="font-body text-xs font-normal px-2 text-bauto-carbon select-none min-w-[18px] text-center">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              className="w-7 h-7 flex items-center justify-center text-bauto-carbon hover:text-bauto-piedra active:scale-95 transition-transform"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3 h-3 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
