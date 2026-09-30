# PLAN: CORRECCIONES FINALES QUIET LUXURY (V2)
**Fecha:** 2026-09-29
**Capa:** Interfaz de Usuario (UI) / Estética / Copywriting

## 1. Archivos, líneas y cambios exactos

### 1. Limpieza de Clima y Rebranding a "Studio"
*   **Archivo:** `components/navigation/Navbar.tsx` y `components/navigation/Footer.tsx`.
*   *Cambio (Clima):* Buscar y destruir cualquier rastro oculto de `<WeatherWidget />` (incluyendo su renderizado en el menú móvil). El logo ya está limpio sin "Resort Wear".
*   *Cambio (Links):* **Mantener** los 3 enlaces de navegación en desktop, pero renombrar `Boutique` a `Studio`. Quedarán: *Colección*, *Journal*, *Studio*.

### 2. Renombramiento Global: "Boutique" -> "Studio"
*   **Archivos:** Múltiples (ej. `app/tienda-santa-marta/page.tsx`, `app/page.tsx`, `Footer.tsx`).
*   *Cambio:* Cambiar las menciones de "Boutique" por "Studio" (ej. "Conoce el Studio", "Visita nuestro Studio en Santa Marta").

### 3. Espaciado Horizontal (Respiro extremo Móvil y PC)
*   **Archivos:** `app/page.tsx`, `app/catalogo/page.tsx` y contenedores globales.
*   *Cambio:* Aumentar el padding lateral base de `px-4` a `px-6` o `px-8` (Móvil). Para PC, subir de `lg:px-8` a `lg:px-12` o `lg:px-16`. 
*   *Objetivo:* Comprimir ligeramente el contenido hacia el centro para que los bordes de la pantalla queden como un enorme marco de espacio en blanco.

### 4. Erradicación del "Envío de cortesía"
*   **Archivos:** `components/cart/Carrito.tsx`, `components/product/StickyBuyBar.tsx` y `components/product/ProductDetailClient.tsx`.
*   *Cambio:* Eliminar cualquier lógica condicional que imprima textos como "De cortesía" o "Envío gratis". El envío siempre se mostrará con su valor real o se calculará en el checkout.

### 5. Normalización de Botones y Eliminación de Iconos
*   **Archivos:** Múltiples (Carrito, Producto, Home).
*   *Cambio:* Estandarizar la tipografía de TODOS los botones primarios a: `text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-light`.
*   *Cambio (Iconos):* Eliminar iconos redundantes dentro de los botones (como la flecha `<ArrowRight />` o bolsitas de compra al lado del texto). El texto limpio y esbelto proyecta confianza y minimalismo.

### 6. "Bolsa" -> "Carrito de compras"
*   **Archivo:** `components/cart/Carrito.tsx`.
*   *Cambio:* Reemplazar los textos "Bolsa de compra" y "Tu bolsa aún está ligera" por "Carrito de compras" y "Tu carrito de compras está vacío".

## 2. Riesgos de dañar algo y mitigación
*   *Riesgo:* Reemplazar la palabra "Boutique" puede romper URLs si se hace un buscar/reemplazar ciego (ej. reemplazar `/tienda-santa-marta` o similar si la URL tuviera la palabra boutique).
*   *Mitigación:* Se reemplazarán únicamente los textos visibles (etiquetas JSX y strings de renderizado), respetando los slugs de las rutas de Next.js actuales.

## 3. Estrategia de Ejecución
Ejecutaré los cambios mediante scripts de reemplazo precisos o modificando directamente los componentes React afectados. Posteriormente lanzaré un compilado local (`npm run build`) para verificar la estabilidad antes del redespliegue.
