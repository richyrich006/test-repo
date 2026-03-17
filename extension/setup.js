// Copies Readability.js from node_modules into the extension folder.
// Run once with: npm run setup

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'node_modules', '@mozilla', 'readability', 'Readability.js');
const dest = path.join(__dirname, 'Readability.js');

if (!fs.existsSync(src)) {
  console.error('Error: @mozilla/readability not found. Run `npm install` first.');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('✓ Readability.js copied to extension/Readability.js');
