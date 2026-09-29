const fs = require('fs');

let content = fs.readFileSync('components/cart/Carrito.tsx', 'utf8');

// Replace the JSX for shipping cost
content = content.replace(/\{shippingCost === 0 \? \([\s\S]*?formatCOP\(shippingCost\)\n\s*\)\}/g, '{formatCOP(shippingCost)}');

fs.writeFileSync('components/cart/Carrito.tsx', content);

