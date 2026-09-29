/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Error 404 Poético
 * @Propósito: Página personalizada de 'No Encontrado' con estética Resort Wear
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página de error 404 estándar de Next.js
 */

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Home, ShoppingBag, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="max-w-md w-full text-center">
        
        {/* Ícono de Brisa & Compás */}
        <div className="w-16 h-16 rounded-full bg-bauto-perla border border-bauto-carbon/5 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Compass className="w-8 h-8 text-bauto-terracota animate-pulse" />
        </div>

        {/* Indicador Numérico Discreto */}
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-bauto-terracota block mb-2">
          404 • Fuera de Carta
        </span>

        {/* Título Principal */}
        <h1 className="font-title font-bold text-2xl sm:text-3xl text-bauto-carbon mb-3">
          Un Rincón Inexplorado
        </h1>

        {/* Narrativa Poética */}
        <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed mb-8">
          Como una brisa que cambia de rumbo sobre el mar de Santa Marta, la página o prenda que buscas no se encuentra en esta coordenada.
        </p>

        {/* Botones de Retorno y Navegación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/catalogo"
            className="btn-pill-primary w-full sm:w-auto px-6 py-3 text-xs tracking-wider inline-flex items-center justify-center gap-2 shadow-elevated"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-pill bg-bauto-nube border border-bauto-carbon/15 hover:border-bauto-carbon/30 text-xs text-bauto-carbon font-semibold inline-flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4 text-bauto-piedra" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Asistencia Concierge */}
        <div className="pt-6 border-t border-bauto-carbon/10 text-xs text-bauto-piedra">
          <span>¿Buscabas una prenda específica? </span>
          <a
            href="https://wa.me/573505731220?text=Hola%20BAUTO,%20buscaba%20una%20prenda%20y%20no%20la%20encontré%20en%20la%20web."
            target="_blank"
            rel="noopener noreferrer"
            className="text-bauto-terracota font-semibold underline inline-flex items-center gap-1 hover:text-bauto-terracota/80"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Preguntar a Concierge</span>
          </a>
        </div>

      </div>
    </div>
  );
}
