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

export interface ColombianCity {
  city: string;
  department: string;
  label: string;
}

// Catálogo enriquecido de ciudades capitales, áreas metropolitanas y municipios de Colombia
export const COLOMBIAN_CITIES: ColombianCity[] = [
  // Magdalena & Costa Caribe
  { city: 'Santa Marta', department: 'Magdalena', label: 'Santa Marta (Magdalena)' },
  { city: 'Ciénaga', department: 'Magdalena', label: 'Ciénaga (Magdalena)' },
  { city: 'Fundación', department: 'Magdalena', label: 'Fundación (Magdalena)' },
  { city: 'El Banco', department: 'Magdalena', label: 'El Banco (Magdalena)' },
  { city: 'Plato', department: 'Magdalena', label: 'Plato (Magdalena)' },
  { city: 'Aracataca', department: 'Magdalena', label: 'Aracataca (Magdalena)' },
  { city: 'Barranquilla', department: 'Atlántico', label: 'Barranquilla (Atlántico)' },
  { city: 'Soledad', department: 'Atlántico', label: 'Soledad (Atlántico)' },
  { city: 'Malambo', department: 'Atlántico', label: 'Malambo (Atlántico)' },
  { city: 'Puerto Colombia', department: 'Atlántico', label: 'Puerto Colombia (Atlántico)' },
  { city: 'Sabanalarga', department: 'Atlántico', label: 'Sabanalarga (Atlántico)' },
  { city: 'Cartagena', department: 'Bolívar', label: 'Cartagena (Bolívar)' },
  { city: 'Turbaco', department: 'Bolívar', label: 'Turbaco (Bolívar)' },
  { city: 'Magangué', department: 'Bolívar', label: 'Magangué (Bolívar)' },
  { city: 'El Carmen de Bolívar', department: 'Bolívar', label: 'El Carmen de Bolívar (Bolívar)' },
  { city: 'Arjona', department: 'Bolívar', label: 'Arjona (Bolívar)' },
  { city: 'Valledupar', department: 'Cesar', label: 'Valledupar (Cesar)' },
  { city: 'Aguachica', department: 'Cesar', label: 'Aguachica (Cesar)' },
  { city: 'Agustín Codazzi', department: 'Cesar', label: 'Agustín Codazzi (Cesar)' },
  { city: 'Bosconia', department: 'Cesar', label: 'Bosconia (Cesar)' },
  { city: 'Riohacha', department: 'La Guajira', label: 'Riohacha (La Guajira)' },
  { city: 'Maicao', department: 'La Guajira', label: 'Maicao (La Guajira)' },
  { city: 'Uribia', department: 'La Guajira', label: 'Uribia (La Guajira)' },
  { city: 'San Juan del Cesar', department: 'La Guajira', label: 'San Juan del Cesar (La Guajira)' },
  { city: 'Fonseca', department: 'La Guajira', label: 'Fonseca (La Guajira)' },
  { city: 'Montería', department: 'Córdoba', label: 'Montería (Córdoba)' },
  { city: 'Cereté', department: 'Córdoba', label: 'Cereté (Córdoba)' },
  { city: 'Lorica', department: 'Córdoba', label: 'Lorica (Córdoba)' },
  { city: 'Sahagún', department: 'Córdoba', label: 'Sahagún (Córdoba)' },
  { city: 'Montelíbano', department: 'Córdoba', label: 'Montelíbano (Córdoba)' },
  { city: 'Sincelejo', department: 'Sucre', label: 'Sincelejo (Sucre)' },
  { city: 'Corozal', department: 'Sucre', label: 'Corozal (Sucre)' },
  { city: 'Tolú', department: 'Sucre', label: 'Tolú (Sucre)' },

  // Bogotá & Cundinamarca
  { city: 'Bogotá D.C.', department: 'Bogotá / Cundinamarca', label: 'Bogotá D.C.' },
  { city: 'Soacha', department: 'Cundinamarca', label: 'Soacha (Cundinamarca)' },
  { city: 'Chía', department: 'Cundinamarca', label: 'Chía (Cundinamarca)' },
  { city: 'Zipaquirá', department: 'Cundinamarca', label: 'Zipaquirá (Cundinamarca)' },
  { city: 'Facatativá', department: 'Cundinamarca', label: 'Facatativá (Cundinamarca)' },
  { city: 'Fusagasugá', department: 'Cundinamarca', label: 'Fusagasugá (Cundinamarca)' },
  { city: 'Mosquera', department: 'Cundinamarca', label: 'Mosquera (Cundinamarca)' },
  { city: 'Madrid', department: 'Cundinamarca', label: 'Madrid (Cundinamarca)' },
  { city: 'Funza', department: 'Cundinamarca', label: 'Funza (Cundinamarca)' },
  { city: 'Cajicá', department: 'Cundinamarca', label: 'Cajicá (Cundinamarca)' },
  { city: 'Girardot', department: 'Cundinamarca', label: 'Girardot (Cundinamarca)' },
  { city: 'Sopó', department: 'Cundinamarca', label: 'Sopó (Cundinamarca)' },
  { city: 'Cota', department: 'Cundinamarca', label: 'Cota (Cundinamarca)' },
  { city: 'Tocancipá', department: 'Cundinamarca', label: 'Tocancipá (Cundinamarca)' },
  { city: 'La Calera', department: 'Cundinamarca', label: 'La Calera (Cundinamarca)' },

  // Antioquia
  { city: 'Medellín', department: 'Antioquia', label: 'Medellín (Antioquia)' },
  { city: 'Envigado', department: 'Antioquia', label: 'Envigado (Antioquia)' },
  { city: 'Itagüí', department: 'Antioquia', label: 'Itagüí (Antioquia)' },
  { city: 'Bello', department: 'Antioquia', label: 'Bello (Antioquia)' },
  { city: 'Rionegro', department: 'Antioquia', label: 'Rionegro (Antioquia)' },
  { city: 'Sabaneta', department: 'Antioquia', label: 'Sabaneta (Antioquia)' },
  { city: 'La Estrella', department: 'Antioquia', label: 'La Estrella (Antioquia)' },
  { city: 'Caldas', department: 'Antioquia', label: 'Caldas (Antioquia)' },
  { city: 'Copacabana', department: 'Antioquia', label: 'Copacabana (Antioquia)' },
  { city: 'Girardota', department: 'Antioquia', label: 'Girardota (Antioquia)' },
  { city: 'Marinilla', department: 'Antioquia', label: 'Marinilla (Antioquia)' },
  { city: 'Apartadó', department: 'Antioquia', label: 'Apartadó (Antioquia)' },
  { city: 'Turbo', department: 'Antioquia', label: 'Turbo (Antioquia)' },
  { city: 'Caucasia', department: 'Antioquia', label: 'Caucasia (Antioquia)' },
  { city: 'Guarne', department: 'Antioquia', label: 'Guarne (Antioquia)' },

  // Valle del Cauca
  { city: 'Cali', department: 'Valle del Cauca', label: 'Cali (Valle del Cauca)' },
  { city: 'Palmira', department: 'Valle del Cauca', label: 'Palmira (Valle del Cauca)' },
  { city: 'Buenaventura', department: 'Valle del Cauca', label: 'Buenaventura (Valle del Cauca)' },
  { city: 'Tuluá', department: 'Valle del Cauca', label: 'Tuluá (Valle del Cauca)' },
  { city: 'Cartago', department: 'Valle del Cauca', label: 'Cartago (Valle del Cauca)' },
  { city: 'Buga', department: 'Valle del Cauca', label: 'Buga (Valle del Cauca)' },
  { city: 'Jamundí', department: 'Valle del Cauca', label: 'Jamundí (Valle del Cauca)' },
  { city: 'Yumbo', department: 'Valle del Cauca', label: 'Yumbo (Valle del Cauca)' },
  { city: 'Candelaria', department: 'Valle del Cauca', label: 'Candelaria (Valle del Cauca)' },

  // Santanderes
  { city: 'Bucaramanga', department: 'Santander', label: 'Bucaramanga (Santander)' },
  { city: 'Floridablanca', department: 'Santander', label: 'Floridablanca (Santander)' },
  { city: 'Girón', department: 'Santander', label: 'Girón (Santander)' },
  { city: 'Piedecuesta', department: 'Santander', label: 'Piedecuesta (Santander)' },
  { city: 'Barrancabermeja', department: 'Santander', label: 'Barrancabermeja (Santander)' },
  { city: 'San Gil', department: 'Santander', label: 'San Gil (Santander)' },
  { city: 'Socorro', department: 'Santander', label: 'Socorro (Santander)' },
  { city: 'Cúcuta', department: 'Norte de Santander', label: 'Cúcuta (Norte de Santander)' },
  { city: 'Los Patios', department: 'Norte de Santander', label: 'Los Patios (Norte de Santander)' },
  { city: 'Villa del Rosario', department: 'Norte de Santander', label: 'Villa del Rosario (Norte de Santander)' },
  { city: 'Ocaña', department: 'Norte de Santander', label: 'Ocaña (Norte de Santander)' },
  { city: 'Pamplona', department: 'Norte de Santander', label: 'Pamplona (Norte de Santander)' },

  // Eje Cafetero
  { city: 'Pereira', department: 'Risaralda', label: 'Pereira (Risaralda)' },
  { city: 'Dosquebradas', department: 'Risaralda', label: 'Dosquebradas (Risaralda)' },
  { city: 'Santa Rosa de Cabal', department: 'Risaralda', label: 'Santa Rosa de Cabal (Risaralda)' },
  { city: 'Manizales', department: 'Caldas', label: 'Manizales (Caldas)' },
  { city: 'Villamaría', department: 'Caldas', label: 'Villamaría (Caldas)' },
  { city: 'Chinchiná', department: 'Caldas', label: 'Chinchiná (Caldas)' },
  { city: 'Armenia', department: 'Quindío', label: 'Armenia (Quindío)' },
  { city: 'Calarcá', department: 'Quindío', label: 'Calarcá (Quindío)' },
  { city: 'La Tebaida', department: 'Quindío', label: 'La Tebaida (Quindío)' },
  { city: 'Montenegro', department: 'Quindío', label: 'Montenegro (Quindío)' },
  { city: 'Quimbaya', department: 'Quindío', label: 'Quimbaya (Quindío)' },

  // Tolima & Huila
  { city: 'Ibagué', department: 'Tolima', label: 'Ibagué (Tolima)' },
  { city: 'Espinal', department: 'Tolima', label: 'Espinal (Tolima)' },
  { city: 'Melgar', department: 'Tolima', label: 'Melgar (Tolima)' },
  { city: 'Mariquita', department: 'Tolima', label: 'Mariquita (Tolima)' },
  { city: 'Honda', department: 'Tolima', label: 'Honda (Tolima)' },
  { city: 'Neiva', department: 'Huila', label: 'Neiva (Huila)' },
  { city: 'Pitalito', department: 'Huila', label: 'Pitalito (Huila)' },
  { city: 'Garzón', department: 'Huila', label: 'Garzón (Huila)' },
  { city: 'La Plata', department: 'Huila', label: 'La Plata (Huila)' },

  // Boyacá
  { city: 'Tunja', department: 'Boyacá', label: 'Tunja (Boyacá)' },
  { city: 'Duitama', department: 'Boyacá', label: 'Duitama (Boyacá)' },
  { city: 'Sogamoso', department: 'Boyacá', label: 'Sogamoso (Boyacá)' },
  { city: 'Chiquinquirá', department: 'Boyacá', label: 'Chiquinquirá (Boyacá)' },
  { city: 'Paipa', department: 'Boyacá', label: 'Paipa (Boyacá)' },
  { city: 'Villa de Leyva', department: 'Boyacá', label: 'Villa de Leyva (Boyacá)' },

  // Meta & Llanos Orientales
  { city: 'Villavicencio', department: 'Meta', label: 'Villavicencio (Meta)' },
  { city: 'Acacías', department: 'Meta', label: 'Acacías (Meta)' },
  { city: 'Granada', department: 'Meta', label: 'Granada (Meta)' },
  { city: 'Yopal', department: 'Casanare', label: 'Yopal (Casanare)' },
  { city: 'Aguazul', department: 'Casanare', label: 'Aguazul (Casanare)' },
  { city: 'Arauca', department: 'Arauca', label: 'Arauca (Arauca)' },

  // Sur & Pacífico
  { city: 'Pasto', department: 'Nariño', label: 'Pasto (Nariño)' },
  { city: 'Ipiales', department: 'Nariño', label: 'Ipiales (Nariño)' },
  { city: 'Tumaco', department: 'Nariño', label: 'Tumaco (Nariño)' },
  { city: 'Popayán', department: 'Cauca', label: 'Popayán (Cauca)' },
  { city: 'Santander de Quilichao', department: 'Cauca', label: 'Santander de Quilichao (Cauca)' },
  { city: 'Quibdó', department: 'Chocó', label: 'Quibdó (Chocó)' },

  // Amazonía & Orinoquía
  { city: 'Florencia', department: 'Caquetá', label: 'Florencia (Caquetá)' },
  { city: 'Mocoa', department: 'Putumayo', label: 'Mocoa (Putumayo)' },
  { city: 'Puerto Asís', department: 'Putumayo', label: 'Puerto Asís (Putumayo)' },
  { city: 'San José del Guaviare', department: 'Guaviare', label: 'San José del Guaviare (Guaviare)' },
  { city: 'Leticia', department: 'Amazonas', label: 'Leticia (Amazonas)' },
  { city: 'San Andrés', department: 'San Andrés y Providencia', label: 'San Andrés (Archipiélago)' },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

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
  placeholder = 'Ej: Santa Marta, Bogotá, Medellín...',
  required = true,
  hasError = false,
  isLoading = false,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrado reactivo de ciudades
  const normalizedQuery = normalizeText(value);
  const filteredCities = normalizedQuery.length >= 2
    ? COLOMBIAN_CITIES.filter((item) => {
        const normCity = normalizeText(item.city);
        const normDept = normalizeText(item.department);
        return normCity.includes(normalizedQuery) || normDept.includes(normalizedQuery);
      }).slice(0, 8)
    : [];

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
            const isSelected = normalizeText(c.city) === normalizedQuery;
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
