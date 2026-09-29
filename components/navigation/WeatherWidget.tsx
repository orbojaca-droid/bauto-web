'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Widget en vivo del clima y brisa de Santa Marta para el Navbar
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Bajo - Consumo pasivo de API interna con fallback
 */

import React, { useEffect, useState } from 'react';
import { Sun, CloudSun, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  apparentTemperature: number;
  windSpeedKmh: number;
  condition: string;
  phrase: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setWeather(data);
        }
      } catch {
        // Fallback silencioso
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-pill bg-bauto-perla/60 text-[11px] text-bauto-piedra animate-pulse">
        <Sun className="w-3.5 h-3.5 text-bauto-trigo animate-spin" style={{ animationDuration: '8s' }} />
        <span>Santa Marta...</span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-pill bg-bauto-perla/60 text-[11px] text-bauto-piedra">
        <Wind className="w-3.5 h-3.5 text-bauto-oceano" />
        <span>Santa Marta • 29°C</span>
      </div>
    );
  }

  return (
    <div 
      className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-pill bg-bauto-perla/70 hover:bg-bauto-perla border border-bauto-carbon/5 transition-colors cursor-default"
      title={`${weather.phrase} (Sensación: ${weather.apparentTemperature}°C, Viento: ${weather.windSpeedKmh} km/h)`}
    >
      <span className="flex items-center gap-1 text-[11px] text-bauto-carbon font-medium">
        {weather.temperature > 28 ? (
          <Sun className="w-3.5 h-3.5 text-bauto-trigo" />
        ) : (
          <CloudSun className="w-3.5 h-3.5 text-bauto-oceano" />
        )}
        <span>Santa Marta</span>
        <span className="font-mono font-semibold text-bauto-terracota">
          {Math.round(weather.temperature)}°C
        </span>
      </span>
      <span className="text-bauto-piedra/30">•</span>
      <span className="text-[11px] text-bauto-piedra font-normal truncate max-w-[130px]">
        {weather.condition}
      </span>
    </div>
  );
}
