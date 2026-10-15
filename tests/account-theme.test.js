import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Appearance & Themes Settings in account.html', () => {
    let accountHtml;

    beforeAll(() => {
        const filePath = path.join(ROOT_DIR, 'account.html');
        accountHtml = fs.readFileSync(filePath, 'utf-8');
    });

    test('account.html includes Appearance & Themes section with form controls', () => {
        expect(accountHtml).toContain('Appearance & Themes');
        expect(accountHtml).toContain('id="theme-settings-form"');
        expect(accountHtml).toContain('id="theme-select"');
        expect(accountHtml).toContain('id="custom-hex-color"');
    });

    test('account.html includes both Save Theme and Reset buttons', () => {
        expect(accountHtml).toContain('id="save-theme-btn"');
        expect(accountHtml).toContain('id="reset-theme-btn"');
        expect(accountHtml).toMatch(/<button[^>]*id="reset-theme-btn"[^>]*>.*Reset.*<\/button>/s);
    });

    test('account.html has correct default color value for custom hex', () => {
        expect(accountHtml).toContain('value="#2563EB"');
    });

    test('js/account.js includes reset-theme-btn handler that resets theme and accent color', () => {
        const accountJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'account.js'), 'utf-8');
        expect(accountJs).toContain('reset-theme-btn');
        expect(accountJs).toContain("defaultTheme = 'system'");
        expect(accountJs).toContain("defaultAccent = '#2563EB'");
        expect(accountJs).toContain('Theme preferences reset to default successfully!');
    });
});
