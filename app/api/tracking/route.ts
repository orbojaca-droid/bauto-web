/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Proxy de Rastreo MiPaquete V2 con Storytelling Caribeño
 * @Ruta: GET /api/tracking?guia=...
 * @Propósito: Consulta el estado logístico oficial en MiPaquete V2 y traduce los estados
 *             técnicos en hitos editoriales de marca para el Portal de Rastreo (/rastreo).
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { MIPAPE_BASE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface TrackingMilestone {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  current?: boolean;
}

/**
 * Traduce el código de estado técnico de MiPaquete a la narrativa caribeña de BAUTO
 */
function mapMiPaqueteStatus(rawState: string = ""): {
  estado: string;
  estadoLegible: string;
  mensajeEditorial: string;
  milestones: TrackingMilestone[];
} {
  const s = rawState.trim().toUpperCase();

  let activeIndex = 0;
  let estado = "ALISTAMIENTO";
  let estadoLegible = "Alistamiento en Taller";
  let mensajeEditorial =
    "Tus prendas están siendo dobladas, empacadas y perfumadas con aroma caribeño en nuestro taller en Santa Marta.";

  if (s.includes("DELIVERED") || s.includes("ENTREGADO")) {
    activeIndex = 3;
    estado = "ENTREGADO";
    estadoLegible = "Entregado con Éxito";
    mensajeEditorial =
      "Disfruta la calma y el confort del trópico. Tu pedido ha sido entregado a satisfacción.";
  } else if (
    s.includes("OUT_FOR_DELIVERY") ||
    s.includes("REPARTO") ||
    s.includes("DISTRIBUCION")
  ) {
    activeIndex = 2;
    estado = "EN_REPARTO";
    estadoLegible = "Última Milla Caribeña";
    mensajeEditorial =
      "Tu paquete se encuentra en el vehículo de reparto y será entregado en el transcurso del día.";
  } else if (
    s.includes("TRANSIT") ||
    s.includes("CAMINO") ||
    s.includes("PICKED_UP") ||
    s.includes("RECOGIDO") ||
    s.includes("EN RUTA")
  ) {
    activeIndex = 1;
    estado = "EN_CAMINO";
    estadoLegible = "Brisa en Popa (En Tránsito)";
    mensajeEditorial =
      "Tu envío viaja con destino hacia tu ciudad. Pronto sentirás la frescura de nuestras texturas.";
  }

  const milestones: TrackingMilestone[] = [
    {
      id: "alistamiento",
      title: "Taller Santa Marta",
      subtitle: "Prendas preparadas con esmero",
      completed: activeIndex >= 0,
      current: activeIndex === 0,
    },
    {
      id: "en_camino",
      title: "Brisa en Popa",
      subtitle: "En ruta nacional hacia tu destino",
      completed: activeIndex >= 1,
      current: activeIndex === 1,
    },
    {
      id: "en_reparto",
      title: "Última Milla",
      subtitle: "En móvil de distribución local",
      completed: activeIndex >= 2,
      current: activeIndex === 2,
    },
    {
      id: "entregado",
      title: "Entrega Exitosa",
      subtitle: "Calma y confort asegurados",
      completed: activeIndex >= 3,
      current: activeIndex === 3,
    },
  ];

  return { estado, estadoLegible, mensajeEditorial, milestones };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const numeroGuia = (searchParams.get("guia") || searchParams.get("guide") || "").trim();

    if (!numeroGuia) {
      return NextResponse.json(
        {
          success: false,
          error: "Falta el parámetro 'guia' en la consulta.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.MIPAQUETE_API_KEY;

    // 1. Rama de respuesta de Servientrega si no hay API Key en entorno local/pruebas
    if (!apiKey) {
      const simulated = mapMiPaqueteStatus("IN_TRANSIT");
      return NextResponse.json({
        success: true,
        guia: numeroGuia,
        transportadora: "Servientrega",
        origen: "Santa Marta, Magdalena",
        estado: simulated.estado,
        estadoLegible: simulated.estadoLegible,
        mensajeEditorial: simulated.mensajeEditorial,
        milestones: simulated.milestones,
        fechaEstimada: "1 a 3 días hábiles",
        simulado: true,
      });
    }

    // 2. Consulta oficial a MiPaquete API V2
    const url = `${MIPAPE_BASE_URL}/getSendings/1`;
    const payload: Record<string, any> = { pageSize: 10 };

    if (/^\d+$/.test(numeroGuia)) {
      payload.mpCode = parseInt(numeroGuia, 10);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: apiKey,
        "session-tracker": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      next: { revalidate: 300 }, // Caché de 5 minutos para optimizar cuota
    });

    if (!response.ok) {
      console.error("[TRACKING] Error en MiPaquete V2:", response.status, await response.text());
      return NextResponse.json(
        {
          success: false,
          error: "No fue posible conectar con el operador logístico en este momento.",
        },
        { status: 502 }
      );
    }

    const json = await response.json();
    const sendingsList = json.sendings || (Array.isArray(json) ? json : json.data || []);

    if (Array.isArray(sendingsList) && sendingsList.length > 0) {
      const match = sendingsList.find(
        (s: any) =>
          String(s.guideNumber || "").trim().toUpperCase() === numeroGuia.toUpperCase() ||
          String(s.mpCode || "") === numeroGuia
      );

      if (match) {
        const rawState = match.state || match.status || "IN_TRANSIT";
        const narrative = mapMiPaqueteStatus(rawState);

        return NextResponse.json({
          success: true,
          guia: match.guideNumber || numeroGuia,
          mpCode: match.mpCode,
          transportadora: match.deliveryCompanyName || "Operador Logístico",
          origen: "Santa Marta, Magdalena",
          destino: match.destinationCity || "",
          estado: narrative.estado,
          estadoLegible: narrative.estadoLegible,
          mensajeEditorial: narrative.mensajeEditorial,
          milestones: narrative.milestones,
          labelUrl: match.labelUrl || null,
        });
      }
    }

    // Si la guía no se encuentra aún en MiPaquete
    const fallbackNarrative = mapMiPaqueteStatus("CREATED");
    return NextResponse.json({
      success: true,
      guia: numeroGuia,
      transportadora: "Transportadora Nacional",
      origen: "Santa Marta, Magdalena",
      estado: fallbackNarrative.estado,
      estadoLegible: fallbackNarrative.estadoLegible,
      mensajeEditorial: fallbackNarrative.mensajeEditorial,
      milestones: fallbackNarrative.milestones,
      nota: "La guía está en proceso de recolección física en nuestro taller.",
    });
  } catch (error: any) {
    console.error("Excepción en /api/tracking:", error);
    return NextResponse.json(
      { success: false, error: "ERROR_INTERNO", message: error.message },
      { status: 500 }
    );
  }
}
