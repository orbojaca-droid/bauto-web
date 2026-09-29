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
import { ArrowLeft } from 'lucide-react';
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
    title: `${capitalized} de Lino | BAUTO Resort Wear`,
    description: `Descubre nuestra selección de ${catName} en lino puro y fibras nobles diseñadas para el trópico.`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      
      {/* Botón Volver al Catálogo */}
      <div className="mb-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-xs text-bauto-piedra hover:text-bauto-carbon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Toda la Colección</span>
        </Link>
      </div>

      {/* Encabezado de la Tipología */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Tipología Oficial
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl tracking-tight text-bauto-carbon mb-3 capitalize">
          {officialCategory}
        </h1>
        <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed">
          Diseñadas bajo el concepto de cuerpo consciente y libertad de movimiento.
        </p>
      </div>

      {/* Rejilla Filtrada con la Categoría Preseleccionada */}
      <CatalogGrid products={products} initialCategory={officialCategory} />

    </div>
  );
}
