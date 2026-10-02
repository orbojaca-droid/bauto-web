'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Compass, MapPin, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../lib/cartStore';
import { playHapticClick } from '../../lib/sound';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHydrated = useCartStore((state) => state.isHydrated);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const displayCount = isHydrated ? totalItems : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleOpenCart = () => {
    playHapticClick();
    setDrawerOpen(true);
  };

  const navLinks = [
    { href: '/catalogo', label: 'Colección', icon: Compass },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/tienda-santa-marta', label: 'Studio', icon: MapPin },
  ];

  return (
    <>
      <header 
        // @BAUTO_REFACTOR 2026-10-02
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-3.5 bg-bauto-nube border-b border-bauto-carbon/10' : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  playHapticClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden w-11 h-11 flex items-center justify-center -ml-2 text-bauto-carbon hover:bg-bauto-perla/80 transition-colors"
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
                      // @BAUTO_REFACTOR 2026-10-02
                      className={`uppercase tracking-[0.15em] text-[11px] font-light transition-colors ${
                        isActive ? 'text-bauto-carbon' : 'text-bauto-carbon/60 hover:text-bauto-carbon'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

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
              </Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleOpenCart}
                className="relative flex items-center justify-center w-10 h-10 text-bauto-carbon hover:text-bauto-terracota transition-all duration-150 ease-out active:scale-95"
                aria-label={`Ver bolsa de compras con ${displayCount} prendas`}
              >
                <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                {displayCount > 0 && (
                  <span className="absolute top-[8px] right-[6px] w-[6px] h-[6px] bg-bauto-carbon rounded-full animate-fade-in" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 lg:hidden bg-bauto-carbon/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute top-[65px] left-0 right-0 bg-bauto-nube p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-4 mt-8">
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
                      // @BAUTO_REFACTOR 2026-10-02
                      className={`flex items-center gap-4 py-2 text-3xl font-light uppercase tracking-[0.1em] transition-colors ${
                        isActive ? 'text-bauto-carbon' : 'text-bauto-carbon/60'
                      }`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 flex flex-col gap-2 text-xs text-bauto-piedra">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-bauto-terracota" />
                  <span>Calle 20 # 2-36, Centro Histórico, Santa Marta</span>
                </p>
                <p className="text-[11px] text-bauto-piedra/80">
                  Lunes a sábado: 10:00 AM - 8:00 PM
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
