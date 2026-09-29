'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Confirmación Post-Pago
 * @Propósito: Pantalla de confirmación de compra post-pasarela Wompi con estética de pliego editorial y narrativa de atelier
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Enlaces transaccionales y limpieza de carrito intactos
 */

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, PackageCheck, MessageCircle } from 'lucide-react';
import { useCartStore } from '../../../lib/cartStore';
import { playSuccessChime, playHapticClick } from '../../../lib/sound';
import { BAUTO_WHATSAPP_PHONE } from '../../../lib/constants';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('id') || searchParams.get('transactionId') || '';
  const reference = searchParams.get('reference') || searchParams.get('ref') || 'BAUTO-WEB';

  const clearCart = useCartStore((state) => state.clearCart);

  // Vaciar carrito y reproducir campanada de éxito al confirmar orden
  useEffect(() => {
    playSuccessChime();
    clearCart();
  }, [clearCart]);

  const whatsappMsg = encodeURIComponent(
    `Hola BAUTO Concierge, acabo de realizar la orden con referencia: ${reference}. Quisiera consultar detalles del alistamiento de mis prendas.`
  );
  const whatsappUrl = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${whatsappMsg}`;

  const stages = [
    { num: '01', title: 'Orden Recibida', desc: 'Pago procesado exitosamente por Wompi', done: true },
    { num: '02', title: 'Alistamiento en Taller', desc: 'Prenda doblada y perfumada en Santa Marta', current: true },
    { num: '03', title: 'En Tránsito con la Brisa', desc: 'Guía MiPaquete generada y en camino', pending: true },
    { num: '04', title: 'Entrega en tu Puerta', desc: 'Confort consciente del Caribe en tus manos', pending: true },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center animate-fade-in font-body">
      
      {/* Sello Editorial Sutil */}
      <div className="w-12 h-12 rounded-full border border-bauto-carbon/20 mx-auto flex items-center justify-center text-bauto-carbon mb-6">
        <Check className="w-5 h-5 stroke-[1.5]" />
      </div>

      <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
        Pedido Confirmado · Taller Santa Marta
      </span>

      <h1 className="font-title font-light text-3xl sm:text-4xl tracking-wide text-bauto-carbon mb-3">
        Gracias por vestir BAUTO
      </h1>

      <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra max-w-md mx-auto mb-6">
        Tus prendas están siendo seleccionadas con dedicación bajo la brisa y la luz de nuestro atelier en Santa Marta.
      </p>

      {/* Referencia de la Orden */}
      <div className="inline-flex items-center gap-2 px-4 py-2 border-b border-bauto-carbon/20 text-xs text-bauto-carbon mb-12">
        <span className="text-bauto-piedra font-normal">Referencia:</span>
        <span className="font-medium tracking-wider">{reference}</span>
      </div>

      {/* Storytelling Editorial de 4 Etapas */}
      <div className="border-t border-b border-bauto-carbon/10 py-8 mb-12 text-left">
        <h2 className="text-[10px] font-normal tracking-[0.2em] uppercase text-bauto-piedra mb-8">
          Etapas de Preparación del Pedido
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stages.map((stage) => (
            <div key={stage.num} className="flex items-start gap-3">
              <span className={`text-xs font-title tracking-wider ${stage.current ? 'text-bauto-carbon font-medium' : 'text-bauto-piedra/60'}`}>
                {stage.num}
              </span>
              <div>
                <h3 className={`text-xs font-normal tracking-wide ${stage.current ? 'text-bauto-carbon font-medium' : 'text-bauto-carbon'}`}>
                  {stage.title}
                </h3>
                <p className="text-[11px] text-bauto-piedra mt-0.5 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/rastreo?guia=${encodeURIComponent(reference)}`}
          onClick={playHapticClick}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-4 h-4 stroke-[1.5]" />
          <span>Consultar Portal de Rastreo</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={playHapticClick}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-bauto-carbon/20 text-bauto-carbon hover:bg-bauto-perla transition-colors text-xs tracking-wide flex items-center justify-center gap-2 font-normal"
        >
          <MessageCircle className="w-4 h-4 text-bauto-carbon/70 stroke-[1.5]" />
          <span>Atención Concierge</span>
        </a>

        <Link
          href="/catalogo"
          onClick={playHapticClick}
          className="w-full sm:w-auto px-5 py-3.5 text-xs text-bauto-piedra hover:text-bauto-carbon transition-colors"
        >
          <span>Volver al Catálogo</span>
        </Link>
      </div>

    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-bauto-piedra">Cargando confirmación...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
