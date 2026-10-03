'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Confirmación Post-Pago
 * @Propósito: Pantalla de confirmación de compra post-pasarela Wompi con estética de pliego editorial y Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado
 */

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, MessageCircle } from 'lucide-react';
import { useCartStore } from '../../../lib/cartStore';
import { playSuccessChime, playHapticClick } from '../../../lib/sound';
import { BAUTO_WHATSAPP_PHONE } from '../../../lib/constants';

function ConfirmationContent() {
 const searchParams = useSearchParams();
 const transactionId = searchParams.get('id') || searchParams.get('transactionId') || '';
 const reference = searchParams.get('reference') || searchParams.get('ref') || 'BAUTO-WEB';

 const clearCart = useCartStore((state) => state.clearCart);

 // Vaciar carrito, reproducir campanada y asegurar envío del recibo
 useEffect(() => {
 playSuccessChime();
 clearCart();

 // @BAUTO_REFACTOR 2026-10-03: Despacho seguro de recibo por correo
 if (reference && reference !== 'BAUTO-WEB') {
 fetch('/api/checkout/send-receipt', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ reference, transactionId }),
 }).catch((err) =>
 console.warn('[Confirmación] Notificación recibo no bloqueante:', err)
 );
 }
 }, [clearCart, reference, transactionId]);

 const whatsappMsg = encodeURIComponent(
 `Hola BAUTO Concierge, acabo de realizar la orden con referencia: ${reference}. Quisiera consultar detalles del alistamiento de mis prendas.`
 );
 const whatsappUrl = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${whatsappMsg}`;

 const stages = [
 { num: '01', title: 'Pago aprobado', desc: 'Transacción confirmada por pasarela Wompi', done: true },
 { num: '02', title: 'Alistamiento en taller', desc: 'Prendas seleccionadas, planchadas y perfumadas en Santa Marta', current: true },
 { num: '03', title: 'Despacho Servientrega', desc: 'Tu número de guía se enviará por correo al entregar al transportador', pending: true },
 { num: '04', title: 'Entrega en tu puerta', desc: 'Confort consciente del Caribe en tus manos', pending: true },
 ];

 return (
 <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center animate-fade-in">
 
 {/* Sello editorial sutil */}
 <div className="w-12 h-12  mx-auto flex items-center justify-center text-bauto-carbon mb-6">
 <Check className="w-5 h-5 stroke-[1.5]" />
 </div>

 <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
 Pedido confirmado · Taller Santa Marta
 </span>

 <h1 className="font-light text-3xl sm:text-4xl tracking-wide text-bauto-carbon mb-3">
 Gracias por vestir BAUTO
 </h1>

 <p className="italic text-sm sm:text-base text-bauto-piedra max-w-md mx-auto mb-6">
 Tus prendas están siendo seleccionadas con dedicación bajo la brisa y la luz de nuestro atelier en Santa Marta.
 </p>

 {/* Referencia de la orden */}
 <div className="inline-flex items-center gap-2 px-4 py-2  text-xs text-bauto-carbon mb-12">
 <span className="text-bauto-piedra font-normal">Referencia:</span>
 <span className="font-medium tracking-wider">{reference}</span>
 </div>

 {/* Storytelling editorial de 4 etapas */}
 <div className="border-t py-8 mb-12 text-left">
 <h2 className="text-[10px] font-normal tracking-[0.2em] uppercase text-bauto-piedra mb-8">
 Etapas de preparación del pedido
 </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 {stages.map((stage) => (
 <div key={stage.num} className="flex items-start gap-3">
 <span className={`text-xs tracking-wider ${stage.current ? 'text-bauto-carbon font-medium' : 'text-bauto-piedra/60'}`}>
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

 {/* Aviso editorial de recibo y guía posterior */}
 <div className="border border-[#EAE7DF] bg-[#FAF9F6] p-4 text-xs text-bauto-carbon mb-10 text-left leading-relaxed">
 <p className="font-medium text-bauto-carbon mb-1">
 Recibo de compra enviado a tu correo
 </p>
 <p className="text-[11px] text-bauto-piedra">
 Hemos procesado tu pago con éxito y generado el recibo correspondiente. Cuando el taller entregue tus prendas a Servientrega, recibirás un correo electrónico independiente con el número de guía para consultar el rastreo en tiempo real.
 </p>
 </div>

 {/* Botones de acción */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
 <a
 href={whatsappUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={playHapticClick}
 // @BAUTO_REFACTOR 2026-10-03
 className="w-full sm:w-auto px-7 py-3.5 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-transform active:scale-[0.97] text-xs font-sans font-medium flex items-center justify-center gap-2"
 >
 <MessageCircle className="w-4 h-4 stroke-[1.5]" />
 <span>Atención concierge WhatsApp</span>
 </a>

 <Link
 href="/catalogo"
 onClick={playHapticClick}
 // @BAUTO_REFACTOR 2026-10-03
 className="w-full sm:w-auto px-6 py-3.5 border border-[#EAE7DF] text-bauto-carbon hover:bg-bauto-perla transition-transform active:scale-[0.97] text-xs font-sans flex items-center justify-center gap-2 font-normal"
 >
 <span>Volver al catálogo</span>
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
