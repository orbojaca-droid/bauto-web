/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Filosofía de Marca
 * @Propósito: Manifiesto editorial sobre Cuerpo Consciente, Lino Puro y la Arruga Noble
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página editorial estática
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Feather, Wind, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Filosofía & Manifiesto | BAUTO Resort Wear',
  description:
    'Cuerpo consciente, movimiento del trópico y aprecio por la arruga noble del lino puro. Nuestra filosofía de confección en Santa Marta.',
};

export default function FilosofiaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-fade-in">
      
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Manifiesto Editorial
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-5xl text-bauto-carbon mb-4 leading-tight">
          Cuerpo Consciente & El Movimiento del Trópico
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-bauto-piedra leading-relaxed">
          Diseñamos prendas para habitar el Caribe sin prisas, con holgura y en íntima sintonía con la brisa.
        </p>
      </div>

      {/* Contenido Editorial Principal */}
      <div className="flex flex-col gap-12 text-sm text-bauto-carbon leading-relaxed">
        
        {/* Pilar 1: La Arruga Noble */}
        <div className="bg-bauto-perla/80 rounded-card p-6 sm:p-10 border border-bauto-carbon/5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-terracota mb-3">
            <Feather className="w-4 h-4" />
            <span>El Elogio de la Arruga Noble</span>
          </div>
          <h2 className="font-title font-bold text-xl sm:text-2xl text-bauto-carbon mb-3">
            El lino no se somete, se disfruta
          </h2>
          <p className="text-xs sm:text-sm text-bauto-piedra leading-relaxed font-body">
            En un mundo apresurado que impone telas sintéticas y planchados rígidos, BAUTO celebra la ondulación viva del lino 100%. La arruga noble no es un descuido: es la firma de una fibra pura que se acomoda al cuerpo, que respira con el viento y que cuenta la historia de un día habitado junto al mar.
          </p>
        </div>

        {/* Pilar 2: Confección Consciente y Lotes Pequeños */}
        <div className="bg-[#FAF6F0] rounded-card p-6 sm:p-10 border border-[#E8DEC8]">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-arena mb-3">
            <Sparkles className="w-4 h-4 text-bauto-terracota" />
            <span>Sastrería en Lotes Reducidos</span>
          </div>
          <h2 className="font-title font-bold text-xl sm:text-2xl text-bauto-carbon mb-3">
            Prendas de 1 a 3 unidades por talla
          </h2>
          <p className="text-xs sm:text-sm text-bauto-piedra leading-relaxed font-body">
            Rechazamos la sobreproducción masiva. Cortamos y confeccionamos piezas en cantidades limitadas en nuestro taller propio. Cada costura es revisada manualmente y cada prenda es perfumada antes de viajar, garantizando que quien viste BAUTO porta una pieza casi irrepetible.
          </p>
        </div>

        {/* Pilar 3: Confort Activo frente al Clima */}
        <div className="bg-bauto-perla/60 rounded-card p-6 sm:p-10 border border-bauto-carbon/5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-bauto-oceano mb-3">
            <Wind className="w-4 h-4" />
            <span>Termorregulación Natural</span>
          </div>
          <h2 className="font-title font-bold text-xl sm:text-2xl text-bauto-carbon mb-3">
            La respuesta al calor húmedo de la costa
          </h2>
          <p className="text-xs sm:text-sm text-bauto-piedra leading-relaxed font-body">
            El lino es una fibra vegetal hueca capaz de absorber hasta el 20% de su peso en humedad sin sentirse mojada al tacto. Actúa como un aislante térmico inteligente: mantiene el cuerpo fresco bajo el sol del mediodía y templado cuando cae la brisa nocturna en la playa.
          </p>
        </div>

      </div>

      {/* Llamado a la Acción al Final */}
      <div className="mt-16 text-center">
        <Link
          href="/catalogo"
          className="btn-pill-primary px-8 py-4 text-xs tracking-wide shadow-elevated"
        >
          <span>Descubrir las Prendas en Lino Puro</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
