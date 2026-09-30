'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Página canónica de revisión y checkout con pasarela Wompi y tipografía en Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Manejo del formulario de envío e inicio de checkout bancario
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../../lib/cartStore';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { GiftCeremony } from '../../components/cart/GiftCeremony';
import { AddressAutocomplete } from '../../components/cart/AddressAutocomplete';
import { formatCOP } from '../../lib/grammar';
import { playHapticClick } from '../../lib/sound';

export default function CartPage() {
 const router = useRouter();
 const isHydrated = useCartStore((state) => state.isHydrated);
 const items = useCartStore((state) => state.items);
 const getSubtotal = useCartStore((state) => state.getSubtotal);
 
 const isGiftPackaging = useCartStore((state) => state.isGiftPackaging);
 const giftDedicationNote = useCartStore((state) => state.giftDedicationNote);

 // Formulario del comprador
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [phone, setPhone] = useState('');
 const [address, setAddress] = useState('');
 const [city, setCity] = useState('');
 const [notes, setNotes] = useState('');

 const [loading, setLoading] = useState(false);
 const [errorMessage, setErrorMessage] = useState('');

 if (!isHydrated) return null;

 const subtotal = getSubtotal();
 
 const shippingCost = 15000;
 const total = subtotal + shippingCost;

 const handleCheckout = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrorMessage('');

 if (items.length === 0) {
 setErrorMessage('Tu bolsa de compras está vacía.');
 return;
 }

 if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
 setErrorMessage('Por favor completa todos los campos de entrega obligatorios.');
 return;
 }

 playHapticClick();
 setLoading(true);

 try {
 // Obtener o generar sessionId para el Two-Phase Soft Lock en Redis
 let sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('bauto_session_id') : null;
 if (!sessionId) {
 sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
 if (typeof window !== 'undefined') sessionStorage.setItem('bauto_session_id', sessionId);
 }

 // Solicitar sesión blindada con precios verificados en backend
 const res = await fetch('/api/checkout/wompi-session', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 sessionId,
 items: items.map((item) => ({
 id: item.id,
 reference: item.product.reference,
 size: item.selectedSize,
 quantity: item.quantity,
 })),
 customerEmail: email.trim(),
 customerName: name.trim(),
 customerPhone: phone.trim(),
 shippingAddress: `${address.trim()}${city ? `, ${city.trim()}` : ''}`,
 shippingCity: city.trim() || 'Colombia',
 notes: notes.trim(),
 giftPackaging: isGiftPackaging,
 giftNote: giftDedicationNote.trim(),
 }),
 });

 const data = await res.json();

 if (!res.ok || !data.success) {
 throw new Error(data.error || 'No se pudo iniciar la sesión de pago.');
 }

 // Redirigir a checkoutUrl oficial de Wompi Web
 const targetUrl = data.checkoutUrl || data.data?.checkoutUrl;
 if (targetUrl) {
 window.location.href = targetUrl;
 } else {
 throw new Error('URL de pasarela no disponible.');
 }
 } catch (err: any) {
 setErrorMessage(err.message || 'Error de conexión con la pasarela de pagos.');
 setLoading(false);
 }
 };

 if (items.length === 0) {
 return (
 <div className="max-w-md mx-auto px-4 py-28 text-center animate-fade-in">
 <span className="font-title text-[10px] font-medium uppercase tracking-[0.35em] text-bauto-piedra block mb-2">
 Bolsa de viaje
 </span>
 <h1 className="font-title font-light text-2xl sm:text-3xl text-bauto-carbon mb-3">
 Tu bolsa está vacía
 </h1>
 <p className="font-editorial italic text-xs sm:text-sm text-bauto-piedra leading-relaxed mb-8">
 La brisa y la luz del Caribe esperan tus próximas elecciones de siluetas nobles.
 </p>
 <Link
 href="/catalogo"
 onClick={playHapticClick}
 className="px-8 py-3.5 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs font-sans inline-flex items-center gap-2 font-medium"
 >
 <span>Explorar la colección</span>
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 );
 }

 return (
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16 animate-fade-in">
 
 <div className="mb-10 sm:mb-12">
 <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra block mb-1 font-light">
 Finalizar pedido
 </span>
 <h1 className="font-title font-light sm:font-normal text-2xl sm:text-3xl lg:text-4xl text-bauto-carbon">
 Tu bolsa y entrega
 </h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
 
 {/* Columna izquierda: Lista de prendas y datos del comprador (7 columnas) */}
 <div className="lg:col-span-7 flex flex-col gap-10">
 
 {/* Lista de prendas */}
 <div className=" pb-8">
 <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-bauto-carbon mb-5 flex items-center justify-between">
 <span>Prendas seleccionadas</span>
 <span className="text-bauto-piedra/70 font-light lowercase">
 ({items.reduce((acc, i) => acc + i.quantity, 0)} piezas)
 </span>
 </h2>

 <div className="divide-y divide-bauto-carbon/[0.06]">
 {items.map((item) => (
 <CartItemRow key={item.id} item={item} />
 ))}
 </div>

 {/* Módulo de regalo */}
 <div className="mt-6 pt-4 ">
 <GiftCeremony />
 </div>
 </div>

 {/* Formulario de entrega */}
 <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-5 pt-2">
 <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-bauto-carbon mb-1">
 Datos para el envío nacional
 </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Nombre completo *
 </label>
 <input
 type="text"
 required
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Tu nombre y apellido"
 className="w-full text-xs py-2.5 bg-transparent  text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors font-body"
 />
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Celular / WhatsApp *
 </label>
 <input
 type="tel"
 required
 value={phone}
 onChange={(e) => setPhone(e.target.value)}
 placeholder="Ej: 300 123 4567"
 className="w-full text-xs py-2.5 bg-transparent  text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors font-body"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Correo electrónico (para guía y recibo) *
 </label>
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="correo@ejemplo.com"
 className="w-full text-xs py-2.5 bg-transparent  text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors font-body"
 />
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Dirección de entrega *
 </label>
 <AddressAutocomplete
 value={address}
 onChange={setAddress}
 onSelectCity={setCity}
 placeholder="Busca tu dirección o ingrésala manualmente"
 />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Ciudad / municipio *
 </label>
 <input
 type="text"
 required
 value={city}
 onChange={(e) => setCity(e.target.value)}
 placeholder="Ej: Santa Marta, Bogotá, Medellín"
 className="w-full text-xs py-2.5 bg-transparent  text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors font-body"
 />
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Indicaciones adicionales (opcional)
 </label>
 <input
 type="text"
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder="Apto, torre, portería..."
 className="w-full text-xs py-2.5 bg-transparent  text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors font-body"
 />
 </div>
 </div>

 {errorMessage && (
 <div className="p-3 bg-bauto-danger/10 border border-bauto-danger/20 text-bauto-danger text-xs ">
 {errorMessage}
 </div>
 )}
 </form>

 </div>

 {/* Columna derecha: Resumen financiero y pago Wompi (5 columnas) */}
 <div className="lg:col-span-5 sticky top-24">
 <div className=" p-6 sm:p-8 bg-[#FAF6F0]/40 ">
 
 <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-bauto-carbon mb-5">
 Resumen de la orden
 </h2>

 <div className="flex flex-col gap-3 text-xs pb-5">
 <div className="flex justify-between text-bauto-piedra">
 <span>Subtotal prendas</span>
 <span className="font-body text-bauto-carbon font-normal">
 {formatCOP(subtotal)}
 </span>
 </div>

 <div className="flex justify-between text-bauto-piedra">
 <span>Envío nacional (MiPaquete)</span>
 <span className="font-body text-bauto-carbon">
 {formatCOP(shippingCost)}
 </span>
 </div>

 {isGiftPackaging && (
 <div className="flex justify-between text-bauto-piedra">
 <span>Empaque y tarjeta de regalo</span>
 <span className="font-body text-bauto-carbon font-normal">Incluido</span>
 </div>
 )}
 </div>

 {/* Total */}
 <div className="flex items-baseline justify-between pt-4 mb-6">
 <span className="text-xs uppercase tracking-wider text-bauto-carbon">Total</span>
 <span className="font-body text-xl sm:text-2xl font-normal text-bauto-carbon">
 {formatCOP(total)}
 </span>
 </div>

 {/* Botón de pago principal */}
 <button
 type="submit"
 form="checkout-form"
 disabled={loading}
 className="w-full py-4 text-xs font-sans font-medium bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {loading ? (
 <span className="inline-flex items-center gap-2">
 <Loader2 className="w-4 h-4 animate-spin" />
 <span>Procesando sesión...</span>
 </span>
 ) : (
 <span>Proceder al pago seguro · {formatCOP(total)}</span>
 )}
 </button>

 {/* Sellos de confianza bancaria */}
 <div className="mt-6 pt-5 text-[11px] text-bauto-piedra text-center font-light leading-relaxed">
 <p className="text-bauto-carbon font-normal mb-1">
 Procesamiento seguro y cifrado
 </p>
 <p className="text-[10px] text-bauto-piedra/80">
 Aceptamos PSE, Bancolombia, Nequi, Tarjetas Débito/Crédito y Addi. Fondos procesados bajo certificación bancaria PCI-DSS.
 </p>
 </div>

 </div>
 </div>

 </div>

 </div>
 );
}
