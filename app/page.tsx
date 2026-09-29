/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Home Cinemática
 * @Propósito: Página de inicio cinemática con VideoHero ambiental, curated drops y pilares de marca.
 *             Tipografía estricta en Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página principal pública
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchStockProducts } from '../lib/sheets';
import { ProductCard } from '../components/product/ProductCard';
import { VideoHero } from '../components/media/VideoHero';
import { Product } from '../types/catalog';

export const revalidate = 60; // Revalidación cada 60s en Edge CDN

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await fetchStockProducts();
  } catch (error) {
    products = [];
  }

  // Selección curada: primeros 8 productos con stock > 0
  const curatedDrops = products.filter((p) => p.totalStock > 0).slice(0, 8);

  return (
    <div className="flex flex-col gap-20 sm:gap-32 pb-24">
      
      {/* 1. Hero editorial minimalista */}
      <section className="relative min-h-[calc(85vh-80px)] min-h-[calc(85dvh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-7 animate-fade-in">
          
          <span className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-bauto-piedra font-normal block">
            Santa Marta • Caribe colombiano
          </span>

          <h1 className="font-title font-light text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-bauto-carbon max-w-3xl leading-[1.08]">
            El silencio y el confort del lino noble
          </h1>

          <p className="font-editorial italic text-base sm:text-xl text-bauto-piedra max-w-xl font-normal leading-relaxed">
            Prendas de autor concebidas para habitar el trópico con calma, ligereza y aprecio por la arruga noble.
          </p>

          <div className="pt-3">
            <Link
              href="/catalogo"
              className="btn-primary active:scale-[0.97] transition-transform duration-150 ease-out px-8 py-3.5 text-xs font-sans font-normal shadow-sm"
            >
              <span>Explorar colección</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Espacio audiovisual cinemático (Lookbook en movimiento) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <VideoHero
          aspectRatio="cinematic"
          tagline="Atmósfera y movimiento"
          title="La cadencia del lino bajo la brisa caribeña"
          description="Prendas concebidas para acompañar el andar sereno entre la bahía de Santa Marta y la Sierra Nevada."
        />
      </section>

      {/* 3. Curated Drops (Escaparate de temporada) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-[9px] tracking-[0.35em] uppercase text-bauto-piedra/80 block mb-1">
              Selección
            </span>
            <h2 className="font-title font-light text-2xl sm:text-3xl text-bauto-carbon tracking-tight">
              Edición de temporada
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-normal text-bauto-carbon hover:text-bauto-terracota transition-colors border-b border-bauto-carbon/20 hover:border-bauto-terracota pb-0.5"
          >
            <span>Ver colección completa ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {curatedDrops.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-12 sm:gap-y-16">
            {curatedDrops.map((product, idx) => (
              <ProductCard key={product.id || product.reference} product={product} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-bauto-piedra">
            <p className="font-editorial italic">Cargando las últimas prendas del taller...</p>
          </div>
        )}
      </section>

      {/* 4. Manifiesto textil (Editorial spread) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20 border-t border-bauto-carbon/5">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-[9px] tracking-[0.35em] uppercase text-bauto-piedra/80 block mb-4">
            Manifiesto
          </span>
          <blockquote className="font-editorial italic text-2xl sm:text-3xl lg:text-4xl text-bauto-carbon leading-snug font-normal">
            «Diseñamos prendas para habitar el Caribe con calma, ligereza y aprecio por la arruga noble.»
          </blockquote>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 text-left">
          
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[10px] text-bauto-piedra/50 tracking-wider">01</span>
            <h3 className="font-title font-medium text-sm sm:text-base text-bauto-carbon tracking-wide">
              Cuerpo consciente
            </h3>
            <p className="text-xs text-bauto-piedra leading-relaxed font-light">
              Atención al tacto y confort activo. Piezas livianas de fibra natural que regulan la temperatura y permiten a la piel respirar en libertad.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[10px] text-bauto-piedra/50 tracking-wider">02</span>
            <h3 className="font-title font-medium text-sm sm:text-base text-bauto-carbon tracking-wide">
              Movimiento del trópico
            </h3>
            <p className="text-xs text-bauto-piedra leading-relaxed font-light">
              Siluetas holgadas que acompañan el andar sereno. Cortes sin rigideces que cobran vida y fluidez con la brisa marina de Santa Marta.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[10px] text-bauto-piedra/50 tracking-wider">03</span>
            <h3 className="font-title font-medium text-sm sm:text-base text-bauto-carbon tracking-wide">
              Tejido de reciprocidad
            </h3>
            <p className="text-xs text-bauto-piedra leading-relaxed font-light">
              Lino puro y confección de autor. Cada prenda honra el oficio artesanal y la longevidad del tejido frente a la prisa del consumo.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Boutique en Santa Marta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className=" bg-[#F2F0EB]/50 border-t border-b border-bauto-carbon/10 py-12 sm:py-16 px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl flex flex-col gap-2">
            <span className="text-[9px] tracking-[0.35em] uppercase text-bauto-piedra/80">
              Boutique y taller caribeño
            </span>
            <h2 className="font-title font-light text-2xl sm:text-3xl text-bauto-carbon tracking-tight">
              Habita el espacio en Calle 20 # 2-36
            </h2>
            <p className="font-editorial italic text-xs sm:text-sm text-bauto-piedra leading-relaxed">
              En pleno Centro Histórico de Santa Marta, a dos cuadras del mar. Descubre la textura real del lino y vive una atención personalizada y sosegada.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/tienda-santa-marta"
              className="btn-glass px-7 py-3 text-xs font-sans text-bauto-carbon hover:bg-white transition-all shadow-none"
            >
              <span>Conoce la boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
