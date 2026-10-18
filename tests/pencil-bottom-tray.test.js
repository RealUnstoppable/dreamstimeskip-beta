import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Pencil 1 Bottom Tray Component', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

  it('ensures old obstructive #preregister-popup-overlay is replaced with bottom tray', () => {
    expect(indexHtml).not.toContain('<div id="preregister-popup-overlay">');
    expect(indexHtml).toContain('id="pencil-bottom-tray"');
    expect(indexHtml).toContain('class="pencil-bottom-tray collapsed"');
  });

  it('ensures the tray has a red notification circle next to the title', () => {
    expect(indexHtml).toContain('class="tray-notif-circle"');
    expect(indexHtml).toContain('class="tray-header-left"');
    // Circle is inside header-left next to label
    const headerLeftBlock = indexHtml.match(/<div class="tray-header-left">([\s\S]*?)<\/div>/);
    expect(headerLeftBlock).toBeTruthy();
    expect(headerLeftBlock[1]).toContain('tray-notif-circle');
    expect(headerLeftBlock[1]).toContain("The last pencil you'll ever buy.");
  });

  it('ensures the tray contains drag handle and header controls', () => {
    expect(indexHtml).toContain('class="tray-handle-bar"');
    expect(indexHtml).toContain('id="tray-drag-header"');
    expect(indexHtml).toContain('class="tray-chevron-btn"');
    expect(indexHtml).toContain('class="tray-close-btn');
  });

  it('ensures button gradient is removed and styled white with black text', () => {
    // In CSS
    const btnCssMatch = indexHtml.match(/\.popup-preregister-btn,\s*\.tray-preregister-btn\s*\{([\s\S]*?)\}/);
    expect(btnCssMatch).toBeTruthy();
    const btnCss = btnCssMatch[1];
    expect(btnCss).toContain('background: #ffffff');
    expect(btnCss).toContain('color: #000000');
    expect(btnCss).not.toContain('linear-gradient');
    expect(btnCss).not.toContain('radial-gradient');
  });

  it('ensures content includes product image, headline, and Pre-register CTA link', () => {
    expect(indexHtml).toContain('src="/images/Pencil-1-logo-light.png"');
    expect(indexHtml).toContain("The last pencil you'll ever buy.");
    expect(indexHtml).toContain('href="https://realunstoppable.store/sign%20in%20beta.html"');
    expect(indexHtml).toContain('Pre-register Now');
  });

  it('ensures bottom tray dragging and state script is implemented', () => {
    expect(indexHtml).toContain('pointerdown');
    expect(indexHtml).toContain('pointermove');
    expect(indexHtml).toContain('pointerup');
    expect(indexHtml).toContain('expandTray');
    expect(indexHtml).toContain('collapseTray');
    expect(indexHtml).toContain('dismissTray');
    expect(indexHtml).toContain('pencilTrayDismissed');
  });

  it('ensures bottom tray CSS positions element at bottom and handles collapsed/expanded states', () => {
    expect(indexHtml).toContain('.pencil-bottom-tray {');
    expect(indexHtml).toContain('position: fixed');
    expect(indexHtml).toContain('bottom: 0');
    expect(indexHtml).toContain('.pencil-bottom-tray.visible.collapsed');
    expect(indexHtml).toContain('.pencil-bottom-tray.visible.expanded');
    expect(indexHtml).toContain('.tray-notif-circle');
    expect(indexHtml).toContain('background-color: #ff3b30');
  });
});
