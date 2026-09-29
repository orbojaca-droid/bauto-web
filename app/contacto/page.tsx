/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Atención & Contacto
 * @Propósito: Página de contacto directo, Concierge VIP de WhatsApp y citas en boutique de Santa Marta
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Página de comunicación institucional
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { playHapticFeedback } from '../../lib/sound';

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
    
    // Armar mensaje directo a WhatsApp como fallback preferencial VIP
    const asuntoLegible: Record<string, string> = {
      asesoria: 'Asesoría de Talla y Estilo',
      especial: 'Pedido Especial o Novios',
      visita: 'Cita en Boutique Santa Marta',
      estado: 'Consulta sobre mi Orden',
      otro: 'Consulta General',
    };

    const texto = `Hola BAUTO Concierge,\n\nMi nombre es ${nombre}.\nAsunto: ${asuntoLegible[asunto] || asunto}\nCorreo: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`;
    const url = `https://wa.me/573505731220?text=${encodeURIComponent(texto)}`;
    
    setEnviado(true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in">
      
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-terracota font-semibold block mb-2">
          Concierge VIP & Taller
        </span>
        <h1 className="font-title font-bold text-3xl sm:text-4xl text-bauto-carbon mb-3">
          Atención Personalizada
        </h1>
        <p className="font-editorial italic text-sm text-bauto-piedra leading-relaxed">
          Cada prenda de lino tiene una historia. Estamos a tu disposición para asesorarte en cortes, calces y ocasiones especiales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Canales Directos */}
        <div className="md:col-span-5 flex flex-col gap-5">
          
          {/* Tarjeta Concierge WhatsApp */}
          <div className="bg-[#F0FDF4] rounded-card p-6 border border-[#BBF7D0] relative overflow-hidden">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#16A34A] mb-2">
              <MessageCircle className="w-4 h-4" />
              <span>Respuesta Inmediata</span>
            </div>
            <h2 className="font-title font-bold text-lg text-bauto-carbon mb-2">
              Concierge WhatsApp
            </h2>
            <p className="text-xs text-bauto-piedra font-body leading-relaxed mb-4">
              Atención directa con nuestro equipo de diseño y tienda para resolver dudas en tiempo real.
            </p>
            <a
              href="https://wa.me/573505731220?text=Hola%20BAUTO%20Concierge,%20deseo%20asesoría%20sobre%20una%20prenda%20de%20la%20colección."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playHapticFeedback()}
              className="btn-pill-primary w-full py-3 text-xs tracking-wider inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>

          {/* Tarjeta Boutique Física */}
          <div className="bg-bauto-perla/80 rounded-card p-6 border border-bauto-carbon/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bauto-terracota mb-2">
              <MapPin className="w-4 h-4" />
              <span>Boutique de Autor</span>
            </div>
            <h3 className="font-title font-bold text-base text-bauto-carbon mb-1">
              Santa Marta, Colombia
            </h3>
            <p className="text-xs text-bauto-piedra font-body leading-relaxed mb-3">
              Calle 20 # 2-36, Centro Histórico
            </p>
            <Link
              href="/tienda-santa-marta"
              className="text-xs font-semibold text-bauto-terracota underline inline-flex items-center gap-1"
            >
              <span>Ver mapa e indicaciones GPS</span>
              <span>→</span>
            </Link>
          </div>

          {/* Tarjeta Horarios */}
          <div className="bg-bauto-perla/80 rounded-card p-6 border border-bauto-carbon/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bauto-carbon/60 mb-2">
              <Clock className="w-4 h-4 text-bauto-terracota" />
              <span>Horarios de Atención</span>
            </div>
            <div className="text-xs text-bauto-piedra space-y-1 font-body">
              <p><strong>Lunes a Sábado:</strong> 10:00 AM – 8:00 PM</p>
              <p><strong>Domingos y Festivos:</strong> 11:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Correo */}
          <div className="bg-bauto-perla/80 rounded-card p-6 border border-bauto-carbon/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bauto-carbon/60 mb-2">
              <Mail className="w-4 h-4 text-bauto-terracota" />
              <span>Correo Oficial</span>
            </div>
            <a
              href="mailto:hola@bauto.com.co"
              className="text-xs font-mono font-medium text-bauto-carbon hover:text-bauto-terracota transition-colors"
            >
              hola@bauto.com.co
            </a>
          </div>

        </div>

        {/* Columna Derecha: Formulario de Mensaje */}
        <div className="md:col-span-7 bg-white rounded-card p-6 sm:p-8 border border-bauto-carbon/8 shadow-sm">
          
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bauto-perla text-[10px] uppercase tracking-wider font-semibold text-bauto-terracota mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Solicitud de Asesoría</span>
            </div>
            <h2 className="font-title font-bold text-xl text-bauto-carbon">
              Envíanos un Mensaje
            </h2>
            <p className="text-xs text-bauto-piedra font-body mt-1">
              Te conectaremos directamente con un asesor especializado en lino Resort Wear.
            </p>
          </div>

          {enviado ? (
            <div className="p-8 text-center bg-bauto-perla/60 rounded-card-sm border border-bauto-carbon/5 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-3" />
              <h3 className="font-title font-bold text-lg text-bauto-carbon mb-1">
                ¡Solicitud Redirigida con Éxito!
              </h3>
              <p className="text-xs text-bauto-piedra font-body max-w-sm mx-auto leading-relaxed mb-4">
                Hemos preparado tu mensaje directamente en el canal VIP de WhatsApp. Si no se abrió la ventana, puedes pulsar el botón inferior.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="btn-pill-primary px-6 py-2.5 text-xs"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-bauto-carbon mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bauto-carbon/15 bg-bauto-nube text-base sm:text-xs text-bauto-carbon placeholder:text-bauto-piedra/50 focus:outline-none focus:border-bauto-terracota"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-bauto-carbon mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bauto-carbon/15 bg-bauto-nube text-base sm:text-xs text-bauto-carbon placeholder:text-bauto-piedra/50 focus:outline-none focus:border-bauto-terracota"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-bauto-carbon mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bauto-carbon/15 bg-bauto-nube text-base sm:text-xs text-bauto-carbon placeholder:text-bauto-piedra/50 focus:outline-none focus:border-bauto-terracota"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-bauto-carbon mb-1.5">
                  Motivo de Consulta
                </label>
                <select
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bauto-carbon/15 bg-bauto-nube text-base sm:text-xs text-bauto-carbon focus:outline-none focus:border-bauto-terracota"
                >
                  <option value="asesoria">Asesoría de Talla y Estilo</option>
                  <option value="especial">Pedido Especial / Novios / Evento</option>
                  <option value="visita">Agendar Visita en Boutique Santa Marta</option>
                  <option value="estado">Estado de mi Compra en Línea</option>
                  <option value="otro">Otra Inquietud</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-bauto-carbon mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos sobre tu evento, la prenda que buscas o tus medidas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bauto-carbon/15 bg-bauto-nube text-base sm:text-xs text-bauto-carbon placeholder:text-bauto-piedra/50 focus:outline-none focus:border-bauto-terracota resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-pill-primary w-full py-3.5 text-xs tracking-wider inline-flex items-center justify-center gap-2 shadow-elevated"
                >
                  <Send className="w-4 h-4" />
                  <span>Conectar con Concierge VIP</span>
                </button>
                <p className="text-[10px] text-center text-bauto-piedra/70 mt-2">
                  Tus datos se tratan con estricta confidencialidad bajo nuestra política de privacidad.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
