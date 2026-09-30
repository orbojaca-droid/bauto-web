const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find components app -name "*.tsx" -type f').toString().trim().split('\n');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace "Boutique" with "Studio" (case-sensitive replacements)
  content = content.replace(/Boutique Santa Marta/g, 'Studio Santa Marta');
  content = content.replace(/boutique/g, 'Studio');
  content = content.replace(/Boutique/g, 'Studio');
  
  // Re-adjust links if we accidentally broke them (e.g. /tienda-santa-marta was untouched because it doesn't contain "boutique")
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
