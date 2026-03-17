// Copies third-party libraries from node_modules into the extension folder.
// Run once with: npm run setup

const fs = require('fs');
const path = require('path');

function copy(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.error(`Error: ${label} not found at ${src}. Run \`npm install\` first.`);
    process.exit(1);
  }
  fs.copyFileSync(src, dest);
  console.log(`✓ ${label} copied to extension/${path.basename(dest)}`);
}

copy(
  path.join(__dirname, 'node_modules', '@mozilla', 'readability', 'Readability.js'),
  path.join(__dirname, 'Readability.js'),
  '@mozilla/readability'
);

copy(
  path.join(__dirname, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.min.js'),
  path.join(__dirname, 'pdf.min.js'),
  'pdfjs-dist (core)'
);

copy(
  path.join(__dirname, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.js'),
  path.join(__dirname, 'pdf.worker.min.js'),
  'pdfjs-dist (worker)'
);
