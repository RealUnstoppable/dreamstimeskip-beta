import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DEFAULT_PROMO_START_UTC,
  calculateMedixlyDailyPrice,
  getPricingSnapshot,
  TIER_CONFIG
} from '../js/medixly-pricing-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Medixly Pricing Header CSS Parity & Price Counter Reset', () => {
  let pricingHtml;
  let playerHtml;
  let pricingCss;
  let medixlyCss;
  let styleCss;

  beforeAll(() => {
    pricingHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly-pricing.html'), 'utf8');
    playerHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
    pricingCss = fs.readFileSync(path.join(ROOT_DIR, 'css/medixly-pricing.css'), 'utf8');
    medixlyCss = fs.readFileSync(path.join(ROOT_DIR, 'css/medixly.css'), 'utf8');
    styleCss = fs.readFileSync(path.join(ROOT_DIR, 'css/style.css'), 'utf8');
  });

  describe('Header HTML Structure Parity', () => {
    it('both medixly.html and medixly-pricing.html declare main-header element', () => {
      expect(pricingHtml).toContain('<header class="main-header"></header>');
      expect(playerHtml).toContain('<header class="main-header"></header>');
    });

    it('medixly-pricing.html loads navbar with cache-busting version', () => {
      expect(pricingHtml).toContain("import { loadNavbar } from './js/navbar.js?v=");
      expect(pricingHtml).toContain("loadNavbar();");
    });
  });

  describe('Header CSS Format & Rules Parity on medixly-pricing.css', () => {
    const requiredHeaderClasses = [
      '#medixly-navbar-logo',
      '.medixly-desktop-navbar',
      '.medixly-nav-left',
      '.medixly-brand-lockup',
      '.medixly-logo-img',
      '.medixly-brand-text',
      '.medixly-brand-title',
      '.medixly-brand-subtitle',
      '.medixly-nav-right',
      '.medixly-header-btn',
      '.medixly-upgrade-btn',
      '.medixly-auth-btn',
      '.medixly-ecosystem-arrow-btn',
      '.medixly-ecosystem-drawer',
      '.medixly-ecosystem-track',
      '.medixly-eco-link'
    ];

    it.each(requiredHeaderClasses)('medixly-pricing.css contains %s', (className) => {
      expect(pricingCss).toContain(className);
    });

    it('medixly-pricing.css defines logo height of 81px and 1.5x mobile scale', () => {
      expect(pricingCss).toMatch(/#medixly-navbar-logo\s*\{[^}]*height:\s*81px\s*!important/);
      expect(pricingCss).toMatch(/transform:\s*scale\(1\.5\)/);
    });

    it('medixly-pricing.css defines 70px desktop navbar height matching medixly.css', () => {
      expect(pricingCss).toMatch(/height:\s*70px;/);
    });

    it('medixly-pricing.css defines gradient styling for upgrade button ($0.99 Today)', () => {
      expect(pricingCss).toMatch(/\.medixly-upgrade-btn\s*\{[^}]*linear-gradient/);
    });

    it('medixly-pricing.css defines collapsible ecosystem drawer animation', () => {
      expect(pricingCss).toMatch(/\.medixly-ecosystem-drawer\s*\{[^}]*transform:\s*translateY\(-100%\)/);
      expect(pricingCss).toMatch(/\.medixly-ecosystem-drawer\.is-open\s*\{[^}]*transform:\s*translateY\(0\)/);
    });

    it('style.css also contains global medixly-desktop-navbar rules for fallback parity', () => {
      expect(styleCss).toContain('.medixly-desktop-navbar');
      expect(styleCss).toContain('.medixly-brand-lockup');
      expect(styleCss).toContain('.medixly-header-btn');
      expect(styleCss).toContain('.medixly-ecosystem-drawer');
    });
  });

  describe('Price Counter Reset to 0.99', () => {
    it('sets promotion anchor date to today (2026-11-06)', () => {
      expect(DEFAULT_PROMO_START_UTC).toBe('2026-11-06T00:00:00Z');
    });

    it('calculates entry price as $0.99 today for Premium', () => {
      const today = new Date('2026-11-06T12:00:00Z');
      const price = calculateMedixlyDailyPrice('premium', 'monthly', today);
      expect(price).toBe(0.99);
    });

    it('calculates entry price as $0.99 today for Ultra', () => {
      const today = new Date('2026-11-06T12:00:00Z');
      const price = calculateMedixlyDailyPrice('ultra', 'monthly', today);
      expect(price).toBe(0.99);
    });

    it('generates day 1 pricing snapshot with $0.99 today and $1.99 tomorrow', () => {
      const today = new Date('2026-11-06T12:00:00Z');
      const snapshot = getPricingSnapshot(today);
      expect(snapshot.dayIndex).toBe(0);
      expect(snapshot.dayNumber).toBe(1);
      expect(snapshot.plans.premium.monthly).toBe(0.99);
      expect(snapshot.plans.ultra.monthly).toBe(0.99);
      expect(snapshot.plans.premium.tomorrowMonthly).toBe(1.99);
    });

    it('displays $0.99 entry prices across medixly-pricing.html banners and buttons', () => {
      expect(pricingHtml).toContain('id="banner-current-price">$0.99</strong>');
      expect(pricingHtml).toContain('id="banner-next-price">$1.99</strong>');
      expect(pricingHtml).toContain('id="premium-price-display">$0.99</span>');
      expect(pricingHtml).toContain('id="ultra-price-display">$0.99</span>');
      expect(pricingHtml).toContain('Lock In Premium ($0.99/mo)');
      expect(pricingHtml).toContain('Lock In Ultra ($0.99/mo)');
    });
  });
});
