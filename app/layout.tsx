/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Raíz del layout global con fuentes oficiales de BAUTO (Sora, Plus Jakarta Sans, Rajdhani, Lora)
 * @Capa: Estética / Técnica
 * @Riesgo_Evaluado: Bajo - Plantilla maestra del App Router
 */

import type { Metadata, Viewport } from 'next';
import { Sora, Plus_Jakarta_Sans, Rajdhani, Lora } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { CartInitializer } from '../components/cart/CartInitializer';
import { Carrito } from '../components/cart/Carrito';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BAUTO Resort Wear | Lino Noble, Fibras del Trópico & Confort del Caribe',
  description:
    'Prendas creadas bajo la brisa y la luz de Santa Marta. Lino puro, fibras nobles del trópico, siluetas fluidas y diseño de autor consciente.',
  metadataBase: new URL('https://www.bauto.com.co'),
  keywords: [
    'BAUTO',
    'Resort Wear',
    'Lino Colombia',
    'Fibras Nobles',
    'Santa Marta',
    'Caribe',
    'Moda Consciente',
    'Lujo Silencioso',
  ],
  authors: [{ name: 'BAUTO Studio' }],
  openGraph: {
    title: 'BAUTO Resort Wear | Lino Noble, Fibras del Trópico & Confort del Caribe',
    description: 'Prendas de autor creadas bajo la brisa y la luz de Santa Marta, Colombia.',
    url: 'https://www.bauto.com.co',
    siteName: 'BAUTO Resort Wear',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BAUTO Resort Wear',
    description: 'Lino noble, fibras del trópico y confección caribeña desde Santa Marta.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF9F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${plusJakarta.variable} ${rajdhani.variable} ${lora.variable}`}
    >
      <body className="min-h-screen min-h-[100dvh] flex flex-col bg-bauto-nube text-bauto-carbon antialiased selection:bg-bauto-terracota/20 selection:text-bauto-terracota">
        <CartInitializer />
        <Navbar />
        <main className="flex-1 pt-[68px] sm:pt-[76px]">
          {children}
        </main>
        <Footer />
        <Carrito />
      </body>
    </html>
  );
}
