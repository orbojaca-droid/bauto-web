/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Centro de Ayuda & Legal
 * @Propósito: Página de preguntas frecuentes, envíos, cambios y Derecho de Retracto (Ley 1480 de 2011)
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página informativa institucional
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Truck, RefreshCw, ShieldCheck, Scale, MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';

export const metadata: Metadata = {
  title: 'Centro de Ayuda & Políticas | BAUTO Resort Wear',
  description:
    'Preguntas frecuentes sobre envíos nacionales, cambios de talla, derecho de retracto (Ley 1480) y medios de pago seguros.',
};

export default function AyudaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in">
      
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Atención al Cliente
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl text-bauto-carbon mb-3">
          Centro de Ayuda & Políticas
        </h1>
        <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed">
          Transparencia, confianza y respaldo en cada etapa de tu experiencia con BAUTO.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* 1. Envíos Nacionales */}
        <section id="envios" className="bg-bauto-perla/80 rounded-card p-6 sm:p-8 border border-bauto-carbon/5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-terracota mb-3">
            <Truck className="w-4 h-4" />
            <span>Envíos y Despachos Nacionales</span>
          </div>
          <h2 className="font-title font-bold text-lg sm:text-xl text-bauto-carbon mb-3">
            ¿Cómo y cuándo recibo mis prendas?
          </h2>
          <div className="text-xs sm:text-sm text-bauto-piedra space-y-2.5 leading-relaxed font-body">
            <p>
              • <strong>Tiempos de entrega:</strong> Las órdenes son preparadas en nuestro taller de Santa Marta en 24 horas hábiles. La entrega toma de <strong>2 a 4 días hábiles</strong> en ciudades principales y de <strong>3 a 6 días hábiles</strong> en otros destinos nacionales.
            </p>
            <p>
              • <strong>Entrega de cortesía:</strong> Disfruta de flete gratis en todo el territorio colombiano para compras superiores a <strong>$300.000 COP</strong>. Para órdenes menores, el flete fijo es de <strong>$15.000 COP</strong>.
            </p>
            <p>
              • <strong>Seguimiento en vivo:</strong> Puedes rastrear el estado de tu paquete en cualquier momento desde nuestro <Link href="/rastreo" className="text-bauto-terracota underline">Portal de Rastreo Canónico</Link>.
            </p>
          </div>
        </section>

        {/* 2. Cambios de Talla */}
        <section id="cambios" className="bg-bauto-perla/80 rounded-card p-6 sm:p-8 border border-bauto-carbon/5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-terracota mb-3">
            <RefreshCw className="w-4 h-4" />
            <span>Políticas de Cambios y Garantía</span>
          </div>
          <h2 className="font-title font-bold text-lg sm:text-xl text-bauto-carbon mb-3">
            ¿Cómo realizar un cambio de talla?
          </h2>
          <div className="text-xs sm:text-sm text-bauto-piedra space-y-2.5 leading-relaxed font-body">
            <p>
              • <strong>Primer cambio ágil:</strong> Entendemos la importancia de que una prenda de lino siente con la holgura perfecta. El primer cambio de talla no tiene costo de transporte para el cliente.
            </p>
            <p>
              • <strong>Plazo para solicitar cambio:</strong> Dispones de <strong>30 días calendario</strong> a partir de la fecha de entrega para notificar la solicitud a través de nuestro Concierge de WhatsApp.
            </p>
            <p>
              • <strong>Condiciones:</strong> La prenda debe estar en perfecto estado, sin lavar, sin alteraciones y con sus etiquetas y empaque original.
            </p>
          </div>
        </section>

        {/* 3. Derecho de Retracto (Ley 1480 de 2011) */}
        <section id="retracto" className="bg-[#FAF6F0] rounded-card p-6 sm:p-8 border border-[#E8DEC8]">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-arena mb-3">
            <Scale className="w-4 h-4 text-bauto-terracota" />
            <span>Derecho de Retracto (Ley 1480 de 2011 - Colombia)</span>
          </div>
          <h2 className="font-title font-bold text-lg sm:text-xl text-bauto-carbon mb-3">
            Garantía legal de devolución del 100% de tu dinero
          </h2>
          <div className="text-xs sm:text-sm text-bauto-piedra space-y-2.5 leading-relaxed font-body">
            <p>
              De conformidad con el Artículo 47 del Estatuto del Consumidor en Colombia (Ley 1480 de 2011), en las compras realizadas a través de comercio electrónico el consumidor tiene derecho a retractarse de la compra dentro de los <strong>5 (cinco) días hábiles</strong> siguientes a la entrega de la prenda.
            </p>
            <p>
              • El cliente devolverá el producto a nuestro taller en las mismas condiciones en que lo recibió, asumiendo los costos de transporte de regreso.
            </p>
            <p>
              • BAUTO reintegrará el 100% del dinero pagado en un plazo máximo de <strong>15 a 30 días calendario</strong> a través de reversión en Wompi o consignación a cuenta bancaria titular.
            </p>
          </div>
        </section>

        {/* 4. Medios de Pago */}
        <section id="pagos" className="bg-bauto-perla/80 rounded-card p-6 sm:p-8 border border-bauto-carbon/5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-terracota mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Pagos y Seguridad</span>
          </div>
          <h2 className="font-title font-bold text-lg sm:text-xl text-bauto-carbon mb-3">
            ¿Cuáles son los medios de pago aceptados?
          </h2>
          <p className="text-xs sm:text-sm text-bauto-piedra leading-relaxed font-body mb-3">
            Todos nuestros cobros en línea son procesados por <strong>Wompi</strong> (Bancolombia) bajo certificación bancaria <strong>PCI-DSS Nivel 1</strong> y protocolo antifraude 3D Secure 2.0. Puedes pagar con:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-bauto-carbon">
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ PSE (Todos los bancos)</div>
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ Botón Bancolombia</div>
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ Nequi</div>
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ Tarjetas de Crédito</div>
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ Tarjetas Débito</div>
            <div className="p-2.5 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5">✓ Addi (Cuotas sin interés)</div>
          </div>
        </section>

        {/* 5. Asistencia Directa */}
        <div className="text-center pt-4">
          <p className="text-xs text-bauto-piedra mb-3">
            ¿Tu inquietud requiere atención personalizada?
          </p>
          <a
            href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO, tengo una consulta sobre políticas o mi pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-primary px-7 py-3 text-xs tracking-wide inline-flex items-center gap-2 shadow-elevated"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Hablar con un Asesor de Taller</span>
          </a>
        </div>

      </div>

    </div>
  );
}
