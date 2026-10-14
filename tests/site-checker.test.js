import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import {
  formatCurrentDate,
  checkPageIntegrity,
  checkScriptSyntax,
  performSiteChecks,
  updateIndexHtml,
  ECOSYSTEM_SYSTEMS
} from '../scripts/site-checker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Site Health & Status Checker', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-checker-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('formatCurrentDate', () => {
    it('formats a date correctly into MMM D, YYYY', () => {
      const date = new Date(2026, 9, 13); // Oct 13, 2026
      expect(formatCurrentDate(date)).toBe('Oct 13, 2026');
    });

    it('formats single-digit days correctly', () => {
      const date = new Date(2026, 7, 5); // Aug 5, 2026
      expect(formatCurrentDate(date)).toBe('Aug 5, 2026');
    });

    it('formats leap year and end-of-year dates', () => {
      const date = new Date(2028, 1, 29); // Feb 29, 2028
      expect(formatCurrentDate(date)).toBe('Feb 29, 2028');
    });
  });

  describe('checkPageIntegrity', () => {
    it('returns error if file does not exist', () => {
      const res = checkPageIntegrity(tempDir, 'nonexistent.html');
      expect(res.exists).toBe(false);
      expect(res.issues.length).toBeGreaterThan(0);
      expect(res.issues[0]).toContain('does not exist');
    });

    it('detects missing critical assets and structural issues', () => {
      const pagePath = path.join(tempDir, 'broken.html');
      fs.writeFileSync(pagePath, '<div>Missing tags and assets <link rel="stylesheet" href="missing.css"> <script src="missing.js"></script></div>');

      const res = checkPageIntegrity(tempDir, 'broken.html');
      expect(res.exists).toBe(true);
      expect(res.issues.some(i => i.includes('Missing <html>'))).toBe(true);
      expect(res.issues.some(i => i.includes('missing.css'))).toBe(true);
      expect(res.issues.some(i => i.includes('missing.js'))).toBe(true);
    });

    it('passes for a valid page with existing local assets', () => {
      const cssPath = path.join(tempDir, 'style.css');
      fs.writeFileSync(cssPath, 'body { color: red; }');

      const pagePath = path.join(tempDir, 'valid.html');
      fs.writeFileSync(
        pagePath,
        '<!DOCTYPE html><html><head><title>Test</title><link rel="stylesheet" href="style.css"></head><body><h1>Hello</h1></body></html>'
      );

      const res = checkPageIntegrity(tempDir, 'valid.html');
      expect(res.exists).toBe(true);
      expect(res.issues).toHaveLength(0);
    });
  });

  describe('checkScriptSyntax', () => {
    it('passes for valid JavaScript', () => {
      const scriptPath = path.join(tempDir, 'valid.js');
      fs.writeFileSync(scriptPath, 'export function add(a, b) { return a + b; }');

      const res = checkScriptSyntax(tempDir, 'valid.js');
      expect(res.valid).toBe(true);
    });

    it('fails for invalid JavaScript syntax', () => {
      const scriptPath = path.join(tempDir, 'invalid.js');
      fs.writeFileSync(scriptPath, 'const a = ;');

      const res = checkScriptSyntax(tempDir, 'invalid.js');
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('updateIndexHtml', () => {
    const sampleHtml = `<!DOCTYPE html>
<html>
<head><title>Test Hub</title></head>
<body>
    <section id="bento">
        <div class="bento-card reveal" id="bento-status">
            <h4>Ecosystem Status</h4>
            <div class="status-item">
                <span>All Systems</span>
                <span class="status-indicator online">Operational</span>
            </div>
            <p>Last check: Aug 11, 2026</p>
        </div>
    </section>
</body>
</html>`;

    it('updates index.html to Operational with new date when all systems are healthy', () => {
      const indexPath = path.join(tempDir, 'index.html');
      fs.writeFileSync(indexPath, sampleHtml);

      const statusResult = {
        dateFormatted: 'Oct 13, 2026',
        overallStatus: 'Operational',
        badgeClass: 'online',
        offlineSystems: []
      };

      updateIndexHtml(tempDir, statusResult);

      const updated = fs.readFileSync(indexPath, 'utf8');
      expect(updated).toContain('<p>Last check: Oct 13, 2026</p>');
      expect(updated).toContain('<span class="status-indicator online">Operational</span>');
      expect(updated).toContain('id="status-issues-list" class="status-issues-list" style="display: none;"');
    });

    it('updates index.html to Maintenance or Offline and lists specific failing systems', () => {
      const indexPath = path.join(tempDir, 'index.html');
      fs.writeFileSync(indexPath, sampleHtml);

      const statusResult = {
        dateFormatted: 'Oct 14, 2026',
        overallStatus: 'Maintenance',
        badgeClass: 'maintenance',
        offlineSystems: [
          { name: 'Unstoppable Shop', status: 'Offline', issues: ['js/shop.js syntax error'] },
          { name: 'Medixly Music', status: 'Maintenance', issues: ['audio-engine.js warning'] }
        ]
      };

      updateIndexHtml(tempDir, statusResult);

      const updated = fs.readFileSync(indexPath, 'utf8');
      expect(updated).toContain('<p>Last check: Oct 14, 2026</p>');
      expect(updated).toContain('<span class="status-indicator maintenance">Maintenance</span>');
      expect(updated).toContain('<div id="status-issues-list" class="status-issues-list">');
      expect(updated).toContain('<span>Unstoppable Shop</span>');
      expect(updated).toContain('<span class="status-indicator offline">Offline</span>');
      expect(updated).toContain('<span>Medixly Music</span>');
      expect(updated).toContain('<span class="status-indicator maintenance">Maintenance</span>');
    });

    it('re-updates cleanly from a maintenance state back to operational', () => {
      const indexPath = path.join(tempDir, 'index.html');
      fs.writeFileSync(indexPath, sampleHtml);

      // 1. Move to Maintenance
      updateIndexHtml(tempDir, {
        dateFormatted: 'Oct 13, 2026',
        overallStatus: 'Maintenance',
        badgeClass: 'maintenance',
        offlineSystems: [{ name: 'Unstoppable Shop', status: 'Offline', issues: ['error'] }]
      });

      let content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('Maintenance');
      expect(content).toContain('Unstoppable Shop');

      // 2. Recover to Operational next day
      updateIndexHtml(tempDir, {
        dateFormatted: 'Oct 14, 2026',
        overallStatus: 'Operational',
        badgeClass: 'online',
        offlineSystems: []
      });

      content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('<p>Last check: Oct 14, 2026</p>');
      expect(content).toContain('<span class="status-indicator online">Operational</span>');
      expect(content).not.toContain('<span>Unstoppable Shop</span>');
    });
  });

  describe('Real Ecosystem Health Check', () => {
    it('runs swift check over current repository and determines status', async () => {
      const result = await performSiteChecks(ROOT_DIR, { skipHttp: true });
      expect(result.totalSystems).toBe(ECOSYSTEM_SYSTEMS.length);
      expect(result.durationMs).toBeLessThan(3000);
      expect(result.dateFormatted).toMatch(/^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/);
      expect(['Operational', 'Maintenance', 'Offline']).toContain(result.overallStatus);
      expect(result.operationalCount).toBeGreaterThanOrEqual(1);
    });
  });
});
