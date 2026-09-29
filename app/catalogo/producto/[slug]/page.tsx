/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Ficha de producto (PDP) oficial de BAUTO Resort Wear
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Página principal de conversión de prendas
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchStockProducts } from '../../../../lib/sheets';
import type { Product } from '../../../../types/catalog';
import { ProductDetailClient } from '../../../../components/product/ProductDetailClient';
import { ProductCard } from '../../../../components/product/ProductCard';

export const revalidate = 60;

interface ProductPageProps {
 params: {
 slug: string;
 };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
 const products = await fetchStockProducts();
 const product = products.find((p) => p.slug === params.slug);

 if (!product) {
 return { title: 'Prenda no encontrada | BAUTO' };
 }

 return {
 title: `${product.name} | BAUTO Resort Wear`,
 description: product.description || `Prenda de autor ${product.name} en fibras nobles y silueta caribeña. Confeccionada en Santa Marta.`,
 openGraph: {
 title: `${product.name} | BAUTO Resort Wear`,
 description: product.description,
 images: product.primaryImage ? [{ url: product.primaryImage }] : [],
 },
 };
}

export default async function ProductPage({ params }: ProductPageProps) {
 let products: Product[] = [];
 try {
 products = await fetchStockProducts();
 } catch (error) {
 products = [];
 }

 const product = products.find((p) => p.slug === params.slug);

 if (!product) {
 notFound();
 }

 // Prendas relacionadas (misma tipología o aleatorias, excluyendo la actual)
 const relatedProducts = products
 .filter((p) => p.id !== product.id && p.totalStock > 0)
 .slice(0, 4);

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
 
 {/* Breadcrumbs de Navegación de Lujo */}
 <nav className="flex items-center gap-2 text-xs text-bauto-piedra mb-10 overflow-x-auto whitespace-nowrap scrollbar-none font-light">
 <Link href="/" className="hover:text-bauto-carbon transition-colors">
 Inicio
 </Link>
 <span className="text-bauto-piedra/30 font-light text-[10px]">/</span>
 <Link href="/catalogo" className="hover:text-bauto-carbon transition-colors">
 Colección
 </Link>
 <span className="text-bauto-piedra/30 font-light text-[10px]">/</span>
 <span className="text-bauto-carbon font-normal truncate max-w-[200px]">
 {product.name}
 </span>
 </nav>

 {/* Orquestador Interactivo de la Ficha */}
 <ProductDetailClient product={product} />

 {/* Sección de Prendas Relacionadas */}
 {relatedProducts.length > 0 && (
 <section className="mt-24 pt-16 ">
 <div className="flex items-end justify-between mb-10">
 <div>
 <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra block mb-1 font-light">
 Complementa tu atuendo
 </span>
 <h2 className="font-title font-light sm:font-normal text-xl sm:text-2xl text-bauto-carbon">
 Otras piezas de la colección
 </h2>
 </div>

 <Link
 href="/catalogo"
 className="text-xs uppercase tracking-[0.15em] text-bauto-carbon hover:text-bauto-piedra  hover:border-bauto-carbon pb-0.5 transition-colors"
 >
 Ver toda la colección
 </Link>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
 {relatedProducts.map((p) => (
 <ProductCard key={p.id || p.reference} product={p} />
 ))}
 </div>
 </section>
 )}

 </div>
 );
}
