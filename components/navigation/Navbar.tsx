'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Barra de navegación global con glassmorphism, selector del clima y acceso al Carrito
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de navegación desacoplado
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Compass, MapPin, PackageCheck, BookOpen } from 'lucide-react';
import { useCartStore } from '../../lib/cartStore';
import { WeatherWidget } from './WeatherWidget';
import { playHapticClick } from '../../lib/sound';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cart store
  const isHydrated = useCartStore((state) => state.isHydrated);
  const items = useCartStore((state) => state.items);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const displayCount = isHydrated ? totalItems : 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleOpenCart = () => {
    playHapticClick();
    setDrawerOpen(true);
  };

  const navLinks = [
    { href: '/catalogo', label: 'Colección', icon: Compass },
    { href: '/tienda-santa-marta', label: 'Boutique Santa Marta', icon: MapPin },
    { href: '/rastreo', label: 'Rastreo', icon: PackageCheck },
    { href: '/filosofia', label: 'Filosofía', icon: BookOpen },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'glass-nav py-3.5 shadow-subtle' 
            : 'bg-bauto-nube/80 backdrop-blur-md py-4 sm:py-5 border-b border-bauto-carbon/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Lado Izquierdo: Menú Hamburguesa Móvil & Links Desktop */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  playHapticClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden w-11 h-11 flex items-center justify-center -ml-2 rounded-full text-bauto-carbon hover:bg-bauto-perla/80 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <nav className="hidden lg:flex items-center gap-7">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={playHapticClick}
                      className={`text-[13px] tracking-wide transition-colors ${
                        isActive
                          ? 'text-bauto-terracota font-semibold'
                          : 'text-bauto-carbon/80 hover:text-bauto-terracota'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Centro: Logotipo Oficial BAUTO */}
            <div className="text-center">
              <Link 
                href="/" 
                onClick={playHapticClick}
                className="group inline-flex flex-col items-center select-none"
                aria-label="Ir a la página principal de BAUTO Resort Wear"
              >
                <Image
                  src="/logo-bauto.png"
                  alt="BAUTO"
                  width={130}
                  height={30}
                  priority
                  className="h-5 sm:h-6 w-auto object-contain transition-opacity group-hover:opacity-80"
                />
                <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.35em] uppercase text-bauto-piedra mt-0.5">
                  Resort Wear
                </span>
              </Link>
            </div>

            {/* Lado Derecho: Clima de Santa Marta & Botón Carrito */}
            <div className="flex items-center gap-3 sm:gap-4">
              <WeatherWidget />

              <button
                type="button"
                onClick={handleOpenCart}
                className="relative flex items-center justify-center w-10 h-10 text-bauto-carbon hover:text-bauto-terracota transition-colors active:scale-95"
                aria-label={`Ver bolsa de compras con ${displayCount} prendas`}
              >
                <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                {displayCount > 0 && (
                  <span className="absolute top-1 right-0.5 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[8.5px] font-mono font-semibold text-white bg-bauto-carbon rounded-full animate-fade-in">
                    {displayCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Menú Cortina Móvil (Ergonomía iPhone Safari) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden bg-bauto-carbon/30 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-[65px] left-0 right-0 bg-bauto-nube border-b border-bauto-carbon/10 shadow-elevated p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      playHapticClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-card-sm text-sm tracking-wide transition-colors ${
                      isActive 
                        ? 'bg-bauto-perla text-bauto-terracota font-semibold' 
                        : 'text-bauto-carbon hover:bg-bauto-perla/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-bauto-terracota' : 'text-bauto-piedra'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-bauto-carbon/5 flex flex-col gap-2 text-xs text-bauto-piedra">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-bauto-terracota" />
                <span>Calle 20 # 2-36, Centro Histórico, Santa Marta</span>
              </p>
              <p className="text-[11px] text-bauto-piedra/80">
                Lunes a Sábado: 10:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
