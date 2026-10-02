'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Página canónica de revisión y checkout con pasarela Wompi y tipografía en Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Manejo del formulario de envío e inicio de checkout bancario
 */

import React, { useState, useEffect } from 'react';
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
 
 // @BAUTO_REFACTOR 2026-10-02
 const [cedula, setCedula] = useState('');
 const [barrio, setBarrio] = useState('');
 const [shippingCost, setShippingCost] = useState<number | null>(null);
 const [shippingDays, setShippingDays] = useState<string>('');
 const [isQuotingShipping, setIsQuotingShipping] = useState(false);
 const [shippingError, setShippingError] = useState('');

 const [errors, setErrors] = useState<Record<string, string>>({});

 const [loading, setLoading] = useState(false);
 const [errorMessage, setErrorMessage] = useState('');

 const subtotal = isHydrated ? getSubtotal() : 0;
 const total = subtotal + (shippingCost || 0);

 // @BAUTO_REFACTOR 2026-10-02 Cotizador dinámico
 useEffect(() => {
   if (!isHydrated) return;
   const delayDebounceFn = setTimeout(async () => {
     if (city.trim().length >= 3) {
       setIsQuotingShipping(true);
       setShippingError('');
       try {
         const res = await fetch('/api/shipping/quote', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             city: city.trim(),
             subtotal,
             itemsCount: items.reduce((acc, i) => acc + i.quantity, 0)
           })
         });
         const data = await res.json();
         if (res.ok && data.cost !== undefined) {
           setShippingCost(data.cost);
           setShippingDays(data.deliveryDays || "2 a 3 días hábiles");
         } else {
           setShippingError(data.error || 'No se pudo cotizar el envío para esta ciudad.');
           setShippingCost(null);
           setShippingDays('');
         }
       } catch (err) {
         setShippingError('Error al conectar con el cotizador de envíos.');
         setShippingCost(null);
         setShippingDays('');
       } finally {
         setIsQuotingShipping(false);
       }
     } else {
       setShippingCost(null);
       setShippingDays('');
       setShippingError('');
     }
   }, 500);

   return () => clearTimeout(delayDebounceFn);
 }, [city, subtotal, items, isHydrated]);

 if (!isHydrated) return null;

 const handleCheckout = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrorMessage('');
 setErrors({});

 if (items.length === 0) {
 setErrorMessage('Tu bolsa de compras está vacía.');
 return;
 }

 // @BAUTO_REFACTOR 2026-10-02
 const newErrors: Record<string, string> = {};
 if (!city.trim()) newErrors.city = 'La ciudad o municipio es obligatoria.';
 if (!cedula.trim() || !/^\d{6,}$/.test(cedula.trim())) newErrors.cedula = 'La cédula es obligatoria (mínimo 6 dígitos).';
 if (!name.trim()) newErrors.name = 'El nombre completo es obligatorio.';
 if (!phone.trim()) newErrors.phone = 'El celular / WhatsApp es obligatorio.';
 if (!email.trim()) newErrors.email = 'El correo electrónico es obligatorio.';
 if (!barrio.trim()) newErrors.barrio = 'El barrio o sector es obligatorio.';
 if (!address.trim()) newErrors.address = 'La dirección exacta es obligatoria.';

 if (Object.keys(newErrors).length > 0) {
 setErrors(newErrors);
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
 customerCedula: cedula.trim(),
 customerBarrio: barrio.trim(),
 customerEmail: email.trim(),
 customerName: name.trim(),
 customerPhone: phone.trim(),
 shippingAddress: `${address.trim()}${city ? `, ${city.trim()}` : ''}`,
 shippingCity: city.trim() || 'Colombia',
 shippingCost: shippingCost,
 shippingDays: shippingDays,
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
 <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-bauto-piedra block mb-2">
 Bolsa de viaje
 </span>
 <h1 className="font-light text-2xl sm:text-3xl text-bauto-carbon mb-3">
 Tu bolsa está vacía
 </h1>
 <p className="italic text-xs sm:text-sm text-bauto-piedra leading-relaxed mb-8">
 La brisa y la luz del Caribe esperan tus próximas elecciones de siluetas nobles.
 </p>
 <Link
 href="/catalogo"
 onClick={playHapticClick}
 // @BAUTO_REFACTOR 2026-10-02
 className="px-8 py-3.5 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-transform active:scale-[0.97] text-xs font-sans inline-flex items-center gap-2 font-medium"
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
 <h1 className="font-light tracking-[0.15em] uppercase text-xl sm:text-2xl text-bauto-carbon">
 Tu bolsa y entrega
 </h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
 
 {/* Columna izquierda: Lista de prendas y datos del comprador (7 columnas) */}
 <div className="lg:col-span-7 flex flex-col gap-10">
 
 {/* Lista de prendas */}
 <div className="pb-8">
 <h2 className="text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon mb-5 flex items-center justify-between">
 <span>Prendas seleccionadas</span>
 <span className="text-bauto-piedra/70 font-light lowercase">
 ({items.reduce((acc, i) => acc + i.quantity, 0)} piezas)
 </span>
 </h2>

 <div className="divide-y divide-[#EAE7DF]">
 {items.map((item) => (
 <CartItemRow key={item.id} item={item} />
 ))}
 </div>

 {/* Módulo de regalo */}
 <div className="mt-6 pt-4">
 <GiftCeremony />
 </div>
 </div>

 {/* Formulario de entrega */}
 <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-8 pt-2">
 
 {/* @BAUTO_REFACTOR 2026-10-02 */}
 {/* FASE 1: Destino y Flete Servientrega */}
 <div className="flex flex-col gap-5">
 <h2 className="text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon mb-1">
 Fase 1: Destino y Flete Servientrega
 </h2>
 
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Ciudad o municipio de entrega *
 </label>
 <div className="relative">
 <input
 type="text"
 required
 value={city}
 onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors({...errors, city: ''}); }}
 placeholder="Ej: Santa Marta, Bogotá, Medellín"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.city ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {isQuotingShipping && (
 <div className="absolute right-0 top-1/2 -translate-y-1/2">
 <Loader2 className="w-4 h-4 animate-spin text-bauto-piedra" />
 </div>
 )}
 </div>
 {errors.city && <span className="text-xs text-bauto-danger mt-1 block">{errors.city}</span>}
 {shippingError && <span className="text-xs text-bauto-danger mt-1 block">{shippingError}</span>}
 </div>

 {shippingCost !== null && !isQuotingShipping && (
 <div className="mt-2 border border-[#EAE7DF] p-3.5 flex items-center justify-between text-xs bg-transparent">
 <span className="text-bauto-carbon font-light">
 Servientrega Nacional · <span className="text-bauto-terracota font-light tracking-[0.15em]">{formatCOP(shippingCost)}</span> · Entrega estimada: {shippingDays}
 </span>
 <span className="text-[10px] text-bauto-piedra/80 uppercase tracking-widest bg-bauto-carbon/5 px-2 py-1">Envío asegurado</span>
 </div>
 )}
 </div>

 {/* FASE 2: Datos de Entrega y Facturación */}
 <div className="flex flex-col gap-5 pt-4 border-t border-[#EAE7DF]">
 <h2 className="text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon mb-1">
 Fase 2: Datos de Entrega y Facturación
 </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Cédula de identidad *
 </label>
 <input
 type="text"
 required
 value={cedula}
 onChange={(e) => { setCedula(e.target.value); if (errors.cedula) setErrors({...errors, cedula: ''}); }}
 placeholder="Solo números"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.cedula ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {errors.cedula && <span className="text-xs text-bauto-danger mt-1 block">{errors.cedula}</span>}
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Nombre completo *
 </label>
 <input
 type="text"
 required
 value={name}
 onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({...errors, name: ''}); }}
 placeholder="Tu nombre y apellido"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.name ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {errors.name && <span className="text-xs text-bauto-danger mt-1 block">{errors.name}</span>}
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Celular / WhatsApp *
 </label>
 <input
 type="tel"
 required
 value={phone}
 onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({...errors, phone: ''}); }}
 placeholder="Ej: 300 123 4567"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.phone ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {errors.phone && <span className="text-xs text-bauto-danger mt-1 block">{errors.phone}</span>}
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Correo electrónico *
 </label>
 <input
 type="email"
 required
 value={email}
 onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: ''}); }}
 placeholder="correo@ejemplo.com"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.email ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {errors.email && <span className="text-xs text-bauto-danger mt-1 block">{errors.email}</span>}
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Barrio o sector *
 </label>
 <input
 type="text"
 required
 value={barrio}
 onChange={(e) => { setBarrio(e.target.value); if (errors.barrio) setErrors({...errors, barrio: ''}); }}
 placeholder="Nombre del barrio"
 className={`w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b ${errors.barrio ? 'border-bauto-danger' : 'border-[#EAE7DF]'}`}
 />
 {errors.barrio && <span className="text-xs text-bauto-danger mt-1 block">{errors.barrio}</span>}
 </div>

 <div>
 <label className="block text-xs font-normal text-bauto-piedra mb-1">
 Dirección exacta *
 </label>
 <AddressAutocomplete
 value={address}
 onChange={(val) => { setAddress(val); if (errors.address) setErrors({...errors, address: ''}); }}
 onSelectCity={() => {}}
 placeholder="Busca tu dirección o ingrésala manualmente"
 hasError={!!errors.address}
 />
 {errors.address && <span className="text-xs text-bauto-danger mt-1 block">{errors.address}</span>}
 </div>
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
 className="w-full text-xs py-2.5 bg-transparent text-bauto-carbon placeholder:text-bauto-piedra/40 focus:border-bauto-carbon focus:outline-none transition-colors border-b border-[#EAE7DF]"
 />
 </div>
 </div>

 {errorMessage && (
 <div className="p-3 bg-bauto-danger/10 border border-bauto-danger/20 text-bauto-danger text-xs">
 {errorMessage}
 </div>
 )}
 </form>

 </div>

 {/* Columna derecha: Resumen financiero y pago Wompi (5 columnas) */}
 <div className="lg:col-span-5 sticky top-24">
 <div className="p-6 sm:p-8 bg-transparent border border-[#EAE7DF]">
 
 <h2 className="text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon mb-5">
 Resumen de la orden
 </h2>

 <div className="flex flex-col gap-3 text-xs pb-5">
 <div className="flex justify-between text-bauto-piedra">
 <span>Subtotal prendas</span>
 <span className="text-[11px] font-light tracking-[0.15em] text-bauto-terracota">
 {formatCOP(subtotal)}
 </span>
 </div>

 <div className="flex justify-between text-bauto-piedra">
 {/* @BAUTO_REFACTOR 2026-10-02 */}
 <span>Envío con Servientrega</span>
 <span className="text-[11px] font-light tracking-[0.15em] text-bauto-terracota">
 {shippingCost === null ? 'Calculado según ciudad' : formatCOP(shippingCost)}
 </span>
 </div>

 {isGiftPackaging && (
 <div className="flex justify-between text-bauto-piedra">
 <span>Empaque y tarjeta de regalo</span>
 <span className="text-[11px] font-light tracking-[0.15em] text-bauto-terracota">Incluido</span>
 </div>
 )}
 </div>

 {/* Total */}
 <div className="flex items-baseline justify-between pt-4 mb-6">
 <span className="text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon">Total</span>
 <span className="text-xl sm:text-2xl font-light tracking-[0.15em] text-bauto-terracota">
 {formatCOP(total)}
 </span>
 </div>

 {/* Botón de pago principal */}
 <button
 type="submit"
 form="checkout-form"
 disabled={loading || isQuotingShipping || shippingCost === null}
 // @BAUTO_REFACTOR 2026-10-02
 className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-light bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-[transform,background-color] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
 >
 {loading || isQuotingShipping ? (
 <span className="inline-flex items-center justify-center gap-2">
 <Loader2 className="w-4 h-4 animate-spin" />
 <span>{isQuotingShipping ? 'Cotizando envío...' : 'Procesando sesión...'}</span>
 </span>
 ) : shippingCost === null ? (
 <span>Ingresa tu ciudad para cotizar envío</span>
 ) : (
 <span>Proceder al pago seguro · {formatCOP(total)}</span>
 )}
 </button>

 {/* Sellos de confianza bancaria */}
 <div className="mt-6 pt-5 text-[11px] text-bauto-piedra text-center font-light leading-relaxed">
 <p className="text-bauto-carbon font-normal mb-1">
 Procesamiento seguro y cifrado
 </p>
 <p className="text-[10px] text-bauto-piedra/80 mb-2">
 Aceptamos PSE, Bancolombia, Nequi, Tarjetas Débito/Crédito y Addi. Fondos procesados bajo certificación bancaria PCI-DSS.
 </p>
 <p className="text-[10px] text-bauto-carbon/80 font-normal">
 Cambios y devoluciones fáciles por 15 días · Envío asegurado con Servientrega
 </p>
 </div>

 </div>
 </div>

 </div>

 </div>
 );
}
