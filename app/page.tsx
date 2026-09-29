/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Home Cinemática
 * @Propósito: Página de inicio cinemática con video hero, curated drops y pilares de marca
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página principal pública
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MapPin, Feather, Compass, Wind } from 'lucide-react';
import { fetchStockProducts } from '../lib/sheets';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types/catalog';

export const revalidate = 60; // Revalidación cada 60s en Edge CDN

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await fetchStockProducts();
  } catch (error) {
    // Si la hoja no responde temporalmente en build time
    products = [];
  }

  // Selección curada: primeros 8 productos con stock > 0
  const curatedDrops = products.filter((p) => p.totalStock > 0).slice(0, 8);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      
      {/* 1. Hero Cinemático */}
      <section className="relative min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center overflow-hidden">
        {/* Fondo Gradiente Cálido Caribeño */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0] via-[#FAF9F6] to-[#F2F0EB] pointer-events-none" />
        
        {/* Orbes Difusos Cálidos de la Brisa */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-bauto-terracota/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-bauto-oceano/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-bauto-perla/80 border border-bauto-carbon/5 text-xs text-bauto-piedra shadow-subtle">
            <Wind className="w-3.5 h-3.5 text-bauto-oceano" />
            <span className="font-editorial italic font-medium">Santa Marta • Resort Wear Caribe</span>
          </div>

          <h1 className="font-title font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-bauto-carbon leading-[1.08]">
            Confort consciente en <span className="text-bauto-terracota">lino noble</span>
          </h1>

          <p className="font-editorial italic text-base sm:text-xl text-bauto-piedra max-w-2xl font-normal leading-relaxed">
            Prendas de autor concebidas para habitar el trópico. Siluetas libres, artesanía sincera y aprecio por la arruga noble desde el Caribe colombiano.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/catalogo"
              className="btn-pill-primary px-8 py-4 text-sm tracking-wide shadow-elevated"
            >
              <span>Explorar la Colección</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tienda-santa-marta"
              className="btn-pill-glass px-7 py-4 text-sm tracking-wide flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-bauto-terracota" />
              <span>Boutique Calle 20</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Curated Drops (Prendas Destacadas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra block mb-1">
              Selección de Temporada
            </span>
            <h2 className="font-title font-bold text-2xl sm:text-3xl text-bauto-carbon">
              Curated Drops
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bauto-terracota hover:text-bauto-terracota-dark transition-colors"
          >
            <span>Ver toda la colección ({products.length} piezas)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {curatedDrops.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {curatedDrops.map((product, idx) => (
              <ProductCard key={product.id || product.reference} product={product} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-bauto-piedra bg-bauto-perla/40 rounded-card p-8">
            <Compass className="w-8 h-8 text-bauto-terracota mx-auto mb-2 opacity-60" />
            <p className="font-editorial italic">Cargando las últimas prendas del taller...</p>
          </div>
        )}
      </section>

      {/* 3. Pilares Conceptuales de Marca BAUTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-bauto-perla/70 rounded-card p-8 sm:p-14 border border-bauto-carbon/5 shadow-subtle">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
              Manifiesto Textil
            </span>
            <h2 className="font-title font-bold text-2xl sm:text-3xl text-bauto-carbon">
              El Universo Sensorial BAUTO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-bauto-terracota/10 text-bauto-terracota flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-title font-semibold text-base text-bauto-carbon">
                1. Cuerpo Consciente
              </h3>
              <p className="text-xs text-bauto-piedra leading-relaxed">
                Atención al tacto y confort activo. Diseñamos piezas ligeras que permiten a la piel respirar con libertad bajo las temperaturas del trópico.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-bauto-oceano/10 text-bauto-oceano flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-title font-semibold text-base text-bauto-carbon">
                2. Movimiento del Trópico
              </h3>
              <p className="text-xs text-bauto-piedra leading-relaxed">
                Siluetas fluidas que acompañan el andar relajado. Cortes amplios sin rigideces que cobran vida propia con la brisa marina.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-bauto-trigo/10 text-bauto-trigo flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-title font-semibold text-base text-bauto-carbon">
                3. Tejido de Reciprocidad
              </h3>
              <p className="text-xs text-bauto-piedra leading-relaxed">
                Lino puro 100%, fibras nobles y confección de autor. Cada prenda honra el tiempo de trabajo artesanal y la longevidad del tejido.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Invitación a la Boutique en Santa Marta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-card overflow-hidden bg-bauto-carbon text-white p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-elevated">
          <div className="max-w-lg flex flex-col gap-3 text-center md:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-trigo font-semibold">
              Boutique & Taller Físico
            </span>
            <h2 className="font-title font-bold text-2xl sm:text-3xl tracking-tight">
              Habita la experiencia en Calle 20 # 2-36
            </h2>
            <p className="text-xs text-bauto-perla/80 leading-relaxed font-body">
              En pleno Centro Histórico de Santa Marta, a pasos del mar. Ven a sentir la textura real del lino, probarte las piezas exclusivas y recibir atención personalizada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <Link
              href="/tienda-santa-marta"
              className="btn-pill-primary bg-bauto-terracota hover:bg-bauto-terracota-dark px-7 py-3.5 text-xs tracking-wide text-white shadow-elevated"
            >
              <span>Ver Ubicación & Horarios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
