/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Autocompletado de Direcciones (Google Places API)
 * @Ruta: GET /api/places/autocomplete?input=...
 * @Propósito: Autocompletado predictivo de direcciones en el carrito restringido a Colombia (country:co)
 *             para evitar errores de entrega en guías de despacho.
 *             Mantiene la API Key de Google Maps protegida en el servidor.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const input = (searchParams.get("input") || searchParams.get("q") || "").trim();
    const city = (searchParams.get("city") || "").trim();

    if (!input || input.length < 2) {
      return NextResponse.json({
        success: true,
        predictions: [],
      });
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      "AIzaSyB50OdLvtAbWn4iWfo9I6mQBw3oCA0EUL0";

    // Enriquecer la búsqueda hacia Google Places API (New) con la ciudad seleccionada
    const searchInput = city ? `${input}, ${city}` : input;

    // Consulta oficial a Google Places API (New)
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: searchInput,
        includedRegionCodes: ["co"],
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Google Places API New] Status ${res.status}:`, errText);
      return NextResponse.json({
        success: true,
        predictions: [],
      });
    }

    const data = await res.json();

    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const normCity = city ? normalize(city) : "";

    const rawPredictions = (data.suggestions || [])
      .filter((s: any) => s.placePrediction)
      .map((s: any) => {
        const p = s.placePrediction;
        return {
          placeId: p.placeId,
          description: p.text?.text || "",
          mainText: p.structuredFormat?.mainText?.text || p.text?.text || "",
          secondaryText: p.structuredFormat?.secondaryText?.text || "",
        };
      });

    // Si viene ciudad, filtrar sugerencias que contengan la ciudad elegida en descripción o texto secundario
    const filtered = normCity
      ? rawPredictions.filter(
          (p: any) =>
            normalize(p.description).includes(normCity) ||
            normalize(p.secondaryText).includes(normCity)
        )
      : rawPredictions;

    const finalPredictions = filtered.length > 0 ? filtered : rawPredictions;

    return NextResponse.json({
      success: true,
      predictions: finalPredictions,
    });
  } catch (error: any) {
    console.error("Error en /api/places/autocomplete:", error);
    return NextResponse.json({
      success: true,
      predictions: [],
    });
  }
}

