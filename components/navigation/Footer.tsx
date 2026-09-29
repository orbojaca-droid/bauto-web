/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Pie de página institucional y legal de BAUTO Resort Wear
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente informativo estático
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-[#FAF9F6] border-t border-bauto-carbon/[0.06] text-bauto-carbon">

      {/* Cuerpo Principal del Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Columna 1 & 2: Identidad & Manifiesto */}
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
              <span className="block text-[8.5px] tracking-[0.35em] uppercase text-bauto-piedra">
                Resort Wear • Santa Marta
              </span>
            </div>
            
            <p className="text-xs text-bauto-piedra leading-relaxed max-w-sm">
              Prendas creadas bajo la brisa y la luz del Caribe colombiano. 
              Confort consciente, movimiento libre y aprecio por la textura viva de las fibras nobles.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com/bauto.studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bauto-carbon/60 hover:text-bauto-carbon transition-colors"
                aria-label="Instagram BAUTO"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a 
                href="mailto:hola@bauto.com.co" 
                className="text-bauto-carbon/60 hover:text-bauto-carbon transition-colors"
                aria-label="Correo BAUTO"
              >
                <Mail className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* Columna 3: Colección & Tipologías */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-4">
              Colección
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-bauto-piedra">
              <li><Link href="/catalogo" className="hover:text-bauto-terracota transition-colors">Ver Todo el Catálogo</Link></li>
              <li><Link href="/catalogo/camisa" className="hover:text-bauto-terracota transition-colors">Camisas de Lino</Link></li>
              <li><Link href="/catalogo/pantalon" className="hover:text-bauto-terracota transition-colors">Pantalones Fluidos</Link></li>
              <li><Link href="/catalogo/kimono" className="hover:text-bauto-terracota transition-colors">Kimonos & Capas</Link></li>
              <li><Link href="/catalogo/bermuda" className="hover:text-bauto-terracota transition-colors">Bermudas & Shorts</Link></li>
              <li><Link href="/catalogo/chaleco" className="hover:text-bauto-terracota transition-colors">Chalecos & Terceras Piezas</Link></li>
            </ul>
          </div>

          {/* Columna 4: Experiencia & Ayuda */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-4">
              Experiencia
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-bauto-piedra">
              <li><Link href="/rastreo" className="hover:text-bauto-terracota transition-colors">Rastrear mi Envío</Link></li>
              <li><Link href="/tienda-santa-marta" className="hover:text-bauto-terracota transition-colors">Boutique Santa Marta</Link></li>
              <li><Link href="/filosofia" className="hover:text-bauto-terracota transition-colors">Filosofía & Fibras Nobles</Link></li>
              <li><Link href="/ayuda" className="hover:text-bauto-terracota transition-colors">Políticas & Cambios</Link></li>
              <li><Link href="/ayuda#retracto" className="hover:text-bauto-terracota transition-colors">Derecho de Retracto (Ley 1480)</Link></li>
              <li><Link href="/contacto" className="hover:text-bauto-terracota transition-colors">Atención Concierge</Link></li>
            </ul>
          </div>

          {/* Columna 5: Boutique Física */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-4">
              Boutique Taller
            </h3>
            <div className="flex flex-col gap-3 text-xs text-bauto-piedra">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-bauto-terracota shrink-0 mt-0.5" />
                <span>Calle 20 # 2-36, Centro Histórico, Santa Marta, Colombia</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold text-bauto-carbon block">Horarios:</span>
                Lunes a Sábado: 10:00 AM – 8:00 PM<br />
                Domingos & Festivos: 11:00 AM – 6:00 PM
              </p>
            </div>
          </div>

        </div>

        {/* Línea Divisoria Inferior y Derechos */}
        <div className="mt-12 pt-8 border-t border-bauto-carbon/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-bauto-piedra">
          <p>© 2026 BAUTO Resort Wear. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/ayuda#terminos" className="hover:text-bauto-terracota transition-colors">Términos y Condiciones</Link>
            <span>•</span>
            <Link href="/ayuda#privacidad" className="hover:text-bauto-terracota transition-colors">Política de Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
