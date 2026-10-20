import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Ensure ads.txt is copied to dist/ads.txt
const srcAdsTxt = path.join(rootDir, 'ads.txt');
const distAdsTxt = path.join(distDir, 'ads.txt');

if (fs.existsSync(srcAdsTxt)) {
  fs.copyFileSync(srcAdsTxt, distAdsTxt);
  console.log(`[build] Successfully copied ads.txt -> ${distAdsTxt}`);
} else {
  console.warn(`[build] Warning: ${srcAdsTxt} not found!`);
}

// Ensure public/ads.txt also exists
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const publicAdsTxt = path.join(publicDir, 'ads.txt');
if (fs.existsSync(srcAdsTxt) && !fs.existsSync(publicAdsTxt)) {
  fs.copyFileSync(srcAdsTxt, publicAdsTxt);
  console.log(`[build] Synced ads.txt -> ${publicAdsTxt}`);
}
