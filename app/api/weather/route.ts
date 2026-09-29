/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Clima de Santa Marta en Vivo (Costo $0)
 * @Ruta: GET /api/weather
 * @Propósito: Alimenta el banner superior y el pie de página de la web con la temperatura
 *             y condiciones en vivo de la bahía de Santa Marta (lat: 11.2408, lon: -74.1990).
 *             Caché de borde de 1 hora (revalidate: 3600) para máxima velocidad y 0 costo.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hora de caché en Vercel Edge CDN

function interpretWeatherCode(code: number, isDay: number): { condition: string; phrase: string } {
  if (code === 0) {
    return isDay
      ? { condition: "Sol radiante", phrase: "Cielo despejado y brisa de mar" }
      : { condition: "Noche estrellada", phrase: "Brisa marina y calma total" };
  }
  if (code === 1 || code === 2) {
    return { condition: "Parcialmente nublado", phrase: "Brisa fresca del trópico" };
  }
  if (code === 3) {
    return { condition: "Nublado", phrase: "Sombra templada en la bahía" };
  }
  if (code >= 51 && code <= 67) {
    return { condition: "Llovizna tropical", phrase: "Lluvia cálida y pasajera" };
  }
  if (code >= 80 && code <= 82) {
    return { condition: "Chubascos", phrase: "Chaparrón caribeño refrescante" };
  }
  return { condition: "Brisa caribeña", phrase: "Temperatura agradable" };
}

export async function GET() {
  const LAT = 11.2408;
  const LON = -74.199;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=America%2FBogota`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo respondió con status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};

    const temp = Math.round(current.temperature_2m ?? 30);
    const apparent = Math.round(current.apparent_temperature ?? 33);
    const humidity = current.relative_humidity_2m ?? 70;
    const windSpeed = Math.round(current.wind_speed_10m ?? 12);
    const isDay = current.is_day ?? 1;
    const code = current.weather_code ?? 0;

    const { condition, phrase } = interpretWeatherCode(code, isDay);
    const caption = `Santa Marta · ${temp}°C · ${condition}`;

    return NextResponse.json(
      {
        success: true,
        location: "Santa Marta, Caribe Colombiano",
        temperature: temp,
        apparentTemperature: apparent,
        humidity,
        windSpeedKmh: windSpeed,
        condition,
        phrase,
        caption,
        coordinates: { lat: LAT, lon: LON },
        updatedAt: current.time || new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error: any) {
    console.warn("Fallo consultando Open-Meteo, entregando fallback tropical:", error.message);
    return NextResponse.json({
      success: true,
      location: "Santa Marta, Caribe Colombiano",
      temperature: 30,
      apparentTemperature: 33,
      humidity: 72,
      windSpeedKmh: 14,
      condition: "Sol y brisa",
      phrase: "Calma y frescura en la bahía",
      caption: "Santa Marta · 30°C · Brisa del Caribe",
      fallback: true,
    });
  }
}
