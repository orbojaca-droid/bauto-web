const fs = require('fs');
const files = ['app/page.tsx', 'app/journal/page.tsx', 'app/catalogo/page.tsx', 'app/tienda-santa-marta/page.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Use a temporary token to avoid overlapping replacements
  content = content.replace(/\bpy-16\b/g, '__TMP_PAD__');
  content = content.replace(/\bpy-24\b/g, '__TMP_PAD__');
  content = content.replace(/__TMP_PAD__/g, 'py-20 sm:py-24 md:py-32');
  fs.writeFileSync(file, content);
});
