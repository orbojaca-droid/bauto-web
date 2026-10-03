'use client';

/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Carrito / Checkout
 * @Propósito: Selector predictivo de ciudades y municipios de Colombia con autocompletado en tiempo real.
 *             Cubre los 32 departamentos y principales municipios para cotización instantánea con Servientrega.
 * @Capa: Capa 2 (Lógica Funcional) + Capa 3 (Estética Quiet Luxury)
 * @Riesgo_Evaluado: Bajo - Entrada de datos normalizada con fallback a texto libre
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, ChevronDown, Check } from 'lucide-react';

import { Municipality, searchMunicipalities } from '../../lib/colombiaData';

export type ColombianCity = Municipality;

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
  onSelectCity?: (city: string) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  isLoading?: boolean;
}

export function CityAutocomplete({
  value,
  onChange,
  onSelectCity,
  placeholder = 'Ej: Santa Marta, Bogotá, Medellín, Mompox...',
  required = true,
  hasError = false,
  isLoading = false,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrado predictivo instantáneo sobre los 1.122 municipios oficiales de Colombia (DANE)
  const filteredCities = searchMunicipalities(value, 8);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cityObj: ColombianCity) => {
    onChange(cityObj.city);
    if (onSelectCity) {
      onSelectCity(cityObj.city);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="absolute left-0 w-3.5 h-3.5 text-bauto-carbon/40 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (filteredCities.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className={`font-light tracking-[0.03em] w-full text-xs pl-6 pr-8 py-2.5 bg-transparent border-b ${
            hasError ? 'border-bauto-danger' : 'border-[#EAE7DF]'
          } focus:border-bauto-carbon focus:outline-none transition-colors text-bauto-carbon placeholder:text-bauto-piedra/50 rounded-none`}
        />
        {isLoading ? (
          <Loader2 className="absolute right-0 w-3.5 h-3.5 text-bauto-piedra animate-spin" />
        ) : (
          <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-bauto-carbon/30 pointer-events-none" />
        )}
      </div>

      {/* Menú Flotante de Coincidencias */}
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#FAF9F6] border border-[#EAE7DF] shadow-lg max-h-56 overflow-y-auto">
          {filteredCities.map((c) => {
            const isSelected = c.city.toLowerCase().trim() === value.toLowerCase().trim();
            return (
              <button
                key={`${c.city}-${c.department}`}
                type="button"
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-[#EAE7DF]/60 last:border-none transition-colors hover:bg-[#EAE7DF]/40 ${
                  isSelected ? 'bg-bauto-carbon/5' : ''
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-normal text-bauto-carbon truncate">
                    {c.city}
                  </span>
                  <span className="text-[10px] text-bauto-piedra/80 truncate">
                    {c.department}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-bauto-terracota shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
