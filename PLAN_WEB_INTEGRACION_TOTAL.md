# PLAN DE INTEGRACIÓN Y REFACTORIZACIÓN TOTAL: PROYECTO `WEB`

**Versión:** 1.0  
**Fecha:** 29 de Septiembre de 2026  
**Módulo:** `WEB` (`www.bauto.com.co` / Vercel Headless + GAS Backend)  
**Marco Normativo:** `.antigravityrules` & `BRAND_AND_DESIGN_SYSTEM.md`  
**Estado:** PENDIENTE DE APROBACIÓN POR EL USUARIO  

---

## 1. Visión General y Objetivos

Este plan formaliza la integración completa y soberana de la tienda online de alta costura de **BAUTO Resort Wear**, articulando 5 objetivos específicos:
1. **Conectividad Soberana y Confidencial a Google Sheets:** Las bases de datos maestras (`Master Stock DB` `1cKL-Rt04R6e...` y `Ventas DB` `1tZeAgLC...`) se mantienen **100% privadas y restringidas en Google Drive**. No se exponen mediante enlaces públicos CSV ni se tercerizan mediante raspados externos.
2. **Backend Dedicado en Google Apps Script (`WEB`):** Creación del backend en GAS que funge como API Gateway privado bajo la identidad de `bautostudio@gmail.com`, ejecutando lecturas en tiempo real y asentamiento de ventas con exclusión mutua (`LockService`).
3. **Erradicación de Mayúsculas Intermedias (*Sentence Case* Estricto):** Eliminación completa del *Title Case* y de las clases CSS `uppercase` en oraciones y frases en toda la web (24 componentes y páginas), reservando mayúsculas exclusivamente para la primera letra y nombres propios (*BAUTO*, *Santa Marta*, *Caribe*, *Wompi*, *MiPaquete*).
4. **Espacios Cinemáticos de Video:** Integración de componentes de video de alta costura (`VideoHero`) en Home (`app/page.tsx`) y Catálogo (`app/catalogo/page.tsx`) con reproducción ambiental en silencio (`autoPlay`, `muted`, `loop`, `playsInline`).
5. **Cartografía de Lujo Santa Marta:** Reemplazo del iframe genérico de OpenStreetMap por un mapa cartográfico interactivo personalizado en tonos cálidos arena/carbón con pin en Terracota Ancestral (`#B85C38`) sobre la Calle 20 # 2-36.
6. **Monitoreo de Telemetría Nivel 3 en el HUB (Último Punto):** Instrumentación de las 5 categorías oficiales (`SEGURIDAD`, `LECTURA`, `ESCRITURA`, `INTEGRACIONES`, `DOCUMENTOS`) e incorporación de `WEB` en el radar y panel de salud de `0. HUB`.

---

## 2. Reparto de Trabajo Multi-Agente (3 Agentes Especializados)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      DIRECTOR DE ORQUESTA BAUTO                        │
├───────────────────┬────────────────────────────┬───────────────────────┤
│    AGENTE 1       │         AGENTE 2           │       AGENTE 3        │
│   (Editor UX      │    (Arquitecto Backend &   │   (Revisor Ciego      │
│   & Lenguaje)     │     Conectividad GAS)      │     de Calidad)       │
├───────────────────┼────────────────────────────┼───────────────────────┤
│ • Sentence Case   │ • Crea backend GAS `WEB`   │ • Auditoría ciega     │
│   en toda la web  │ • Conexión privada con     │   archivo por archivo │
│ • Videos Home     │   Master DB y Ventas DB    │ • Verificación de     │
│   y Catálogo      │ • Conector en lib/sheets   │   cero datos filtrados│
│ • Mapa de lujo    │ • Despliegue con clasp     │ • Compilación limpia  │
│   en Santa Marta  │ • Telemetría final en HUB  │ • Despliegues y Docs  │
└───────────────────┴────────────────────────────┴───────────────────────┘
```

---

## 3. Detalle Fase por Fase: Archivos, Líneas y Cambios

### 🔹 FASE 1: Backend GAS `WEB` & Conectividad Privada (Master DB y Ventas DB)
> **Responsable:** Agente 2 (Arquitecto Backend)

#### 1. Creación de `VS/WEB/gas/appsscript.json`
* **Acción:** Declarar configuración de Web App con `executeAs: "USER_DEPLOYING"`, `access: "ANYONE_ANONYMOUS"` y vincular la librería matriz `Platform` (`1dhP6-1TfLwnLWsIapB0Nl2OLZTHcNjtO_RoDf69SUEgaw3tWkfvOfP2o` v925).

#### 2. Creación de `VS/WEB/gas/Code.js`
* **Acción:**
  * Constantes canónicas:
    ```javascript
    const STOCK_SPREADSHEET_ID = '1cKL-Rt04R6e_Xdesg_2RkQufN6DKmTcSQpxVVTySZxg';
    const VENTAS_SPREADSHEET_ID = '1tZeAgLCeeYpeesZQhxvtGNqKI6d9qfOZyYWCdAMzSH0';
    ```
  * `doPost(e)`: Autenticación por `SECRETO_VENTA_SERVICIO`.
  * `obtenerCatalogoWeb_()`: Lectura atómica de `STOCK` en `Master Stock DB`. Transforma fotos de Drive a URLs de CDN (`drive.google.com/thumbnail?id=...&sz=w800`), filtra stock > 0 y excluye cualquier columna sensible (costos, proveedores, compras).
  * `registrarVentaWeb_()`: `LockService` (30s) + Descuento en `STOCK` + Asiento en `VENTAS` (`VTA-XXXX`) + Registro en `MOVIMIENTOS`.
  * `clasp push` y `clasp deploy` para emitir la URL oficial de producción.

#### 3. Modificación de `VS/WEB/lib/constants.ts` (Líneas 10-13)
* **Acción:** Configurar `WEB_GAS_URL` con la URL de producción emitida por clasp.

#### 4. Modificación de `VS/WEB/lib/sheets.ts` (Líneas 163-274)
* **Acción:** Reemplazar el intento de descarga CSV por `POST` seguro hacia `WEB_GAS_URL` con `{ accion: 'obtenerCatalogoWeb', secreto: process.env.SECRETO_VENTA_SERVICIO }`. Revalidación en Edge de 60 segundos.

#### 5. Modificación de `VS/WEB/app/api/webhooks/wompi/route.ts` (Líneas 168-195)
* **Acción:** Enviar la confirmación asíncrona de compra a `WEB_GAS_URL` con `{ accion: 'registrarVentaWeb' }`, garantizando el doble asiento en `STOCK` y `VENTAS`.

---

### 🔹 FASE 2: Espacios Cinemáticos de Video (Home y Catálogo)
> **Responsable:** Agente 1 (Editor UX & Lenguaje)

#### 6. Creación de `VS/WEB/components/media/VideoHero.tsx`
* **Acción:** Componente de video de alta costura:
  * Etiqueta `<video playsInline autoPlay muted loop preload="metadata">`.
  * Marco hairline minimalista (`border border-bauto-carbon/10`) con proporciones `aspect-[16/9]` en desktop y `aspect-[4/5]` en móvil.
  * Poster WebP y botón sobrio de pausa/play.

#### 7. Modificación de `VS/WEB/app/page.tsx` (Líneas 33-61)
* **Acción:** Integrar `<VideoHero />` en el Home entre el encabezado editorial y la edición de temporada.

#### 8. Modificación de `VS/WEB/app/catalogo/page.tsx` (Líneas 34-46)
* **Acción:** Integrar el espacio de video lookbook precediendo la cuadrícula de prendas del catálogo.

---

### 🔹 FASE 3: Cartografía de Lujo para la Boutique Santa Marta
> **Responsable:** Agente 1 (Editor UX & Lenguaje)

#### 9. Creación de `VS/WEB/components/map/BoutiqueMap.tsx`
* **Acción:** Módulo cartográfico personalizado *Quiet Luxury*:
  * Mosaicos sobrios en paleta arena y carbón (#FAF9F6/#1C1917).
  * Marcador de boutique en Terracota Ancestral (`#B85C38`) con pulso sutil sobre Calle 20 # 2-36 (11.2420° N, 74.2138° W).
  * Accesos directos a Google Maps, Apple Maps y Waze.

#### 10. Modificación de `VS/WEB/app/tienda-santa-marta/page.tsx` (Líneas 25-70)
* **Acción:** Reemplazar el iframe de OpenStreetMap por `<BoutiqueMap />`.

---

### 🔹 FASE 4: Normalización Exhaustiva a Sentence Case (Toda la Web)
> **Responsable:** Agente 1 (Editor UX & Lenguaje)

* **PDP & Tallas:**
  * `components/product/ProductDetailClient.tsx` (Líneas 160-220): *"Añadir a la bolsa"*, *"¡Añadido a la bolsa!"*, *"Fibras nobles"*, *"Guía de medidas"*.
  * `components/product/SizeSelector.tsx` (Líneas 53-57): *"Guía de medidas"*, removiendo `uppercase`.
  * `components/product/StickyBuyBar.tsx` (Líneas 90-94): *"Elegir talla"*, *"Añadir a la bolsa"*.
  * `components/product/SizeGuideModal.tsx` (Líneas 50-56): *"Guía de medidas (cm)"*.
* **Catálogo & Tarjetas:**
  * `components/product/CatalogGrid.tsx` (Líneas 85, 122, 123, 167): *"Toda la colección"*, *"Precio: menor a mayor"*, *"Precio: mayor a menor"*, *"Restablecer criterios"*.
  * `components/product/ProductCard.tsx` (Líneas 46-78): *"Boutique Santa Marta"*, *"Últimas piezas"*, *"Agotado"*.
  * `app/catalogo/page.tsx` (Líneas 36, 40): *"Colección permanente"*, *"Colección BAUTO"*.
* **Bolsa & Checkout:**
  * `components/cart/Carrito.tsx` (Líneas 134-192): *"Explorar colección"*, *"Total estimado"*, *"Continuar con el pago"*.
  * `components/cart/GiftCeremony.tsx` (Líneas 42-44): *"Presentación para obsequio"*.
  * `app/carrito/page.tsx` (Líneas 133-344): *"Explorar la colección"*, *"Finalizar pedido"*, *"Tu bolsa y entrega"*, *"Prendas seleccionadas"*, *"Datos para el envío nacional"*, *"Nombre completo"*, *"Dirección de entrega"*, *"Ciudad / municipio"*, *"Proceder al pago seguro"*.
* **Post-Venta, Navegación y Footer:**
  * `app/checkout/confirmacion/page.tsx` (Líneas 38-109): *"Pedido confirmado · Taller Santa Marta"*, *"Orden recibida"*, *"Alistamiento en taller"*, *"En tránsito con la brisa"*, *"Entrega en tu puerta"*, *"Rastrear envío"*, *"Hablar con Concierge"*.
  * `components/navigation/Footer.tsx` (Líneas 70-108): *"Ver todo el catálogo"*, *"Camisas de lino"*, *"Pantalones fluidos"*, *"Kimonos y capas"*, *"Bermudas y shorts"*, *"Rastrear mi envío"*, *"Filosofía y fibras nobles"*, *"Políticas y cambios"*, *"Derecho de retracto (Ley 1480)"*, *"Boutique taller"*, *"Lunes a sábado"*, *"Domingos y festivos"*.
  * `app/page.tsx` (Líneas 37, 54, 70, 78): *"Explorar colección"*, *"Edición de temporada"*, *"Ver colección completa"*.
  * `app/tienda-santa-marta/page.tsx` (Líneas 35, 76, 89, 92, 93, 100): *"Horarios de atelier"*, *"Lunes a sábado"*, *"Domingos y festivos"*, *"Cómo llegar"*.
  * Páginas editoriales (`filosofia`, `ayuda`, `contacto`, `rastreo`, `not-found`): Normalización de subtítulos y botones a *Sentence case*.

---

### 🔹 FASE 5: Monitoreo de 5 Categorías en el HUB (Último Punto)
> **Responsable:** Agente 2 (Arquitecto Backend)

#### 11. Instrumentación de las 5 categorías en `VS/WEB/gas/Code.js`
* `SEGURIDAD`: `Platform.registrarErrorCategoria('WEB', 'SEGURIDAD', 'validarSecretoM2M', exito, mensaje)`
* `LECTURA`: `Platform.registrarErrorCategoria('WEB', 'LECTURA', 'obtenerCatalogoWeb', exito, mensaje)`
* `ESCRITURA`: `Platform.registrarErrorCategoria('WEB', 'ESCRITURA', 'registrarVentaWeb', exito, mensaje)`
* `INTEGRACIONES`: `Platform.registrarErrorCategoria('WEB', 'INTEGRACIONES', 'generarGuiaMiPaquete', exito, mensaje)`
* `DOCUMENTOS`: `Platform.registrarErrorCategoria('WEB', 'DOCUMENTOS', 'generarComprobanteWeb', exito, mensaje)`
* `LATIDO (Heartbeat)`: `activarPilotoTelemetria()` con trigger a las 9am (`Platform.escribirEstadoSalud('WEB', 'ONLINE', '')`).

#### 12. Incorporación de `WEB` en `0. HUB/index.html` (Líneas 423-443)
* Registro de `'WEB'` bajo `Nivel 3` en `NIVELES` y en `PROY_META` con `{ icon: 'language', abbr: 'WEB', grid: 'WEB' }`.
* Despliegue de `0. HUB` vía `clasp push`.

---

### 🔹 FASE 6: Verificación Ciega, Compilación, Despliegues y Memoria
> **Responsable:** Agente 3 (Revisor Ciego de Calidad)

1. **Auditoría ciega:** Script de verificación buscando cualquier residuo de *Title Case* o CSS `uppercase` en oraciones.
2. **Validación de seguridad:** Confirmación de que ningún costo o dato sensible sale en el JSON de GAS.
3. **Compilación local:** `npm run build` en `VS/WEB` verificando 0 errores en las 18 rutas.
4. **Despliegues:**
   * Commit y push de `VS/WEB` a Vercel (`bauto-web.vercel.app`).
   * Despliegue confirmado de GAS `WEB`.
5. **Memoria Holística:** Actualización de `0. BAUTO ECOSYSTEM/BAUTO_MEMORY.md` (Secciones 1.B y 3).

---

## 4. Matriz de Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Acción de Mitigación |
| :--- | :---: | :---: | :--- |
| **Exposición de datos confidenciales** | Nula | Crítico | Las hojas `Master Stock DB` y `Ventas DB` permanecen **100% privadas**. El backend `WEB` filtra en servidor y entrega únicamente el payload comercial. |
| **Colisión de ventas simultáneas** | Muy baja | Alto | `LockService` atómico de 30s en GAS antes de tocar `STOCK` y `VENTAS`. |
| **Falla en reproducción de video en iPhone** | Baja | Medio | Atributos nativos obligatorios `playsInline`, `autoPlay`, `muted`, `loop` y `poster` WebP. |
| **Desbalance en el radar del HUB** | Baja | Medio | Las 5 categorías respetan las claves canónicas en mayúsculas (`SEGURIDAD`, `LECTURA`, `ESCRITURA`, `INTEGRACIONES`, `DOCUMENTOS`). |
| **Ruptura de build de Next.js** | Muy baja | Alto | Verificación previa obligatoria con `npm run build` antes de commit y push. |
