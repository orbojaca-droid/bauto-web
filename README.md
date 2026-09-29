# BAUTO Resort Wear — Plataforma Web (bauto.com.co)

Módulo: `WEB`  
Arquitectura: **Headless E-commerce Multipágina (Next.js App Router + Vercel + Wompi + Google Sheets)**  
Origen: Santa Marta, Caribe Colombiano

---

## 1. Estructura de Rutas y Páginas

* `/` → Portada Cinemática con Clima en Vivo de Santa Marta y Shop the Look.
* `/catalogo` → Catálogo General con filtros por Tipología y Tejido noble.
* `/catalogo/[tipologia]` → Molde Dinámico de Tipología (`/camisas`, `/guayaberas`, `/pantalones`, etc.).
* `/catalogo/producto/[slug]` → Molde de Prenda con Galería 4K, Matriz de Tallas, Modal de Medidas y Soft-Hold.
* `/blog` y `/blog/[slug]` → El Diario BAUTO (Artículos editoriales de estilo de vida caribeño).
* `/tienda-santa-marta` → Ubicación física en Calle 20 # 2-36 con mapa y GPS directo.
* `/rastreo` → Portal Canónico de Rastreo de Envíos en lenguaje caribeño (MiPaquete V2).
* `/ayuda` → Centro de Ayuda Unificado: Tiempos de Envío, Políticas de Cambios y Medios de Pago.
* `/filosofia` → Manifiesto de Cuerpo Consciente, Artesanía y Telas Nobles.
* `/contacto` → WhatsApp Concierge contextualizado con el bot `AGENTE`.
* `/pedido/confirmado` → Página de Aterrizaje y Recibo Digital post-Wompi.
* `/404` → Página de Enlace Roto de Autor.

---

## 2. Tipologías Oficiales

Consolidadas desde `0. CATALOGUE/types.ts`:
1. Camisa
2. Camisón
3. Chaqueta
4. Pantalón
5. Pantaloneta
6. Pañoleta
7. Short
8. Sombrero
9. Toalla
10. Postal
11. Tula
12. Saco Capotero
*(+ Cualquier tipología adicional ingresada en la columna Tipología de Master DB)*.

---

## 3. Modelo Financiero y Operativo

* **Costo Fijo Mensual:** **$0 COP**.
* **Hosting:** Vercel (Capa Hobby - $0).
* **Pasarela:** Wompi Bancolombia ($0 cuota mensual; solo comisión por venta).
* **Base de Datos:** Google Sheets (`Master DB` - $0).
* **APIs:** Google Cloud Free Tiers (Maps, Places, Shopping, Indexing, Translation, Vision) y Suite de Vanguardia.
