/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Página canónica del catálogo completo de prendas con espacio audiovisual y Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Vista pública del catálogo
 */

import React from 'react';
import type { Metadata } from 'next';
import { fetchStockProducts } from '../../lib/sheets';
import { CatalogGrid } from '../../components/product/CatalogGrid';
import { VideoHero } from '../../components/media/VideoHero';
import { Product } from '../../types/catalog';

export const revalidate = 60; // Revalidación cada 60s

export const metadata: Metadata = {
 title: 'Colección completa | BAUTO Resort Wear',
 description:
 'Explora nuestra colección de prendas en lino puro, algodón noble y siluetas del trópico creadas en Santa Marta.',
};

export default async function CatalogoPage() {
 let products: Product[] = [];
 try {
 products = await fetchStockProducts();
 } catch (error) {
 products = [];
 }

 return (
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-14 animate-fade-in">
 
 {/* Encabezado editorial */}
 <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
 <span className="text-[11px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
 Colección permanente
 </span>
 <h1 className="font-title font-light sm:font-normal text-3xl sm:text-4xl lg:text-5xl tracking-wide text-bauto-carbon mb-3">
 Colección BAUTO
 </h1>
 <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
 Prendas concebidas para habitar el Caribe con calma, nobleza y libertad de movimiento.
 </p>
 </div>

 {/* Espacio audiovisual del catálogo */}
 <div className="mb-12 sm:mb-16">
 <VideoHero
 aspectRatio="cinematic"
 tagline="Sinfonía textil"
 title="El vuelo de las prendas en movimiento"
 description="Explora cada fibra noble en su interacción natural con la brisa de Santa Marta."
 showControls={true}
 />
 </div>

 {/* Rejilla interactiva con filtros */}
 <CatalogGrid products={products} />

 </div>
 );
}
