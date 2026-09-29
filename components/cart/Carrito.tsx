'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Drawer transaccional refinado bajo estética Quiet Luxury (Negro Carbón y tipografía serena)
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Preservación íntegra de Zustand y navegación
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, Compass } from 'lucide-react';
import { useCartStore } from '../../lib/cartStore';
import { FreeShippingBar } from './FreeShippingBar';
import { CartItemRow } from './CartItemRow';
import { GiftCeremony } from './GiftCeremony';
import { formatCOP } from '../../lib/grammar';
import { playHapticClick } from '../../lib/sound';

export function Carrito() {
  const router = useRouter();
  const isOpen = useCartStore((state) => state.isOpen);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getFreeShippingProgress = useCartStore((state) => state.getFreeShippingProgress);
  const isHydrated = useCartStore((state) => state.isHydrated);

  // Bloqueo de scroll de fondo en iOS Safari y escritorio mientras el Drawer esté abierto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isHydrated || !isOpen) return null;

  const subtotal = getSubtotal();
  const { isQualified } = getFreeShippingProgress();
  const shippingCost = isQualified || subtotal >= 300000 ? 0 : 15000;
  const total = subtotal + (items.length > 0 ? shippingCost : 0);

  const handleClose = () => {
    playHapticClick();
    setDrawerOpen(false);
  };

  const handleGoToCheckout = () => {
    playHapticClick();
    setDrawerOpen(false);
    router.push('/carrito');
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo Oscuro / Backdrop con Desenfoque */}
      <div
        className="fixed inset-0 bg-bauto-carbon/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Contenedor Adaptativo: Bottom Sheet en Móvil / Panel Lateral en Desktop */}
      <aside
        className={`relative z-10 w-full sm:max-w-md bg-bauto-nube shadow-2xl flex flex-col transition-all duration-300 ${
          /* Móvil: anclado al fondo, máximo 92dvh con esquinas suaves superiores */
          'max-sm:mt-auto max-sm:max-h-[92dvh] max-sm:rounded-t-2xl ' +
          /* Desktop: 100vh de altura completa, fijado a la derecha */
          'sm:h-full sm:min-h-screen'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Bolsa de compras BAUTO"
      >
        {/* Tirador Táctil (Drag Handle) solo visible en pantallas móviles */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-bauto-carbon/20 " />
        </div>

        {/* Cabecera del Carrito */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-bauto-carbon/10">
          <div className="flex items-baseline gap-2">
            <h2 className="font-title font-light text-base tracking-wide text-bauto-carbon">
              Bolsa de compra
            </h2>
            <span className="font-body text-xs text-bauto-piedra">
              ({itemCount} {itemCount === 1 ? 'pieza' : 'piezas'})
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center -mr-2  text-bauto-piedra hover:text-bauto-carbon transition-colors"
            aria-label="Cerrar bolsa"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Barra de Progreso de Envío de Cortesía */}
        {items.length > 0 && <FreeShippingBar />}

        {/* Cuerpo Principal del Carrito */}
        <div className="flex-1 overflow-y-auto px-6 py-2 overscroll-contain">
          {items.length === 0 ? (
            /* Estado Vacío Poético */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4 py-16 gap-5 animate-fade-in">
              <Compass className="w-8 h-8 text-bauto-carbon/40 stroke-[1.25]" />
              
              <div className="max-w-xs">
                <h3 className="font-title font-light text-base text-bauto-carbon mb-2 tracking-wide">
                  Tu bolsa aún está ligera
                </h3>
                <p className="font-editorial italic text-xs text-bauto-piedra leading-relaxed">
                  Siluetas fluidas y fibras nobles inspiradas en el Caribe esperan ser descubiertas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push('/catalogo');
                }}
                className="mt-2 px-6 py-3  bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-[11px] font-sans font-medium"
              >
                <span>Explorar colección</span>
              </button>
            </div>
          ) : (
            /* Lista de Ítems del Carrito */
            <div>
              <div className="divide-y divide-bauto-carbon/5">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* Ceremonia de Obsequio */}
              <GiftCeremony />
            </div>
          )}
        </div>

        {/* Pie Transaccional Fijo con Desglose */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-bauto-carbon/10 bg-bauto-nube/95 backdrop-blur-md pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-col gap-2 mb-4 text-xs font-body">
              <div className="flex justify-between text-bauto-piedra">
                <span>Subtotal</span>
                <span className="text-bauto-carbon font-normal">
                  {formatCOP(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-bauto-piedra">
                <span>Envío nacional</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-bauto-carbon font-normal">De cortesía</span>
                  ) : (
                    formatCOP(shippingCost)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-medium text-bauto-carbon pt-3 border-t border-bauto-carbon/10">
                <span>Total estimado</span>
                <span className="text-base text-bauto-carbon">
                  {formatCOP(total)}
                </span>
              </div>
            </div>

            {/* Botón Primario de Compra en Negro Carbón */}
            <button
              type="button"
              onClick={handleGoToCheckout}
              className="w-full py-3.5 px-6  bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-all duration-200 text-xs font-sans font-medium flex items-center justify-center gap-2"
            >
              <span>Continuar con el pago</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-[10px] text-center text-bauto-piedra mt-3 flex items-center justify-center gap-1">
              <span>Transacción protegida por</span>
              <span className="font-medium text-bauto-carbon">Wompi PCI-DSS</span>
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
