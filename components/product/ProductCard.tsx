'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Tarjeta de prenda de lujo con miniatura WebP optimizada, badges y hover sutil
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de presentación reutilizable
 */

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';
import { Product } from '../../types/catalog';
import { getOptimizedImageUrl } from '../../lib/images';
import { formatCOP } from '../../lib/grammar';
import { playHapticClick } from '../../lib/sound';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = getOptimizedImageUrl(product.primaryImage || (product.images && product.images[0]) || '', {
    width: 600,
    quality: 85,
  });

  return (
    <article className="group relative flex flex-col animate-fade-in">
      {/* Contenedor de Imagen de Pasarela */}
      <Link
        href={`/catalogo/producto/${product.slug}`}
        onClick={playHapticClick}
        className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#FAF6F0] mb-3 block"
      >
        <img
          src={imageUrl}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badge Exclusivo Tienda Física */}
        {product.isExclusiveInStore && (
          <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-bauto-carbon text-[9px] font-medium tracking-[0.15em] uppercase shadow-sm">
            <span>Boutique Santa Marta</span>
          </div>
        )}

        {/* Badge de Stock Bajo */}
        {!product.isExclusiveInStore && product.totalStock > 0 && product.totalStock <= 2 && (
          <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-bauto-piedra text-[9px] font-medium tracking-[0.15em] uppercase">
            Últimas piezas
          </div>
        )}

        {/* Agotado */}
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-[#FAF9F6]/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-bauto-piedra border-b border-bauto-piedra/30 pb-0.5">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* Información de la Prenda */}
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[9px] tracking-[0.25em] uppercase text-bauto-piedra/80 block font-normal">
          {product.tipologia || 'Resort Wear'}
        </span>

        <h3 className="font-title font-normal text-xs sm:text-sm text-bauto-carbon group-hover:text-bauto-terracota transition-colors line-clamp-1">
          <Link href={`/catalogo/producto/${product.slug}`} onClick={playHapticClick}>
            {product.name}
          </Link>
        </h3>

        <div className="pt-0.5">
          <span className="font-mono text-xs sm:text-sm text-bauto-carbon/90 font-medium">
            {formatCOP(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
