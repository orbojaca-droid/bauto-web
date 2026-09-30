const fs = require('fs');

let content = fs.readFileSync('components/product/CatalogGrid.tsx', 'utf8');

// Import framer-motion
content = content.replace(/import \{ Search, X \} from 'lucide-react';/g, "import { Search, X } from 'lucide-react';\nimport { motion } from 'framer-motion';");

// Container variants
const containerVariants = `
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
`;
content = content.replace(/return \(\n    <div className="flex flex-col gap-8">/g, `${containerVariants}\n  return (\n    <div className="flex flex-col gap-8">`);

// Replace the grid container with motion.div
let oldGrid = `<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.reference} product={product} />
          ))}
        </div>`;
        
let newGrid = `<motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {filteredProducts.map((product, i) => (
            <motion.div 
              key={product.id || product.reference}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.5 } }
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('components/product/CatalogGrid.tsx', content);

