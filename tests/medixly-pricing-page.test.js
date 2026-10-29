import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCurrentDayIndex,
  calculateMedixlyDailyPrice,
  getTierCap,
  getTimeUntilNextMidnightUTC,
  getWeekPromoEndUTC,
  getPricingSnapshot,
  formatCurrency,
  TIER_CONFIG
} from '../js/medixly-pricing-engine.js';
import {
  createMedixlyCheckoutSession,
  handleMedixlyWebhookEvent
} from '../backend/medixly-stripe-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Medixly Pricing Page & Architecture Validation', () => {
  let pricingHtml;

  beforeAll(() => {
    pricingHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly-pricing.html'), 'utf8');
  });

  describe('HTML Markup & SEO Metadata', () => {
    it('contains canonical URL pointing to https://realunstoppable.store/medixly', () => {
      expect(pricingHtml).toContain('<link rel="canonical" href="https://realunstoppable.store/medixly">');
    });

    it('contains OpenGraph and Twitter card metadata', () => {
      expect(pricingHtml).toContain('property="og:title"');
      expect(pricingHtml).toContain('property="og:url" content="https://realunstoppable.store/medixly"');
      expect(pricingHtml).toContain('name="twitter:card" content="summary_large_image"');
      expect(pricingHtml).toContain('https://realunstoppable.store/images/medixly-logo.png');
    });

    it('includes live countdown timer components and elements', () => {
      expect(pricingHtml).toContain('id="cd-hours"');
      expect(pricingHtml).toContain('id="cd-minutes"');
      expect(pricingHtml).toContain('id="cd-seconds"');
      expect(pricingHtml).toContain('id="countdown-progress-bar"');
      expect(pricingHtml).toContain('id="promo-day-badge"');
      expect(pricingHtml).toContain('id="week-countdown-timer"');
    });

    it('includes pricing plan cards for Free, Premium, and Ultra tiers', () => {
      expect(pricingHtml).toContain('Free Standard');
      expect(pricingHtml).toContain('Medixly Premium');
      expect(pricingHtml).toContain('Medixly Ultra');
      expect(pricingHtml).toContain('id="btn-choose-premium"');
      expect(pricingHtml).toContain('id="btn-choose-ultra"');
    });

    it('highlights Medixly Premium card as Most Popular with cap notice', () => {
      expect(pricingHtml).toContain('pricing-card highlight');
      expect(pricingHtml).toContain('$6.99 CAP');
    });

    it('highlights Medixly Ultra card with $12.99 CAP notice', () => {
      expect(pricingHtml).toContain('$12.99 CAP');
    });

    it('contains Price Lock Guarantee section', () => {
      expect(pricingHtml).toContain('The Medixly Lifetime Price-Lock Guarantee');
      expect(pricingHtml).toContain('Cancel anytime with zero fees');
    });

    it('contains comprehensive feature comparison table', () => {
      expect(pricingHtml).toContain('Detailed Feature Comparison');
      expect(pricingHtml).toContain('Audio Bitrate');
      expect(pricingHtml).toContain('Ad Interruption');
      expect(pricingHtml).toContain('Lossless FLAC');
    });

    it('contains Frequently Asked Questions accordion', () => {
      expect(pricingHtml).toContain('Frequently Asked Questions');
      expect(pricingHtml).toContain('How does the daily price escalation mechanic work?');
      expect(pricingHtml).toContain('What does "Lifetime Price Lock" mean?');
    });

    it('includes user subscription state container and success modal', () => {
      expect(pricingHtml).toContain('id="user-subscription-banner"');
      expect(pricingHtml).toContain('id="checkout-success-modal"');
    });
  });

  describe('Integration with Player & Site Assets', () => {
    it('medixly.html links to medixly-pricing.html in audio ads and top banner', () => {
      const playerHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
      expect(playerHtml).toContain('href="medixly-pricing.html"');
      expect(playerHtml).toContain('Upgrade ($1 Today)');
    });

    it('scripts/sync-stripe-products.js includes medixly memberships', () => {
      const syncScript = fs.readFileSync(path.join(ROOT_DIR, 'scripts/sync-stripe-products.js'), 'utf8');
      expect(syncScript).toContain("id: 'medixly-membership-premium'");
      expect(syncScript).toContain("id: 'medixly-membership-ultra'");
      expect(syncScript).toContain("sourceSite: 'medixly'");
    });

    it('server.js defines routes for /medixly and /medixly-pricing', () => {
      const serverJs = fs.readFileSync(path.join(ROOT_DIR, 'server.js'), 'utf8');
      expect(serverJs).toContain("reqPath === '/medixly'");
      expect(serverJs).toContain("reqPath = '/medixly-pricing.html'");
      expect(serverJs).toContain('createMedixlyCheckoutSession');
      expect(serverJs).toContain('handleMedixlyWebhookEvent');
    });

    it('functions/index.js handles project: medixly checkout sessions and webhooks', () => {
      const functionsJs = fs.readFileSync(path.join(ROOT_DIR, 'functions/index.js'), 'utf8');
      expect(functionsJs).toContain('project === "medixly"');
      expect(functionsJs).toContain('metadata.project === "medixly"');
      expect(functionsJs).toContain('medixlySubscription');
    });
  });

  describe('Daily Escalation Edge Cases & Math Rigor', () => {
    const promoStart = new Date('2026-10-28T00:00:00Z');

    it('correctly handles Day 0 through Day 6 escalation for Premium', () => {
      const expected = [1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 6.99];
      for (let day = 0; day <= 6; day++) {
        const testDate = new Date(promoStart.getTime() + day * 86400000 + 3600000);
        const price = calculateMedixlyDailyPrice('premium', 'monthly', testDate, promoStart);
        expect(price).toBe(expected[day]);
      }
    });

    it('enforces Premium cap of $6.99 forever after Day 6', () => {
      for (let day = 7; day <= 100; day += 15) {
        const testDate = new Date(promoStart.getTime() + day * 86400000);
        const price = calculateMedixlyDailyPrice('premium', 'monthly', testDate, promoStart);
        expect(price).toBe(6.99);
      }
    });

    it('enforces Ultra cap of $12.99 forever after Day 12', () => {
      for (let day = 12; day <= 100; day += 20) {
        const testDate = new Date(promoStart.getTime() + day * 86400000);
        const price = calculateMedixlyDailyPrice('ultra', 'monthly', testDate, promoStart);
        expect(price).toBe(12.99);
      }
    });

    it('calculates yearly rate with exact 2 months free discount', () => {
      const d0 = new Date('2026-10-28T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'yearly', d0, promoStart)).toBe(10.00);
      expect(calculateMedixlyDailyPrice('ultra', 'yearly', d0, promoStart)).toBe(10.00);

      const d6 = new Date('2026-11-03T01:00:00Z');
      // Premium capped at 6.99 => 6.99 * 10 = 69.90
      expect(calculateMedixlyDailyPrice('premium', 'yearly', d6, promoStart)).toBe(69.90);
      // Ultra at 7.00 => 70.00
      expect(calculateMedixlyDailyPrice('ultra', 'yearly', d6, promoStart)).toBe(70.00);
    });
  });
});
