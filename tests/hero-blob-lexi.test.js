import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Hero Blob Stacking and Lexi AI Signature Blue Color', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'css/style.css'), 'utf8');

  it('ensures hero section and blob exist on index.html', () => {
    expect(indexHtml).toContain('<div class="orb"></div>');
    expect(indexHtml).toContain('id="dynamic-greeting"');
    expect(indexHtml).toContain('All you want, all in one place.');
    expect(indexHtml).toContain('Powered by Unstoppable AI');
  });

  it('ensures hero text has z-index: 1, user-select: none, and pointer-events: none', () => {
    const textStyleMatch = styleCss.match(/\.hero-content\s+h1[\s\S]*?\{([\s\S]*?)\}/);
    expect(textStyleMatch).toBeTruthy();
    const textBody = textStyleMatch[1];
    expect(textBody).toContain('z-index: 1');
    expect(textBody).toContain('user-select: none');
    expect(textBody).toContain('pointer-events: none');
  });

  it('ensures the hero blob (.orb) has z-index: 2 (+1 over text) and pointer-events: auto', () => {
    const orbStyleMatch = styleCss.match(/\.orb\s*\{([\s\S]*?)\}/);
    expect(orbStyleMatch).toBeTruthy();
    const orbBody = orbStyleMatch[1];
    expect(orbBody).toContain('z-index: 2');
    expect(orbBody).toContain('pointer-events: auto');
  });

  it('ensures Lexi AI orb (#siri-orb) has signature blue gradient between dark and light blue', () => {
    const siriOrbMatch = styleCss.match(/#siri-orb\s*\{([\s\S]*?)\}/);
    expect(siriOrbMatch).toBeTruthy();
    const siriBody = siriOrbMatch[1];
    expect(siriBody).toContain('#0a192f'); // dark blue
    expect(siriBody).toContain('#38bdf8'); // light sky blue
    expect(siriBody).not.toContain('color-cycle'); // does not cycle to rainbow/pink
  });

  it('ensures sitewide Lexi AI orb (.sitewide-lexi-orb) has matching signature blue gradient', () => {
    const sitewideMatch = styleCss.match(/\.sitewide-lexi-orb\s*\{([\s\S]*?)\}/);
    expect(sitewideMatch).toBeTruthy();
    const sitewideBody = sitewideMatch[1];
    expect(sitewideBody).toContain('#0a192f');
    expect(sitewideBody).toContain('#38bdf8');
    expect(sitewideBody).not.toContain('color-cycle');
  });
});
