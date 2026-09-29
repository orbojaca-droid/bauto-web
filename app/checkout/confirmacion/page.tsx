'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Confirmación Post-Pago
 * @Propósito: Pantalla de confirmación de compra post-pasarela Wompi con storytelling caribeño
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página informativa con enlaces directos a WhatsApp y Rastreo
 */

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, MessageCircle, ArrowRight, Sparkles, MapPin } from 'lucide-react';
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
    `Hola BAUTO Concierge, acabo de realizar la orden con referencia: ${reference}. Quisiera consultar detalles del alistamiento.`
  );
  const whatsappUrl = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${whatsappMsg}`;

  const stages = [
    { title: 'Orden Recibida', desc: 'Pago procesado exitosamente por Wompi', done: true },
    { title: 'Alistamiento en Taller', desc: 'Prenda doblada y perfumada en Santa Marta', current: true },
    { title: 'En Tránsito con la Brisa', desc: 'Guía MiPaquete generada y en camino', pending: true },
    { title: 'Entrega en tu Puerta', desc: 'Disfruta del confort consciente del Caribe', pending: true },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center animate-fade-in">
      
      {/* Icono de Éxito */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-bauto-terracota/10 mx-auto flex items-center justify-center text-bauto-terracota mb-6 border border-bauto-terracota/20">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-bauto-terracota font-semibold block mb-2">
        Transacción Exitosa • Wompi Aprobada
      </span>

      <h1 className="font-title font-bold text-3xl sm:text-4xl tracking-tight text-bauto-carbon mb-3">
        ¡Gracias por elegir BAUTO!
      </h1>

      <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra max-w-lg mx-auto mb-6">
        Tus prendas están siendo seleccionadas con dedicación bajo la brisa y la luz de nuestro taller en Santa Marta.
      </p>

      {/* Referencia de la Orden */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-bauto-perla border border-bauto-carbon/10 font-mono text-xs font-semibold text-bauto-carbon mb-10">
        <span>Referencia:</span>
        <span className="text-bauto-terracota">{reference}</span>
      </div>

      {/* Storytelling de 4 Etapas */}
      <div className="bg-bauto-perla/70 rounded-card p-6 sm:p-8 border border-bauto-carbon/5 text-left mb-10 shadow-subtle">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-6 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-bauto-terracota" />
          <span>Etapas de Preparación de tu Pedido</span>
        </h2>

        <div className="space-y-6">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    stage.done
                      ? 'bg-bauto-success text-white'
                      : stage.current
                      ? 'bg-bauto-terracota text-white animate-pulse'
                      : 'bg-bauto-carbon/10 text-bauto-piedra'
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < stages.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${stage.done ? 'bg-bauto-success/40' : 'bg-bauto-carbon/10'}`} />
                )}
              </div>

              <div>
                <h3 className={`text-xs font-semibold ${stage.current ? 'text-bauto-terracota' : 'text-bauto-carbon'}`}>
                  {stage.title}
                </h3>
                <p className="text-[11px] text-bauto-piedra">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/rastreo?guia=${encodeURIComponent(reference)}`}
          onClick={playHapticClick}
          className="btn-pill-primary w-full sm:w-auto px-7 py-3.5 text-xs tracking-wide shadow-elevated"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Consultar Portal de Rastreo</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={playHapticClick}
          className="btn-pill-glass w-full sm:w-auto px-6 py-3.5 text-xs tracking-wide flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Contactar al Concierge VIP</span>
        </a>

        <Link
          href="/catalogo"
          onClick={playHapticClick}
          className="btn-pill-ghost w-full sm:w-auto px-5 py-3.5 text-xs text-bauto-piedra hover:text-bauto-carbon transition-colors"
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
