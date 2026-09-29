# PLAN: FASE UI/UX PRO MAX (EXAGGERATED MINIMALISM)
**Fecha:** 2026-09-29
**Capa:** Interfaz de Usuario / Experiencia de Lujo

## 1. Archivos, líneas y cambios exactos

### Bloque 1: Navbar y Home (Limpieza Visual)
*   **`components/navigation/Navbar.tsx`:**
    *   *Cambio:* Remover importación y uso de `<WeatherWidget />`.
    *   *Cambio:* Eliminar texto `Resort Wear` en `text-[7.5px]` debajo del logo.
    *   *Cambio:* Reemplazar contador de carrito (número) por un punto (dot) rojo/negro sutil cuando `displayCount > 0`.
*   **`app/filosofia/page.tsx`:**
    *   *Cambio:* Remover clase `divide-y divide-bauto-carbon/10` para dejar espaciado negativo puro.

### Bloque 2: Flujo Transaccional (Ergonomía E-commerce)
*   **`components/cart/FreeShippingBar.tsx` / `Carrito.tsx` / `cartStore.ts`:**
    *   *Cambio:* **ELIMINAR** por completo la lógica y el componente visual de envío gratuito por $300,000 COP, ya que no corresponde a la política real de la marca.
    *   *Cambio:* Mantener mensaje Wompi PCI-DSS intacto (confianza).
    *   *Cambio:* Eliminar prosa poética del estado vacío ("Tu bolsa aún está ligera... Siluetas fluidas...").
*   **`components/product/SizeSelector.tsx`:**
    *   *Cambio:* Remover bordes de casillas. Usar diseño desnudo con `border-b` condicional al seleccionar.
    *   *Cambio:* Sustituir "X piezas disponibles" por "Últimas piezas en taller".
*   **`components/product/ProductDetailClient.tsx` y `Carrito.tsx`:**
    *   *Cambio:* Estilizar los botones de "Añadir" y "Pagar" cambiando `font-medium` a `font-light`, `text-[11px]`, `uppercase tracking-widest` y `py-3`.

### Bloque 3: Multimedia (Desnudar medios)
*   **`components/media/VideoHero.tsx` y `components/map/BoutiqueMap.tsx`:**
    *   *Cambio:* Remover clases `bg-bauto-nube/95` y `backdrop-blur-md` de los textos/botones flotantes para que descansen directamente sobre el medio.

## 2. Posibilidades de modificar algo más (Impactos Cruzados)
*   Al quitar el `FreeShippingBar.tsx`, el `cartStore.ts` debe limpiarse de la constante de umbral (`FREE_SHIPPING_THRESHOLD`).
*   Al desnudar textos sobre el mapa/video, el contraste depende del fondo. El mapa es claro y el video tiene un gradiente inferior oscuro, por lo que las mitigaciones están dadas.

## 3. Riesgos de dañar algo y mitigación
*   *Riesgo:* Inconsistencia de dependencias al borrar `FreeShippingBar.tsx`.
*   *Mitigación:* Remover la importación en `Carrito.tsx` y eliminar el archivo completamente del sistema para evitar basura en el build.
*   *Riesgo:* Un texto blanco desnudo sobre el video podría volverse ilegible en pantallas muy luminosas.
*   *Mitigación:* Ya existe un `bg-gradient-to-t from-bauto-carbon/60` en la base del video que asegura contraste para los botones.

## 4. Ejecución con Agentes
Ejecutaré los cambios asumiendo el rol de **Editor**. Posteriormente, lanzaré un **Revisor Ciego** para confirmar que el compilador Next.js no se rompa por culpa de las importaciones eliminadas.
