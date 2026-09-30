const fs = require('fs');

let content = fs.readFileSync('components/product/ProductCard.tsx', 'utf8');

// Add useState
content = content.replace(/import React from 'react';/g, "import React, { useState } from 'react';");

// Add state to component
content = content.replace(/export function ProductCard\(\{ product, priority = false \}: ProductCardProps\) \{/g, `export function ProductCard({ product, priority = false }: ProductCardProps) {\n  const [isLoaded, setIsLoaded] = useState(false);`);

// Modify img tag
let oldImg = `<img
 src={imageUrl}
 alt={product.name}
 loading={priority ? 'eager' : 'lazy'}
 className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
 />`;

let newImg = `<img
 src={imageUrl}
 alt={product.name}
 loading={priority ? 'eager' : 'lazy'}
 data-loaded={isLoaded}
 onLoad={() => setIsLoaded(true)}
 onError={() => setIsLoaded(true)}
 className="w-full h-full object-cover object-center transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] data-[loaded=false]:opacity-0 data-[loaded=false]:scale-95 data-[loaded=true]:opacity-100 data-[loaded=true]:scale-100"
 />`;

content = content.replace(oldImg, newImg);

fs.writeFileSync('components/product/ProductCard.tsx', content);

