import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Unstoppable Section Width & Aspect Ratio Stability', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'css/style.css'), 'utf8');
  const style2Css = fs.readFileSync(path.join(ROOT_DIR, 'css/style 2.css'), 'utf8');

  it('ensures .scroll-container has overflow-x: hidden in style.css to prevent horizontal scrolling', () => {
    const scrollContainerMatch = styleCss.match(/\.scroll-container\s*\{([\s\S]*?)\}/);
    expect(scrollContainerMatch).toBeTruthy();
    expect(scrollContainerMatch[1]).toContain('overflow-x: hidden');
  });

  it('ensures .brand-section has overflow: hidden in style.css', () => {
    const brandSectionMatch = styleCss.match(/\.brand-section\s*\{([\s\S]*?)\}/);
    expect(brandSectionMatch).toBeTruthy();
    expect(brandSectionMatch[1]).toContain('overflow: hidden');
  });

  it('ensures .section-background has overflow: hidden in style.css to clip background video overflow', () => {
    const sectionBgMatch = styleCss.match(/\.section-background\s*\{([\s\S]*?)\}/);
    expect(sectionBgMatch).toBeTruthy();
    expect(sectionBgMatch[1]).toContain('overflow: hidden');
  });

  it('ensures .section-background iframe locks correctly to 16:9 aspect ratio in style.css', () => {
    const bgIframeMatch = styleCss.match(/\.section-background\s+iframe\s*\{([\s\S]*?)\}/);
    expect(bgIframeMatch).toBeTruthy();
    const rules = bgIframeMatch[1];
    expect(rules).toContain('width: 100vw');
    expect(rules).toContain('height: 56.25vw');
    expect(rules).toContain('min-height: 100vh');
    expect(rules).toContain('min-width: 177.77vh');
    expect(rules).toContain('transform: translate(-50%, -50%)');
  });

  it('ensures #unstoppable section in index.html is contained and clipped', () => {
    expect(indexHtml).toContain('id="unstoppable"');
    const unstoppableMatch = indexHtml.match(/<section[^>]*id="unstoppable"[^>]*>/);
    expect(unstoppableMatch).toBeTruthy();
    const tag = unstoppableMatch[0];
    expect(tag).toContain('overflow: hidden');
    expect(tag).toContain('max-width: 100vw');
  });

  it('ensures .video-wrapper in index.html preserves 16:9 aspect ratio with 56.25% padding', () => {
    const videoWrapperMatch = indexHtml.match(/<div[^>]*class="video-wrapper"[^>]*>/);
    expect(videoWrapperMatch).toBeTruthy();
    const tag = videoWrapperMatch[0];
    expect(tag).toContain('padding-bottom: 56.25%');
    expect(tag).toContain('overflow: hidden');
    expect(tag).toContain('max-width: 800px');
  });

  it('ensures mobile media query handles .brand-content and #unstoppable responsiveness', () => {
    const startIndex = indexHtml.indexOf('@media (max-width: 600px)');
    expect(startIndex).toBeGreaterThan(-1);
    const endIndex = indexHtml.indexOf('/* --- END: Medixly Styling --- */', startIndex);
    const queryBody = indexHtml.substring(startIndex, endIndex);
    expect(queryBody).toContain('#unstoppable');
    expect(queryBody).toContain('youtube-container');
    expect(queryBody).toContain('box-sizing: border-box');
  });

  it('ensures style 2.css has overflow-x hidden on scroll-container and overflow hidden on section-background', () => {
    const scrollContainerMatch = style2Css.match(/\.scroll-container\s*\{([\s\S]*?)\}/);
    expect(scrollContainerMatch).toBeTruthy();
    expect(scrollContainerMatch[1]).toContain('overflow-x: hidden');

    const sectionBgMatch = style2Css.match(/\.section-background\s*\{([\s\S]*?)\}/);
    expect(sectionBgMatch).toBeTruthy();
    expect(sectionBgMatch[1]).toContain('overflow: hidden');
  });
});
