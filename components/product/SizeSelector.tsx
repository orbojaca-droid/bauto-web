'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Selector interactivo de tallas con disponibilidad en vivo de Master DB
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de selección con feedback háptico
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Talla, StockPorTalla } from '../../types/catalog';
import { playHapticClick } from '../../lib/sound';

interface SizeSelectorProps {
 stockPorTalla: StockPorTalla;
 selectedSize: Talla | null;
 onSelectSize: (size: Talla) => void;
 onOpenSizeGuide?: () => void;
}

const ALL_SIZES: Talla[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function SizeSelector({
 stockPorTalla,
 selectedSize,
 onSelectSize,
 onOpenSizeGuide,
}: SizeSelectorProps) {
 // Si la prenda solo tiene talla ÚNICA
 const isOnlyUnica = (stockPorTalla.UNICA || 0) > 0 && ALL_SIZES.every((s) => (stockPorTalla[s] || 0) === 0);
 const displaySizes: Talla[] = isOnlyUnica ? ['UNICA'] : ALL_SIZES;

 return (
 <div className="flex flex-col gap-3">
 <div className="flex items-center justify-between text-xs">
 <span className="font-normal text-bauto-carbon">
 Talla:{' '}
 {selectedSize && (
 <span className="text-bauto-carbon font-medium ml-1">
 {selectedSize}
 </span>
 )}
 </span>

 {onOpenSizeGuide && (
 <button
 type="button"
 onClick={() => {
 playHapticClick();
 onOpenSizeGuide();
 }}
 className="text-[11px] uppercase tracking-wider text-bauto-piedra hover:text-bauto-carbon  hover:border-bauto-carbon pb-0.5 transition-colors"
 >
 Guía de medidas
 </button>
 )}
 </div>

 {/* Cuadrícula de Botones de Tallas */}
 <div className="flex flex-wrap gap-2">
 {displaySizes.map((size) => {
 const stock = stockPorTalla[size] || 0;
 const isAvailable = stock > 0;
 const isSelected = selectedSize === size;

 return (
 <button
 key={size}
 type="button"
 disabled={!isAvailable}
 onClick={() => {
 if (isAvailable) {
 playHapticClick();
 onSelectSize(size);
 }
 }}
 className={`text-[11px] uppercase tracking-[0.15em] pb-1 transition-colors ${
 isSelected
 ? 'text-[#1C1917] border-b border-[#1C1917]'
 : isAvailable
 ? 'text-[#1C1917] hover:opacity-70 active:scale-[0.92] transition-transform duration-100 ease-out'
 : 'text-gray-400 opacity-50 cursor-not-allowed'
 }`}
 >
 <span className="relative z-10">{size}</span>
 </button>
 );
 })}
 </div>

 {/* Mensaje de Disponibilidad */}
 {selectedSize && (
 <div className="text-[11px] text-bauto-piedra italic mt-0.5">
 <span>
 {stockPorTalla[selectedSize] <= 2
 ? 'Últimas piezas en taller'
                    : 'Disponible en taller'}
 </span>
 </div>
 )}
 </div>
 );
}
