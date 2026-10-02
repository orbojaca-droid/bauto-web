/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Tienda Santa Marta
 * @Propósito: Página de la Studio y taller físico en Santa Marta bajo estética Quiet Luxury.
 * Mapa cartográfico personalizado a medida y tipografía estricta en Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado
 */

import React from 'react';
import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';
import { StudioMap } from '../../components/map/StudioMap';

export const metadata: Metadata = {
 title: 'Studio Santa Marta | Calle 20 # 2-36 | BAUTO Resort Wear',
 description:
 'Visita nuestra Studio y taller en el Centro Histórico de Santa Marta. Calle 20 # 2-36. Lino noble, confort del Caribe y atención personalizada.',
};

export default function TiendaSantaMartaPage() {
 return (
 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-20 animate-fade-in">
 
 {/* Encabezado principal */}
 <div className="text-center max-w-2xl mx-auto mb-16">
 <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra font-normal block mb-3">
 Atelier y Studio · Santa Marta
 </span>
 <h1 className="font-light text-3xl sm:text-5xl text-bauto-carbon mb-4 tracking-wide">
 Calle 20 # 2-36
 </h1>
 <p className="italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
 Un santuario de frescura, lino puro y fibras nobles a dos cuadras de la bahía histórica.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
 
 {/* Columna izquierda: Visor del mapa cartográfico a medida e información de visita (7 columnas) */}
 <div className="lg:col-span-7 flex flex-col gap-10">

 {/* Visor del mapa personalizado BAUTO */}
 <StudioMap />
 
 {/* Información de dirección y horarios */}
 <div className=" pt-8 flex flex-col gap-8">
 
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
 Horarios de atelier
 </span>
 <p className="text-xs text-bauto-carbon leading-relaxed">
 <span className="text-bauto-piedra">Lunes a sábado:</span> 10:00 AM – 8:00 PM<br />
 <span className="text-bauto-piedra">Domingos y festivos:</span> 11:00 AM – 6:00 PM
 </p>
 </div>
 </div>

 </div>

 {/* Experiencia en atelier */}
 <div className=" pt-8">
 <h3 className="text-[10px] font-normal tracking-[0.2em] uppercase text-bauto-piedra mb-6">
 La experiencia en taller
 </h3>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
 <div>
 <strong className="font-normal text-bauto-carbon block mb-1">Espacio de calma</strong>
 <p className="text-[11px] text-bauto-piedra leading-relaxed">Ambiente sereno y climatizado para descubrir las texturas con reposo.</p>
 </div>

 <div>
 <strong className="font-normal text-bauto-carbon block mb-1">Café de la Sierra</strong>
 <p className="text-[11px] text-bauto-piedra leading-relaxed">Cosecha artesanal de la Sierra Nevada para acompañar tu visita.</p>
 </div>
 </div>
 </div>

 </div>

 {/* Columna derecha: Concierge de atelier y viajeros (5 columnas) */}
 <div className="lg:col-span-5 flex flex-col gap-8">
 <div className=" p-8 sm:p-10 flex flex-col gap-6 bg-bauto-perla/30">
 <div>
 <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
 Atención concierge
 </span>
 <h3 className="font-light text-xl text-bauto-carbon tracking-wide">
 ¿Deseas apartar una pieza o agendar una cita en Studio?
 </h3>
 </div>

 <p className="text-xs text-bauto-piedra leading-relaxed">
 Nuestro taller puede reservar tus siluetas predilectas en tu talla exacta para que estén listas al momento de tu llegada.
 </p>

 <a
 href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO, quisiera consultar disponibilidad en la Studio de Santa Marta.')}`}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full py-3.5 px-6 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs font-sans font-medium flex items-center justify-center gap-2"
 >
 <MessageCircle className="w-4 h-4 stroke-[1.5]" />
 <span>Contactar concierge</span>
 </a>
 </div>

 <div className="p-6 bg-[#FAF6F0] text-xs text-bauto-carbon">
 <h4 className="font-medium text-bauto-carbon mb-1">
 Atención a huéspedes y viajeros
 </h4>
 <p className="italic text-xs text-bauto-piedra leading-relaxed">
 Si estás de paso por Santa Marta, Tayrona o Minca, coordinamos entregas directas en tu hotel o despacho prioritario nacional e internacional.
 </p>
 </div>
 </div>

 </div>

 </div>
 );
}
