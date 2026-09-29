'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Cuadrícula interactiva del catálogo con filtros facetados por tipología, orden y búsqueda
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - UI de catálogo desacoplada
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Compass, X } from 'lucide-react';
import { Product } from '../../types/catalog';
import { ProductCard } from './ProductCard';
import { playHapticClick } from '../../lib/sound';

interface CatalogGridProps {
  products: Product[];
  initialCategory?: string;
}

export function CatalogGrid({ products, initialCategory = 'TODAS' }: CatalogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST');
  const [searchQuery, setSearchQuery] = useState('');

  // Lista de categorías únicas encontradas en los productos
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.tipologia) set.add(p.tipologia);
    });
    return ['TODAS', ...Array.from(set)];
  }, [products]);

  // Filtrado y ordenamiento reactivo
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filtro por categoría
        if (selectedCategory !== 'TODAS' && product.tipologia.toUpperCase() !== selectedCategory.toUpperCase()) {
          return false;
        }
        // Filtro por búsqueda de texto
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchRef = product.reference.toLowerCase().includes(q);
          const matchTip = product.tipologia.toLowerCase().includes(q);
          if (!matchName && !matchRef && !matchTip) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'PRICE_ASC') return a.price - b.price;
        if (sortOption === 'PRICE_DESC') return b.price - a.price;
        return 0; // Por defecto orden de aparición / novedad
      });
  }, [products, selectedCategory, sortOption, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-card bg-bauto-perla/60 border border-bauto-carbon/5">
        
        {/* Selector de Categorías (Pills Horizontales) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playHapticClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-pill text-xs tracking-wide font-medium transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-bauto-terracota text-white shadow-sm'
                    : 'bg-bauto-nube text-bauto-carbon hover:bg-bauto-perla border border-bauto-carbon/5'
                }`}
              >
                {cat === 'TODAS' ? 'Toda la Colección' : cat}
              </button>
            );
          })}
        </div>

        {/* Búsqueda y Ordenamiento */}
        <div className="flex items-center gap-3">
          
          {/* Input de Búsqueda Rápida */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 w-3.5 h-3.5 text-bauto-piedra pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prenda..."
              className="w-full text-xs pl-8 pr-7 py-2 rounded-pill bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-bauto-piedra hover:text-bauto-carbon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select de Orden */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-pill bg-bauto-nube border border-bauto-carbon/10 text-bauto-carbon focus:border-bauto-terracota focus:outline-none cursor-pointer"
          >
            <option value="NEWEST">Novedades</option>
            <option value="PRICE_ASC">Precio: Menor a Mayor</option>
            <option value="PRICE_DESC">Precio: Mayor a Menor</option>
          </select>

        </div>

      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs text-bauto-piedra px-1">
        <span>Mostrando {filteredProducts.length} piezas de autor</span>
        {selectedCategory !== 'TODAS' && (
          <button
            type="button"
            onClick={() => setSelectedCategory('TODAS')}
            className="text-bauto-terracota hover:underline"
          >
            Ver todas las tipologías
          </button>
        )}
      </div>

      {/* Cuadrícula de Prendas */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.reference} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-xs text-bauto-piedra bg-bauto-perla/30 rounded-card p-12">
          <Compass className="w-10 h-10 text-bauto-terracota mx-auto mb-3 opacity-50" />
          <h3 className="font-title font-semibold text-sm text-bauto-carbon mb-1">
            No encontramos prendas con este filtro
          </h3>
          <p className="font-editorial italic max-w-sm mx-auto mb-5">
            Intenta seleccionar otra categoría o reiniciar los términos de búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="btn-pill-primary px-6 py-2.5 text-xs shadow-sm"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

    </div>
  );
}
