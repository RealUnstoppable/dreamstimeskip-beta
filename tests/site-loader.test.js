import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Site Loader & Rockstar UN Logo', () => {
    it('should have images/un-logo-touching.png on disk with valid PNG header', () => {
        const imgPath = path.join(ROOT_DIR, 'images', 'un-logo-touching.png');
        expect(fs.existsSync(imgPath)).toBe(true);
        const buffer = fs.readFileSync(imgPath);
        expect(buffer[0]).toBe(0x89);
        expect(buffer[1]).toBe(0x50);
        expect(buffer[2]).toBe(0x4E);
        expect(buffer[3]).toBe(0x47);
        expect(buffer.length).toBeGreaterThan(1000);
    });

    it('should have site loader CSS styles defined in css/style.css', () => {
        const cssPath = path.join(ROOT_DIR, 'css', 'style.css');
        const css = fs.readFileSync(cssPath, 'utf-8');
        expect(css).toContain('.un-site-loader-overlay');
        expect(css).toContain('.un-loader-badge');
        expect(css).toContain('.un-loader-wave-beam');
        expect(css).toContain('unLogoWave');
        expect(css).toContain('skewX(-16deg)');
        expect(css).toContain('drop-shadow');
    });

    it('should export showSiteLoader and hideSiteLoader functions from js/site-loader.js', async () => {
        const jsPath = path.join(ROOT_DIR, 'js', 'site-loader.js');
        expect(fs.existsSync(jsPath)).toBe(true);
        const siteLoaderModule = await import('../js/site-loader.js');
        expect(typeof siteLoaderModule.showSiteLoader).toBe('function');
        expect(typeof siteLoaderModule.hideSiteLoader).toBe('function');
        expect(typeof siteLoaderModule.isSiteLoaderActive).toBe('function');
    });

    it('should correctly create loader DOM and control visibility via showSiteLoader and hideSiteLoader', async () => {
        const { showSiteLoader, hideSiteLoader, isSiteLoaderActive } = await import('../js/site-loader.js');
        
        showSiteLoader();
        expect(isSiteLoaderActive()).toBe(true);

        const loaderEl = document.getElementById('un-site-loader');
        expect(loaderEl).not.toBeNull();
        expect(loaderEl.classList.contains('hidden')).toBe(false);
        expect(loaderEl.querySelector('.un-loader-badge')).not.toBeNull();
        expect(loaderEl.querySelector('.un-loader-wave-beam')).not.toBeNull();
        expect(loaderEl.querySelector('.un-loader-logo-base')).not.toBeNull();

        hideSiteLoader(true); // force immediate hide
        expect(isSiteLoaderActive()).toBe(false);
        expect(loaderEl.classList.contains('hidden')).toBe(true);
    });

    it('should have a complete, valid base64 PNG for the un logo mask in site-loader.js and css/style.css', () => {
        const jsPath = path.join(ROOT_DIR, 'js', 'site-loader.js');
        const js = fs.readFileSync(jsPath, 'utf-8');
        const jsMatch = js.match(/const LOGO_MASK_DATA = ['"]data:image\/png;base64,([^'"]+)['"]/);
        expect(jsMatch).not.toBeNull();
        const jsBase64 = jsMatch[1];
        const jsBuffer = Buffer.from(jsBase64, 'base64');
        expect(jsBuffer.length).toBeGreaterThan(5000);
        expect(jsBuffer[0]).toBe(0x89);
        expect(jsBuffer[1]).toBe(0x50);
        expect(jsBuffer[2]).toBe(0x4E);
        expect(jsBuffer[3]).toBe(0x47);

        const imgPath = path.join(ROOT_DIR, 'images', 'un-logo-touching.png');
        const expectedBuffer = fs.readFileSync(imgPath);
        expect(jsBuffer.equals(expectedBuffer)).toBe(true);

        const cssPath = path.join(ROOT_DIR, 'css', 'style.css');
        const css = fs.readFileSync(cssPath, 'utf-8');
        expect(css).toContain(`--un-loader-mask: url('data:image/png;base64,${jsBase64}')`);
    });

    it('should be imported in js/theme-loader.js so all pages load it automatically', () => {
        const themeLoaderPath = path.join(ROOT_DIR, 'js', 'theme-loader.js');
        const themeLoader = fs.readFileSync(themeLoaderPath, 'utf-8');
        expect(themeLoader).toContain('site-loader.js');
    });
});
