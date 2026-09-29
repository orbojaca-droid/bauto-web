const fs = require('fs');

let content = fs.readFileSync('components/cart/Carrito.tsx', 'utf8');

// Fix the broken JSX
content = content.replace(/\{items\.length > 0 && \}/g, '');

// Clean Wompi if required (wait, user said "lo de wompi me parece clave porque da confianza", so I MUST NOT remove it! I must keep Wompi!)
// Oh, the user explicitly said: "lo de wompi me parece clave porque da confianza. Se pueden quitar otras cosas."
// So keeping Wompi is correct.

// Remove Empty State Poem
// Let's replace the whole empty state block correctly
content = content.replace(/<p className="font-editorial italic text-xs text-bauto-piedra leading-relaxed">\s*Siluetas fluidas y fibras nobles inspiradas en el Caribe esperan ser descubiertas\.\s*<\/p>/g, '');

// Fix Button CSS
content = content.replace(/w-full py-3\.5 px-6 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-all duration-200 text-xs font-sans font-medium flex items-center justify-center gap-2/g, 'w-full py-3 px-6 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-all duration-200 text-[11px] uppercase tracking-widest font-light flex items-center justify-center gap-2');

content = content.replace(/mt-2 px-6 py-3 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-\[11px\] font-sans font-medium/g, 'mt-2 px-6 py-3 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-colors text-[11px] uppercase tracking-widest font-light');

// Wait, the unused import getFreeShippingProgress might cause a warning/error if it's not used.
content = content.replace(/const getFreeShippingProgress = useCartStore\(\(state\) => state\.getFreeShippingProgress\);\n/g, '');
content = content.replace(/const \{ isQualified \} = getFreeShippingProgress\(\);\n/g, '');
content = content.replace(/const shippingCost = isQualified \|\| subtotal >= 300000 \? 0 : 15000;/g, 'const shippingCost = 15000;');

fs.writeFileSync('components/cart/Carrito.tsx', content);

// Also remove from App page where getFreeShippingProgress might be used? No, only Carrito.tsx.
