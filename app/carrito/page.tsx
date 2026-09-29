'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Página canónica de revisión y checkout con pasarela Wompi
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Medio - Manejo del formulario de envío e inicio de checkout bancario
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
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
  const getFreeShippingProgress = useCartStore((state) => state.getFreeShippingProgress);
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
  const { isQualified } = getFreeShippingProgress();
  const shippingCost = isQualified || subtotal >= 300000 ? 0 : 15000;
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-bauto-perla mx-auto flex items-center justify-center text-bauto-terracota border border-bauto-carbon/5 mb-5">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-title font-bold text-2xl text-bauto-carbon mb-2">
          Tu bolsa de viaje está vacía
        </h1>
        <p className="font-editorial italic text-sm text-bauto-piedra max-w-md mx-auto mb-8">
          La brisa y la luz del Caribe esperan tus próximas elecciones de lino puro y prendas nobles.
        </p>
        <Link
          href="/catalogo"
          onClick={playHapticClick}
          className="btn-pill-primary px-8 py-3.5 text-sm tracking-wide shadow-elevated"
        >
          <span>Explorar la Colección</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.25em] uppercase text-bauto-piedra block mb-1">
          Finalizar Pedido
        </span>
        <h1 className="font-title font-bold text-2xl sm:text-3xl tracking-tight text-bauto-carbon">
          Tu Bolsa y Entrega
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Columna Izquierda: Lista de Prendas y Datos del Comprador (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Lista de Prendas */}
          <div className="bg-bauto-perla/60 rounded-card p-5 sm:p-7 border border-bauto-carbon/5">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-4 flex items-center justify-between">
              <span>Prendas Seleccionadas</span>
              <span className="text-bauto-piedra font-normal lowercase">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} piezas)
              </span>
            </h2>

            <div className="divide-y divide-bauto-carbon/5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Módulo de Regalo */}
            <GiftCeremony />
          </div>

          {/* Formulario de Entrega */}
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-bauto-perla/60 rounded-card p-5 sm:p-7 border border-bauto-carbon/5 flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-2">
              Datos para el Envío Nacional
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full text-sm p-3 rounded-card-sm bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                  Celular / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 300 123 4567"
                  className="w-full text-sm p-3 rounded-card-sm bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                Correo Electrónico (para guía y recibo) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full text-sm p-3 rounded-card-sm bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                Dirección de Entrega (con autocompletado) *
              </label>
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelectCity={setCity}
                placeholder="Busca tu dirección o ingrésala manualmente"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                  Ciudad / Municipio *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Santa Marta, Barranquilla, Bogotá"
                  className="w-full text-sm p-3 rounded-card-sm bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-bauto-carbon mb-1.5">
                  Indicaciones Adicionales (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Apto, torre, portería..."
                  className="w-full text-sm p-3 rounded-card-sm bg-bauto-nube border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-card-sm bg-bauto-danger/10 border border-bauto-danger/20 text-bauto-danger text-xs">
                {errorMessage}
              </div>
            )}
          </form>

        </div>

        {/* Columna Derecha: Resumen Financiero y Pago Wompi (5 columnas) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-bauto-perla rounded-card p-6 sm:p-7 border border-bauto-carbon/10 shadow-subtle">
            
            <h2 className="text-xs font-semibold tracking-wider uppercase text-bauto-carbon mb-5">
              Resumen de la Orden
            </h2>

            <div className="flex flex-col gap-3 text-xs border-b border-bauto-carbon/10 pb-5">
              <div className="flex justify-between text-bauto-piedra">
                <span>Subtotal prendas</span>
                <span className="font-mono text-bauto-carbon font-semibold">
                  {formatCOP(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-bauto-piedra">
                <span>Envío nacional (MiPaquete)</span>
                <span className="font-mono">
                  {shippingCost === 0 ? (
                    <span className="text-bauto-terracota font-medium">De cortesía</span>
                  ) : (
                    formatCOP(shippingCost)
                  )}
                </span>
              </div>

              {isGiftPackaging && (
                <div className="flex justify-between text-bauto-piedra">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-bauto-terracota" />
                    <span>Empaque y tarjeta de regalo</span>
                  </span>
                  <span className="font-mono text-bauto-terracota font-medium">Incluido</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-4 mb-6">
              <span className="text-sm font-semibold text-bauto-carbon">Total a Pagar</span>
              <span className="font-mono text-2xl font-bold text-bauto-terracota">
                {formatCOP(total)}
              </span>
            </div>

            {/* Botón de Pago Principal */}
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="btn-pill-primary w-full py-4 text-sm tracking-wide shadow-elevated disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Conectando con Wompi...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pagar con Wompi · {formatCOP(total)}</span>
                </>
              )}
            </button>

            {/* Sellos de Confianza Bancaria */}
            <div className="mt-6 pt-5 border-t border-bauto-carbon/5 flex flex-col gap-2.5 text-[11px] text-bauto-piedra text-center">
              <div className="flex items-center justify-center gap-1 text-bauto-carbon font-medium">
                <ShieldCheck className="w-4 h-4 text-bauto-success" />
                <span>Transacción 100% Cifrada PCI-DSS Nivel 1</span>
              </div>
              <p className="text-[10px] text-bauto-piedra/80 leading-relaxed">
                Acepta PSE, Botón Bancolombia, Nequi, Tarjetas Débito/Crédito y Addi. 
                Tus fondos son procesados de forma segura sin almacenar datos sensibles.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
