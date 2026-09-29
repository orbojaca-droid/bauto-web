'use client';

/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Inicializador del store reactivo del carrito en el cliente para evitar mismatch de hidratación
 * @Capa: Técnica / Funcional
 * @Riesgo_Evaluado: Bajo - Efecto de inicialización de estado
 */

import { useEffect } from 'react';
import { useCartStore } from '../../lib/cartStore';

export function CartInitializer() {
 useEffect(() => {
 useCartStore.getState().setHydrated();
 }, []);

 return null;
}
