const fs = require('fs');

let content = fs.readFileSync('components/cart/Carrito.tsx', 'utf8');

// Imports
content = content.replace(/import \{ X, Compass \} from 'lucide-react';/g, "import { X, Compass } from 'lucide-react';\nimport { motion, AnimatePresence } from 'framer-motion';");

// Remove early return for isOpen
content = content.replace(/if \(!isHydrated \|\| !isOpen\) return null;/g, 'if (!isHydrated) return null;');

// Wrap return with AnimatePresence
content = content.replace(/return \(\n <div className="fixed inset-0 z-50 flex justify-end">/g, `return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-50 flex justify-end">`);

// Add closing tags
content = content.replace(/ <\/aside>\n <\/div>\n \);\n\}/g, ` </motion.aside>\n </div>\n )}\n </AnimatePresence>\n );\n}`);

// Motion div for backdrop
content = content.replace(/<div\n className="fixed inset-0 bg-bauto-carbon\/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"\n onClick=\{handleClose\}\n aria-hidden="true"\n \/>/g, `<motion.div
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
 className="fixed inset-0 bg-bauto-carbon/40 backdrop-blur-sm"
 onClick={handleClose}
 aria-hidden="true"
 />`);

// Motion aside for drawer
// Removing transition-all duration-300
content = content.replace(/<aside\n className=\{`relative z-10 w-full sm:max-w-md bg-bauto-nube flex flex-col transition-all duration-300 \$\{/g, `<motion.aside
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
 className={\`relative z-10 w-full sm:max-w-md bg-bauto-nube flex flex-col \${`);

// Also fix buttons active scale globally
content = content.replace(/active:scale-\[0\.97\]/g, ''); // Clear duplicates if any
content = content.replace(/hover:bg-bauto-carbon-soft transition-all duration-200/g, 'hover:bg-bauto-carbon-soft transition-all duration-[160ms] ease-out active:scale-[0.97]');
content = content.replace(/hover:bg-bauto-carbon-soft transition-colors text-\[11px\]/g, 'hover:bg-bauto-carbon-soft transition-all duration-[160ms] ease-out active:scale-[0.97] text-[11px]');

fs.writeFileSync('components/cart/Carrito.tsx', content);

