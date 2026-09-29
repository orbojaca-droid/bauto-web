'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Ficha de producto interactiva (PDP) con galería 4K, selector de tallas y compra táctil
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Orquestador principal de selección y adición al carrito
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  MapPin,
  Check,
  Feather,
  Sun,
  Ruler,
} from 'lucide-react';
import { Product, Talla } from '../../types/catalog';
import { useCartStore } from '../../lib/cartStore';
import { formatCOP, getArticleForTipologia } from '../../lib/grammar';
import { getOptimizedImageUrl } from '../../lib/images';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';
import { TextureMagnifier } from './TextureMagnifier';
import { SizeSelector } from './SizeSelector';
import { SizeGuideModal } from './SizeGuideModal';
import { StickyBuyBar } from './StickyBuyBar';
import { playSuccessChime, playHapticClick } from '../../lib/sound';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.primaryImage];

  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [selectedSize, setSelectedSize] = useState<Talla | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const isExclusive = product.isExclusiveInStore;
  const isOutOfStock = product.totalStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!selectedSize) {
      setSizeError(true);
      playHapticClick();
      return;
    }

    setSizeError(false);
    addItem(product, selectedSize, 1);
    playSuccessChime();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const articulo = getArticleForTipologia(product.tipologia, product.name);
  const whatsappMsg = encodeURIComponent(
    `Hola BAUTO, estoy interesado en ${articulo} ${product.name} (Ref: ${product.reference}) y me gustaría recibir asesoría personalizada.`
  );
  const whatsappUrl = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${whatsappMsg}`;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Columna Izquierda: Galería Macro 4K (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          
          {/* Miniaturas Laterales */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[580px] scrollbar-none shrink-0 w-full sm:w-20">
              {images.map((img, idx) => {
                const thumbUrl = getOptimizedImageUrl(img, { width: 160, quality: 75 });
                const isCurrent = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playHapticClick();
                      setSelectedImage(img);
                    }}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-card-sm overflow-hidden bg-bauto-perla shrink-0 border transition-all ${
                      isCurrent
                        ? 'border-bauto-terracota shadow-sm ring-1 ring-bauto-terracota'
                        : 'border-bauto-carbon/10 hover:border-bauto-carbon/30 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`${product.name} miniatura ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Imagen Principal con Lupa de Textura */}
          <div className="flex-1 w-full">
            <TextureMagnifier src={selectedImage || product.primaryImage} alt={product.name} />
          </div>

        </div>

        {/* Columna Derecha: Ficha Sensorial y Acciones de Compra (5 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          
          {/* Cabecera de la Prenda */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra font-normal">
                {product.tipologia || 'Resort Wear'}
              </span>
              <span className="text-bauto-piedra/30">•</span>
              <span className="font-mono text-[10px] text-bauto-piedra/70">
                {product.reference}
              </span>
            </div>

            <h1 className="font-title font-bold text-2xl sm:text-3xl tracking-tight text-bauto-carbon mb-2">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold text-2xl text-bauto-terracota">
                {formatCOP(product.price)}
              </span>
              <span className="text-xs text-bauto-piedra">IVA incluido</span>
            </div>
          </div>

          {/* Badge Exclusivo Tienda Física */}
          {isExclusive && (
            <div className="p-3 rounded-card-sm bg-bauto-trigo/15 border border-bauto-trigo/30 text-bauto-carbon flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-bauto-trigo shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Pieza Única en Tienda Física</strong>
                <p className="text-[11px] text-bauto-piedra mt-0.5">
                  Esta prenda tiene inventario reservado en Calle 20 # 2-36, Santa Marta. Puedes comprarla en línea o consultar con nuestro Concierge para apartarla.
                </p>
              </div>
            </div>
          )}

          {/* Ficha Sensorial del Tejido */}
          <div className="p-4 rounded-card-sm bg-bauto-perla/70 border border-bauto-carbon/5 flex flex-col gap-2.5 text-xs">
            <span className="text-[10px] tracking-wider uppercase text-bauto-terracota font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ficha Sensorial del Tejido</span>
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-bauto-piedra block">Composición:</span>
                <strong className="font-medium text-bauto-carbon">{product.material || '100% Lino Noble'}</strong>
              </div>
              <div>
                <span className="text-bauto-piedra block">Tacto al Lavado:</span>
                <strong className="font-medium text-bauto-carbon">Suavizado artesanal</strong>
              </div>
              <div>
                <span className="text-bauto-piedra block">Gramaje:</span>
                <strong className="font-medium text-bauto-carbon">{product.fabricGrammage || '165 g/m²'}</strong>
              </div>
              <div>
                <span className="text-bauto-piedra block">Caída:</span>
                <strong className="font-medium text-bauto-carbon">Fluida y relajada</strong>
              </div>
            </div>
          </div>

          {/* Selector de Tallas */}
          {!isOutOfStock && (
            <div>
              <SizeSelector
                stockPorTalla={product.stockPerSize}
                selectedSize={selectedSize}
                onSelectSize={(size) => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                onOpenSizeGuide={() => setSizeGuideOpen(true)}
              />

              {sizeError && (
                <p className="text-xs text-bauto-danger font-medium mt-2 animate-fade-in">
                  Por favor elige una talla antes de añadir a la bolsa.
                </p>
              )}
            </div>
          )}

          {/* Botón Principal de Adición a la Bolsa */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`btn-pill-primary w-full py-4 text-sm tracking-wide shadow-elevated ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed bg-bauto-carbon' : ''
              }`}
            >
              {isOutOfStock ? (
                <span>Agotado Temporalmente</span>
              ) : addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Añadido a la Bolsa!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir a la Bolsa</span>
                </>
              )}
            </button>

            {/* Asesoría Directa por WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playHapticClick}
              className="btn-pill-glass w-full py-3 text-xs tracking-wide flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Consultar al Asesor de Taller (WhatsApp)</span>
            </a>
          </div>

          {/* Sellos de Confianza Rápidos */}
          <div className="pt-4 border-t border-bauto-carbon/5 flex flex-col gap-2 text-[11px] text-bauto-piedra">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-bauto-terracota shrink-0" />
              <span>Envío de cortesía en Colombia en compras superiores a $300.000 COP</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-bauto-terracota shrink-0" />
              <span>Primer cambio de talla ágil sin costo adicional de flete</span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Guía de Medidas */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        categoria={product.tipologia}
      />

      {/* Barra de Compra Flotante en Móvil al hacer scroll */}
      <StickyBuyBar
        product={product}
        selectedSize={selectedSize}
        onAddToCart={handleAddToCart}
        disabled={isOutOfStock}
      />
    </>
  );
}
