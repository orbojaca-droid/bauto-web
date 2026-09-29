'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Lupa macro 4K para apreciar el tejido noble, gramaje y caída del lino
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Microinteracción visual contenida
 */

import React, { useState, useRef } from 'react';
import { getOptimizedImageUrl } from '../../lib/images';

interface TextureMagnifierProps {
  src: string;
  alt: string;
}

export function TextureMagnifier({ src, alt }: TextureMagnifierProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const highResUrl = getOptimizedImageUrl(src, { width: 1400, quality: 92 });
  const standardUrl = getOptimizedImageUrl(src, { width: 800, quality: 85 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-[#FAF6F0] cursor-crosshair select-none group"
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
        <div
          className="absolute inset-0 bg-no-repeat transition-all duration-75 ease-out"
          style={{
            backgroundImage: `url(${highResUrl})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '240%',
          }}
        />
      )}

      {/* Indicador Discreto */}
      <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] text-bauto-piedra/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-bauto-carbon/[0.06]">
        Detalle Textil
      </div>
    </div>
  );
}
