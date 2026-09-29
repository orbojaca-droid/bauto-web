/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Tienda Santa Marta
 * @Propósito: Página de la boutique y taller físico en Santa Marta con enlaces GPS nativos
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página informativa con integración GPS
 */

import React from 'react';
import type { Metadata } from 'next';
import { MapPin, Clock, Navigation, Coffee, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { WeatherWidget } from '../../components/navigation/WeatherWidget';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in">
      
      {/* Encabezado Principal */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Boutique & Taller Caribe
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl text-bauto-carbon mb-3">
          BAUTO Santa Marta
        </h1>
        <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
          Un santuario de frescura y lino puro a dos cuadras de la bahía más hermosa de América.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Columna Izquierda: Visor del Mapa, Información de Visita y GPS (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Visor Interactivo del Mapa */}
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-card overflow-hidden border border-bauto-carbon/10 shadow-subtle bg-bauto-perla">
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
              className="w-full h-full filter saturate-[0.85] contrast-[1.05] border-0"
            />
            {/* Insignia Flotante BAUTO sobre el Mapa */}
            <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-bauto-carbon/10 shadow-sm flex items-center gap-2 pointer-events-none z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-bauto-terracota animate-pulse" />
              <span className="text-[11px] font-semibold text-bauto-carbon tracking-wide font-sans">
                BAUTO • Calle 20 # 2-36
              </span>
            </div>
            
            {/* Badge de Proximidad al Mar */}
            <div className="absolute bottom-3.5 right-3.5 bg-bauto-carbon/90 text-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase pointer-events-none z-10 hidden sm:block">
              Centro Histórico • 2 cuadras del Mar
            </div>
          </div>
          
          {/* Tarjeta de Dirección & Horarios */}
          <div className="bg-bauto-perla/80 rounded-card p-6 sm:p-8 border border-bauto-carbon/5 shadow-subtle flex flex-col gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-bauto-terracota/10 text-bauto-terracota shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase text-bauto-piedra block">
                  Ubicación Exacta
                </span>
                <strong className="text-base text-bauto-carbon block font-semibold">
                  Calle 20 # 2-36, Centro Histórico
                </strong>
                <p className="text-xs text-bauto-piedra mt-0.5">
                  Santa Marta, Magdalena, Colombia (Entre Carreras 2da y 3ra)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-bauto-terracota/10 text-bauto-terracota shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase text-bauto-piedra block">
                  Horarios de Atención
                </span>
                <p className="text-xs text-bauto-carbon leading-relaxed">
                  <strong className="font-semibold">Lunes a Sábado:</strong> 10:00 AM – 8:00 PM<br />
                  <strong className="font-semibold">Domingos y Festivos:</strong> 11:00 AM – 6:00 PM
                </p>
              </div>
            </div>

            {/* Botones de Navegación GPS Directa */}
            <div className="pt-4 border-t border-bauto-carbon/10">
              <span className="text-[11px] font-medium text-bauto-carbon block mb-3">
                Cómo llegar con tu app de navegación preferida:
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary px-5 py-2.5 text-xs shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-glass px-5 py-2.5 text-xs"
                >
                  <span>Apple Maps</span>
                </a>

                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-glass px-5 py-2.5 text-xs"
                >
                  <span>Waze</span>
                </a>
              </div>
            </div>

          </div>

          {/* Amenidades de la Boutique */}
          <div className="bg-bauto-perla/60 rounded-card p-6 sm:p-8 border border-bauto-carbon/5">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-5">
              La Experiencia en Boutique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-bauto-terracota shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-bauto-carbon block">Climatización Óptima</strong>
                  <p className="text-[11px] text-bauto-piedra">Espacio fresco y relajante para probarte con total calma.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-bauto-terracota shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-bauto-carbon block">Café de la Sierra</strong>
                  <p className="text-[11px] text-bauto-piedra">Disfruta una taza de café artesanal cosechado en la Sierra Nevada.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Vista Visual y Concierge VIP (5 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-card overflow-hidden bg-bauto-carbon text-white p-7 sm:p-9 flex flex-col gap-5 shadow-elevated">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-trigo font-semibold block mb-1">
                Concierge de Tienda
              </span>
              <h3 className="font-title font-bold text-xl">
                ¿Deseas apartar una pieza o agendar una cita privada?
              </h3>
            </div>

            <p className="text-xs text-bauto-perla/80 leading-relaxed font-body">
              Nuestro equipo en taller puede preparar tus prendas favoritas para que estén listas en tu talla al momento de visitarnos.
            </p>

            <a
              href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO, quisiera consultar disponibilidad en la boutique de Santa Marta.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary bg-bauto-terracota hover:bg-bauto-terracota-dark py-3.5 text-xs tracking-wide text-white flex items-center justify-center gap-2 shadow-elevated"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Escribir al Concierge de Tienda</span>
            </a>
          </div>

          <div className="p-5 rounded-card bg-[#FAF6F0] border border-[#E8DEC8] text-xs text-bauto-carbon">
            <h4 className="font-semibold text-bauto-carbon mb-1">
              Atención a Turistas & Viajeros
            </h4>
            <p className="font-editorial italic text-[11px] text-bauto-piedra leading-relaxed">
              Si estás de viaje en Santa Marta, Tayrona o Minca, realizamos entregas en tu hotel el mismo día o despacho aéreo nacional e internacional.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
