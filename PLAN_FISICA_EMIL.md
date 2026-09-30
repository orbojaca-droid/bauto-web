# PLAN: FÍSICA Y MICRO-INTERACCIONES (Emil Kowalski + Apple Design)
**Fecha:** 2026-09-29
**Capa:** Interacción, Motion, Percepción Táctil

## 1. El "Squish" Táctil (Botones y Enlaces)
*   *Problema:* Los botones de la web no tienen masa. Al hacer clic, algunos apenas escalan a `0.99` o usan un desvanecimiento genérico de `150ms`.
*   *Solución:* Normalizar todas las interacciones táctiles (Botón Añadir a bolsa, Pagar, botones secundarios) para que usen `active:scale-[0.97]` con una transición elástica rápida: `transition-all duration-[160ms] ease-out`. Esto da confirmación física inmediata como si la interfaz fuera un material blando y lujoso.

## 2. Continuidad y Carga (Fundido de Imágenes y Video)
*   *Problema:* Las fotografías de las prendas en el catálogo "saltan" de golpe cuando el navegador las descarga. El video carga cambiando bruscamente su opacidad.
*   *Solución (ProductCard):* Añadir estado de hidratación (`isLoaded`). Las imágenes entrarán flotando ligeramente desde `scale-95` y `opacity-0` hacia `100` con una duración de `400ms` usando una curva bezier intensa (`cubic-bezier(0.23, 1, 0.32, 1)`).
*   *Solución (VideoHero):* Sustituir el cambio de opacidad del `<video>` por un fundido cruzado desenfocado (`blur-sm` a `blur-0`). Esto oculta la carga brusca de los píxeles del video y lo hace emerger como niebla.

## 3. Coreografía de Modales (Springs)
*   *Problema:* El carrito y el menú móvil se deslizan linealmente (`duration-300`).
*   *Solución:* Cambiar la clase de entrada del Drawer para que en vez de un slide lineal, utilice un "ease-out" pronunciado (`ease-[cubic-bezier(0.32,0.72,0,1)]`) que simule la fricción física de un resorte: comienza extremadamente rápido y frena suavemente al final del recorrido.

## 4. Tallas Vivas (Morphing en SizeSelector)
*   *Problema:* Al elegir talla (ej. de M a L), el subrayado salta instantáneamente de una letra a otra.
*   *Solución:* Aunque no metamos librerías pesadas, agregaremos una transición animada (`transition-colors duration-200 ease-out`) al background/border para que el cambio de talla no sea binario, sino que se sienta como un "switch" físico.

## Estrategia
Se modificarán los componentes interactivos añadiendo la directiva global `data-[loaded=true]` en React para manejar las coreografías, y se inyectarán utilidades CSS avanzadas de inercia directamente en `tailwind.config.js` si es necesario, sin inflar el tamaño del *bundle* de JavaScript.
