'use client';

/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Módulo de ceremonia de obsequio con pliego de papel de algodón y caligrafía 'Lora' Italic
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado - Conexión íntegra con Zustand
 */

import React from 'react';
import { Gift } from 'lucide-react';
import { useCartStore } from '../../lib/cartStore';
import { playHapticClick } from '../../lib/sound';

 // @BAUTO_REFACTOR 2026-10-02
export function GiftCeremony() {
  const isGiftPackaging = useCartStore((state) => state.isGiftPackaging);
  const giftDedicationNote = useCartStore((state) => state.giftDedicationNote);
  const toggleGiftPackaging = useCartStore((state) => state.toggleGiftPackaging);
  const setGiftDedicationNote = useCartStore((state) => state.setGiftDedicationNote);

  const MAX_CHARS = 180;

  const handleToggle = () => {
    playHapticClick();
    toggleGiftPackaging(!isGiftPackaging);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setGiftDedicationNote(e.target.value);
    }
  };

  return (
    <div className="py-4 border-b border-[#EAE7DF]">
      {/* Selector de Empaque de Regalo */}
      <div className="flex items-center justify-between cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-3">
          <Gift className="w-4 h-4 text-bauto-carbon/70 stroke-[1.25]" />
          <div>
            <h4 className="text-[11px] font-light tracking-[0.15em] uppercase text-bauto-carbon">Presentación para obsequio</h4>
            <p className="text-[11px] text-bauto-piedra">Caja rígida artesanal y tarjeta caligráfica BAUTO</p>
          </div>
        </div>

        {/* Switch Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={isGiftPackaging}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer  border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isGiftPackaging ? 'bg-bauto-carbon' : 'bg-[#EAE7DF]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform  bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isGiftPackaging ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Dedicatoria Personalizada Desplegable */}
      {isGiftPackaging && (
        <div className="mt-3.5 pt-3 border-t border-[#EAE7DF] flex flex-col gap-2.5 animate-slide-up">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="dedication" className="text-[11px] font-light tracking-[0.15em] uppercase text-bauto-carbon">
              Dedicatoria de puño y letra:
            </label>
            <span className="text-[10px] text-bauto-piedra">
              {giftDedicationNote.length}/{MAX_CHARS}
            </span>
          </div>

          <textarea
            id="dedication"
            value={giftDedicationNote}
            onChange={handleNoteChange}
            placeholder="Escribe el mensaje para quien recibe las prendas..."
            rows={2}
            maxLength={MAX_CHARS}
            className="w-full text-xs p-3 bg-transparent border-b border-[#EAE7DF] focus:border-bauto-carbon focus:outline-none transition-colors resize-none text-bauto-carbon placeholder:text-bauto-piedra/50 rounded-none"
          />

          {/* Tarjeta de Previsualización en Papel de Algodón y 'Lora' Italic */}
          {giftDedicationNote.trim() && (
            <div className="p-4 bg-transparent border-l border-[#EAE7DF] mt-1">
              <span className="text-[10px] tracking-widest uppercase text-bauto-piedra block mb-1">
                Tarjeta BAUTO
              </span>
              <p className="text-xs font-light tracking-[0.03em] text-bauto-carbon leading-relaxed">
                "{giftDedicationNote}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
