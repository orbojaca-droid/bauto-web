/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Pie de página institucional y legal de BAUTO Resort Wear con Sentence case estricto.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente informativo estático
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Instagram } from 'lucide-react';

 // @BAUTO_REFACTOR 2026-10-02
export function Footer() {
 return (
 <footer className="mt-auto bg-bauto-nube text-bauto-carbon">

 {/* Cuerpo principal del footer */}
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
 
 {/* Columna 1 & 2: Identidad y manifiesto */}
 <div className="lg:col-span-2 flex flex-col gap-4">
 <div>
 <Link href="/" className="inline-block">
 <Image
 src="/logo-bauto.png"
 alt="BAUTO Resort Wear"
 width={150}
 height={35}
 className="h-7 w-auto object-contain mb-1"
 />
 </Link>
 <span className="block text-[11px] font-light tracking-[0.35em] uppercase text-bauto-carbon/60">
 Resort Wear • Santa Marta
 </span>
 </div>
 
 <p className="text-[11px] font-light tracking-[0.03em] text-bauto-carbon/60 leading-relaxed max-w-sm">
 Prendas creadas bajo la brisa y la luz del Caribe colombiano. 
 Confort consciente, movimiento libre y aprecio por la textura viva de las fibras nobles.
 </p>

 <div className="flex items-center gap-6 pt-2">
 <a 
 href="https://instagram.com/bauto.studio" 
 target="_blank" 
 rel="noopener noreferrer"
 // @BAUTO_REFACTOR 2026-10-02
 className="p-2.5 -m-2.5 text-bauto-carbon/60 hover:text-bauto-carbon transition-colors"
 aria-label="Instagram BAUTO"
 >
 <Instagram className="w-4 h-4 stroke-[1.5]" />
 </a>
 <a 
 href="mailto:hola@bauto.com.co" 
 // @BAUTO_REFACTOR 2026-10-02
 className="p-2.5 -m-2.5 text-bauto-carbon/60 hover:text-bauto-carbon transition-colors"
 aria-label="Correo BAUTO"
 >
 <Mail className="w-4 h-4 stroke-[1.5]" />
 </a>
 </div>
 </div>

 {/* Columna 3: Colección y tipologías */}
 <div>
 <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-bauto-carbon mb-4">
 Tipologías
 </h3>
 <ul className="flex flex-col gap-2.5 text-[11px] font-light tracking-[0.03em] text-bauto-carbon/60">
 <li><Link href="/catalogo" className="hover:text-bauto-carbon transition-colors">Ver todo</Link></li>
 <li><Link href="/catalogo/camisa" className="hover:text-bauto-carbon transition-colors">Camisas</Link></li>
 <li><Link href="/catalogo/pantalon" className="hover:text-bauto-carbon transition-colors">Pantalones</Link></li>
 <li><Link href="/catalogo/pantaloneta" className="hover:text-bauto-carbon transition-colors">Pantalonetas</Link></li>
 <li><Link href="/catalogo/kimono" className="hover:text-bauto-carbon transition-colors">Kimonos</Link></li>
 <li><Link href="/catalogo/bermuda" className="hover:text-bauto-carbon transition-colors">Bermudas</Link></li>
 <li><Link href="/catalogo/vestido" className="hover:text-bauto-carbon transition-colors">Vestidos</Link></li>
 </ul>
 </div>

 {/* Columna 4: Experiencia y ayuda */}
 <div>
 <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-bauto-carbon mb-4">
 Soporte
 </h3>
 <ul className="flex flex-col gap-2.5 text-[11px] font-light tracking-[0.03em] text-bauto-carbon/60">
 <li><Link href="/rastreo" className="hover:text-bauto-carbon transition-colors">Rastreo</Link></li>
 <li><Link href="/filosofia" className="hover:text-bauto-carbon transition-colors">Manifiesto</Link></li>
 <li><Link href="/journal" className="hover:text-bauto-carbon transition-colors">Journal</Link></li>
 <li><Link href="/ayuda" className="hover:text-bauto-carbon transition-colors">Políticas</Link></li>
 <li><Link href="/contacto" className="hover:text-bauto-carbon transition-colors">Concierge</Link></li>
 </ul>
 </div>

 {/* Columna 5: Studio física */}
 <div>
 <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-bauto-carbon mb-4">
 Studio taller
 </h3>
 <div className="flex flex-col gap-3 text-[11px] font-light tracking-[0.03em] text-bauto-carbon/60">
 <p className="flex items-start gap-2">
 <MapPin className="w-4 h-4 text-bauto-terracota shrink-0 mt-0.5" />
 <span>Calle 20 # 2-36, Centro Histórico, Santa Marta, Colombia</span>
 </p>
 <p className="text-[11px] leading-relaxed">
 <span className="font-semibold text-bauto-carbon block">Horarios:</span>
 Lunes a sábado: 10:00 AM – 8:00 PM<br />
 Domingos y festivos: 11:00 AM – 6:00 PM
 </p>
 </div>
 </div>

 </div>

 {/* Línea divisoria inferior y derechos */}
 <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-light tracking-[0.03em] text-bauto-carbon/60">
 <p>© 2026 BAUTO Resort Wear. Todos los derechos reservados.</p>
 <div className="flex items-center gap-4">
 <Link href="/ayuda#terminos" className="hover:text-bauto-terracota transition-colors">Términos y condiciones</Link>
 <span>•</span>
 <Link href="/ayuda#privacidad" className="hover:text-bauto-terracota transition-colors">Política de privacidad</Link>
 </div>
 </div>

 </div>
 </footer>
 );
}
