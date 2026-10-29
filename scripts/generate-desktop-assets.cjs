const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const sourceLogo = path.join(rootDir, 'images', 'medixly-logo.png');
const buildDir = path.join(rootDir, 'desktop', 'build');
const iconsetDir = path.join(buildDir, 'icon.iconset');

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

if (!fs.existsSync(iconsetDir)) {
  fs.mkdirSync(iconsetDir, { recursive: true });
}

console.log('Generating macOS app icons from', sourceLogo);

const iconSizes = [
  { name: 'icon_16x16.png', size: 16 },
  { name: 'icon_16x16@2x.png', size: 32 },
  { name: 'icon_32x32.png', size: 32 },
  { name: 'icon_32x32@2x.png', size: 64 },
  { name: 'icon_128x128.png', size: 128 },
  { name: 'icon_128x128@2x.png', size: 256 },
  { name: 'icon_256x256.png', size: 256 },
  { name: 'icon_256x256@2x.png', size: 512 },
  { name: 'icon_512x512.png', size: 512 },
  { name: 'icon_512x512@2x.png', size: 1024 }
];

for (const item of iconSizes) {
  const destPath = path.join(iconsetDir, item.name);
  execSync(`sips -z ${item.size} ${item.size} "${sourceLogo}" --out "${destPath}"`, { stdio: 'ignore' });
}

// Convert iconset to .icns
const icnsDest = path.join(buildDir, 'icon.icns');
try {
  execSync(`iconutil -c icns "${iconsetDir}" -o "${icnsDest}"`);
  console.log('Successfully created', icnsDest);
} catch (e) {
  console.warn('iconutil warning:', e.message);
}

// Generate Tray Icons
const trayIcon16 = path.join(buildDir, 'tray-icon.png');
const trayIcon32 = path.join(buildDir, 'tray-icon@2x.png');
execSync(`sips -z 18 18 "${sourceLogo}" --out "${trayIcon16}"`, { stdio: 'ignore' });
execSync(`sips -z 36 36 "${sourceLogo}" --out "${trayIcon32}"`, { stdio: 'ignore' });
console.log('Generated tray icons:', trayIcon16, trayIcon32);

// Generate 512x512 png icon for electron-builder
const iconPng512 = path.join(buildDir, 'icon.png');
execSync(`sips -z 512 512 "${sourceLogo}" --out "${iconPng512}"`, { stdio: 'ignore' });

// Clean up iconset temp folder
fs.rmSync(iconsetDir, { recursive: true, force: true });
console.log('macOS desktop assets generated successfully!');
