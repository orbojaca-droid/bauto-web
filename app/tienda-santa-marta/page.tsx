/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Tienda Santa Marta
 * @Propósito: Página de la boutique y taller físico en Santa Marta bajo estética Quiet Luxury
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Enlaces GPS nativos e iframe de mapa intactos
 */

import React from 'react';
import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';

export const metadata: Metadata = {
  title: 'Boutique Santa Marta | Calle 20 # 2-36 | BAUTO Resort Wear',
  description:
    'Visita nuestra boutique y taller en el Centro Histórico de Santa Marta. Calle 20 # 2-36. Lino noble, confort del Caribe y atención personalizada.',
};

export default function TiendaSantaMartaPage() {
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Calle+20+%23+2-36,+Santa+Marta';
  const appleMapsUrl = 'https://maps.apple.com/?address=Calle+20+2-36,+Santa+Marta,+Colombia';
  const wazeUrl = 'https://waze.com/ul?q=Calle+20+%23+2-36+Santa+Marta';

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapEmbedSrc = googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=BAUTO+Travel+Wear,Calle+20+%23+2-36,Santa+Marta`
    : 'https://www.openstreetmap.org/export/embed.html?bbox=-74.2165%2C11.2395%2C-74.2110%2C11.2445&layer=mapnik&marker=11.2420124%2C-74.2138635';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-20 animate-fade-in font-body">
      
      {/* Encabezado Principal */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra font-normal block mb-3">
          Atelier & Boutique · Santa Marta
        </span>
        <h1 className="font-title font-light text-3xl sm:text-5xl text-bauto-carbon mb-4 tracking-wide">
          Calle 20 # 2-36
        </h1>
        <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
          Un santuario de frescura, lino puro y fibras nobles a dos cuadras de la bahía histórica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Columna Izquierda: Visor del Mapa, Información de Visita y GPS (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col gap-10">

          {/* Visor del Mapa con Marco Hairline */}
          <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden border border-bauto-carbon/10 bg-bauto-perla">
            <iframe
              title="Mapa Boutique BAUTO Santa Marta"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              loading="lazy"
              src={mapEmbedSrc}
              className="w-full h-full filter saturate-[0.8] contrast-[1.02] border-0"
            />
            {/* Coordenada Sutil sobre el Mapa */}
            <div className="absolute top-4 left-4 bg-bauto-nube/95 backdrop-blur-md px-3 py-1.5 border border-bauto-carbon/10 text-[10px] uppercase tracking-wider text-bauto-carbon font-normal pointer-events-none">
              11°14′31″ N · 74°12′49″ W
            </div>
          </div>
          
          {/* Información de Dirección & Horarios */}
          <div className="border-t border-bauto-carbon/10 pt-8 flex flex-col gap-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
                  Dirección
                </span>
                <strong className="text-sm text-bauto-carbon block font-medium">
                  Calle 20 # 2-36, Centro Histórico
                </strong>
                <p className="text-xs text-bauto-piedra mt-1 leading-relaxed">
                  Entre Carreras 2da y 3ra · Santa Marta, Magdalena
                </p>
              </div>

              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
                  Horarios de Atelier
                </span>
                <p className="text-xs text-bauto-carbon leading-relaxed">
                  <span className="text-bauto-piedra">Lunes a Sábado:</span> 10:00 AM – 8:00 PM<br />
                  <span className="text-bauto-piedra">Domingos y Festivos:</span> 11:00 AM – 6:00 PM
                </p>
              </div>
            </div>

            {/* Enlaces GPS Tipográficos */}
            <div className="pt-4 border-t border-bauto-carbon/10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block mb-3 font-normal">
                Navegación GPS:
              </span>
              <div className="flex items-center gap-4 text-xs font-normal">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bauto-carbon hover:text-bauto-piedra transition-colors underline underline-offset-4"
                >
                  Google Maps
                </a>
                <span className="text-bauto-carbon/20">·</span>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bauto-carbon hover:text-bauto-piedra transition-colors underline underline-offset-4"
                >
                  Apple Maps
                </a>
                <span className="text-bauto-carbon/20">·</span>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bauto-carbon hover:text-bauto-piedra transition-colors underline underline-offset-4"
                >
                  Waze
                </a>
              </div>
            </div>

          </div>

          {/* Experiencia en Atelier */}
          <div className="border-t border-bauto-carbon/10 pt-8">
            <h3 className="text-[10px] font-normal tracking-[0.2em] uppercase text-bauto-piedra mb-6">
              La Experiencia en Taller
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <strong className="font-normal text-bauto-carbon block mb-1">Espacio de Calma</strong>
                <p className="text-[11px] text-bauto-piedra leading-relaxed">Ambiente sereno y climatizado para descubrir las texturas con reposo.</p>
              </div>

              <div>
                <strong className="font-normal text-bauto-carbon block mb-1">Café de la Sierra</strong>
                <p className="text-[11px] text-bauto-piedra leading-relaxed">Cosecha artesanal de la Sierra Nevada para acompañar tu visita.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Concierge de Atelier y Viajeros (5 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="border border-bauto-carbon/10 p-8 sm:p-10 flex flex-col gap-6 bg-bauto-perla/30">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
                Atención Concierge
              </span>
              <h3 className="font-title font-light text-xl text-bauto-carbon tracking-wide">
                ¿Deseas apartar una pieza o agendar una cita en boutique?
              </h3>
            </div>

            <p className="text-xs text-bauto-piedra leading-relaxed font-body">
              Nuestro taller puede reservar tus siluetas predilectas en tu talla exacta para que estén listas al momento de tu llegada.
            </p>

            <a
              href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO, quisiera consultar disponibilidad en la boutique de Santa Marta.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 stroke-[1.5]" />
              <span>Contactar Concierge</span>
            </a>
          </div>

          <div className="p-6 bg-[#FAF6F0] border-l-2 border-bauto-arena text-xs text-bauto-carbon">
            <h4 className="font-medium text-bauto-carbon mb-1">
              Atención a Huéspedes & Viajeros
            </h4>
            <p className="font-editorial italic text-xs text-bauto-piedra leading-relaxed">
              Si estás de paso por Santa Marta, Tayrona o Minca, coordinamos entregas directas en tu hotel o despacho prioritario nacional e internacional.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
