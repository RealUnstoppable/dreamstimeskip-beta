/**
 * Medixly Pricing & Membership UI Controller
 * Integrates live countdown timer, dynamic daily escalation, Stripe Checkout, and Firebase Auth state.
 */

import {
  getPricingSnapshot,
  getTimeUntilNextMidnightUTC,
  getWeekPromoEndUTC,
  calculateMedixlyDailyPrice,
  formatCurrency,
  TIER_CONFIG
} from './medixly-pricing-engine.js';

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export class MedixlyPricingUI {
  constructor() {
    this.billingCycle = 'monthly'; // 'monthly' | 'yearly'
    this.purchaseMode = 'subscription'; // 'subscription' | 'payment' (one-time lock)
    this.currentUser = null;
    this.userSubscription = null;
    this.timerInterval = null;
    this.lastDayIndex = -1;
  }

  init() {
    this.bindDOM();
    this.setupEventListeners();
    this.startCountdown();
    this.updatePricingDisplay();
    this.initAuthTracking();
    this.checkUrlState();
  }

  bindDOM() {
    // Countdown elements
    this.hoursEl = document.getElementById('cd-hours');
    this.minutesEl = document.getElementById('cd-minutes');
    this.secondsEl = document.getElementById('cd-seconds');
    this.progressBarEl = document.getElementById('countdown-progress-bar');
    this.weekCountdownEl = document.getElementById('week-countdown-timer');
    this.dayBadgeEl = document.getElementById('promo-day-badge');
    this.currentPriceBannerEl = document.getElementById('banner-current-price');
    this.nextPriceBannerEl = document.getElementById('banner-next-price');

    // Price display elements
    this.premiumPriceEl = document.getElementById('premium-price-display');
    this.premiumPeriodEl = document.getElementById('premium-period-display');
    this.premiumRegularEl = document.getElementById('premium-regular-price');
    this.premiumSavingsEl = document.getElementById('premium-savings-badge');
    this.premiumTomorrowEl = document.getElementById('premium-tomorrow-price');
    this.premiumBtn = document.getElementById('btn-choose-premium');

    this.ultraPriceEl = document.getElementById('ultra-price-display');
    this.ultraPeriodEl = document.getElementById('ultra-period-display');
    this.ultraRegularEl = document.getElementById('ultra-regular-price');
    this.ultraSavingsEl = document.getElementById('ultra-savings-badge');
    this.ultraTomorrowEl = document.getElementById('ultra-tomorrow-price');
    this.ultraBtn = document.getElementById('btn-choose-ultra');

    // Toggles
    this.billingToggleMonthly = document.getElementById('toggle-monthly');
    this.billingToggleYearly = document.getElementById('toggle-yearly');
    this.modeToggleSub = document.getElementById('toggle-mode-subscription');
    this.modeToggleOneTime = document.getElementById('toggle-mode-onetime');

    // User status banner
    this.userBannerEl = document.getElementById('user-subscription-banner');
  }

  setupEventListeners() {
    if (this.billingToggleMonthly && this.billingToggleYearly) {
      this.billingToggleMonthly.addEventListener('click', () => this.setBillingCycle('monthly'));
      this.billingToggleYearly.addEventListener('click', () => this.setBillingCycle('yearly'));
    }

    if (this.modeToggleSub && this.modeToggleOneTime) {
      this.modeToggleSub.addEventListener('click', () => this.setPurchaseMode('subscription'));
      this.modeToggleOneTime.addEventListener('click', () => this.setPurchaseMode('payment'));
    }

    if (this.premiumBtn) {
      this.premiumBtn.addEventListener('click', () => this.handleCheckout('premium'));
    }

    if (this.ultraBtn) {
      this.ultraBtn.addEventListener('click', () => this.handleCheckout('ultra'));
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
          if (!isActive) item.classList.add('active');
        });
      }
    });
  }

  setBillingCycle(cycle) {
    this.billingCycle = cycle;
    if (this.billingToggleMonthly && this.billingToggleYearly) {
      this.billingToggleMonthly.classList.toggle('active', cycle === 'monthly');
      this.billingToggleYearly.classList.toggle('active', cycle === 'yearly');
    }
    this.updatePricingDisplay();
  }

  setPurchaseMode(mode) {
    this.purchaseMode = mode;
    if (this.modeToggleSub && this.modeToggleOneTime) {
      this.modeToggleSub.classList.toggle('active', mode === 'subscription');
      this.modeToggleOneTime.classList.toggle('active', mode === 'payment');
    }
    this.updatePricingDisplay();
  }

  startCountdown() {
    const tick = () => {
      const now = new Date();
      const countdown = getTimeUntilNextMidnightUTC(now);
      const weekCutoff = getWeekPromoEndUTC(now);
      const snapshot = getPricingSnapshot(now);

      if (this.hoursEl) this.hoursEl.textContent = String(countdown.hours).padStart(2, '0');
      if (this.minutesEl) this.minutesEl.textContent = String(countdown.minutes).padStart(2, '0');
      if (this.secondsEl) this.secondsEl.textContent = String(countdown.seconds).padStart(2, '0');

      if (this.progressBarEl) {
        this.progressBarEl.style.width = `${countdown.progressPercent}%`;
      }

      if (this.weekCountdownEl) {
        this.weekCountdownEl.textContent = weekCutoff.formatted;
      }

      // Detect day rollover (midnight UTC)
      if (this.lastDayIndex !== -1 && this.lastDayIndex !== snapshot.dayIndex) {
        this.onMidnightRollover(snapshot);
      }
      this.lastDayIndex = snapshot.dayIndex;
    };

    tick();
    this.timerInterval = setInterval(tick, 1000);
  }

  onMidnightRollover(snapshot) {
    this.updatePricingDisplay();
    // Visual celebration/notification of new day escalation
    const banner = document.getElementById('urgency-toast');
    if (banner) {
      banner.textContent = `⚡ Midnight UTC Reached! Promotion stepped to Day ${snapshot.dayNumber}!`;
      banner.classList.add('show');
      setTimeout(() => banner.classList.remove('show'), 6000);
    }
  }

  updatePricingDisplay() {
    const snapshot = getPricingSnapshot(new Date());
    const isYearly = this.billingCycle === 'yearly';
    const isOneTime = this.purchaseMode === 'payment';

    // Day & Banner
    if (this.dayBadgeEl) {
      this.dayBadgeEl.textContent = `DAY ${snapshot.dayNumber} OF 7`;
    }
    if (this.currentPriceBannerEl) {
      this.currentPriceBannerEl.textContent = formatCurrency(snapshot.plans.premium.monthly);
    }
    if (this.nextPriceBannerEl) {
      this.nextPriceBannerEl.textContent = formatCurrency(snapshot.plans.premium.tomorrowMonthly);
    }

    // Premium Tier
    const pCurrent = isYearly ? snapshot.plans.premium.yearly : snapshot.plans.premium.monthly;
    const pRegular = isYearly ? snapshot.plans.premium.regularYearly : snapshot.plans.premium.regularMonthly;
    const pSavings = isYearly ? snapshot.plans.premium.savingsPercentYearly : snapshot.plans.premium.savingsPercentMonthly;

    if (this.premiumPriceEl) this.premiumPriceEl.textContent = formatCurrency(pCurrent);
    if (this.premiumPeriodEl) this.premiumPeriodEl.textContent = isYearly ? '/ year' : '/ month';
    if (this.premiumRegularEl) this.premiumRegularEl.textContent = formatCurrency(pRegular);
    if (this.premiumSavingsEl) this.premiumSavingsEl.textContent = `SAVE ${pSavings}%`;
    if (this.premiumTomorrowEl) {
      this.premiumTomorrowEl.textContent = `Increases to ${formatCurrency(snapshot.plans.premium.tomorrowMonthly)} at midnight UTC`;
    }

    // Ultra Tier
    const uCurrent = isYearly ? snapshot.plans.ultra.yearly : snapshot.plans.ultra.monthly;
    const uRegular = isYearly ? snapshot.plans.ultra.regularYearly : snapshot.plans.ultra.regularMonthly;
    const uSavings = isYearly ? snapshot.plans.ultra.savingsPercentYearly : snapshot.plans.ultra.savingsPercentMonthly;

    if (this.ultraPriceEl) this.ultraPriceEl.textContent = formatCurrency(uCurrent);
    if (this.ultraPeriodEl) this.ultraPeriodEl.textContent = isYearly ? '/ year' : '/ month';
    if (this.ultraRegularEl) this.ultraRegularEl.textContent = formatCurrency(uRegular);
    if (this.ultraSavingsEl) this.ultraSavingsEl.textContent = `SAVE ${uSavings}%`;
    if (this.ultraTomorrowEl) {
      this.ultraTomorrowEl.textContent = `Increases to ${formatCurrency(snapshot.plans.ultra.tomorrowMonthly)} at midnight UTC`;
    }

    // Button Labels
    const actionWord = isOneTime ? 'Lock One-Off' : 'Lock In';
    if (this.premiumBtn && !this.premiumBtn.disabled) {
      this.premiumBtn.textContent = `${actionWord} Premium (${formatCurrency(pCurrent)}${isYearly ? '/yr' : '/mo'})`;
    }
    if (this.ultraBtn && !this.ultraBtn.disabled) {
      this.ultraBtn.textContent = `${actionWord} Ultra (${formatCurrency(uCurrent)}${isYearly ? '/yr' : '/mo'})`;
    }

    // Check if user already owns tier
    this.refreshUserTierUI();
  }

  initAuthTracking() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            this.userSubscription = snap.data();
          }
        } catch (err) {
          console.warn('Notice: Could not load user subscription details:', err.message);
        }
      } else {
        this.userSubscription = null;
      }
      this.refreshUserTierUI();
    });
  }

  refreshUserTierUI() {
    if (!this.userBannerEl) return;

    if (this.currentUser && this.userSubscription) {
      const tier = (this.userSubscription.membershipLevel || this.userSubscription.tier || '').toLowerCase();
      const medixlySub = this.userSubscription.medixlySubscription || {};
      const isSubActive = medixlySub.status === 'active' || tier === 'premium' || tier === 'ultra';

      if (isSubActive) {
        const tierName = tier === 'ultra' ? 'Ultra' : 'Premium';
        const lockedAt = medixlySub.lockedPrice ? `$${Number(medixlySub.lockedPrice).toFixed(2)}` : 'promotional rate';

        this.userBannerEl.style.display = 'block';
        this.userBannerEl.innerHTML = `
          <div class="user-active-card">
            <div class="user-active-badge">✓ ACTIVE SUBSCRIBER</div>
            <h3>Signed in as <strong>${escapeHTML(this.currentUser.email || 'Member')}</strong></h3>
            <p>You have an active <strong>Medixly ${tierName}</strong> membership locked at <strong>${lockedAt}</strong>.</p>
            <div class="user-active-actions">
              <a href="medixly.html" class="btn-primary-glow">▶ Launch Web Player</a>
              <a href="account.html" class="btn-subtle">Manage Account</a>
            </div>
          </div>
        `;

        if (tier === 'premium' && this.premiumBtn) {
          this.premiumBtn.textContent = '✓ Current Plan';
          this.premiumBtn.disabled = true;
          this.premiumBtn.classList.add('btn-disabled');
        } else if (tier === 'ultra') {
          if (this.premiumBtn) {
            this.premiumBtn.textContent = 'Included in Ultra';
            this.premiumBtn.disabled = true;
          }
          if (this.ultraBtn) {
            this.ultraBtn.textContent = '✓ Current Plan';
            this.ultraBtn.disabled = true;
            this.ultraBtn.classList.add('btn-disabled');
          }
        }
        return;
      }
    }

    this.userBannerEl.style.display = 'none';
    if (this.premiumBtn) this.premiumBtn.disabled = false;
    if (this.ultraBtn) this.ultraBtn.disabled = false;
  }

  async handleCheckout(tier) {
    const btn = tier === 'ultra' ? this.ultraBtn : this.premiumBtn;
    const origText = btn ? btn.textContent : '';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-inline"></span> Initializing Secure Checkout...`;
    }

    try {
      let idToken = null;
      let email = '';
      let uid = 'guest';

      if (this.currentUser) {
        idToken = await this.currentUser.getIdToken();
        email = this.currentUser.email || '';
        uid = this.currentUser.uid;
      }

      const checkoutPayload = {
        project: 'medixly',
        plan: tier,
        tier: tier,
        billingCycle: this.billingCycle,
        mode: this.purchaseMode,
        uid: uid,
        email: email,
        successUrl: `${window.location.origin}/medixly-pricing.html?status=success&session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
        cancelUrl: `${window.location.origin}/medixly-pricing.html?status=cancelled`
      };

      // Try local/server endpoint first, fallback to cloud function
      let response;
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

        response = await fetch('/create-checkout-session', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(checkoutPayload)
        });
      } catch (networkErr) {
        // Fallback to cloud functions endpoint
        const headers = { 'Content-Type': 'application/json' };
        if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

        response = await fetch('https://us-central1-dts-hub-website.cloudfunctions.net/createCheckoutSession', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(checkoutPayload)
        });
      }

      if (!response || !response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.url) {
        if (typeof window !== 'undefined' && window.medixlyDesktop && window.medixlyDesktop.openExternal) {
          window.medixlyDesktop.openExternal(data.url);
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Opened Checkout in Browser ↗';
            setTimeout(() => { btn.textContent = origText; }, 4000);
          }
        } else {
          window.location.href = data.url;
        }
      } else {
        throw new Error('Checkout URL not returned by payment gateway.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Unable to initiate checkout: ${err.message || 'Please try again or contact support.'}`);
      if (btn) {
        btn.disabled = false;
        btn.textContent = origText;
      }
    }
  }

  checkUrlState() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const tier = params.get('tier') || 'membership';

    if (status === 'success') {
      const banner = document.getElementById('checkout-success-modal');
      if (banner) {
        banner.classList.add('show');
        const tierNameEl = document.getElementById('success-tier-name');
        if (tierNameEl) tierNameEl.textContent = tier.toUpperCase();
      }
    } else if (status === 'cancelled') {
      const toast = document.getElementById('urgency-toast');
      if (toast) {
        toast.textContent = 'Checkout was cancelled. Your promotional locked rate is still reserved until midnight UTC!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 6000);
      }
    }
  }

  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Auto-instantiate when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.medixlyPricingUI = new MedixlyPricingUI();
    window.medixlyPricingUI.init();
  });
}
