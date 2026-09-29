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

    if (!input || input.length < 2) {
      return NextResponse.json({
        success: true,
        predictions: [],
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    // 1. Simulación para desarrollo local o si la llave no está configurada aún
    if (!apiKey) {
      const lower = input.toLowerCase();
      const mockAddresses = [
        "Calle 20 # 2-36, Centro Histórico, Santa Marta, Magdalena",
        "Carrera 1 # 22-10, El Rodadero, Santa Marta, Magdalena",
        "Calle 85 # 11-53, El Retiro, Bogotá, D.C.",
        "Carrera 43A # 1-50, El Poblado, Medellín, Antioquia",
        "Carrera 53 # 79-128, Alto Prado, Barranquilla, Atlántico",
        "Avenida San Martín # 6-45, Bocagrande, Cartagena, Bolívar",
        "Avenida 6 Norte # 24N-02, Granada, Cali, Valle del Cauca",
      ];

      const filtered = mockAddresses
        .filter((addr) => addr.toLowerCase().includes(lower) || lower.length >= 3)
        .slice(0, 5)
        .map((addr, index) => ({
          placeId: `mock_place_${index + 1}`,
          description: addr,
          mainText: addr.split(",")[0],
          secondaryText: addr.split(",").slice(1).join(",").trim(),
        }));

      return NextResponse.json({
        success: true,
        predictions: filtered.length > 0 ? filtered : [
          {
            placeId: "mock_place_custom",
            description: `${input}, Santa Marta, Magdalena, Colombia`,
            mainText: input,
            secondaryText: "Santa Marta, Magdalena, Colombia",
          }
        ],
        simulated: true,
      });
    }

    // 2. Consulta oficial a Google Places Autocomplete API
    const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&components=country:co&types=address&language=es&key=${apiKey}`;

    const res = await fetch(googleUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Google Places API respondió con status ${res.status}`);
    }

    const data = await res.json();

    const predictions = (data.predictions || []).map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting?.main_text || p.description,
      secondaryText: p.structured_formatting?.secondary_text || "",
    }));

    return NextResponse.json({
      success: true,
      predictions,
    });
  } catch (error: any) {
    console.error("Error en /api/places/autocomplete:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_PLACES_API", message: error.message },
      { status: 500 }
    );
  }
}
