'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless) - Bloque 2: Carrito
 * @Propósito: Campo predictivo de dirección con Google Places restringido a Colombia
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Componente de entrada con debounce y fallback manual
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface Prediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelectCity?: (city: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelectCity,
  placeholder = 'Ej: Carrera 1 # 18-22, Santa Marta',
  required = true,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced fetch a /api/places/autocomplete
  useEffect(() => {
    if (!query || query.length < 3) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.predictions)) {
            setPredictions(data.predictions);
            setShowDropdown(data.predictions.length > 0);
          }
        }
      } catch {
        // Fallback silencioso a entrada manual
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Cierra el menú al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPrediction = (p: Prediction) => {
    setQuery(p.description);
    onChange(p.description);
    if (onSelectCity && p.secondaryText) {
      const cityPart = p.secondaryText.split(',')[0]?.trim();
      if (cityPart) onSelectCity(cityPart);
    }
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3.5 w-4 h-4 text-bauto-piedra pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (predictions.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full text-sm pl-10 pr-9 py-3 rounded-card-sm bg-bauto-perla/80 border border-bauto-carbon/10 focus:border-bauto-terracota focus:outline-none transition-colors text-bauto-carbon placeholder:text-bauto-piedra/60 font-body"
        />
        {loading && (
          <Loader2 className="absolute right-3.5 w-4 h-4 text-bauto-terracota animate-spin" />
        )}
      </div>

      {/* Sugerencias Desplegables */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-bauto-nube border border-bauto-carbon/10 rounded-card-sm shadow-elevated overflow-hidden max-h-56 overflow-y-auto">
          {predictions.map((p) => (
            <button
              key={p.placeId}
              type="button"
              onClick={() => handleSelectPrediction(p)}
              className="w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-bauto-perla border-b border-bauto-carbon/5 last:border-none transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-bauto-terracota shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-bauto-carbon block truncate">
                  {p.mainText || p.description}
                </span>
                {p.secondaryText && (
                  <span className="text-[10px] text-bauto-piedra block truncate">
                    {p.secondaryText}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
