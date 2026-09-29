'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Modal con tabla de medidas en centímetros para sastrería BAUTO Resort Wear
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Modal puramente informativo
 */

import React from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';
import { playHapticClick } from '../../lib/sound';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria?: string;
}

export function SizeGuideModal({ isOpen, onClose, categoria = 'Prendas Superiores' }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const measurements = [
    { talla: 'XS', pecho: '92 - 96', cintura: '74 - 78', cadera: '90 - 94', largo: '70' },
    { talla: 'S', pecho: '96 - 100', cintura: '78 - 82', cadera: '94 - 98', largo: '72' },
    { talla: 'M', pecho: '100 - 104', cintura: '82 - 86', cadera: '98 - 102', largo: '74' },
    { talla: 'L', pecho: '104 - 108', cintura: '86 - 90', cadera: '102 - 106', largo: '76' },
    { talla: 'XL', pecho: '108 - 114', cintura: '90 - 96', cadera: '106 - 112', largo: '78' },
    { talla: 'XXL', pecho: '114 - 120', cintura: '96 - 102', cadera: '112 - 118', largo: '80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con Desenfoque */}
      <div
        className="fixed inset-0 bg-bauto-carbon/40 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          playHapticClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        className="relative z-10 w-full max-w-lg bg-bauto-nube rounded-card p-6 sm:p-8 shadow-elevated border border-bauto-carbon/10 animate-slide-up max-h-[90dvh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Guía de Medidas BAUTO"
      >
        <div className="flex items-center justify-between pb-4 border-b border-bauto-carbon/10 mb-5">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-bauto-terracota" />
            <h3 className="font-title font-bold text-base sm:text-lg text-bauto-carbon">
              Guía de Medidas en Centímetros
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playHapticClick();
              onClose();
            }}
            className="w-11 h-11 flex items-center justify-center -mr-2 rounded-full text-bauto-piedra hover:text-bauto-carbon hover:bg-bauto-perla transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabla de Medidas */}
        <div className="overflow-x-auto rounded-card-sm border border-bauto-carbon/10 bg-bauto-perla/60 mb-5">
          <table className="w-full text-xs text-left">
            <thead className="bg-bauto-perla text-[10px] uppercase font-semibold text-bauto-carbon border-b border-bauto-carbon/10">
              <tr>
                <th className="px-3.5 py-3 font-mono">Talla</th>
                <th className="px-3 py-3">Pecho</th>
                <th className="px-3 py-3">Cintura</th>
                <th className="px-3 py-3">Cadera</th>
                <th className="px-3 py-3">Largo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bauto-carbon/5 font-mono text-bauto-carbon">
              {measurements.map((m) => (
                <tr key={m.talla} className="hover:bg-bauto-nube/80 transition-colors">
                  <td className="px-3.5 py-2.5 font-bold text-bauto-terracota">{m.talla}</td>
                  <td className="px-3 py-2.5">{m.pecho} cm</td>
                  <td className="px-3 py-2.5">{m.cintura} cm</td>
                  <td className="px-3 py-2.5">{m.cadera} cm</td>
                  <td className="px-3 py-2.5">{m.largo} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nota Editorial de Calce */}
        <div className="p-4 rounded-card-sm bg-[#FAF6F0] border border-[#E8DEC8] flex items-start gap-2.5 text-xs text-bauto-carbon">
          <Sparkles className="w-4 h-4 text-bauto-terracota shrink-0 mt-0.5" />
          <p className="font-editorial italic leading-relaxed text-[11px] text-bauto-piedra">
            Nuestras siluetas están concebidas para el movimiento libre y la brisa del Caribe. 
            El corte es naturalmente holgado (Relaxed Fit). Si buscas una silueta más clásica, 
            te sugerimos elegir una talla menor.
          </p>
        </div>
      </div>
    </div>
  );
}
