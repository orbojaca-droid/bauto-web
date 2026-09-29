const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find components app -name "*.tsx" -type f').toString().trim().split('\n');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Remove subtle structural borders
  content = content.replace(/\bborder-(b|t|l|r|x|y)\s+border-bauto-carbon\/(5|10|15|20|30|\[0\.06\]|\[0\.08\])\b/g, '');
  content = content.replace(/\bborder\s+border-bauto-carbon\/(5|10|15|20|30|\[0\.06\]|\[0\.08\])\b/g, '');
  content = content.replace(/\bborder-(b|t|l|r|x|y)\s+border-bauto-piedra\/(30|10)\b/g, '');
  content = content.replace(/\bborder-l-2\s+border-bauto-arena\b/g, '');
  
  // Remove shadows
  content = content.replace(/\bshadow-(sm|md|lg|2xl|elevated|subtle)\b/g, '');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
