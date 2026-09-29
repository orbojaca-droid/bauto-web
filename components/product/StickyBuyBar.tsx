'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Barra flotante inferior de compra para iPhone móvil con respeto a safe-area
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - UI móvil anclada
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Product, Talla } from '../../types/catalog';
import { formatCOP } from '../../lib/grammar';
import { getOptimizedImageUrl } from '../../lib/images';
import { playHapticClick } from '../../lib/sound';

interface StickyBuyBarProps {
  product: Product;
  selectedSize: Talla | null;
  onAddToCart: () => void;
  onOpenSizeSelector?: () => void;
  disabled?: boolean;
}

export function StickyBuyBar({
  product,
  selectedSize,
  onAddToCart,
  onOpenSizeSelector,
  disabled = false,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece al hacer scroll hacia abajo más de 320px
      setVisible(window.scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const imageUrl = getOptimizedImageUrl(
    product.primaryImage || (product.images && product.images[0]) || '',
    { width: 120, quality: 75 }
  );

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-bauto-nube/95 backdrop-blur-md border-t border-bauto-carbon/10 px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-elevated animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        
        {/* Miniatura y Precio */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-12 rounded-card-sm overflow-hidden bg-bauto-perla shrink-0 border border-bauto-carbon/5">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-medium text-bauto-carbon truncate max-w-[120px]">
              {product.name}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-xs text-bauto-terracota">
                {formatCOP(product.price)}
              </span>
              {selectedSize && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-bauto-perla text-bauto-carbon font-semibold">
                  {selectedSize}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            playHapticClick();
            onAddToCart();
          }}
          className="btn-pill-primary h-11 px-5 text-xs font-semibold tracking-wide shrink-0 shadow-sm flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{selectedSize ? 'Añadir' : 'Elegir Talla'}</span>
        </button>

      </div>
    </div>
  );
}
