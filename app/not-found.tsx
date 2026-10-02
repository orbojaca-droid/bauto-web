/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Error 404 Poético
 * @Propósito: Página personalizada de 'No Encontrado' con estética Quiet Luxury y Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página de error 404 estándar de Next.js
 */

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_URL } from '../lib/constants';

export default function NotFound() {
 return (
 <div className="min-h-[70vh] flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20 animate-fade-in">
 <div className="max-w-md w-full text-center">
 
 {/* 404 Tipográfico Gigante */}
 <h1 className="text-[6rem] sm:text-[8rem] uppercase tracking-[0.15em] font-light text-[#1C1917] leading-none mb-6">
 404
 </h1>

 {/* Título principal */}
 <h2 className="font-light uppercase tracking-[0.1em] text-xl sm:text-2xl text-[#1C1917] mb-3">
 Un rincón inexplorado
 </h2>

 {/* Narrativa poética */}
 <p className="italic text-xs sm:text-sm text-bauto-piedra leading-relaxed mb-8 max-w-sm mx-auto">
 Como una brisa que cambia de rumbo sobre el mar de Santa Marta, la coordenada que buscas no existe en esta colección.
 </p>

 {/* Botones de retorno y navegación */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
 <Link
 href="/catalogo"
 className="w-full sm:w-auto px-7 py-3 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs font-sans inline-flex items-center justify-center gap-2 font-medium"
 >
 <span>Ver catálogo</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>

 <Link
 href="/"
 className="w-full sm:w-auto px-7 py-3  text-bauto-carbon hover:bg-bauto-perla transition-colors text-xs font-sans inline-flex items-center justify-center gap-2 font-normal"
 >
 <span>Volver al inicio</span>
 </Link>
 </div>

 {/* Asistencia concierge */}
 <div className="pt-6 text-xs text-bauto-piedra font-light">
 <span>¿Buscabas una pieza o silueta específica? </span>
 <a
 href={`${BAUTO_WHATSAPP_URL}?text=${encodeURIComponent('Hola BAUTO, buscaba una prenda y no la encontré en la web.')}`}
 target="_blank"
 rel="noopener noreferrer"
 className="text-bauto-carbon font-medium hover:text-bauto-terracota inline-flex items-center gap-1  pb-0.5 ml-1 transition-colors"
 >
 <MessageCircle className="w-3.5 h-3.5 text-bauto-terracota" />
 <span>Asistencia concierge</span>
 </a>
 </div>

 </div>
 </div>
 );
}
