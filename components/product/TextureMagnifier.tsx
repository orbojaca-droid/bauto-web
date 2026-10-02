'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Lupa macro 4K para apreciar el tejido noble, gramaje y caída del lino
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Microinteracción visual contenida
 */

import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { getOptimizedImageUrl } from '../../lib/images';

interface TextureMagnifierProps {
 src: string;
 alt: string;
}

export function TextureMagnifier({ src, alt }: TextureMagnifierProps) {
 const [isZooming, setIsZooming] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);
 
 const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
 const x = useSpring(50, springConfig);
 const y = useSpring(50, springConfig);

 const highResUrl = getOptimizedImageUrl(src, { width: 1400, quality: 92 });
 const standardUrl = getOptimizedImageUrl(src, { width: 800, quality: 85 });

 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!containerRef.current) return;
 const rect = containerRef.current.getBoundingClientRect();
 x.set(((e.clientX - rect.left) / rect.width) * 100);
 y.set(((e.clientY - rect.top) / rect.height) * 100);
 };

 const bgPositionX = useTransform(x, (val) => `${val}%`);
 const bgPositionY = useTransform(y, (val) => `${val}%`);

 return (
 <div
 ref={containerRef}
 onMouseEnter={() => setIsZooming(true)}
 onMouseLeave={() => setIsZooming(false)}
 onMouseMove={handleMouseMove}
 className="relative w-full aspect-[3/4] overflow-hidden bg-[#FAF6F0] cursor-crosshair select-none group"
 >
 {/* Imagen Estándar */}
 <img
 src={standardUrl}
 alt={alt}
 className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
 isZooming ? 'opacity-0' : 'opacity-100'
 }`}
 />

 {/* Imagen Macro Zoom 2.2x */}
 {isZooming && (
 <motion.div
 className="absolute inset-0 bg-no-repeat"
 style={{
 backgroundImage: `url(${highResUrl})`,
 backgroundPositionX: bgPositionX,
 backgroundPositionY: bgPositionY,
 backgroundSize: '240%',
 }}
 />
 )}

 {/* Indicador Discreto */}
 <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] text-bauto-piedra/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity ">
 Detalle Textil
 </div>
 </div>
 );
}
