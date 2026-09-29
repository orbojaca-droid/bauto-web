'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Drawer lateral para desktop y Bottom Sheet para móvil (patrón iOS Safari)
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Manejo de gestos táctiles y bloqueo de scroll en iOS
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, ArrowRight, Compass } from 'lucide-react';
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
          /* Móvil: anclado al fondo, máximo 92dvh con bordes redondeados superiores */
          'max-sm:mt-auto max-sm:max-h-[92dvh] max-sm:rounded-t-[32px] ' +
          /* Desktop: 100vh de altura completa, fijado a la derecha */
          'sm:h-full sm:min-h-screen'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Bolsa de compras BAUTO"
      >
        {/* Tirador Táctil (Drag Handle) solo visible en pantallas móviles */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-bauto-carbon/20 rounded-full" />
        </div>

        {/* Cabecera del Carrito */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bauto-carbon/5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-bauto-terracota" />
            <h2 className="font-title font-bold text-base tracking-wide text-bauto-carbon">
              Tu Bolsa de Compra
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-bauto-perla text-bauto-piedra font-semibold">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center -mr-2 rounded-full text-bauto-piedra hover:text-bauto-carbon hover:bg-bauto-perla transition-colors"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso de Envío de Cortesía */}
        {items.length > 0 && <FreeShippingBar />}

        {/* Cuerpo Principal del Carrito */}
        <div className="flex-1 overflow-y-auto px-5 py-2 overscroll-contain">
          {items.length === 0 ? (
            /* Estado Vacío Poético */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4 py-12 gap-5 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-bauto-perla flex items-center justify-center text-bauto-terracota border border-bauto-carbon/5">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>
              
              <div className="max-w-xs">
                <h3 className="font-title font-semibold text-sm text-bauto-carbon mb-1.5">
                  Tu bolsa de viaje aún está ligera
                </h3>
                <p className="font-editorial italic text-xs text-bauto-piedra leading-relaxed">
                  La brisa y la luz del Caribe esperan tus próximas elecciones de lino puro y tejidos nobles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push('/catalogo');
                }}
                className="btn-pill-primary px-6 py-2.5 text-xs tracking-wide shadow-sm mt-2"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="px-5 py-4 border-t border-bauto-carbon/10 bg-bauto-nube/95 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-col gap-1.5 mb-4 text-xs">
              <div className="flex justify-between text-bauto-piedra">
                <span>Subtotal</span>
                <span className="font-mono text-bauto-carbon font-semibold">
                  {formatCOP(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-bauto-piedra">
                <span>Envío nacional</span>
                <span className="font-mono">
                  {shippingCost === 0 ? (
                    <span className="text-bauto-terracota font-medium">De cortesía</span>
                  ) : (
                    formatCOP(shippingCost)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-bauto-carbon pt-2 border-t border-bauto-carbon/5">
                <span>Total Estimado</span>
                <span className="font-mono text-base text-bauto-terracota">
                  {formatCOP(total)}
                </span>
              </div>
            </div>

            {/* Botón Primario de Compra */}
            <button
              type="button"
              onClick={handleGoToCheckout}
              className="btn-pill-primary w-full py-3.5 text-sm tracking-wide shadow-elevated"
            >
              <span>Continuar con el Pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-bauto-piedra mt-2.5 flex items-center justify-center gap-1">
              <span>Pagos seguros procesados por</span>
              <strong className="font-semibold text-bauto-carbon">Wompi PCI-DSS</strong>
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
