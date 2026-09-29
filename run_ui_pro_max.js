const fs = require('fs');

function updateFile(path, regex, replacement) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content);
  }
}

// 1. NAVBAR - Cart Badge Dot
updateFile('components/navigation/Navbar.tsx', /\{displayCount > 0 && \([\s\S]*?\{displayCount\}\n\s*<\/span>\n\s*\)\}/g, `{displayCount > 0 && (
                  <span className="absolute top-[8px] right-[6px] w-[6px] h-[6px] bg-bauto-carbon rounded-full animate-fade-in" aria-hidden="true"></span>
                )}`);

// 2. CARRITO - Remove PCI-DSS text
updateFile('components/cart/Carrito.tsx', /<div className="mt-4 pt-3 border-t border-bauto-carbon\/10 flex items-center justify-center gap-1.5 opacity-50">[\s\S]*?<\/div>/g, '');
updateFile('components/cart/Carrito.tsx', /<div className="mt-4 pt-3 border-t border-bauto-carbon\/5 flex items-center justify-center gap-1.5 opacity-50">[\s\S]*?<\/div>/g, '');
// And remove empty state poem
updateFile('components/cart/Carrito.tsx', /<p className="font-editorial italic text-xs sm:text-sm text-bauto-piedra leading-relaxed max-w-\[200px\] mx-auto">[\s\S]*?<\/p>/g, '');

// 3. CARRITO / FREE SHIPPING - Remove FreeShippingBar logic
// Carrito.tsx
updateFile('components/cart/Carrito.tsx', /import \{ FreeShippingBar \} from '\.\/FreeShippingBar';\n/g, '');
updateFile('components/cart/Carrito.tsx', /<FreeShippingBar \/>/g, '');

// cartStore.ts
updateFile('lib/cartStore.ts', /export const FREE_SHIPPING_THRESHOLD = 300000;\n/g, '');
updateFile('lib/cartStore.ts', /getAmountToFreeShipping: \(\) => number;/g, '');
updateFile('lib/cartStore.ts', /getAmountToFreeShipping: \(\) => \{[\s\S]*?\},/g, '');

// 4. SIZE SELECTOR
let sizeSelectorRegex = /<button[\s\S]*?className={`relative flex items-center justify-center h-10 min-w-\[46px\] px-3\.5 text-xs font-body font-normal transition-all duration-200 active:scale-95 \$\{[\s\S]*?isSelected[\s\S]*?\? 'bg-bauto-carbon text-white '[\s\S]*?: !stock[\s\S]*?\? 'text-bauto-carbon hover:'[\s\S]*?: 'text-bauto-piedra\/30 cursor-not-allowed opacity-40'[\s\S]*?\}`\}[\s\S]*?>/g;
updateFile('components/product/SizeSelector.tsx', sizeSelectorRegex, `<button
                  type="button"
                  onClick={() => {
                    if (stock && stock > 0) {
                      playHapticClick();
                      onSizeSelect(size);
                    }
                  }}
                  disabled={!stock || stock === 0}
                  className={\`relative flex items-center justify-center h-8 px-2 mx-1 text-xs font-body transition-colors border-b \${
                    isSelected
                      ? 'border-bauto-carbon text-bauto-carbon'
                      : (stock && stock > 0)
                      ? 'border-transparent text-bauto-carbon hover:border-bauto-carbon/30'
                      : 'border-transparent text-bauto-piedra/30 cursor-not-allowed opacity-40'
                  }\`}
                >`);
// Availability text
updateFile('components/product/SizeSelector.tsx', /\? 'Última pieza disponible en taller'\n\s*: `\$\{stockPorTalla\[selectedSize\]\} piezas disponibles en esta talla`/g, `? 'Últimas piezas en taller'\n                    : 'Disponible en taller'`);
updateFile('components/product/SizeSelector.tsx', /stockPorTalla\[selectedSize\] === 1/g, 'stockPorTalla[selectedSize] <= 2');

// 5. BUTTONS
updateFile('components/product/ProductDetailClient.tsx', /w-full py-4 text-xs font-sans font-medium/g, 'w-full py-3 text-[11px] uppercase tracking-[0.15em] font-sans font-light');
updateFile('components/cart/Carrito.tsx', /w-full py-3\.5 px-6 flex items-center justify-between text-xs font-medium/g, 'w-full py-3 px-6 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] font-light');

// 6. VIDEOHERO & MAP
updateFile('components/media/VideoHero.tsx', /bg-bauto-carbon\/40 hover:bg-bauto-carbon\/70 backdrop-blur-md/g, 'bg-transparent text-bauto-nube/70 hover:text-bauto-nube');
updateFile('components/map/BoutiqueMap.tsx', /bg-bauto-nube\/95 backdrop-blur-md px-3\.5 py-1\.5/g, 'bg-transparent');
updateFile('components/map/BoutiqueMap.tsx', /bg-bauto-nube\/95 backdrop-blur-md px-3\.5 py-2/g, 'bg-transparent');
updateFile('components/map/BoutiqueMap.tsx', /bg-bauto-nube\/95 hover:bg-bauto-nube backdrop-blur-md/g, 'bg-transparent');
updateFile('components/map/BoutiqueMap.tsx', /px-3 py-1\.5 text-\[11px\]/g, 'text-[10px] uppercase tracking-[0.15em] hover:opacity-70');
updateFile('components/map/BoutiqueMap.tsx', /bg-bauto-nube\/95 backdrop-blur-md px-4 py-3/g, 'bg-transparent px-4 py-3');
updateFile('components/map/BoutiqueMap.tsx', /absolute top-4 left-4/g, 'absolute top-6 left-6');
updateFile('components/map/BoutiqueMap.tsx', /absolute bottom-4 left-4/g, 'absolute bottom-6 left-6');

// 7. FILOSOFIA
updateFile('app/filosofia/page.tsx', /divide-y divide-bauto-carbon\/10/g, '');
updateFile('app/filosofia/page.tsx', /py-16 sm:py-24/g, 'py-24 sm:py-32');

