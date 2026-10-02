/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Centro de Ayuda & Legal
 * @Propósito: Políticas de atención, envíos, cambios y derecho de retracto (Ley 1480 de 2011) bajo estética Quiet Luxury y Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';

export const metadata: Metadata = {
 title: 'Atención y políticas | BAUTO Resort Wear',
 description:
 'Preguntas frecuentes sobre envíos nacionales, cambios de talla, derecho de retracto (Ley 1480) y medios de pago seguros.',
};

export default function AyudaPage() {
 return (
 <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
 
 {/* Encabezado editorial */}
 <div className="text-center max-w-xl mx-auto mb-16">
 <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra font-normal block mb-3">
 Servicio al cliente
 </span>
 <h1 className="font-light text-3xl sm:text-5xl text-bauto-carbon mb-4 tracking-wide">
 Atención y políticas
 </h1>
 <p className="italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
 Claridad, respaldo y atención personalizada en cada etapa de tu experiencia BAUTO.
 </p>
 </div>

 {/* Secciones de políticas con divisores hairline */}
 <div className="divide-y divide-bauto-carbon/10 border-t ">
 
 {/* 1. Envíos nacionales */}
 <section id="envios" className="py-10 sm:py-12">
 <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block mb-2 font-normal">
 01 · Logística y entrega
 </span>
 <h2 className="font-light text-xl sm:text-2xl text-bauto-carbon mb-4 tracking-wide">
 Envíos y despachos nacionales
 </h2>
 <div className="text-xs sm:text-sm text-bauto-piedra space-y-3 leading-relaxed">
 <p>
 • <strong className="text-bauto-carbon font-medium">Tiempos de entrega:</strong> Las órdenes se alistan en nuestro atelier de Santa Marta dentro de las 24 horas hábiles. La entrega toma de <strong>2 a 4 días hábiles</strong> en ciudades principales y de <strong>3 a 6 días hábiles</strong> en otros destinos nacionales.
 </p>
 <p>
 • <strong className="text-bauto-carbon font-medium">Tarifa de envío nacional:</strong> Todos nuestros despachos nacionales tienen una tarifa plana de <strong>$15.000 COP</strong>.
 </p>
 <p>
 • <strong className="text-bauto-carbon font-medium">Seguimiento en línea:</strong> Puedes consultar el progreso de tu envío en cualquier momento desde nuestro{' '}
 <Link href="/rastreo" className="text-bauto-carbon underline underline-offset-4 hover:text-bauto-piedra transition-opacity hover:opacity-80 active:scale-[0.97]">
 portal de rastreo
 </Link>.
 </p>
 </div>
 </section>

 {/* 2. Cambios de talla */}
 <section id="cambios" className="py-10 sm:py-12">
 <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block mb-2 font-normal">
 02 · Ajuste y talla
 </span>
 <h2 className="font-light text-xl sm:text-2xl text-bauto-carbon mb-4 tracking-wide">
 Políticas de cambios y garantía
 </h2>
 <div className="text-xs sm:text-sm text-bauto-piedra space-y-3 leading-relaxed">
 <p>
 • <strong className="text-bauto-carbon font-medium">Primer cambio sin costo:</strong> Queremos que cada silueta siente con perfecta holgura. El primer cambio de talla no tiene costo de transporte.
 </p>
 <p>
 • <strong className="text-bauto-carbon font-medium">Plazo de solicitud:</strong> Dispones de <strong>30 días calendario</strong> a partir de la entrega para solicitar tu cambio a través de nuestro Concierge.
 </p>
 <p>
 • <strong className="text-bauto-carbon font-medium">Condiciones:</strong> La prenda debe conservarse en estado original, sin uso ni alteraciones, con etiquetas y empaque intactos.
 </p>
 </div>
 </section>

 {/* 3. Derecho de retracto (Ley 1480 de 2011) */}
 <section id="retracto" className="py-10 sm:py-12">
 <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block mb-2 font-normal">
 03 · Marco legal
 </span>
 <h2 className="font-light text-xl sm:text-2xl text-bauto-carbon mb-4 tracking-wide">
 Derecho de retracto (Ley 1480 de 2011 - Colombia)
 </h2>
 <div className="text-xs sm:text-sm text-bauto-piedra space-y-3 leading-relaxed">
 <p>
 De conformidad con el Artículo 47 del Estatuto del Consumidor en Colombia (Ley 1480 de 2011), en compras realizadas mediante canales no presenciales o electrónicos, el consumidor tiene derecho a retractarse dentro de los <strong>5 (cinco) días hábiles</strong> siguientes a la recepción de la prenda.
 </p>
 <p>
 • El cliente devolverá la prenda a nuestro atelier en Santa Marta en las mismas condiciones en que fue recibida, asumiendo los costos de envío correspondientes.
 </p>
 <p>
 • BAUTO reintegrará la totalidad del valor cancelado en un plazo de <strong>15 a 30 días calendario</strong> mediante reversión en Wompi o transferencia bancaria a la cuenta del titular.
 </p>
 </div>
 </section>

 {/* 4. Medios de pago y seguridad */}
 <section id="pagos" className="py-10 sm:py-12">
 <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block mb-2 font-normal">
 04 · Pasarela bancaria
 </span>
 <h2 className="font-light text-xl sm:text-2xl text-bauto-carbon mb-4 tracking-wide">
 Medios de pago seguros
 </h2>
 <p className="text-xs sm:text-sm text-bauto-piedra leading-relaxed mb-4">
 Todas las transacciones son gestionadas a través de <strong className="text-bauto-carbon font-medium">Wompi</strong> (Bancolombia) bajo estándar internacional <strong className="text-bauto-carbon font-medium">PCI-DSS Nivel 1</strong> y validación criptográfica 3D Secure 2.0.
 </p>
 <div className="p-4 bg-bauto-perla/40 text-xs text-bauto-carbon flex flex-wrap gap-x-4 gap-y-2 font-normal">
 <span>PSE (todos los bancos)</span>
 <span className="text-bauto-carbon/20">·</span>
 <span>Botón Bancolombia</span>
 <span className="text-bauto-carbon/20">·</span>
 <span>Nequi</span>
 <span className="text-bauto-carbon/20">·</span>
 <span>Tarjetas de crédito y débito</span>
 <span className="text-bauto-carbon/20">·</span>
 <span>Addi (financiamiento)</span>
 </div>
 </section>

 </div>

 {/* Asistencia directa */}
 <div className="text-center pt-12">
 <p className="text-xs text-bauto-piedra mb-4">
 ¿Deseas atención individual para tu pedido?
 </p>
 <a
 href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO, tengo una consulta sobre políticas o mi pedido.')}`}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-8 py-3.5 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-opacity hover:opacity-80 active:scale-[0.97] text-xs font-sans font-medium"
 >
 <MessageCircle className="w-4 h-4 stroke-[1.5]" />
 <span>Atención concierge de taller</span>
 </a>
 </div>

 </div>
 );
}
