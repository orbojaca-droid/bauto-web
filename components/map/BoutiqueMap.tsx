"use client";

/**
 * @BAUTO_ECOSYSTEM 2026-09-29
 * @Modulo: WEB (bauto.com.co) - BoutiqueMap
 * @Propósito: Visor cartográfico a medida en estética Quiet Luxury para la boutique de Santa Marta.
 * Paleta sobria de la marca: Bahía en tono bruma, cuadrícula histórica en arena/lino,
 * pin en Terracota BAUTO con pulso sutil y enlaces directos a navegación GPS.
 */

import React, { useState } from "react";
import { ExternalLink, Navigation } from "lucide-react";
import { playClickSound } from "@/lib/sound";

interface BoutiqueMapProps {
 className?: string;
}

export const BoutiqueMap: React.FC<BoutiqueMapProps> = ({ className = "" }) => {
 const [viewMode, setViewMode] = useState<"artistic" | "satellite">("artistic");

 const googleMapsUrl =
 "https://www.google.com/maps/search/?api=1&query=Calle+20+%23+2-36,+Santa+Marta";
 const appleMapsUrl =
 "https://maps.apple.com/?address=Calle+20+2-36,+Santa+Marta,+Colombia";
 const wazeUrl = "https://waze.com/ul?q=Calle+20+%23+2-36+Santa+Marta";

 const handleToggleMode = (mode: "artistic" | "satellite") => {
 playClickSound();
 setViewMode(mode);
 };

 return (
 <div
 className={`relative w-full overflow-hidden bg-[#F4F1EA] text-bauto-carbon select-none ${className}`}
 style={{ minHeight: "380px" }}
 aria-label="Mapa cartográfico de la Boutique BAUTO en Santa Marta"
 >
 {viewMode === "artistic" ? (
 <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
 {/* Cartografía vectorial artesanal a medida del Centro Histórico */}
 <svg
 viewBox="0 0 1000 600"
 className="w-full h-full object-cover"
 preserveAspectRatio="xMidYMid slice"
 aria-hidden="true"
 >
 <defs>
 {/* Degradado sutil del mar de la bahía */}
 <linearGradient id="bayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="#DFE8EB" />
 <stop offset="100%" stopColor="#CCDDE3" />
 </linearGradient>

 {/* Pulso animado del pin BAUTO */}
 <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
 <stop offset="0%" stopColor="#B85C38" stopOpacity="0.6" />
 <stop offset="100%" stopColor="#B85C38" stopOpacity="0" />
 </radialGradient>
 </defs>

 {/* Tierra firme: Lino y arena cálida */}
 <rect width="1000" height="600" fill="#F5F2EB" />

 {/* Bahía de Santa Marta (Oeste) */}
 <path
 d="M 0,0 L 260,0 C 240,150 250,280 230,380 C 210,480 230,550 210,600 L 0,600 Z"
 fill="url(#bayGradient)"
 />

 {/* Malecón de Bastidas / Carrera 1ra */}
 <path
 d="M 260,0 C 240,150 250,280 230,380 C 210,480 230,550 210,600"
 stroke="#D4CCC2"
 strokeWidth="10"
 fill="none"
 />
 <path
 d="M 260,0 C 240,150 250,280 230,380 C 210,480 230,550 210,600"
 stroke="#FAF9F6"
 strokeWidth="4"
 fill="none"
 />

 {/* Manzanas del Centro Histórico (arquitectura colonial sobria) */}
 <g fill="#ECE7DE" stroke="#DDD7CC" strokeWidth="1.5">
 {/* Manzanas entre Cra 1 y Cra 2 */}
 <rect x="290" y="40" width="130" height="90" rx="2" />
 <rect x="285" y="160" width="130" height="90" rx="2" />
 <rect x="275" y="280" width="130" height="90" rx="2" />
 <rect x="265" y="400" width="130" height="90" rx="2" />

 {/* Manzanas entre Cra 2 y Cra 3 (Ubicación BAUTO) */}
 <rect x="450" y="40" width="140" height="90" rx="2" />
 <rect x="445" y="160" width="140" height="90" rx="2" />
 {/* Manzana boutique Calle 20 # 2-36 */}
 <rect x="435" y="280" width="140" height="90" rx="2" fill="#E4DDCF" stroke="#D1C7B7" />
 <rect x="425" y="400" width="140" height="90" rx="2" />

 {/* Manzanas entre Cra 3 y Cra 4 */}
 <rect x="620" y="40" width="140" height="90" rx="2" />
 <rect x="615" y="160" width="140" height="90" rx="2" />
 <rect x="605" y="280" width="140" height="90" rx="2" />
 <rect x="595" y="400" width="140" height="90" rx="2" />

 {/* Manzanas hacia el oriente */}
 <rect x="790" y="40" width="170" height="90" rx="2" />
 <rect x="785" y="160" width="170" height="90" rx="2" />
 <rect x="775" y="280" width="170" height="90" rx="2" />
 <rect x="765" y="400" width="170" height="90" rx="2" />
 </g>

 {/* Parque de los Novios / Plaza Santander */}
 <rect x="615" y="160" width="140" height="90" rx="4" fill="#DCE5DC" stroke="#C4D1C4" strokeWidth="2" />
 <text x="685" y="210" fill="#7A8265" fontSize="11" fontFamily="sans-serif" letterSpacing="0.1em" textAnchor="middle">
 Parque de los novios
 </text>

 {/* Cuadrícula de Calles y Carreras */}
 {/* Carreras (Norte a Sur) */}
 <line x1="435" y1="0" x2="415" y2="600" stroke="#FAF9F6" strokeWidth="18" />
 <line x1="605" y1="0" x2="585" y2="600" stroke="#FAF9F6" strokeWidth="18" />
 <line x1="775" y1="0" x2="755" y2="600" stroke="#FAF9F6" strokeWidth="18" />

 {/* Calles (Oriente a Poniente) */}
 <line x1="200" y1="145" x2="1000" y2="145" stroke="#FAF9F6" strokeWidth="18" />
 <line x1="200" y1="265" x2="1000" y2="265" stroke="#FAF9F6" strokeWidth="22" strokeDasharray="none" />
 <line x1="200" y1="385" x2="1000" y2="385" stroke="#FAF9F6" strokeWidth="18" />
 <line x1="200" y1="505" x2="1000" y2="505" stroke="#FAF9F6" strokeWidth="18" />

 {/* Textos y Rotulación Sobria */}
 <text x="110" y="300" fill="#758A94" fontSize="13" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em" transform="rotate(-90 110,300)" textAnchor="middle">
 Bahía de Santa Marta
 </text>

 <text x="210" y="120" fill="#9C9588" fontSize="10" fontFamily="sans-serif" letterSpacing="0.12em" transform="rotate(-75 210,120)">
 Cra. 1ra · Malecón
 </text>
 <text x="405" y="120" fill="#9C9588" fontSize="10" fontFamily="sans-serif" letterSpacing="0.12em" transform="rotate(-75 405,120)">
 Carrera 2da
 </text>
 <text x="575" y="120" fill="#9C9588" fontSize="10" fontFamily="sans-serif" letterSpacing="0.12em" transform="rotate(-75 575,120)">
 Carrera 3ra
 </text>

 <text x="820" y="140" fill="#9C9588" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">
 Calle 19
 </text>
 <text x="820" y="260" fill="#1C1917" fontSize="11" fontFamily="sans-serif" fontWeight="500" letterSpacing="0.1em">
 Calle 20 (Eje peatonal y boutique)
 </text>
 <text x="820" y="380" fill="#9C9588" fontSize="10" fontFamily="sans-serif" letterSpacing="0.1em">
 Calle 21
 </text>

 {/* Pin Boutique BAUTO (Calle 20 entre Cra 2 y Cra 3) */}
 <g transform="translate(490, 265)">
 {/* Halo de pulso */}
 <circle cx="0" cy="0" r="32" fill="url(#pinGlow)" className="animate-pulse" />
 <circle cx="0" cy="0" r="16" fill="#B85C38" fillOpacity="0.25" />
 {/* Punto central terracota */}
 <circle cx="0" cy="0" r="7" fill="#B85C38" stroke="#FAF9F6" strokeWidth="2.5" />
 </g>

 {/* Cartela de la Boutique */}
 <g transform="translate(490, 230)">
 <rect x="-70" y="-28" width="140" height="26" rx="13" fill="#1C1917" />
 <text x="0" y="-11" fill="#FAF9F6" fontSize="10" fontFamily="sans-serif" fontWeight="500" letterSpacing="0.12em" textAnchor="middle">
 BAUTO · Calle 20 # 2-36
 </text>
 </g>
 </svg>

 {/* Sello de coordenadas flotante en esquina superior izquierda */}
 <div className="absolute top-6 left-6 bg-transparent ">
 <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-carbon font-mono">
 11°14′31″ N · 74°12′49″ W
 </span>
 </div>

 {/* Tarjeta de distancia al mar */}
 <div className="absolute bottom-6 left-6 bg-transparent text-xs hidden sm:block">
 <p className="font-serif italic text-bauto-carbon text-[11px]">
 A 180 metros de la brisa marina del Caribe
 </p>
 </div>
 </div>
 ) : (
 /* Vista satelital / callejera interactiva */
 <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px]">
 <iframe
 title="Ubicación satelital Boutique BAUTO Santa Marta"
 width="100%"
 height="100%"
 frameBorder="0"
 scrolling="no"
 src="https://www.openstreetmap.org/export/embed.html?bbox=-74.2165%2C11.2395%2C-74.2110%2C11.2445&layer=mapnik&marker=11.2420124%2C-74.2138635"
 className="w-full h-full border-0 filter saturate-[0.8] contrast-[1.02]"
 loading="lazy"
 />
 </div>
 )}

 {/* Selector de modo y botones de navegación rápida */}
 <div className="absolute top-4 right-4 flex items-center gap-2">
 <button
 onClick={() => handleToggleMode(viewMode === "artistic" ? "satellite" : "artistic")}
 type="button"
 className="px-3 py-1.5 bg-transparent text-[11px] font-sans text-bauto-carbon transition-all duration-200 "
 aria-label="Alternar entre mapa de autor y mapa satelital"
 >
 {viewMode === "artistic" ? "Ver satélite" : "Ver mapa BAUTO"}
 </button>
 </div>

 {/* Barra inferior de navegación GPS directa */}
 <div className=" bg-transparent px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
 <div className="flex items-center gap-2 text-bauto-carbon">
 <Navigation className="w-3.5 h-3.5 text-bauto-terracota" />
 <span className="font-medium">Abrir en tu app de navegación:</span>
 </div>

 <div className="flex items-center gap-4">
 <a
 href={googleMapsUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={playClickSound}
 className="inline-flex items-center gap-1 text-bauto-carbon hover:text-bauto-terracota transition-colors underline underline-offset-4"
 >
 <span>Google Maps</span>
 <ExternalLink className="w-3 h-3" />
 </a>
 <span className="text-bauto-carbon/20">·</span>
 <a
 href={appleMapsUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={playClickSound}
 className="inline-flex items-center gap-1 text-bauto-carbon hover:text-bauto-terracota transition-colors underline underline-offset-4"
 >
 <span>Apple Maps</span>
 <ExternalLink className="w-3 h-3" />
 </a>
 <span className="text-bauto-carbon/20">·</span>
 <a
 href={wazeUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={playClickSound}
 className="inline-flex items-center gap-1 text-bauto-carbon hover:text-bauto-terracota transition-colors underline underline-offset-4"
 >
 <span>Waze</span>
 <ExternalLink className="w-3 h-3" />
 </a>
 </div>
 </div>
 </div>
 );
};

export default BoutiqueMap;
