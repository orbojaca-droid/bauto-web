'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Ficha de producto interactiva (PDP) con galería 4K, selector de tallas y compra táctil
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Orquestador principal de selección y adición al carrito
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
 MessageCircle,
 Check,
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
 className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden bg-[#FAF6F0] shrink-0 transition-all ${
 isCurrent
 ? 'opacity-100'
 : 'opacity-50 hover:opacity-100'
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
 <span className="text-[10px] text-bauto-piedra/70">
 {product.reference}
 </span>
 </div>

 <h1 className="uppercase tracking-[0.1em] font-light text-2xl sm:text-3xl lg:text-4xl text-bauto-carbon mb-2">
 {product.name}
 </h1>

 <div className="flex items-baseline gap-3">
 <span className="font-light tracking-[0.15em] text-[#B85C38] text-xl sm:text-2xl">
 {formatCOP(product.price)}
 </span>
 <span className="text-[10px] text-bauto-piedra/70 uppercase tracking-widest">IVA incluido</span>
 </div>
 </div>

 {/* Badge exclusivo tienda física */}
 {isExclusive && (
 <div className=" pl-3.5 py-1 text-xs text-bauto-carbon">
 <span className="block font-medium tracking-wide">Exclusividad en tienda física</span>
 <p className="text-[11px] text-bauto-piedra mt-0.5 leading-relaxed font-light">
 Pieza disponible en Calle 20 # 2-36, Centro Histórico de Santa Marta.
 </p>
 </div>
 )}

 {/* Ficha sensorial del tejido */}
 <div className="border-t py-4 flex flex-col gap-3 text-xs">
 <span className="text-[9px] tracking-[0.25em] uppercase text-bauto-piedra/80 block">
 Ficha sensorial del tejido
 </span>

 <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
 <div>
 <span className="text-bauto-piedra block font-light">Composición:</span>
 <span className="font-normal text-bauto-carbon">{product.material || 'Fibras nobles'}</span>
 </div>
 <div>
 <span className="text-bauto-piedra block font-light">Tacto al lavado:</span>
 <span className="font-normal text-bauto-carbon">Suavizado artesanal</span>
 </div>
 <div>
 <span className="text-bauto-piedra block font-light">Gramaje:</span>
 <span className="font-normal text-bauto-carbon">{product.fabricGrammage || '165 g/m²'}</span>
 </div>
 <div>
 <span className="text-bauto-piedra block font-light">Caída:</span>
 <span className="font-normal text-bauto-carbon">Fluida y relajada</span>
 </div>
 </div>
 </div>

 {/* Selector de tallas */}
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

 {/* Botón principal de adición a la bolsa */}
 <div className="flex flex-col gap-2.5 pt-2">
 <button
 type="button"
 disabled={isOutOfStock}
 onClick={handleAddToCart}
 className={`w-full py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-normal transition-colors border-b border-[#1C1917] text-[#1C1917] hover:opacity-70 active:scale-[0.97] transition-transform duration-120 ease-out ${
 isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''
 }`}
 >
 {isOutOfStock ? (
 <span>Agotado temporalmente</span>
 ) : addedAnimation ? (
 <span className="inline-flex items-center gap-1.5">
 <Check className="w-4 h-4" />
 <span>¡Añadido a la bolsa!</span>
 </span>
 ) : (
 <span>Añadir a la bolsa</span>
 )}
 </button>

 {/* Asesoría directa por WhatsApp */}
 <a
 href={whatsappUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={playHapticClick}
 className="btn-ghost w-full py-3 text-xs font-sans flex items-center justify-center gap-2"
 >
 <MessageCircle className="w-3.5 h-3.5 text-bauto-carbon/70" />
 <span>Consultar con concierge de taller</span>
 </a>
 </div>

 {/* Sellos de Confianza Rápidos */}
 <div className="pt-4 flex flex-col gap-1.5 text-[11px] italic text-bauto-piedra">
 
 <p>· Primer cambio de talla asistido sin costo adicional de flete.</p>
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
