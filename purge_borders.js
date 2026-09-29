const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('find components app -name "*.tsx" -type f').toString().trim().split('\n');

const classesToRemove = [
  'border-b border-bauto-carbon/5',
  'border-t border-bauto-carbon/5',
  'border-b border-bauto-carbon/10',
  'border-t border-bauto-carbon/10',
  'border-b border-bauto-carbon/[0.08]',
  'border-t border-b border-bauto-carbon/[0.08]',
  'border-t border-bauto-carbon/[0.08]',
  'border-t border-bauto-carbon/[0.06]',
  'border border-bauto-carbon/10',
  'border border-bauto-carbon/15',
  'border border-bauto-carbon/[0.06]',
  'shadow-sm',
  'shadow-md',
  'shadow-lg',
  'shadow-elevated',
  'shadow-subtle',
  'shadow-2xl',
  'bg-white/95 backdrop-blur-sm border border-bauto-carbon/\\[0.06\\]',
  'border-l-2 border-bauto-arena',
  'border-b border-bauto-piedra/30 pb-0.5'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  classesToRemove.forEach(cls => {
    // Escape brackets for regex
    const regex = new RegExp(cls.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\//g, '\\/'), 'g');
    content = content.replace(regex, '');
  });
  
  // Clean up double spaces created by removal
  content = content.replace(/  +/g, ' ');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
