
## [2026-09-29] FASE ULTRA-MINIMALISTA (Quiet Luxury)

**1. Archivos, líneas y cambios exactos:**
*   **Archivos:** `app/page.tsx`, `app/journal/page.tsx`, `app/catalogo/page.tsx`, `app/tienda-santa-marta/page.tsx`
    *   *Cambio:* Sustituir todas las clases de padding vertical de secciones (`py-16` y `py-24`) por `py-32` (o variantes con breakpoint `md:py-32`).
*   **Archivo:** `components/navigation/Navbar.tsx`
    *   *Cambio:* Remover los objetos de navegación para "Rastreo" y "Filosofía" del menú principal (desktop y mobile). Renombrar "Diario" a "Journal" y "Boutique Santa Marta" a "Boutique".
*   **Archivo:** `components/navigation/Footer.tsx`
    *   *Cambio:* Insertar una nueva columna de enlaces titulada "Categorías". Inyectar las tipologías oficiales: *Camisas, Pantalones, Pantalonetas, Guayaberas, Vestidos, Sets*. Enlazar a `/catalogo/[tipologia]`.
    *   *Cambio:* Destilar textos: "Diario BAUTO" ➔ "Journal", "Rastrear mi envío" ➔ "Rastreo", "Filosofía y fibras nobles" ➔ "Manifiesto", "Atención concierge" ➔ "Concierge".
*   **Archivos:** `components/product/StickyBuyBar.tsx` y `components/product/ProductDetailClient.tsx`
    *   *Cambio:* Cambiar el copy del botón de acción primario de "Agregar al carrito" a "Añadir".

**2. Posibilidades de modificar algo más (Impactos Cruzados):**
*   Navegación: El usuario de post-venta debe scrollear obligatoriamente hasta el footer para encontrar el botón de Rastreo.
*   Mantenimiento: Añadir categorías *estáticas* (Camisas, Pantalones...) en el Footer requerirá actualizaciones manuales si nacen nuevas tipologías.

**3. Riesgos de dañar algo:**
*   **Riesgo 1 (Experiencia Móvil):** Aplicar `py-32` (128px de vacío) rígidamente en todas las pantallas podría hacer que en un celular la pantalla quede en blanco entre secciones.
*   **Riesgo 2 (Enlaces a catálogos sin stock):** Añadir categorías fijas en el footer podría dirigir a catálogos vacíos.

**4. Acciones de Mitigación:**
*   **Mitigación 1 (Responsive Aire):** Utilizar `py-20 sm:py-24 md:py-32`. Garantiza el vacío dramático en pantallas grandes, pero protege la ergonomía en celulares.
*   **Mitigación 2 (Empty States Seguros):** Utilizar slugs canónicos. La ruta dinámica `/catalogo/[categoria]/page.tsx` devuelve elegantemente un mensaje de estado vacío si no hay existencias.
