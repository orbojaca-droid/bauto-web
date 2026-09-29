/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Página canónica del catálogo completo de prendas
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Vista pública del catálogo
 */

import React from 'react';
import type { Metadata } from 'next';
import { fetchStockProducts } from '../../lib/sheets';
import { CatalogGrid } from '../../components/product/CatalogGrid';
import { Product } from '../../types/catalog';

export const revalidate = 60; // Revalidación cada 60s

export const metadata: Metadata = {
  title: 'Colección Completa | BAUTO Resort Wear',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      
      {/* Encabezado Editorial */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Colección Permanente
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl tracking-tight text-bauto-carbon mb-3">
          El Catálogo BAUTO
        </h1>
        <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
          Prendas creadas con nobleza y holgura para disfrutar la brisa, el mar y la luz del Caribe.
        </p>
      </div>

      {/* Rejilla Interactiva con Filtros */}
      <CatalogGrid products={products} />

    </div>
  );
}
