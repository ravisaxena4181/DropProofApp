const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../node_modules/react-native-vector-icons/fonts');
const targetDir = path.resolve(__dirname, '../android/app/src/main/assets/fonts');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFonts() {
  ensureDir(targetDir);
  if (!fs.existsSync(srcDir)) {
    console.error('Source fonts directory not found:', srcDir);
    process.exit(1);
  }

  const files = fs.readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.ttf'));
  if (files.length === 0) {
    console.error('No .ttf font files found in', srcDir);
    process.exit(1);
  }

  files.forEach((file) => {
    const src = path.join(srcDir, file);
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
    console.log('Copied', file);
  });
  console.log('All fonts copied to', targetDir);
}

copyFonts();
