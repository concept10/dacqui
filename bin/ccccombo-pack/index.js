// index.js
// "I MADE YOU A COMBO PACK!" - create a combo-pack of your Node.js project

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const packageJson = require('./package.json');

const outputFilePath = path.join(__dirname, 'combo-pack.cmb-pck');
const output = fs.createWriteStream(outputFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`Combo-pack created: ${outputFilePath} (${archive.pointer()} total bytes)`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add package.json
archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });

// Add README.md if it exists
const readmePath = path.join(__dirname, 'README.md');
if (fs.existsSync(readmePath)) {
  archive.file(readmePath, { name: 'README.md' });
}

// Add source code
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  archive.directory(srcDir, 'src');
}

// Finalize the archive
archive.finalize();