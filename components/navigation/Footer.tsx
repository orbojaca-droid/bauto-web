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
import { MapPin, Phone, Mail, Instagram, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-bauto-perla/80 border-t border-bauto-carbon/10 text-bauto-carbon">
      
      {/* Franja de Confianza y Filosofía Resort Wear */}
      <div className="border-b border-bauto-carbon/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            
            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-bauto-terracota/10 text-bauto-terracota">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase">Envío de Cortesía</h4>
                <p className="text-[11px] text-bauto-piedra">En compras superiores a $300.000 COP</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-bauto-terracota/10 text-bauto-terracota">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase">Fibras Nobles 100%</h4>
                <p className="text-[11px] text-bauto-piedra">Lino europeo y confección caribeña</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-bauto-terracota/10 text-bauto-terracota">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase">Primer Cambio Ágil</h4>
                <p className="text-[11px] text-bauto-piedra">Talla garantizada y derecho de retracto</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="p-2.5 rounded-full bg-bauto-terracota/10 text-bauto-terracota">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide uppercase">Pago Blindado</h4>
                <p className="text-[11px] text-bauto-piedra">Wompi PCI-DSS • PSE • Bancolombia • Addi</p>
              </div>
            </div>

          </div>
        </div>
      </div>

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
              Confort consciente, movimiento libre y aprecio por la arruga noble del lino puro.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com/bauto.studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-bauto-carbon/5 hover:bg-bauto-terracota hover:text-white transition-colors text-bauto-carbon"
                aria-label="Instagram BAUTO"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="mailto:hola@bauto.com.co" 
                className="p-2 rounded-full bg-bauto-carbon/5 hover:bg-bauto-terracota hover:text-white transition-colors text-bauto-carbon"
                aria-label="Correo BAUTO"
              >
                <Mail className="w-4 h-4" />
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
              <li><Link href="/filosofia" className="hover:text-bauto-terracota transition-colors">Cuerpo Consciente & Lino</Link></li>
              <li><Link href="/ayuda" className="hover:text-bauto-terracota transition-colors">Políticas & Cambios</Link></li>
              <li><Link href="/ayuda#retracto" className="hover:text-bauto-terracota transition-colors">Derecho de Retracto (Ley 1480)</Link></li>
              <li><Link href="/contacto" className="hover:text-bauto-terracota transition-colors">WhatsApp Concierge VIP</Link></li>
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
