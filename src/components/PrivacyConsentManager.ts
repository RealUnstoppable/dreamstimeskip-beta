/**
 * Privacy Consent Manager Component
 * Provides Consent Banner & "Your Privacy Choices / Do Not Sell or Share My Personal Information" Modal
 */

import { getTelemetryCollector, isGpcActive, type ConsentState } from '../lib/telemetry-client.js';

export interface ConsentChoices {
  essential: true;
  analytics: boolean;
  advertising: boolean;
  commercialSharing: boolean;
}

export class PrivacyConsentManager {
  private container: HTMLElement | null = null;
  private modal: HTMLElement | null = null;
  private banner: HTMLElement | null = null;
  private gpcActive: boolean = false;

  constructor() {
    this.gpcActive = isGpcActive();
  }

  public init(): void {
    if (typeof document === 'undefined') return;

    this.injectStyles();
    this.createDomElements();

    const consentStored = localStorage.getItem('ru_consent');
    if (!consentStored) {
      this.showBanner();
    }

    // Expose global opener
    if (typeof window !== 'undefined') {
      (window as unknown as { openPrivacyChoices: () => void }).openPrivacyChoices = () => {
        this.openModal();
      };
    }
  }

  private injectStyles(): void {
    if (document.getElementById('ru-privacy-consent-styles')) return;

    const style = document.createElement('style');
    style.id = 'ru-privacy-consent-styles';
    style.textContent = `
      .ru-consent-banner {
        position: fixed;
        bottom: 24px;
        left: 24px;
        right: 24px;
        max-width: 600px;
        background: rgba(18, 18, 18, 0.96);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 14px;
        padding: 20px 24px;
        color: #f3f4f6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ru-consent-banner.ru-hidden { display: none !important; }
      .ru-consent-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ru-consent-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }
      .ru-gpc-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 3px 8px;
        border-radius: 999px;
      }
      .ru-consent-desc {
        font-size: 0.88rem;
        line-height: 1.5;
        color: #9ca3af;
        margin: 0;
      }
      .ru-consent-desc a {
        color: #14b8a6;
        text-decoration: underline;
      }
      .ru-consent-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
      }
      .ru-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.88rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }
      .ru-btn-primary {
        background: #14b8a6;
        color: #ffffff;
      }
      .ru-btn-primary:hover { background: #0d9488; }
      .ru-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #d1d5db;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .ru-btn-secondary:hover { background: rgba(255, 255, 255, 0.14); }
      .ru-btn-link {
        background: transparent;
        color: #9ca3af;
        text-decoration: underline;
      }
      .ru-btn-link:hover { color: #ffffff; }

      /* Modal Backdrop */
      .ru-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(6px);
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .ru-modal-overlay.ru-hidden { display: none !important; }
      .ru-modal-content {
        background: #141416;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        width: 100%;
        max-width: 580px;
        max-height: 90vh;
        overflow-y: auto;
        color: #e5e7eb;
        padding: 28px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .ru-toggle-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .ru-toggle-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ru-toggle-name {
        font-weight: 600;
        font-size: 0.95rem;
        color: #ffffff;
      }
      .ru-toggle-desc {
        font-size: 0.82rem;
        color: #9ca3af;
        line-height: 1.4;
      }
      .ru-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }
      .ru-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .ru-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: #374151;
        transition: 0.25s;
        border-radius: 24px;
      }
      .ru-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.25s;
        border-radius: 50%;
      }
      input:checked + .ru-slider {
        background-color: #14b8a6;
      }
      input:checked + .ru-slider:before {
        transform: translateX(20px);
      }
      input:disabled + .ru-slider {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  private createDomElements(): void {
    // Banner
    const banner = document.createElement('div');
    banner.id = 'ru-consent-banner';
    banner.className = 'ru-consent-banner ru-hidden';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Privacy and Cookie Preferences');

    const gpcBadgeHtml = this.gpcActive
      ? `<span class="ru-gpc-badge" title="Global Privacy Control signal detected and honored">✓ GPC Honored</span>`
      : '';

    banner.innerHTML = `
      <div class="ru-consent-header">
        <h3 class="ru-consent-title">Privacy &amp; Telemetry Preferences</h3>
        ${gpcBadgeHtml}
      </div>
      <p class="ru-consent-desc">
        We collect first-party telemetry and behavioral analytics to optimize store performance and personalize offers.
        Review our <a href="privacy.html" target="_blank">Privacy Policy</a> and <a href="terms.html" target="_blank">Terms</a>.
      </p>
      <div class="ru-consent-actions">
        <button id="ru-consent-manage" class="ru-btn ru-btn-link">Your Privacy Choices</button>
        <button id="ru-consent-reject" class="ru-btn ru-btn-secondary">Decline Non-Essential</button>
        <button id="ru-consent-accept" class="ru-btn ru-btn-primary">Accept All</button>
      </div>
    `;

    document.body.appendChild(banner);
    this.banner = banner;

    // Modal
    const modal = document.createElement('div');
    modal.id = 'ru-privacy-modal';
    modal.className = 'ru-modal-overlay ru-hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'ru-modal-title');

    modal.innerHTML = `
      <div class="ru-modal-content">
        <div class="ru-consent-header">
          <h2 id="ru-modal-title" class="ru-consent-title" style="font-size: 1.25rem;">Your Privacy Choices</h2>
          ${gpcBadgeHtml}
        </div>
        <p class="ru-consent-desc">
          Manage how your telemetry data is collected, processed, and utilized. Under state privacy laws (CCPA/CPRA), you have the right to opt out of the sale or sharing of your personal data.
        </p>

        <div class="ru-toggles-list">
          <!-- Essential -->
          <div class="ru-toggle-row">
            <div class="ru-toggle-info">
              <span class="ru-toggle-name">Strictly Essential Operations</span>
              <span class="ru-toggle-desc">Required for security, session identification, fraud defense, and checkout. Cannot be disabled.</span>
            </div>
            <label class="ru-switch">
              <input type="checkbox" checked disabled>
              <span class="ru-slider"></span>
            </label>
          </div>

          <!-- Analytics & Telemetry -->
          <div class="ru-toggle-row">
            <div class="ru-toggle-info">
              <span class="ru-toggle-name">Analytics &amp; Behavioral Telemetry</span>
              <span class="ru-toggle-desc">Tracks scroll depth, active dwell, dead clicks, and CTA interactions to improve UI performance.</span>
            </div>
            <label class="ru-switch">
              <input type="checkbox" id="ru-toggle-analytics" checked>
              <span class="ru-slider"></span>
            </label>
          </div>

          <!-- Personalized Advertising -->
          <div class="ru-toggle-row">
            <div class="ru-toggle-info">
              <span class="ru-toggle-name">Personalized Advertising (Google Ads)</span>
              <span class="ru-toggle-desc">Permits Google Ads Enhanced Conversions and customer attribution via first-party hashed identifiers.</span>
            </div>
            <label class="ru-switch">
              <input type="checkbox" id="ru-toggle-advertising" ${this.gpcActive ? 'disabled' : 'checked'}>
              <span class="ru-slider"></span>
            </label>
          </div>

          <!-- Commercial Sharing & Licensing -->
          <div class="ru-toggle-row">
            <div class="ru-toggle-info">
              <span class="ru-toggle-name">Commercial Data Sharing &amp; Licensing</span>
              <span class="ru-toggle-desc">Opt in or out of audience cohort exports and commercial partner licensing. GPC signal locks this to disabled.</span>
            </div>
            <label class="ru-switch">
              <input type="checkbox" id="ru-toggle-sharing" ${this.gpcActive ? 'disabled' : 'checked'}>
              <span class="ru-slider"></span>
            </label>
          </div>
        </div>

        <div class="ru-consent-actions" style="margin-top: 10px;">
          <button id="ru-modal-close" class="ru-btn ru-btn-secondary">Cancel</button>
          <button id="ru-modal-save" class="ru-btn ru-btn-primary">Save Preferences</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    this.bindEvents();
  }

  private bindEvents(): void {
    document.getElementById('ru-consent-accept')?.addEventListener('click', () => {
      this.saveConsent({
        analytics: true,
        advertising: !this.gpcActive,
        commercialSharing: !this.gpcActive,
      });
      this.hideBanner();
    });

    document.getElementById('ru-consent-reject')?.addEventListener('click', () => {
      this.saveConsent({
        analytics: false,
        advertising: false,
        commercialSharing: false,
      });
      this.hideBanner();
    });

    document.getElementById('ru-consent-manage')?.addEventListener('click', () => {
      this.openModal();
    });

    document.getElementById('ru-modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('ru-modal-save')?.addEventListener('click', () => {
      const analytics = (document.getElementById('ru-toggle-analytics') as HTMLInputElement)?.checked ?? true;
      const advertising = this.gpcActive
        ? false
        : (document.getElementById('ru-toggle-advertising') as HTMLInputElement)?.checked ?? false;
      const commercialSharing = this.gpcActive
        ? false
        : (document.getElementById('ru-toggle-sharing') as HTMLInputElement)?.checked ?? false;

      this.saveConsent({ analytics, advertising, commercialSharing });
      this.closeModal();
      this.hideBanner();
    });

    // Close modal on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('ru-hidden')) {
        this.closeModal();
      }
    });

    // Close modal on overlay click
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  public showBanner(): void {
    this.banner?.classList.remove('ru-hidden');
  }

  public hideBanner(): void {
    this.banner?.classList.add('ru-hidden');
  }

  public openModal(): void {
    const collector = getTelemetryCollector();
    const current = collector.getConsent();

    const analyticsEl = document.getElementById('ru-toggle-analytics') as HTMLInputElement | null;
    const adEl = document.getElementById('ru-toggle-advertising') as HTMLInputElement | null;
    const shareEl = document.getElementById('ru-toggle-sharing') as HTMLInputElement | null;

    if (analyticsEl) analyticsEl.checked = current.analytics_storage === 'granted';
    if (adEl) {
      if (this.gpcActive) {
        adEl.checked = false;
        adEl.disabled = true;
      } else {
        adEl.checked = current.ad_user_data === 'granted';
      }
    }
    if (shareEl) {
      if (this.gpcActive) {
        shareEl.checked = false;
        shareEl.disabled = true;
      } else {
        shareEl.checked = current.sale_sharing_opt_in === true;
      }
    }

    this.modal?.classList.remove('ru-hidden');
  }

  public closeModal(): void {
    this.modal?.classList.add('ru-hidden');
  }

  private saveConsent(choices: { analytics: boolean; advertising: boolean; commercialSharing: boolean }): void {
    const collector = getTelemetryCollector();
    const updatedConsent: Partial<ConsentState> = {
      analytics_storage: choices.analytics ? 'granted' : 'denied',
      ad_storage: choices.advertising ? 'granted' : 'denied',
      ad_user_data: choices.advertising ? 'granted' : 'denied',
      ad_personalization: choices.advertising ? 'granted' : 'denied',
      sale_sharing_opt_in: choices.commercialSharing,
    };

    collector.updateConsent(updatedConsent);
  }
}

export function initPrivacyConsentManager(): PrivacyConsentManager {
  const manager = new PrivacyConsentManager();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => manager.init());
    } else {
      manager.init();
    }
  }
  return manager;
}
