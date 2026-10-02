"use client";

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (bauto.com.co) - VideoHero
 * @Propósito: Contenedor cinematográfico de video ambiental en loop silencioso.
 * Estética Quiet Luxury: sin adornos estridentes, controles sutiles,
 * respeto por la cadencia textil y tipografía editorial en Sentence case.
 */

import React, { useRef, useState, useEffect } from "react";
import { playClickSound } from "@/lib/sound";

interface VideoHeroProps {
 videoUrl?: string;
 posterUrl?: string;
 tagline?: string;
 title?: string;
 description?: string;
 aspectRatio?: "cinematic" | "landscape" | "tall";
 className?: string;
 showControls?: boolean;
}

export const VideoHero: React.FC<VideoHeroProps> = ({
 videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
 posterUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
 tagline = "Atmósfera y movimiento",
 title = "La cadencia del lino bajo la brisa caribeña",
 description = "Piezas concebidas para habitar el trópico con soltura, caída natural y nobleza textil.",
 aspectRatio = "cinematic",
 className = "",
 showControls = true,
}) => {
 const videoRef = useRef<HTMLVideoElement>(null);
 const [isPlaying, setIsPlaying] = useState(true);
 const [isMuted, setIsMuted] = useState(true);
 const [isLoaded, setIsLoaded] = useState(false);

 useEffect(() => {
 if (videoRef.current) {
 videoRef.current.play().catch(() => {
 // Fallback ante políticas restrictivas de autoplay en navegadores móviles
 setIsPlaying(false);
 });
 }
 }, []);

 const togglePlay = () => {
 playClickSound();
 if (!videoRef.current) return;
 if (isPlaying) {
 videoRef.current.pause();
 setIsPlaying(false);
 } else {
 videoRef.current.play();
 setIsPlaying(true);
 }
 };

 const toggleMute = () => {
 playClickSound();
 if (!videoRef.current) return;
 videoRef.current.muted = !isMuted;
 setIsMuted(!isMuted);
 };

 const ratioClasses = {
 cinematic: "aspect-[21/9] min-h-[360px] md:min-h-[480px]",
 landscape: "aspect-[16/9] min-h-[300px] md:min-h-[420px]",
 tall: "aspect-[4/5] min-h-[440px] md:min-h-[560px]",
 };

 return (
 <section
 className={`relative w-full overflow-hidden bg-bauto-perla text-bauto-carbon ${ratioClasses[aspectRatio]} ${className}`}
 aria-label="Espacio audiovisual de la colección"
 >
 {/* Video de fondo */}
 <video
 ref={videoRef}
 src={videoUrl}
 poster={posterUrl}
 autoPlay
 muted
 loop
 playsInline
 preload="metadata"
 onLoadedData={() => setIsLoaded(true)}
 data-loaded={isLoaded}
 className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out data-[loaded=false]:opacity-0 data-[loaded=false]:blur-sm data-[loaded=true]:opacity-100 data-[loaded=true]:blur-0"
 />

 {/* Contenido editorial superpuesto */}
 <div 
 className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-16 text-bauto-nube"
 style={{ textShadow: '0 1px 8px rgba(28,25,23,0.3)' }}
 >
 <div className="max-w-2xl space-y-3">
 {tagline && (
 <p className="text-xs font-sans tracking-[0.2em] uppercase text-bauto-nube/80 font-medium">
 {tagline}
 </p>
 )}
 {title && (
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light leading-tight tracking-tight text-bauto-nube">
 {title}
 </h2>
 )}
 {description && (
 <p className="text-sm sm:text-base font-sans text-bauto-nube/90 font-light max-w-xl leading-relaxed">
 {description}
 </p>
 )}
 </div>

 {/* Controles discretos en esquina inferior derecha */}
 {showControls && (
 <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-2">
 <button
 onClick={togglePlay}
 type="button"
 className="px-3 py-1.5 bg-transparent text-bauto-nube/70 hover:text-bauto-nube border border-bauto-nube/20 text-bauto-nube text-xs font-sans transition-all duration-150 ease-out active:scale-[0.97] focus:outline-none"
 aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
 >
 {isPlaying ? "Pausar" : "Reproducir"}
 </button>
 <button
 onClick={toggleMute}
 type="button"
 className="px-3 py-1.5 bg-transparent text-bauto-nube/70 hover:text-bauto-nube border border-bauto-nube/20 text-bauto-nube text-xs font-sans transition-all duration-150 ease-out active:scale-[0.97] focus:outline-none"
 aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
 >
 {isMuted ? "Sonido" : "Silencio"}
 </button>
 </div>
 )}
 </div>
 </section>
 );
};

export default VideoHero;
