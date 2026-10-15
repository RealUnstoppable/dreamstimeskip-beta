import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Bento Grid & Bento Harmony Pulse Stability', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'css/style.css'), 'utf8');

  it('ensures #bento-harmony exists in index.html with correct structure', () => {
    expect(indexHtml).toContain('id="bento-harmony"');
    expect(indexHtml).toContain('class="bento-card reveal"');
  });

  it('ensures bentoSongPulse animation has NO transform property in any keyframe (stays in place)', () => {
    const keyframesMatch = indexHtml.match(/@keyframes\s+bentoSongPulse\s*\{([\s\S]*?)\}\s*(?:#bento-harmony|\.music-wave-bg)/);
    expect(keyframesMatch).toBeTruthy();
    const keyframesBody = keyframesMatch[1];
    expect(keyframesBody).not.toContain('transform');
    expect(keyframesBody).not.toContain('translate');
    expect(keyframesBody).not.toContain('scale');
  });

  it('ensures #bento-harmony has z-index to prevent slipping under adjacent cards', () => {
    const harmonyStyleMatch = indexHtml.match(/#bento-harmony\s*\{([\s\S]*?)\}/);
    expect(harmonyStyleMatch).toBeTruthy();
    const harmonyBody = harmonyStyleMatch[1];
    expect(harmonyBody).toContain('z-index');
  });

  it('ensures #bento-harmony:hover elevates z-index and pauses animation cleanly', () => {
    const hoverMatch = indexHtml.match(/#bento-harmony:hover\s*\{([\s\S]*?)\}/);
    expect(hoverMatch).toBeTruthy();
    const hoverBody = hoverMatch[1];
    expect(hoverBody).toContain('z-index');
    expect(hoverBody).toContain('animation-play-state: paused');
    expect(hoverBody).toContain('transform: translateY(-8px)');
    expect(hoverBody).not.toContain('scale');
  });

  it('ensures .bento-card:hover in style.css has z-index: 2 for clean elevation', () => {
    const bentoCardHoverMatch = styleCss.match(/\.bento-card:hover\s*\{([\s\S]*?)\}/);
    expect(bentoCardHoverMatch).toBeTruthy();
    const bentoCardHoverBody = bentoCardHoverMatch[1];
    expect(bentoCardHoverBody).toContain('z-index: 2');
  });
});
