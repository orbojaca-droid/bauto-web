const fs = require('fs');

function replace(file, regex, replaceStr) {
    if (!fs.existsSync(file)) return;
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(regex, replaceStr);
    fs.writeFileSync(file, c);
}

// 1. Backend Wompi Session
replace('app/api/checkout/wompi-session/route.ts', /const shippingAmountInCents = subtotalCents >= 30000000 \? 0 : 1500000;/g, 'const shippingAmountInCents = 1500000;');

// 2. Checkout page (app/carrito/page.tsx)
replace('app/carrito/page.tsx', /<span className="text-bauto-carbon\/80 font-normal">De cortesía<\/span>/g, '{formatCOP(shippingCost)}');
replace('app/carrito/page.tsx', /const shippingCost = subtotal >= 300000 \? 0 : 15000;/g, 'const shippingCost = 15000;');

// 3. Product Details
replace('components/product/ProductDetailClient.tsx', /<p>· Entrega de cortesía nacional en compras superiores a \$300\.000 COP\.<\/p>/g, '');

// 4. Ayuda
replace('app/ayuda/page.tsx', /<strong className="text-bauto-carbon font-medium">Entrega de cortesía:<\/strong> Disfrutas de entrega nacional sin costo en compras superiores a <strong>\$300\.000 COP<\/strong>\. Para órdenes menores, la tarifa plana es de <strong>\$15\.000 COP<\/strong>\./g, '<strong className="text-bauto-carbon font-medium">Tarifa de envío nacional:</strong> Todos nuestros despachos nacionales tienen una tarifa plana de <strong>$15.000 COP</strong>.');

// 5. Email HTML
replace('lib/email.ts', /\$\{data\.shippingCost === 0 \? '<span style="color: #16A34A; font-weight: 600;">Cortesía<\/span>' : formatCOP\(data\.shippingCost\)\}/g, '${formatCOP(data.shippingCost)}');

