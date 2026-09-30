const fs = require('fs');

let content = fs.readFileSync('components/product/SizeSelector.tsx', 'utf8');

content = content.replace(/import React from 'react';/, "import React from 'react';\nimport { motion } from 'framer-motion';");

let oldButton = ` <button
 key={size}
 type="button"
 disabled={!isAvailable}
 onClick={() => {
 if (isAvailable) {
 playHapticClick();
 onSelectSize(size);
 }
 }}
 className={\`h-10 min-w-[46px] px-3.5 text-xs font-body font-normal transition-colors flex items-center justify-center \${
 isSelected
 ? 'bg-bauto-carbon text-white border border-bauto-carbon'
 : isAvailable
 ? ' text-bauto-carbon hover:border-bauto-carbon'
 : ' text-bauto-piedra/30 cursor-not-allowed opacity-40'
 }\`}
 >
 <span>{size}</span>
 </button>`;

let newButton = ` <button
 key={size}
 type="button"
 disabled={!isAvailable}
 onClick={() => {
 if (isAvailable) {
 playHapticClick();
 onSelectSize(size);
 }
 }}
 className={\`relative h-10 min-w-[46px] px-3.5 text-xs font-body font-normal transition-colors flex items-center justify-center active:scale-95 \${
 isSelected
 ? 'text-white'
 : isAvailable
 ? 'text-bauto-carbon hover:bg-bauto-carbon/5'
 : 'text-bauto-piedra/30 cursor-not-allowed opacity-40'
 }\`}
 >
 {isSelected && (
   <motion.div
     layoutId="activeSize"
     className="absolute inset-0 bg-bauto-carbon"
     transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
   />
 )}
 <span className="relative z-10">{size}</span>
 </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('components/product/SizeSelector.tsx', content);

