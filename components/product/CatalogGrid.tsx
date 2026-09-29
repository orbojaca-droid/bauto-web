'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Cuadrícula interactiva del catálogo con filtros facetados por tipología, orden y búsqueda
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - UI de catálogo desacoplada
 */

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-bauto-carbon/[0.08]">
        
        {/* Selector de Categorías (Tipográfico Plano) */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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
                className={`text-xs uppercase tracking-[0.18em] transition-colors shrink-0 pb-1 ${
                  isSelected
                    ? 'text-bauto-carbon font-medium border-b border-bauto-carbon'
                    : 'text-bauto-piedra/60 hover:text-bauto-carbon'
                }`}
              >
                {cat === 'TODAS' ? 'Toda la Colección' : cat}
              </button>
            );
          })}
        </div>

        {/* Búsqueda y Ordenamiento */}
        <div className="flex items-center gap-4">
          
          {/* Input de Búsqueda Rápida */}
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-0 top-2.5 w-3.5 h-3.5 text-bauto-piedra/50 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pieza..."
              className="w-full text-xs pl-6 pr-6 py-2 bg-transparent border-b border-bauto-carbon/20 text-bauto-carbon placeholder:text-bauto-piedra/50 focus:border-bauto-carbon focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-2 text-bauto-piedra hover:text-bauto-carbon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select de Orden */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="text-xs py-2 px-1 bg-transparent border-b border-bauto-carbon/20 text-bauto-carbon focus:border-bauto-carbon focus:outline-none cursor-pointer"
          >
            <option value="NEWEST">Novedades</option>
            <option value="PRICE_ASC">Precio: Menor a Mayor</option>
            <option value="PRICE_DESC">Precio: Mayor a Menor</option>
          </select>

        </div>

      </div>

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs text-bauto-piedra px-1">
        <span>{filteredProducts.length} siluetas disponibles</span>
        {selectedCategory !== 'TODAS' && (
          <button
            type="button"
            onClick={() => setSelectedCategory('TODAS')}
            className="text-bauto-carbon border-b border-bauto-carbon/30 hover:border-bauto-carbon uppercase tracking-wider text-[11px] pb-0.5 transition-colors"
          >
            Ver toda la colección
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
        <div className="py-24 text-center text-xs text-bauto-piedra max-w-sm mx-auto">
          <h3 className="font-title font-light text-base text-bauto-carbon mb-2">
            Sin piezas coincidentes
          </h3>
          <p className="font-editorial italic mb-6 text-bauto-piedra leading-relaxed">
            Explora otras siluetas de la colección o restablece los criterios de búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="px-7 py-3 text-xs uppercase tracking-[0.2em] bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors"
          >
            Restablecer Criterios
          </button>
        </div>
      )}

    </div>
  );
}
