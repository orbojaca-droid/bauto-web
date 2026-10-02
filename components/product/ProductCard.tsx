'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Tarjeta de prenda de lujo con miniatura WebP optimizada, badges y hover sutil
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de presentación reutilizable
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types/catalog';
import { getOptimizedImageUrl } from '../../lib/images';
import { formatCOP } from '../../lib/grammar';
import { playHapticClick } from '../../lib/sound';

interface ProductCardProps {
 product: Product;
 priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
 const imageUrl = getOptimizedImageUrl(product.primaryImage || (product.images && product.images[0]) || '', {
 width: 600,
 quality: 85,
 });

 return (
 <article className="group relative flex flex-col">
 {/* Contenedor de Imagen de Pasarela */}
 <Link
 href={`/catalogo/producto/${product.slug}`}
 onClick={playHapticClick}
 className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF6F0] mb-3 block"
 >
 <img
 src={imageUrl}
 alt={product.name}
 loading={priority ? 'eager' : 'lazy'}
 data-loaded={isLoaded}
 onLoad={() => setIsLoaded(true)}
 onError={() => setIsLoaded(true)}
 className="w-full h-full object-cover object-center [transition-property:transform,opacity,filter] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] data-[loaded=false]:opacity-0 data-[loaded=false]:blur-sm data-[loaded=false]:scale-95 data-[loaded=true]:opacity-100 data-[loaded=true]:blur-0 data-[loaded=true]:scale-100"
 />



 {/* Agotado */}
 {product.totalStock === 0 && (
 <div className="absolute inset-0 bg-[#FAF9F6]/80 backdrop-blur-[2px] flex items-center justify-center">
 <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-bauto-piedra ">
 Agotado
 </span>
 </div>
 )}
 </Link>

 {/* Información de la Prenda */}
 <div className="flex flex-col gap-1 text-left">
 <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-bauto-piedra block font-normal">
 {product.tipologia || 'Resort Wear'}
 </span>

 <h3 className="uppercase tracking-[0.1em] font-light text-xs sm:text-sm text-bauto-carbon group-hover:opacity-75 transition-opacity line-clamp-1">
 <Link href={`/catalogo/producto/${product.slug}`} onClick={playHapticClick}>
 {product.name}
 </Link>
 </h3>

 <div className="pt-0.5">
 <span className="tracking-[0.15em] text-bauto-terracota font-light text-xs sm:text-sm">
 {formatCOP(product.price)}
 </span>
 </div>
 </div>
 </article>
 );
}
