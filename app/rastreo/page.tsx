'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Portal de Rastreo
 * @Propósito: Portal canónico de rastreo de envíos MiPaquete con storytelling caribeño
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Consulta pasiva de tracking
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, PackageCheck, Truck, Sparkles, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { playHapticClick } from '../../lib/sound';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialGuia = searchParams.get('guia') || '';

  const [guia, setGuia] = useState(initialGuia);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchTracking = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/tracking?guia=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No se encontró información para esta guía.');
      }

      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || 'Error al consultar el portal de rastreo.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialGuia) {
      fetchTracking(initialGuia);
    }
  }, [initialGuia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playHapticClick();
    fetchTracking(guia);
  };

  const whatsappMsg = encodeURIComponent(
    `Hola BAUTO, estoy consultando el rastreo de mi pedido con guía: ${guia}. Quisiera recibir asistencia de un asesor.`
  );
  const whatsappUrl = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${whatsappMsg}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in">
      
      {/* Encabezado del Portal */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Logística & Despacho
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl text-bauto-carbon mb-3">
          Rastreo de tu Pedido
        </h1>
        <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed">
          Consulta en tiempo real el viaje de tus prendas desde nuestro taller en Santa Marta hasta tu puerta.
        </p>
      </div>

      {/* Formulario de Consulta */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-10 flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-bauto-piedra" />
          <input
            type="text"
            value={guia}
            onChange={(e) => setGuia(e.target.value)}
            placeholder="Ingresa tu número de guía o referencia..."
            required
            className="w-full text-xs pl-10 pr-4 py-3 rounded-card-sm bg-bauto-perla border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-pill-primary px-6 py-3 text-xs tracking-wide shadow-sm disabled:opacity-75"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Rastrear</span>}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto p-4 rounded-card-sm bg-bauto-danger/10 border border-bauto-danger/20 text-bauto-danger text-xs text-center flex items-center justify-center gap-2 mb-10">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resultado de Rastreo con Storytelling Caribeño */}
      {trackingData && (
        <div className="bg-bauto-perla/80 rounded-card p-6 sm:p-10 border border-bauto-carbon/5 shadow-subtle animate-slide-up">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-bauto-carbon/10 mb-8">
            <div>
              <span className="text-[10px] tracking-wider uppercase text-bauto-piedra block">
                Guía Oficial MiPaquete
              </span>
              <strong className="font-mono text-base text-bauto-carbon">
                {trackingData.guia || guia}
              </strong>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-bauto-terracota/10 text-bauto-terracota text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{trackingData.estadoLegible || 'En Proceso'}</span>
            </div>
          </div>

          {/* Mensaje Editorial */}
          {trackingData.mensajeEditorial && (
            <div className="p-4 rounded-card-sm bg-bauto-nube border border-bauto-carbon/5 mb-8">
              <p className="font-editorial italic text-xs text-bauto-carbon leading-relaxed">
                "{trackingData.mensajeEditorial}"
              </p>
            </div>
          )}

          {/* Hitos del Envío */}
          {Array.isArray(trackingData.milestones) && (
            <div className="space-y-6">
              {trackingData.milestones.map((m: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        m.completed
                          ? 'bg-bauto-success text-white'
                          : m.current
                          ? 'bg-bauto-terracota text-white animate-pulse'
                          : 'bg-bauto-carbon/10 text-bauto-piedra'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < trackingData.milestones.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${m.completed ? 'bg-bauto-success/40' : 'bg-bauto-carbon/10'}`} />
                    )}
                  </div>

                  <div>
                    <h3 className={`text-xs font-semibold ${m.current ? 'text-bauto-terracota' : 'text-bauto-carbon'}`}>
                      {m.title}
                    </h3>
                    <p className="text-[11px] text-bauto-piedra mt-0.5">{m.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón WhatsApp Concierge */}
          <div className="mt-10 pt-6 border-t border-bauto-carbon/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-bauto-piedra text-center sm:text-left">
              ¿Tienes alguna duda con el reparto o necesitas coordinar la entrega?
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playHapticClick}
              className="btn-pill-glass px-5 py-2.5 flex items-center gap-2 text-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Contactar al Asesor</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-bauto-piedra">Cargando portal de rastreo...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
