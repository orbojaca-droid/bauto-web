/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Atención & Contacto
 * @Propósito: Página de contacto directo, Concierge de WhatsApp y citas en boutique bajo estética Quiet Luxury
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Conexión de WhatsApp y estado de formulario intactos
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Check } from 'lucide-react';
import { playHapticFeedback } from '../../lib/sound';
import { BAUTO_WHATSAPP_PHONE } from '../../lib/constants';

export default function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('asesoria');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playHapticFeedback();
    
    const asuntoLegible: Record<string, string> = {
      asesoria: 'Asesoría de Talla y Estilo',
      especial: 'Pedido Especial o Novios',
      visita: 'Cita en Boutique Santa Marta',
      estado: 'Consulta sobre mi Orden',
      otro: 'Consulta General',
    };

    const texto = `Hola BAUTO Concierge,\n\nMi nombre es ${nombre}.\nAsunto: ${asuntoLegible[asunto] || asunto}\nCorreo: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`;
    const url = `https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
    
    setEnviado(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 sm:py-24 animate-fade-in font-body">
      
      {/* Encabezado Editorial */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra font-normal block mb-3">
          Concierge & Atelier
        </span>
        <h1 className="font-title font-light text-3xl sm:text-5xl text-bauto-carbon mb-4 tracking-wide">
          Atención de Autor
        </h1>
        <p className="font-editorial italic text-sm sm:text-base text-bauto-piedra leading-relaxed">
          Cada silueta tiene su propia resonancia. Estamos a tu disposición para orientarte en caídas, fibras y ocasiones especiales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Columna Izquierda: Canales de Atención Unificados */}
        <div className="md:col-span-5 border border-bauto-carbon/10 p-8 flex flex-col divide-y divide-bauto-carbon/10 bg-bauto-perla/30">
          
          {/* Concierge WhatsApp */}
          <div className="pb-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
              Canal Prioritario
            </span>
            <h2 className="font-title font-light text-lg text-bauto-carbon mb-2">
              Concierge WhatsApp
            </h2>
            <p className="text-xs text-bauto-piedra font-body leading-relaxed mb-4">
              Atención directa con nuestro equipo de atelier para consultas textiles y de disponibilidad en tiempo real.
            </p>
            <a
              href={`https://wa.me/${BAUTO_WHATSAPP_PHONE}?text=${encodeURIComponent('Hola BAUTO Concierge, deseo asesoría sobre una prenda de la colección.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticFeedback()}
              className="w-full py-3 px-6 rounded-full bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>

          {/* Boutique de Santa Marta */}
          <div className="py-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
              Atelier Físico
            </span>
            <h3 className="font-title font-light text-base text-bauto-carbon mb-1">
              Santa Marta, Colombia
            </h3>
            <p className="text-xs text-bauto-piedra font-body leading-relaxed mb-3">
              Calle 20 # 2-36, Centro Histórico
            </p>
            <Link
              href="/tienda-santa-marta"
              className="text-xs text-bauto-carbon hover:text-bauto-piedra underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
            >
              <span>Ver mapa e indicaciones GPS</span>
              <span>→</span>
            </Link>
          </div>

          {/* Horarios */}
          <div className="py-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
              Horarios
            </span>
            <div className="text-xs text-bauto-carbon space-y-1 font-body">
              <p><span className="text-bauto-piedra">Lunes a Sábado:</span> 10:00 AM – 8:00 PM</p>
              <p><span className="text-bauto-piedra">Domingos y Festivos:</span> 11:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Correo */}
          <div className="pt-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
              Correo Electrónico
            </span>
            <a
              href="mailto:hola@bauto.com.co"
              className="text-xs text-bauto-carbon hover:text-bauto-piedra transition-colors"
            >
              hola@bauto.com.co
            </a>
          </div>

        </div>

        {/* Columna Derecha: Formulario Editorial */}
        <div className="md:col-span-7 border border-bauto-carbon/10 p-8 sm:p-10">
          
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-bauto-piedra block mb-2 font-normal">
              Correspondencia
            </span>
            <h2 className="font-title font-light text-2xl text-bauto-carbon tracking-wide">
              Envíanos un Mensaje
            </h2>
            <p className="text-xs text-bauto-piedra font-body mt-1">
              Nos pondremos en contacto contigo a la brevedad posible.
            </p>
          </div>

          {enviado ? (
            <div className="p-8 text-center border border-bauto-carbon/10 bg-bauto-perla/30 animate-fade-in">
              <div className="w-10 h-10 rounded-full border border-bauto-carbon/20 mx-auto flex items-center justify-center text-bauto-carbon mb-4">
                <Check className="w-4 h-4 stroke-[1.5]" />
              </div>
              <h3 className="font-title font-light text-lg text-bauto-carbon mb-2 tracking-wide">
                Solicitud Redirigida
              </h3>
              <p className="text-xs text-bauto-piedra font-body max-w-sm mx-auto leading-relaxed mb-6">
                Hemos preparado tu mensaje directamente en el canal Concierge de WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="text-xs uppercase tracking-wider text-bauto-carbon hover:text-bauto-piedra underline underline-offset-4"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-bauto-piedra mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full bg-transparent border-b border-bauto-carbon/20 focus:border-bauto-carbon focus:outline-none py-2 text-xs text-bauto-carbon placeholder:text-bauto-piedra/40 rounded-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-bauto-piedra mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-transparent border-b border-bauto-carbon/20 focus:border-bauto-carbon focus:outline-none py-2 text-xs text-bauto-carbon placeholder:text-bauto-piedra/40 rounded-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-bauto-piedra mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full bg-transparent border-b border-bauto-carbon/20 focus:border-bauto-carbon focus:outline-none py-2 text-xs text-bauto-carbon placeholder:text-bauto-piedra/40 rounded-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-bauto-piedra mb-2">
                  Motivo de Consulta
                </label>
                <select
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full bg-transparent border-b border-bauto-carbon/20 focus:border-bauto-carbon focus:outline-none py-2 text-xs text-bauto-carbon rounded-none transition-colors"
                >
                  <option value="asesoria">Asesoría de Talla y Estilo</option>
                  <option value="especial">Pedido Especial / Novios / Evento</option>
                  <option value="visita">Agendar Visita en Boutique Santa Marta</option>
                  <option value="estado">Estado de mi Compra en Línea</option>
                  <option value="otro">Otra Inquietud</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-bauto-piedra mb-2">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos sobre tu evento, la silueta que buscas o tus medidas..."
                  className="w-full bg-transparent border-b border-bauto-carbon/20 focus:border-bauto-carbon focus:outline-none py-2 text-xs text-bauto-carbon placeholder:text-bauto-piedra/40 resize-none rounded-none transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-full bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2"
                >
                  <span>Enviar al Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <p className="text-[10px] text-center text-bauto-piedra/70 mt-3">
                  Tus datos se tratan con estricta discreción bajo nuestra política de privacidad.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
