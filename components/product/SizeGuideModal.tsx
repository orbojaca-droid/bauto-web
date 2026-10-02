'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 3: Escaparate Comercial
 * @Propósito: Modal con tabla de medidas en centímetros para sastrería BAUTO Resort Wear
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Modal puramente informativo
 */

import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { playHapticClick } from '../../lib/sound';

interface SizeGuideModalProps {
 isOpen: boolean;
 onClose: () => void;
 categoria?: string;
}

export function SizeGuideModal({ isOpen, onClose, categoria = 'Prendas Superiores' }: SizeGuideModalProps) {
 const measurements = [
 { talla: 'XS', pecho: '92 - 96', cintura: '74 - 78', cadera: '90 - 94', largo: '70' },
 { talla: 'S', pecho: '96 - 100', cintura: '78 - 82', cadera: '94 - 98', largo: '72' },
 { talla: 'M', pecho: '100 - 104', cintura: '82 - 86', cadera: '98 - 102', largo: '74' },
 { talla: 'L', pecho: '104 - 108', cintura: '86 - 90', cadera: '102 - 106', largo: '76' },
 { talla: 'XL', pecho: '108 - 114', cintura: '90 - 96', cadera: '106 - 112', largo: '78' },
 { talla: 'XXL', pecho: '114 - 120', cintura: '96 - 102', cadera: '112 - 118', largo: '80' },
 ];

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Backdrop con Desenfoque */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 bg-bauto-carbon/40 backdrop-blur-sm"
 onClick={() => {
 playHapticClick();
 onClose();
 }}
 aria-hidden="true"
 />

 {/* Modal Box */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
 className="relative z-10 w-full max-w-lg bg-bauto-nube p-6 sm:p-8 max-h-[90dvh] overflow-y-auto"
 role="dialog"
 aria-modal="true"
 aria-label="Guía de medidas BAUTO"
 >
 <div className="flex items-center justify-between pb-4 mb-5">
 <h3 className="font-light text-lg sm:text-xl text-bauto-carbon">
 Guía de medidas (cm)
 </h3>

 <button
 type="button"
 onClick={() => {
 playHapticClick();
 onClose();
 }}
 className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-bauto-piedra hover:text-bauto-carbon transition-colors"
 aria-label="Cerrar modal"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Tabla de Medidas */}
 <div className="overflow-x-auto mb-5">
 <table className="w-full text-xs text-left">
 <thead className="bg-bauto-perla/80 text-[10px] uppercase font-medium text-bauto-piedra ">
 <tr>
 <th className="px-3.5 py-3 font-normal">Talla</th>
 <th className="px-3 py-3 font-normal">Pecho</th>
 <th className="px-3 py-3 font-normal">Cintura</th>
 <th className="px-3 py-3 font-normal">Cadera</th>
 <th className="px-3 py-3 font-normal">Largo</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#EAE7DF] text-bauto-carbon">
 {measurements.map((m) => (
 <tr key={m.talla} className="hover:bg-bauto-perla/30 transition-colors">
 <td className="px-3.5 py-2.5 font-medium text-bauto-carbon">{m.talla}</td>
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
 <div className="pt-4 text-xs">
 <p className="italic leading-relaxed text-[11px] text-bauto-piedra">
 Nuestras siluetas están concebidas para el movimiento libre y la brisa del Caribe. 
 El corte es holgado y relajado (Relaxed Fit). Para una silueta más entallada, te sugerimos seleccionar una talla menor.
 </p>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
