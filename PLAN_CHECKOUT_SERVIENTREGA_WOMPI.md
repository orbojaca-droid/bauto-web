# PLAN: IMPLEMENTACIÓN CHECKOUT 2 PASOS (SERVIENTREGA EXCLUSIVO) + WOMPI PRODUCCIÓN
**Fecha:** 2026-10-02  
**Módulo:** WEB (Next.js Headless / Vercel)  
**Autor:** Antigravity Architect & Coder  
**Capa:** Capa 1 (Técnica) + Capa 2 (Funcional) + Capa 3 (Estética Quiet Luxury)  
**Riesgo Evaluado:** Medio - Flujo transaccional, cálculo de fletes y pasarela bancaria.

---

## 1. Contexto y Fuentes de Verdad

### A. Credenciales Oficiales de Producción Wompi (Bancolombia)
*   **Llave Pública:** `pub_prod_MYfdpyNrCni2KWTQ5SmEMWJR8SiKPUad`
*   **Llave Privada:** `prv_prod_QqDXnSpOtAPGerR1BT8fWYrgMoB4UJI2`
*   **Secreto de Eventos (Webhooks):** `prod_events_CmZuHR3PsadH7qkNkWbkwrE1iDeMfwhl`
*   **Secreto de Integridad (SHA-256):** `prod_integrity_HGmKUlkBtTKpxglIhfMqpprOMzZrMllU`
*   **URL de Eventos (Webhook de Notificación en Servidor):**  
    `https://bauto-web.vercel.app/api/webhooks/wompi` *(Confirmada y registrada en el Dashboard de Wompi)*

### B. Directiva Logística Mandatoria
*   **Transportadora Exclusiva:** **Servientrega** (origen Santa Marta `47001000`). No se muestran ni cotizan otras transportadoras.
*   **Flujo en 2 Fases:**
    1.  **Fase 1 (Ciudad destino primero):** Al iniciar la compra, el cliente ingresa su ciudad/municipio. Se cotiza en tiempo real el flete con Servientrega, mostrando el costo y los días hábiles estimados de entrega. El total de la orden se actualiza de inmediato.
    2.  **Fase 2 (Datos del comprador y entrega):**
        *   **Cédula / Documento de Identidad:** Obligatorio (requerido para la guía oficial de Servientrega y factura).
        *   **Nombre completo:** Obligatorio.
        *   **Celular / WhatsApp:** Obligatorio.
        *   **Correo electrónico:** Obligatorio.
        *   **Barrio:** **Campo independiente obligatorio** (separado de la dirección para garantizar entrega sin extravíos).
        *   **Dirección exacta:** Obligatorio (Calle, Carrera, Apto, Casa).
        *   **Indicaciones adicionales:** Opcional.

---

## 2. Archivos, Líneas y Cambios Exactos

### A. Archivo: `.env.local` (Nuevo)
*   **Ubicación:** `/Users/tomas/Library/CloudStorage/GoogleDrive-bautostudio@gmail.com/My Drive/VS/WEB/.env.local`
*   **Cambio:** Registrar las 4 llaves oficiales de producción de Wompi y la URL canónica de Vercel.
*   **Líneas:** 1-15.

### B. Archivo: `app/api/shipping/quote/route.ts` (Nuevo endpoint)
*   **Ubicación:** `/Users/tomas/Library/CloudStorage/GoogleDrive-bautostudio@gmail.com/My Drive/VS/WEB/app/api/shipping/quote/route.ts`
*   **Cambio:** Endpoint `POST /api/shipping/quote` exclusivo para Servientrega:
    *   **Entrada:** Recibe la ciudad ingresada por el comprador (`city`), valor declarado (`subtotal`) y cantidad de prendas (`itemsCount`).
    *   **Resolución DANE Dinámica:** Normaliza el nombre de la ciudad y resuelve su código DANE oficial de 8 dígitos (ej: Santa Marta `47001000`, Barranquilla `08001000`, Bogotá `11001000`, Medellín `05001000`, Bucaramanga `68001000`, Cali `76001000`, etc.).
    *   **Cálculo Real con la API de MiPaquete / Servientrega:**
        *   Si `MIPAQUETE_API_KEY` está configurada, consulta la API oficial en vivo (`POST https://api-v2.mpr.mipaquete.com/quoteShipping`) con el código DANE de origen y destino, peso y dimensiones reales. Filtra estrictamente la oferta de **Servientrega**, devolviendo el precio exacto en pesos (ej. $16.500 para Barranquilla, $26.857 para Medellín/Bogotá) y los días reales de entrega (`Math.ceil(shippingTime / 1440)`).
        *   Si la API externa no está disponible o mientras se enlaza la llave, liquida la tarifa oficial de Servientrega mediante el cálculo por trayecto DANE departamental y valor asegurado (% de manejo) sin usar números fijos planos, asegurando que cada ciudad reciba su tarifa y tiempo real correspondiente a su distancia desde Santa Marta.
*   **Líneas:** 1-90.

### C. Archivo: `app/api/checkout/wompi-session/route.ts`
*   **Ubicación:** `/Users/tomas/Library/CloudStorage/GoogleDrive-bautostudio@gmail.com/My Drive/VS/WEB/app/api/checkout/wompi-session/route.ts`
*   **Líneas 18-35:**
    *   Recibir del payload `customerCedula`, `customerBarrio`, `shippingCost`, `shippingDays`.
*   **Líneas 76-83:**
    *   Eliminar el cálculo de flete hardcodeado o umbrales no vigentes. Usar el `shippingCost` cotizado de Servientrega (mínimo de contingencia $14.500 COP si no viniera definido).
*   **Líneas 100-116:**
    *   Reemplazar las llaves de fallback por las llaves reales de producción de BAUTO (`pub_prod_MYfdpyNrCni2KWTQ5SmEMWJR8SiKPUad` y `prod_integrity_HGmKUlkBtTKpxglIhfMqpprOMzZrMllU`).
    *   Ajustar `siteUrl` fallback a `https://bauto-web.vercel.app`.
    *   Inyectar en la URL de Wompi:
        *   `&customer-data:legal-id=${encodeURIComponent(customerCedula)}`
        *   `&customer-data:legal-id-type=CC`
*   **Líneas 128-150:**
    *   Guardar en el borrador de Redis: `cedula`, `barrio`, `carrier: "Servientrega"`, `shippingDays`, y concatenar la dirección completa con formato para despacho: `${address.trim()} (Barrio: ${barrio.trim()})`.

### D. Archivo: `app/carrito/page.tsx`
*   **Ubicación:** `/Users/tomas/Library/CloudStorage/GoogleDrive-bautostudio@gmail.com/My Drive/VS/WEB/app/carrito/page.tsx`
*   **Líneas 31-70:**
    *   Nuevos estados del comprador:
        *   `cedula`: string
        *   `barrio`: string
        *   `shippingCost`: number (por defecto 14500 o dinámico tras cotizar)
        *   `shippingDays`: string (ej: "2 a 3 días hábiles")
        *   `isQuoting`: boolean
        *   `cityQuoted`: boolean
*   **Líneas 51-125:**
    *   Validación integral de campos obligatorios: Cédula (numérica), Barrio (independiente), Nombre, Celular, Correo, Dirección y Ciudad.
    *   Envío de `customerCedula` y `customerBarrio` en el POST a `/api/checkout/wompi-session`.
*   **Líneas 190-285 (Reorganización en 2 Fases Visuales):**
    *   **Fase 1 (Ciudad primero):**
        *   Campo de Ciudad / Municipio destacado al inicio de los datos de entrega.
        *   Llamado automático al endpoint de Servientrega al ingresar/seleccionar la ciudad.
        *   Tarjeta de cotización Servientrega sobria (Terracota / Carbón, tipografía Jost, sin bordes toscos):
            *"Servientrega Nacional · $XX.XXX COP · Entrega estimada: X a Y días hábiles"*.
    *   **Fase 2 (Datos del comprador y dirección):**
        *   Grid con Cédula obligatoria y Nombre completo.
        *   Grid con Celular y Correo electrónico.
        *   **Campo independiente de Barrio** con label claro: *"Barrio / Sector *"*.
        *   Dirección exacta y notas opcionales.
*   **Líneas 305-335:**
    *   Resumen de orden: *"Envío con Servientrega · $XX.XXX COP"*.
    *   Total exacto calculado en tiempo real.

---

## 3. Análisis de Impactos Cruzados (Posibilidades de Modificar Algo Más)

1.  **Webhook Wompi (`app/api/webhooks/wompi/route.ts`):**
    *   *Consumidor:* Al aprobarse el pago, el webhook lee el borrador desde Redis. Al incluir ahora `cedula` y `barrio`, los datos enviados hacia Google Apps Script (`2. APPBAUTO` / Ventas / Master DB) llevarán la información completa para la generación automática de la guía en Servientrega.
2.  **Confirmación de Pago (`app/checkout/confirmacion/page.tsx`):**
    *   *Consumidor:* El resumen post-pago mostrará el costo de Servientrega y la dirección con barrio para total claridad del cliente.

---

## 4. Matriz de Riesgos y Acciones de Mitigación

| Riesgo Identificado | Severidad | Acción de Mitigación Implementada |
| :--- | :--- | :--- |
| **Cambio de ciudad tras cotizar** | Media | Listener reactivo en el input de ciudad: al modificar el texto, se recalcula la tarifa de Servientrega y se actualiza el total automáticamente sin borrar el resto del formulario. |
| **Ciudades con tildes o mayúsculas** | Baja | Normalización de cadenas en `quote/route.ts` eliminando diacríticos antes de comparar con la matriz. |
| **Error en cálculo SHA-256 de Wompi** | Alta | La firma se calcula en el servidor backend usando `amountInCents = Math.round(totalCOP * 100)` y el secreto de integridad oficial `prod_integrity_HGmKUlkBtTKpxglIhfMqpprOMzZrMllU`. |
| **Falla en el build de producción Next.js** | Alta | Ejecución local de `npx next build` comprobando 0 errores de tipado en TypeScript y 0 fallos de compilación antes de comitear y pushear a Vercel. |

---

## 5. Criterio de Verificación de Cierre
1.  Cotizar diferentes ciudades (ej: Santa Marta, Bogotá, Medellín, Barranquilla) y comprobar que el flete de Servientrega varíe adecuadamente y actualice el total.
2.  Verificar que los campos **Cédula** y **Barrio** sean requeridos y no permitan enviar el formulario vacíos.
3.  Iniciar la sesión de pago hacia Wompi y verificar que cargue sin el error `No se pudo cargar la información del undefined`.
