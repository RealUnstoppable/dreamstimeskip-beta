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

describe('Medixly Pricing Engine Math & Escalation', () => {
  const promoStart = new Date('2026-10-28T00:00:00Z');

  describe('Daily Index Calculation', () => {
    it('returns 0 for promo start date', () => {
      const d0 = new Date('2026-10-28T12:00:00Z');
      expect(getCurrentDayIndex(d0, promoStart)).toBe(0);
    });

    it('returns 1 for day 2 at 00:00:01 UTC', () => {
      const d1 = new Date('2026-10-29T00:00:01Z');
      expect(getCurrentDayIndex(d1, promoStart)).toBe(1);
    });

    it('returns 6 for day 7', () => {
      const d6 = new Date('2026-11-03T15:30:00Z');
      expect(getCurrentDayIndex(d6, promoStart)).toBe(6);
    });
  });

  describe('Premium Tier Pricing Escalation & Cap', () => {
    it('starts at $1.00 on Day 0 (Today)', () => {
      const d0 = new Date('2026-10-28T10:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d0, promoStart)).toBe(1.00);
    });

    it('escalates to $2.00 on Day 1', () => {
      const d1 = new Date('2026-10-29T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d1, promoStart)).toBe(2.00);
    });

    it('escalates to $3.00 on Day 2', () => {
      const d2 = new Date('2026-10-30T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d2, promoStart)).toBe(3.00);
    });

    it('escalates to $6.00 on Day 5', () => {
      const d5 = new Date('2026-11-02T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d5, promoStart)).toBe(6.00);
    });

    it('hits the cap of $6.99 on Day 6 instead of $7.00', () => {
      const d6 = new Date('2026-11-03T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d6, promoStart)).toBe(6.99);
    });

    it('remains capped at $6.99 on Day 10 and beyond', () => {
      const d10 = new Date('2026-11-07T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'monthly', d10, promoStart)).toBe(6.99);
    });

    it('calculates yearly rate with 2 months free (10x monthly)', () => {
      const d0 = new Date('2026-10-28T10:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'yearly', d0, promoStart)).toBe(10.00);

      const d6 = new Date('2026-11-03T01:00:00Z');
      expect(calculateMedixlyDailyPrice('premium', 'yearly', d6, promoStart)).toBe(69.90);
    });
  });

  describe('Ultra Tier Pricing Escalation & Cap', () => {
    it('starts at $1.00 on Day 0', () => {
      const d0 = new Date('2026-10-28T10:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'monthly', d0, promoStart)).toBe(1.00);
    });

    it('reaches $7.00 on Day 6 (while Premium caps at 6.99)', () => {
      const d6 = new Date('2026-11-03T01:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'monthly', d6, promoStart)).toBe(7.00);
    });

    it('hits the Ultra peak cap of $12.99 on Day 12', () => {
      const d12 = new Date('2026-11-09T01:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'monthly', d12, promoStart)).toBe(12.99);
    });

    it('remains capped at $12.99 on Day 20', () => {
      const d20 = new Date('2026-11-17T01:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'monthly', d20, promoStart)).toBe(12.99);
    });

    it('calculates Ultra yearly rate at 10x monthly', () => {
      const d0 = new Date('2026-10-28T10:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'yearly', d0, promoStart)).toBe(10.00);

      const d12 = new Date('2026-11-09T01:00:00Z');
      expect(calculateMedixlyDailyPrice('ultra', 'yearly', d12, promoStart)).toBe(129.90);
    });
  });

  describe('Free Tier', () => {
    it('always returns 0', () => {
      expect(calculateMedixlyDailyPrice('free')).toBe(0);
      expect(calculateMedixlyDailyPrice('free', 'yearly')).toBe(0);
    });
  });

  describe('Countdown to Midnight UTC', () => {
    it('accurately computes hours, minutes, seconds until next 00:00:00 UTC', () => {
      const testDate = new Date('2026-10-28T22:30:15Z');
      const countdown = getTimeUntilNextMidnightUTC(testDate);

      // From 22:30:15 to 00:00:00 is 1 hour, 29 minutes, 45 seconds = 5385 seconds
      expect(countdown.hours).toBe(1);
      expect(countdown.minutes).toBe(29);
      expect(countdown.seconds).toBe(45);
      expect(countdown.formatted).toBe('01:29:45');
    });

    it('calculates progress percentage of the current 24h cycle', () => {
      const midday = new Date('2026-10-28T12:00:00Z');
      const countdown = getTimeUntilNextMidnightUTC(midday);
      expect(countdown.progressPercent).toBe(50);
    });
  });

  describe('Weekly Cutoff Logic', () => {
    it('computes 7-day cutoff from start date', () => {
      const testDate = new Date('2026-10-28T12:00:00Z');
      const cutoff = getWeekPromoEndUTC(testDate, promoStart);
      expect(cutoff.isExpired).toBe(false);
      expect(cutoff.days).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Pricing Snapshot Builder', () => {
    it('builds a comprehensive snapshot for rendering', () => {
      const snapshot = getPricingSnapshot(new Date('2026-10-28T12:00:00Z'), promoStart);
      expect(snapshot.dayIndex).toBe(0);
      expect(snapshot.dayNumber).toBe(1);
      expect(snapshot.plans.premium.monthly).toBe(1.00);
      expect(snapshot.plans.ultra.monthly).toBe(1.00);
      expect(snapshot.plans.premium.tomorrowMonthly).toBe(2.00);
      expect(snapshot.plans.premium.savingsPercentMonthly).toBeGreaterThan(85);
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers properly', () => {
      expect(formatCurrency(1)).toBe('$1.00');
      expect(formatCurrency(6.99)).toBe('$6.99');
      expect(formatCurrency(129.9)).toBe('$129.90');
      expect(formatCurrency(null)).toBe('$0.00');
    });
  });
});
