const fs = require('fs');

let content = fs.readFileSync('app/carrito/page.tsx', 'utf8');

// The original ternary was:
// {shippingCost === 0 ? ( {formatCOP(shippingCost)} ) : ( formatCOP(shippingCost) )}
// Let's replace the entire block with just formatCOP(shippingCost)

content = content.replace(/\{shippingCost === 0 \? \(\s*\{formatCOP\(shippingCost\)\}\s*\) : \(\s*formatCOP\(shippingCost\)\s*\)\}/g, 'formatCOP(shippingCost)');

fs.writeFileSync('app/carrito/page.tsx', content);
