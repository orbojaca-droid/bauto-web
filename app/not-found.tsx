/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Error 404 Poético
 * @Propósito: Página personalizada de 'No Encontrado' con estética Quiet Luxury
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página de error 404 estándar de Next.js
 */

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MessageCircle } from 'lucide-react';
import { BAUTO_WHATSAPP_URL } from '../lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
      <div className="max-w-md w-full text-center">
        
        {/* Ícono de Compás Serena */}
        <Compass className="w-8 h-8 text-bauto-terracota/80 stroke-[1.25] mx-auto mb-6" />

        {/* Indicador Numérico Discreto */}
        <span className="font-title text-[10px] font-medium uppercase tracking-[0.35em] text-bauto-piedra block mb-2">
          404 — Fuera de Rumbo
        </span>

        {/* Título Principal */}
        <h1 className="font-title font-light text-2xl sm:text-3xl text-bauto-carbon mb-3">
          Un Rincón Inexplorado
        </h1>

        {/* Narrativa Poética */}
        <p className="font-editorial italic text-xs sm:text-sm text-bauto-piedra leading-relaxed mb-8 max-w-sm mx-auto">
          Como una brisa que cambia de rumbo sobre el mar de Santa Marta, la coordenada que buscas no existe en esta colección.
        </p>

        {/* Botones de Retorno y Navegación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/catalogo"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs tracking-[0.18em] uppercase inline-flex items-center justify-center gap-2 font-medium"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="btn-pill-ghost w-full sm:w-auto px-7 py-3 text-xs tracking-[0.18em] uppercase inline-flex items-center justify-center gap-2"
          >
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Asistencia Concierge */}
        <div className="pt-6 border-t border-bauto-carbon/[0.06] text-xs text-bauto-piedra font-light">
          <span>¿Buscabas una pieza o silueta específica? </span>
          <a
            href={`${BAUTO_WHATSAPP_URL}?text=${encodeURIComponent('Hola BAUTO, buscaba una prenda y no la encontré en la web.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bauto-carbon font-medium hover:text-bauto-terracota inline-flex items-center gap-1 border-b border-bauto-carbon/20 pb-0.5 ml-1 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-bauto-terracota" />
            <span>Asistencia Concierge</span>
          </a>
        </div>

      </div>
    </div>
  );
}
