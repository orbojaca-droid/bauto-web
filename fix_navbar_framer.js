const fs = require('fs');

let content = fs.readFileSync('components/navigation/Navbar.tsx', 'utf8');

// Add AnimatePresence import
content = content.replace(/import \{ ShoppingBag, Menu, X, Compass, MapPin, PackageCheck, BookOpen \} from 'lucide-react';/g, "import { ShoppingBag, Menu, X, Compass, MapPin, PackageCheck, BookOpen } from 'lucide-react';\nimport { motion, AnimatePresence } from 'framer-motion';");

// Replace {mobileMenuOpen && ( ... )} with AnimatePresence
let oldMenu = ` {/* Menú Cortina Móvil (Ergonomía iPhone Safari) */}
 {mobileMenuOpen && (
 <div 
 className="fixed inset-0 z-30 lg:hidden bg-bauto-carbon/30 backdrop-blur-sm animate-fade-in"
 onClick={() => setMobileMenuOpen(false)}
 >
 <div 
 className="absolute top-[65px] left-0 right-0 bg-bauto-nube p-6 animate-slide-up"
 onClick={(e) => e.stopPropagation()}
 >`;

let newMenu = ` {/* Menú Cortina Móvil (Ergonomía iPhone Safari) */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
 className="fixed inset-0 z-30 lg:hidden bg-bauto-carbon/30 backdrop-blur-sm"
 onClick={() => setMobileMenuOpen(false)}
 >
 <motion.div 
 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
 className="absolute top-[65px] left-0 right-0 bg-bauto-nube p-6"
 onClick={(e) => e.stopPropagation()}
 >`;

content = content.replace(oldMenu, newMenu);

// Fix closing tags
let oldClose = ` </div>
 </div>
 )}
 </>
 );
}`;

let newClose = ` </div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}`;

content = content.replace(oldClose, newClose);

fs.writeFileSync('components/navigation/Navbar.tsx', content);

