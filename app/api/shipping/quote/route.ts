import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { resolveDaneCode as resolveOfficialDane } from "../../../../lib/colombiaData";

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Endpoint de cotización dinámica en tiempo real de SERVIENTREGA.
 * Resuelve DANE y consulta API de MiPaquete, o calcula con reglas estáticas basadas en trayecto DANE.
 */

const DANE_CODES: Record<string, string> = {
  "SANTA MARTA": "47001000",
  "BARRANQUILLA": "08001000",
  "CARTAGENA": "13001000",
  "VALLEDUPAR": "20001000",
  "BOGOTA": "11001000",
  "MEDELLIN": "05001000",
  "CALI": "76001000",
  "BUCARAMANGA": "68001000",
  "PEREIRA": "66001000",
  "MANIZALES": "17001000",
  "ARMENIA": "63001000",
  "CUCUTA": "54001000",
  "PASTO": "52001000",
  "NEIVA": "41001000",
  "VILLAVICENCIO": "50001000",
  "MONTERIA": "23001000",
  "SINCELEJO": "70001000",
  "RIOHACHA": "44001000",
  "POPAYAN": "19001000",
  "TUNJA": "15001000",
  "IBAGUE": "73001000",
  "SOLEDAD": "08758000",
  "BELLO": "05088000",
  "SOACHA": "25754000",
  "ENVIGADO": "05266000",
  "ITAGUI": "05360000",
  "FLORIDABLANCA": "68276000",
  "GIRARDOT": "25307000",
};

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Normaliza el string de ciudad removiendo tildes, mayúsculas y espacios extra
 */
function normalizeCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Resuelve el código DANE de una ciudad consultando primero el directorio nacional de 1.122 municipios.
 */
function resolveDaneCode(normalizedCity: string): string {
  const official = resolveOfficialDane(normalizedCity);
  if (official && official !== "00000000" && official !== "11001000") {
    return official;
  }
  if (DANE_CODES[normalizedCity]) {
    return DANE_CODES[normalizedCity];
  }
  for (const [key, code] of Object.entries(DANE_CODES)) {
    if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
      return code;
    }
  }
  return official || "11001000";
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Calcula tarifa estática basada en el código DANE
 */
function calculateStaticRate(daneCode: string): { cost: number, deliveryDays: string } {
  // Santa Marta local
  if (daneCode === "47001000") {
    return { cost: 9500, deliveryDays: "1 día hábil" };
  }

  const prefix = daneCode.substring(0, 2);

  // Costa Caribe cercana (Atlántico - 08, Cesar - 20, Bolívar - 13, Magdalena municipios - 47, Sucre - 70, Cordoba - 23, Guajira - 44)
  const costaPrefixes = ["08", "20", "13", "47", "70", "23", "44"];
  if (costaPrefixes.includes(prefix)) {
    return { cost: 16500, deliveryDays: "1 a 2 días hábiles" };
  }

  // Nacional Centro / Andina / Eje Cafetero
  const centroPrefixes = ["11", "25", "05", "68", "54", "76", "17", "66", "63", "73", "41", "15"];
  if (centroPrefixes.includes(prefix)) {
    return { cost: 26850, deliveryDays: "2 a 3 días hábiles" };
  }

  // Nacional Periférico / Trayectos lejanos (por defecto o si no se encontró en diccionario, asumimos lo más lejano/costoso)
  return { cost: 32000, deliveryDays: "3 a 5 días hábiles" };
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Da formato de moneda colombiana
 */
function formatCurrencyCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " COP";
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * Lógica principal de cotización
 */
async function handleQuote(req: NextRequest) {
  try {
    let city: string | null = null;
    let subtotal: number | undefined;
    let itemsCount: number | undefined;

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      city = body.city;
      subtotal = body.subtotal;
      itemsCount = body.itemsCount;
    } else if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      city = searchParams.get("city");
      const subtotalParam = searchParams.get("subtotal");
      const itemsCountParam = searchParams.get("itemsCount");
      if (subtotalParam) subtotal = Number(subtotalParam);
      if (itemsCountParam) itemsCount = Number(itemsCountParam);
    }

    if (!city) {
      return NextResponse.json({ error: "Debes especificar la ciudad de destino." }, { status: 400 });
    }

    const normalizedCity = normalizeCity(city);
    const daneCode = resolveDaneCode(normalizedCity);
    
    let cost: number | null = null;
    let deliveryDays: string | null = null;

    if (process.env.MIPAQUETE_API_KEY) {
      try {
        const height = Math.max(3, (itemsCount || 1) * 3);
        const declaredValue = subtotal || 120000;
        
        const response = await fetch("https://api-v2.mpr.mipaquete.com/quoteShipping", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.MIPAQUETE_API_KEY,
            "session-tracker": crypto.randomUUID(),
          },
          body: JSON.stringify({
            originCountryCode: "170",
            originLocationCode: "47001000", // Santa Marta
            destinyCountryCode: "170",
            destinyLocationCode: daneCode,
            quantity: 1,
            width: 20,
            length: 30,
            height: height,
            weight: 1,
            declaredValue: declaredValue,
          })
        });

        if (response.ok) {
          const data = await response.json();
          const quotesList = Array.isArray(data) ? data : (data.quotes || data.data || []);
          if (Array.isArray(quotesList) && quotesList.length > 0) {
             const servientregaQuote = quotesList.find((q: any) => {
               const name = (q.deliveryCompanyName || q.carrier?.name || q.name || q.transportadora || "").toLowerCase();
               return name.includes("servientrega");
             });
             if (servientregaQuote) {
               cost = servientregaQuote.shippingCost || servientregaQuote.totalPrice || servientregaQuote.price;
               const timeMins = servientregaQuote.shippingTime || 2880;
               const days = Math.ceil(timeMins / 1440);
               deliveryDays = `${days} ${days === 1 ? 'día hábil' : 'días hábiles'}`;
             }
          }
        }
      } catch (err) {
        console.error("Error al consultar MiPaquete", err);
      }
    }

    // Fallback if MiPaquete didn't work or no key
    if (cost === null || deliveryDays === null) {
      const staticRate = calculateStaticRate(daneCode);
      cost = staticRate.cost;
      deliveryDays = staticRate.deliveryDays;
    }

    return NextResponse.json({
      success: true,
      carrier: "Servientrega",
      cost,
      costFormatted: formatCurrencyCOP(cost),
      deliveryDays,
      city: city, // Original
      daneCode,
      origin: "Santa Marta"
    });

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * GET handler
 */
export async function GET(req: NextRequest) {
  return handleQuote(req);
}

/**
 * @BAUTO_REFACTOR 2026-10-02
 * POST handler
 */
export async function POST(req: NextRequest) {
  return handleQuote(req);
}
