const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

// The "Explorar colección" button in Hero
content = content.replace(/btn-primary active:scale-\[0\.97\] transition-transform duration-150 ease-out px-8 py-3\.5 text-xs font-sans font-normal/g, 'btn-primary active:scale-[0.97] transition-transform duration-150 ease-out px-8 py-3.5 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-light');

// The "Conoce la boutique" (now "Conoce el Studio") button
content = content.replace(/btn-glass px-7 py-3 text-xs font-sans text-bauto-carbon hover:bg-white transition-all shadow-none/g, 'btn-glass px-7 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-light text-bauto-carbon hover:bg-white transition-all shadow-none');

fs.writeFileSync('app/page.tsx', content);

// And the one in ProductDetailClient.tsx
let pClient = fs.readFileSync('components/product/ProductDetailClient.tsx', 'utf8');
pClient = pClient.replace(/w-full py-3 text-\[11px\] uppercase tracking-\[0\.15em\] font-sans font-light/g, 'w-full py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-light');
fs.writeFileSync('components/product/ProductDetailClient.tsx', pClient);

// And Carrito
let carrito = fs.readFileSync('components/cart/Carrito.tsx', 'utf8');
carrito = carrito.replace(/w-full py-3 px-6 flex items-center justify-between text-\[11px\] uppercase tracking-\[0\.15em\] font-light/g, 'w-full py-3 px-6 flex items-center justify-center text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-light');

// Fix Bolsa -> Carrito
carrito = carrito.replace(/Bolsa de compra/g, 'Carrito de compras');
carrito = carrito.replace(/Tu bolsa aún está ligera/g, 'Tu carrito está vacío');
carrito = carrito.replace(/Cerrar bolsa/g, 'Cerrar carrito');
carrito = carrito.replace(/Bolsa de compras BAUTO/g, 'Carrito de compras BAUTO');

fs.writeFileSync('components/cart/Carrito.tsx', carrito);

