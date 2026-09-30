/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Landing pages dedicadas para tipologías oficiales de BAUTO
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Ruta dinámica indexable para SEO
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchStockProducts } from '../../../lib/sheets';
import { CatalogGrid } from '../../../components/product/CatalogGrid';
import { slugify } from '../../../lib/grammar';
import { Product } from '../../../types/catalog';

export const revalidate = 60;

interface CategoryPageProps {
 params: {
 categoria: string;
 };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
 const catName = decodeURIComponent(params.categoria).replace(/-/g, ' ');
 const capitalized = catName.charAt(0).toUpperCase() + catName.slice(1);
 return {
 title: `${capitalized} | BAUTO Resort Wear`,
 description: `Descubre nuestra selección de ${catName} en fibras nobles y siluetas diseñadas para el trópico.`,
 };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
 const rawCat = decodeURIComponent(params.categoria).toLowerCase();
 let products: Product[] = [];
 try {
 products = await fetchStockProducts();
 } catch (error) {
 products = [];
 }

 // Encontrar el nombre oficial de la categoría comparando slug
 const matchingProduct = products.find(
 (p) => slugify(p.tipologia || '').toLowerCase() === rawCat
 );
 const officialCategory = matchingProduct ? matchingProduct.tipologia : rawCat;

 return (
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-14 animate-fade-in">
 
 {/* Botón Volver al Catálogo */}
 <div className="mb-8">
 <Link
 href="/catalogo"
 className="inline-flex items-center text-xs tracking-wider uppercase text-bauto-piedra hover:text-bauto-carbon transition-colors border-b border-transparent hover:border-bauto-carbon pb-0.5"
 >
 <span>← Volver a la colección</span>
 </Link>
 </div>

 {/* Encabezado de la Tipología */}
 <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
 <span className="text-[11px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-2">
 Siluetas de autor
 </span>
 <h1 className="font-title font-light sm:font-normal text-3xl sm:text-4xl lg:text-5xl tracking-wide text-bauto-carbon mb-3 capitalize">
 {officialCategory}
 </h1>
 <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed">
 Concebidas bajo la atención al confort y la libertad de movimiento.
 </p>
 </div>

 {/* Rejilla Filtrada con la Categoría Preseleccionada */}
 <CatalogGrid products={products} initialCategory={officialCategory} />

 </div>
 );
}
