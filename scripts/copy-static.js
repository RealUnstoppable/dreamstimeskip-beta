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

// Helper to sync a static file
function syncStaticFile(filename) {
  const src = path.join(rootDir, filename);
  const dist = path.join(distDir, filename);
  const pub = path.join(publicDir, filename);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dist);
    fs.copyFileSync(src, pub);
    console.log(`[build] Synced ${filename} -> dist/ & public/`);
  }
}

// Ensure public directory exists
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

syncStaticFile('ads.txt');
syncStaticFile('robots.txt');
syncStaticFile('sitemap.xml');
