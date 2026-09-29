'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Fila interactiva de producto dentro de la bolsa con miniatura WebP y controles táctiles
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de presentación de ítem
 */

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
    <div className={`flex gap-3.5 py-4 border-b border-bauto-carbon/5 items-center ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Miniatura de la Prenda */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-card-sm overflow-hidden bg-bauto-perla shrink-0 border border-bauto-carbon/5">
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
            <span className="text-[10px] tracking-wider uppercase text-bauto-piedra block">
              {item.product.tipologia || 'Resort Wear'}
            </span>
            <h4 className="font-medium text-bauto-carbon text-xs sm:text-sm truncate max-w-[170px] sm:max-w-[220px]">
              {item.product.name}
            </h4>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-bauto-piedra/60 hover:text-bauto-danger transition-colors"
            title="Quitar de la bolsa"
            aria-label="Quitar de la bolsa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Talla y Referencia */}
        <div className="flex items-center gap-2 text-[11px] text-bauto-piedra">
          <span className="inline-block px-2 py-0.5 rounded-full bg-bauto-carbon/5 font-mono font-semibold text-bauto-carbon text-[10px]">
            Talla {item.selectedSize}
          </span>
          <span>•</span>
          <span className="font-mono text-[10px] text-bauto-piedra/70">
            {item.product.reference}
          </span>
        </div>

        {/* Precio y Controles de Cantidad */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="font-mono font-semibold text-xs sm:text-sm text-bauto-terracota">
            {formatCOP(item.product.price * item.quantity)}
          </span>

          <div className="flex items-center bg-bauto-perla rounded-pill p-0.5 border border-bauto-carbon/5">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-bauto-carbon hover:text-bauto-terracota active:scale-90 transition-transform"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono text-xs font-semibold px-2 text-bauto-carbon select-none min-w-[20px] text-center">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-bauto-carbon hover:text-bauto-terracota active:scale-90 transition-transform"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
