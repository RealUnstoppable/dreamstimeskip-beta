/**
 * Medixly Dynamic Pricing & Escalation Engine
 * 
 * Rules:
 * - Promotion launches at $1.00 base entry price.
 * - Escalates by +$1.00 every single day at midnight UTC (00:00:00 UTC).
 * - Premium Tier Cap: $6.99 / month.
 * - Ultra Tier Cap: $12.99 / month.
 * - Users lock in their entry price for the lifetime of their subscription.
 * - Yearly billing: 10x monthly rate (2 months free / 20% savings).
 */

// Default campaign anchor: October 28, 2026 00:00:00 UTC
export const DEFAULT_PROMO_START_UTC = '2026-10-28T00:00:00Z';

export const TIER_CONFIG = {
  free: {
    id: 'free',
    name: 'Free Standard',
    basePrice: 0,
    cap: 0,
    regularMonthly: 0,
    regularYearly: 0,
    dailyIncrement: 0
  },
  premium: {
    id: 'premium',
    name: 'Medixly Premium',
    basePrice: 1.00,
    cap: 6.99,
    regularMonthly: 9.99,
    regularYearly: 99.99,
    dailyIncrement: 1.00
  },
  ultra: {
    id: 'ultra',
    name: 'Medixly Ultra',
    basePrice: 1.00,
    cap: 12.99,
    regularMonthly: 19.99,
    regularYearly: 199.99,
    dailyIncrement: 1.00
  }
};

/**
 * Returns the effective promo start Date in UTC
 */
export function getPromoStartDate(customStart) {
  if (customStart instanceof Date) return customStart;
  if (typeof customStart === 'string') return new Date(customStart);
  if (typeof process !== 'undefined' && process.env && process.env.MEDIXLY_PROMO_START_DATE) {
    return new Date(process.env.MEDIXLY_PROMO_START_DATE);
  }
  return new Date(DEFAULT_PROMO_START_UTC);
}

/**
 * Calculate the number of full days elapsed since promo start (UTC)
 * @param {Date|string} [targetDate] Current date (defaults to now)
 * @param {Date|string} [startDate] Campaign start date
 * @returns {number} 0-indexed day count (0 = Day 1 / today)
 */
export function getCurrentDayIndex(targetDate = new Date(), startDate = null) {
  const now = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const start = getPromoStartDate(startDate);

  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());

  const diffMs = nowUTC - startUTC;
  const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, daysElapsed);
}

/**
 * Calculate the dynamic price for a tier on a given date
 * @param {'free'|'premium'|'ultra'} tier
 * @param {'monthly'|'yearly'} [billingCycle='monthly']
 * @param {Date|string} [targetDate]
 * @param {Date|string} [startDate]
 * @returns {number} Price rounded to 2 decimal places
 */
export function calculateMedixlyDailyPrice(tier, billingCycle = 'monthly', targetDate = new Date(), startDate = null) {
  const normTier = (tier || '').toLowerCase();
  const config = TIER_CONFIG[normTier];
  if (!config || normTier === 'free') return 0;

  const dayIndex = getCurrentDayIndex(targetDate, startDate);
  const rawEscalated = config.basePrice + (dayIndex * config.dailyIncrement);
  const monthlyPrice = Math.min(config.cap, Math.round(rawEscalated * 100) / 100);

  if (billingCycle === 'yearly') {
    // 10x monthly price (includes 2 months free)
    return Math.round(monthlyPrice * 10 * 100) / 100;
  }

  return monthlyPrice;
}

/**
 * Get tier cap price
 */
export function getTierCap(tier, billingCycle = 'monthly') {
  const normTier = (tier || '').toLowerCase();
  const config = TIER_CONFIG[normTier];
  if (!config || normTier === 'free') return 0;
  if (billingCycle === 'yearly') {
    return Math.round(config.cap * 10 * 100) / 100;
  }
  return config.cap;
}

/**
 * Milliseconds and formatted components until next midnight UTC (00:00:00 UTC)
 */
export function getTimeUntilNextMidnightUTC(targetDate = new Date()) {
  const now = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const nextMidnightMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  );
  const diffMs = Math.max(0, nextMidnightMs - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const elapsedInDay = 86400 - totalSeconds;
  const progressPercent = Math.min(100, Math.max(0, (elapsedInDay / 86400) * 100));

  return {
    diffMs,
    totalSeconds,
    hours,
    minutes,
    seconds,
    progressPercent: Math.round(progressPercent * 10) / 10,
    formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  };
}

/**
 * End-of-week promotion expiration timestamp (Sunday 23:59:59 UTC of the launch week)
 */
export function getWeekPromoEndUTC(targetDate = new Date(), startDate = null) {
  const start = getPromoStartDate(startDate);
  // 7 days campaign window from start
  const endMs = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate() + 7,
    0, 0, 0, 0
  ) - 1; // 23:59:59.999 UTC of 7th day

  const now = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const remainingMs = Math.max(0, endMs - now.getTime());

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    endTimestamp: endMs,
    remainingMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: remainingMs <= 0,
    formatted: `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  };
}

/**
 * Returns complete pricing snapshot for UI rendering
 */
export function getPricingSnapshot(targetDate = new Date(), startDate = null) {
  const dayIndex = getCurrentDayIndex(targetDate, startDate);
  const dayNumber = dayIndex + 1;
  const countdown = getTimeUntilNextMidnightUTC(targetDate);
  const weekCutoff = getWeekPromoEndUTC(targetDate, startDate);

  const premiumMonthly = calculateMedixlyDailyPrice('premium', 'monthly', targetDate, startDate);
  const premiumYearly = calculateMedixlyDailyPrice('premium', 'yearly', targetDate, startDate);
  const ultraMonthly = calculateMedixlyDailyPrice('ultra', 'monthly', targetDate, startDate);
  const ultraYearly = calculateMedixlyDailyPrice('ultra', 'yearly', targetDate, startDate);

  // Tomorrow's projected prices
  const tomorrow = new Date((targetDate instanceof Date ? targetDate : new Date(targetDate)).getTime() + 86400000);
  const premiumTomorrowMonthly = calculateMedixlyDailyPrice('premium', 'monthly', tomorrow, startDate);
  const ultraTomorrowMonthly = calculateMedixlyDailyPrice('ultra', 'monthly', tomorrow, startDate);

  return {
    dayIndex,
    dayNumber,
    isCapped: {
      premium: premiumMonthly >= TIER_CONFIG.premium.cap,
      ultra: ultraMonthly >= TIER_CONFIG.ultra.cap
    },
    countdown,
    weekCutoff,
    plans: {
      free: {
        monthly: 0,
        yearly: 0,
        regularMonthly: 0,
        regularYearly: 0,
        savingsPercentMonthly: 0,
        savingsPercentYearly: 0
      },
      premium: {
        monthly: premiumMonthly,
        yearly: premiumYearly,
        tomorrowMonthly: premiumTomorrowMonthly,
        capMonthly: TIER_CONFIG.premium.cap,
        capYearly: getTierCap('premium', 'yearly'),
        regularMonthly: TIER_CONFIG.premium.regularMonthly,
        regularYearly: TIER_CONFIG.premium.regularYearly,
        savingsPercentMonthly: Math.round(((TIER_CONFIG.premium.regularMonthly - premiumMonthly) / TIER_CONFIG.premium.regularMonthly) * 100),
        savingsPercentYearly: Math.round(((TIER_CONFIG.premium.regularYearly - premiumYearly) / TIER_CONFIG.premium.regularYearly) * 100)
      },
      ultra: {
        monthly: ultraMonthly,
        yearly: ultraYearly,
        tomorrowMonthly: ultraTomorrowMonthly,
        capMonthly: TIER_CONFIG.ultra.cap,
        capYearly: getTierCap('ultra', 'yearly'),
        regularMonthly: TIER_CONFIG.ultra.regularMonthly,
        regularYearly: TIER_CONFIG.ultra.regularYearly,
        savingsPercentMonthly: Math.round(((TIER_CONFIG.ultra.regularMonthly - ultraMonthly) / TIER_CONFIG.ultra.regularMonthly) * 100),
        savingsPercentYearly: Math.round(((TIER_CONFIG.ultra.regularYearly - ultraYearly) / TIER_CONFIG.ultra.regularYearly) * 100)
      }
    }
  };
}

/**
 * Format currency string
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return '$' + amount.toFixed(2);
}
