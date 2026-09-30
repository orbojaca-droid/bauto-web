const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find app components -name "*.tsx" -type f').toString().trim().split('\n');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Update padding for outer containers
  content = content.replace(/px-4 sm:px-6 lg:px-8/g, 'px-6 sm:px-8 lg:px-12');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
