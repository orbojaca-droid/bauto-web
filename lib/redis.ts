/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Motor de Reservas en Edge (Two-Phase Soft Lock)
 * @Propósito: Gestiona reservas temporales con TTL de 12 minutos en Upstash Redis (Vercel KV)
 *             evitando sobreventas. AUDITORÍA: Soporta excludeSessionId para prevenir que el
 *             usuario se auto-bloquee al recargar o reintentar el checkout.
 */

import { Redis } from "@upstash/redis";

// Duración oficial del bloqueo suave: 12 minutos (720 segundos)
export const SOFT_HOLD_TTL_SECONDS = 12 * 60;

let redisClient: Redis | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (e) {
    console.warn("Fallo conectando a Upstash Redis, activando fallback local:", e);
  }
}

interface LocalHold {
  ref: string;
  size: string;
  sessionId: string;
  quantity: number;
  expiresAt: number;
}
const localHolds = new Map<string, LocalHold>();
const localOrderDrafts = new Map<string, { data: any; expiresAt: number }>();
const localProcessedEvents = new Map<string, { status: string; expiresAt: number }>();

function cleanLocalExpiredHolds() {
  const now = Date.now();
  for (const [key, hold] of localHolds.entries()) {
    if (hold.expiresAt <= now) {
      localHolds.delete(key);
    }
  }
  for (const [key, draft] of localOrderDrafts.entries()) {
    if (draft.expiresAt <= now) {
      localOrderDrafts.delete(key);
    }
  }
  for (const [key, ev] of localProcessedEvents.entries()) {
    if (ev.expiresAt <= now) {
      localProcessedEvents.delete(key);
    }
  }
}

/**
 * Obtiene el total de unidades actualmente reservadas de una referencia y talla,
 * excluyendo opcionalmente la sesión del propio comprador actual para evitar auto-bloqueos.
 */
export async function getActiveHoldsCount(
  ref: string,
  size: string,
  excludeSessionId?: string
): Promise<number> {
  const cleanRef = ref.trim().toUpperCase();
  const cleanSize = size.trim().toUpperCase();

  if (redisClient) {
    try {
      const keys = await redisClient.keys(`hold:${cleanRef}:${cleanSize}:*`);
      if (!keys || keys.length === 0) return 0;

      // Filtrar claves que pertenezcan a la sesión del propio comprador
      const filteredKeys = excludeSessionId
        ? keys.filter((k) => !k.endsWith(`:${excludeSessionId}`))
        : keys;

      if (filteredKeys.length === 0) return 0;

      // Usar mget para recuperar los valores en una sola llamada de red en lugar de N+1
      const values = await redisClient.mget<number[]>(...filteredKeys);
      return values.reduce((sum, val) => sum + (val || 1), 0);
    } catch (err) {
      console.error("Error consultando reservas en Redis:", err);
    }
  }

  // Fallback local
  cleanLocalExpiredHolds();
  let totalHeld = 0;
  for (const hold of localHolds.values()) {
    if (
      hold.ref === cleanRef &&
      hold.size === cleanSize &&
      (!excludeSessionId || hold.sessionId !== excludeSessionId)
    ) {
      totalHeld += hold.quantity;
    }
  }
  return totalHeld;
}

/**
 * Crea una reserva temporal de inventario (Soft Hold) con expiración de 12 minutos.
 */
export async function createSoftHold(
  ref: string,
  size: string,
  sessionId: string,
  quantity: number = 1,
  ttlSeconds: number = SOFT_HOLD_TTL_SECONDS
): Promise<{ success: boolean; key: string; expiresAt: number }> {
  const cleanRef = ref.trim().toUpperCase();
  const cleanSize = size.trim().toUpperCase();
  const key = `hold:${cleanRef}:${cleanSize}:${sessionId}`;
  const expiresAt = Date.now() + ttlSeconds * 1000;

  if (redisClient) {
    try {
      await redisClient.set(key, quantity, { ex: ttlSeconds });
      return { success: true, key, expiresAt };
    } catch (err) {
      console.error("Error creando reserva en Redis, usando fallback:", err);
    }
  }

  cleanLocalExpiredHolds();
  localHolds.set(key, {
    ref: cleanRef,
    size: cleanSize,
    sessionId,
    quantity,
    expiresAt,
  });

  return { success: true, key, expiresAt };
}

/**
 * Libera una reserva temporal.
 */
export async function releaseSoftHold(
  ref: string,
  size: string,
  sessionId: string
): Promise<boolean> {
  const cleanRef = ref.trim().toUpperCase();
  const cleanSize = size.trim().toUpperCase();
  const key = `hold:${cleanRef}:${cleanSize}:${sessionId}`;

  if (redisClient) {
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      console.error("Error liberando reserva en Redis:", err);
    }
  }

  localHolds.delete(key);
  return true;
}

/**
 * Guarda el borrador de orden validado para consulta posterior desde el Webhook de Wompi.
 */
export async function saveOrderDraft(
  reference: string,
  data: any,
  ttlSeconds: number = 86400
): Promise<void> {
  const key = `order:draft:${reference}`;
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(data), { ex: ttlSeconds });
      return;
    } catch (err) {
      console.error("Error guardando borrador en Redis, usando fallback local:", err);
    }
  }

  cleanLocalExpiredHolds();
  localOrderDrafts.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Recupera el borrador de orden validado mediante su referencia.
 */
export async function getOrderDraft(reference: string): Promise<any | null> {
  const key = `order:draft:${reference}`;
  if (redisClient) {
    try {
      const res = await redisClient.get<string | object>(key);
      if (!res) return null;
      return typeof res === "string" ? JSON.parse(res) : res;
    } catch (err) {
      console.error("Error recuperando borrador de orden en Redis:", err);
    }
  }

  cleanLocalExpiredHolds();
  const local = localOrderDrafts.get(key);
  return local ? local.data : null;
}

/**
 * Deduplicación atómica de eventos de Webhook (Idempotencia).
 * Retorna true si es la primera vez que se procesa el evento (bloqueo exitoso),
 * o false si el evento ya está en proceso o ya fue completado.
 */
export async function markEventProcessing(
  eventId: string,
  status: string,
  ttlSeconds: number = 86400
): Promise<boolean> {
  const key = `wompi:event:${eventId}:${status}`;
  if (redisClient) {
    try {
      const result = await redisClient.set(key, "PROCESSING", { nx: true, ex: ttlSeconds });
      return result === "OK";
    } catch (err) {
      console.error("Error marcando evento en Redis, usando fallback local:", err);
    }
  }

  cleanLocalExpiredHolds();
  if (localProcessedEvents.has(key)) {
    return false;
  }
  localProcessedEvents.set(key, {
    status: "PROCESSING",
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  return true;
}

/**
 * Marca el evento de webhook como completamente despachado.
 */
export async function markEventDone(
  eventId: string,
  status: string,
  ttlSeconds: number = 86400
): Promise<void> {
  const key = `wompi:event:${eventId}:${status}`;
  if (redisClient) {
    try {
      await redisClient.set(key, "DONE", { ex: ttlSeconds });
      return;
    } catch (err) {
      console.error("Error marcando evento DONE en Redis:", err);
    }
  }

  cleanLocalExpiredHolds();
  localProcessedEvents.set(key, {
    status: "DONE",
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Verifica si un evento de webhook ya fue procesado o se encuentra en proceso.
 */
export async function isEventProcessed(eventId: string, status: string): Promise<boolean> {
  const key = `wompi:event:${eventId}:${status}`;
  if (redisClient) {
    try {
      const val = await redisClient.get<string>(key);
      return val === "DONE" || val === "PROCESSING";
    } catch (err) {
      console.error("Error verificando evento en Redis:", err);
    }
  }

  cleanLocalExpiredHolds();
  return localProcessedEvents.has(key);
}

/**
 * Libera el candado de procesamiento en caso de error en el webhook
 * para permitir el reintento automático de Wompi o la conciliación.
 */
export async function deleteEventLock(eventId: string, status: string): Promise<void> {
  const key = `wompi:event:${eventId}:${status}`;
  if (redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch (err) {
      console.error("Error liberando candado de evento en Redis:", err);
    }
  }

  localProcessedEvents.delete(key);
}

/**
 * Obtiene todas las referencias de borradores de orden actualmente guardadas en Redis
 */
export async function getAllOrderDraftReferences(): Promise<string[]> {
  const prefix = "order:draft:";
  if (redisClient) {
    try {
      const keys = await redisClient.keys(`${prefix}*`);
      return keys.map((k) => k.replace(prefix, ""));
    } catch (err) {
      console.error("Error obteniendo referencias de borradores en Redis:", err);
    }
  }

  cleanLocalExpiredHolds();
  const refs: string[] = [];
  for (const key of localOrderDrafts.keys()) {
    if (key.startsWith(prefix)) {
      refs.push(key.replace(prefix, ""));
    }
  }
  return refs;
}


