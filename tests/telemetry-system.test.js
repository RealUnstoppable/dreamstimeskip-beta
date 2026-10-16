/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import {
  hashSha256,
  isGpcActive,
  getInitialConsent,
  TelemetryCollector,
  generateId,
} from '../dist/lib/telemetry-client.js';
import {
  extractClientIp,
  extractClientGeo,
  deriveSegments,
  issueUidCookie,
  handleTelemetryIngest,
  handleConsentRecord,
} from '../dist/lib/telemetry-server.js';
import {
  sha256Hex,
  normalizePhone,
  toCustomerMatchCSV,
} from '../dist/lib/google-ads-sync.js';
import { PrivacyConsentManager } from '../dist/components/PrivacyConsentManager.js';

describe('First-Party Telemetry & Consent System', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.body.innerHTML = '';
    document.cookie = '';
    delete window.__ru_telemetry;
    delete window.openPrivacyChoices;
    delete navigator.globalPrivacyControl;
  });

  describe('Client-Side Telemetry SDK', () => {
    test('generateId produces non-empty unique string', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(5);
      expect(id1).not.toBe(id2);
    });

    test('hashSha256 normalizes input and hashes with SubtleCrypto', async () => {
      const raw = '  User.Test@Example.COM  ';
      const hash = await hashSha256(raw);
      expect(hash).toBe('f3f97d08c61188f515a70bfa1f11ed320fd719baa089fc6669d820ca9fa0aac3');
    });

    test('isGpcActive detects navigator.globalPrivacyControl correctly', () => {
      expect(isGpcActive()).toBe(false);

      Object.defineProperty(navigator, 'globalPrivacyControl', {
        value: true,
        configurable: true,
      });

      expect(isGpcActive()).toBe(true);
    });

    test('getInitialConsent respects GPC signal by denying ad flags', () => {
      Object.defineProperty(navigator, 'globalPrivacyControl', {
        value: true,
        configurable: true,
      });

      const consent = getInitialConsent();
      expect(consent.gpc).toBe(true);
      expect(consent.sale_sharing_opt_in).toBe(false);
      expect(consent.ad_user_data).toBe('denied');
      expect(consent.ad_personalization).toBe('denied');
    });

    test('TelemetryCollector initializes with identifiers, consent, and micro-trackers', () => {
      const collector = new TelemetryCollector();
      const consent = collector.getConsent();
      expect(consent).toBeDefined();
      expect(consent.policyVersion).toBe('2026.10');
      expect(document.cookie).toContain('ru_uid=');
      expect(document.cookie).toContain('ru_sid=');
    });

    test('trackCommerceEvent pushes hashed user data to dataLayer', async () => {
      window.dataLayer = [];
      const collector = new TelemetryCollector();

      await collector.trackCommerceEvent('purchase', {
        value: 99.99,
        currency: 'USD',
        userEmail: 'CUSTOMER@EXAMPLE.COM',
        userPhone: '+1-555-123-4567',
      });

      expect(window.dataLayer.length).toBeGreaterThan(0);
      const push = window.dataLayer.find((item) => item.event === 'purchase');
      expect(push).toBeDefined();
      expect(push.user_data.sha256_email_address).toBe(
        'e233d4a29013e9d87150c6237c6777bedf379ebf1acdc5d6126fec7e8bb74fb5'
      );
    });
  });

  describe('Server-Side Telemetry Ingestion Pipeline', () => {
    test('extractClientIp correctly prioritizes headers', () => {
      const req1 = {
        headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' },
        socket: {},
      };
      expect(extractClientIp(req1)).toBe('203.0.113.195');

      const req2 = {
        headers: { 'cf-connecting-ip': '198.51.100.44' },
        socket: {},
      };
      expect(extractClientIp(req2)).toBe('198.51.100.44');

      const req3 = {
        headers: { 'x-real-ip': '192.0.2.1' },
        socket: {},
      };
      expect(extractClientIp(req3)).toBe('192.0.2.1');

      const req4 = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      };
      expect(extractClientIp(req4)).toBe('127.0.0.1');
    });

    test('extractClientGeo parses CDN country and region', () => {
      const req = {
        headers: {
          'cf-ipcountry': 'US',
          'cf-region': 'CA',
          'cf-ipcity': 'San Francisco',
          'cf-asn': 'AS13335',
        },
      };
      const geo = extractClientGeo(req);
      expect(geo.country).toBe('US');
      expect(geo.region).toBe('CA');
      expect(geo.city).toBe('San Francisco');
      expect(geo.asn).toBe('AS13335');
    });

    test('issueUidCookie sets HttpOnly, Secure, SameSite=Lax cookie with 1-year expiry', () => {
      let setHeaderCall = null;
      const res = {
        getHeader: () => null,
        setHeader: (name, val) => {
          setHeaderCall = { name, val };
        },
      };

      issueUidCookie(res, 'test_uid_123');
      expect(setHeaderCall.name).toBe('Set-Cookie');
      expect(setHeaderCall.val).toContain('ru_uid=test_uid_123');
      expect(setHeaderCall.val).toContain('HttpOnly');
      expect(setHeaderCall.val).toContain('Secure');
      expect(setHeaderCall.val).toContain('SameSite=Lax');
      expect(setHeaderCall.val).toContain('Max-Age=31536000');
    });

    test('deriveSegments accurately categorizes behavior', () => {
      const events = [
        { type: 'rage_click', payload: { x: 100, y: 100 } },
        { type: 'promo_copy', payload: { promoTag: 'SPRING50' } },
        { type: 'cta_hover', payload: { durationMs: 600 } },
        { type: 'commerce_event', payload: { commerceType: 'add_to_cart' } },
      ];

      const segments = deriveSegments(events);
      expect(segments).toContain('rage_click_affected');
      expect(segments).toContain('promo_seeker');
      expect(segments).toContain('high_intent_viewer');
      expect(segments).toContain('cart_abandoner');
      expect(segments).not.toContain('repeat_buyer');
    });

    test('handleTelemetryIngest enforces size caps and validates payload', async () => {
      const bigArray = new Array(60).fill({ type: 'page_view' });
      let status = 0;
      let body = null;
      const res = {
        status: (code) => {
          status = code;
          return {
            json: (data) => {
              body = data;
            },
          };
        },
        setHeader: () => {},
        getHeader: () => null,
      };

      const req = {
        method: 'POST',
        headers: {},
        body: {
          uid: 'uid_test',
          sessionId: 'sid_test',
          events: bigArray,
        },
      };

      await handleTelemetryIngest(req, res);
      expect(status).toBe(400);
      expect(body.error).toContain('limit of 50 events');
    });
  });

  describe('Google Ads Customer Match Sync', () => {
    test('sha256Hex normalizes strings to lowercase and trims whitespace', () => {
      expect(sha256Hex('  John.Doe@Gmail.com  ')).toBe(
        '375320dd9ae7ed408002f3768e16cb5f28c861062fd50dff9a3bff62e9dce4ef'
      );
      expect(sha256Hex('')).toBe('');
      expect(sha256Hex(null)).toBe('');
    });

    test('normalizePhone removes spaces and punctuation while keeping digits and plus', () => {
      expect(normalizePhone(' +1 (555) 234-5678 ')).toBe('+15552345678');
      expect(normalizePhone(null)).toBe('');
    });

    test('toCustomerMatchCSV formats headers and data correctly', () => {
      const records = [
        {
          Email: 'sha_email_1',
          Phone: 'sha_phone_1',
          'First Name': 'sha_fn_1',
          'Last Name': 'sha_ln_1',
          Country: 'sha_country_1',
          Zip: 'sha_zip_1',
        },
      ];

      const csv = toCustomerMatchCSV(records);
      expect(csv).toBe(
        'Email,Phone,First Name,Last Name,Country,Zip\nsha_email_1,sha_phone_1,sha_fn_1,sha_ln_1,sha_country_1,sha_zip_1'
      );
    });
  });

  describe('Privacy Consent Manager UI', () => {
    test('renders banner and opens modal with granular controls', () => {
      const manager = new PrivacyConsentManager();
      manager.init();

      const banner = document.getElementById('ru-consent-banner');
      expect(banner).not.toBeNull();
      expect(banner.classList.contains('ru-hidden')).toBe(false);

      const modal = document.getElementById('ru-privacy-modal');
      expect(modal).not.toBeNull();
      expect(modal.classList.contains('ru-hidden')).toBe(true);

      // Open modal via global helper
      expect(typeof window.openPrivacyChoices).toBe('function');
      window.openPrivacyChoices();
      expect(modal.classList.contains('ru-hidden')).toBe(false);

      // Verify toggles
      const analyticsToggle = document.getElementById('ru-toggle-analytics');
      const adToggle = document.getElementById('ru-toggle-advertising');
      const shareToggle = document.getElementById('ru-toggle-sharing');

      expect(analyticsToggle).not.toBeNull();
      expect(adToggle).not.toBeNull();
      expect(shareToggle).not.toBeNull();

      // Close modal
      const closeBtn = document.getElementById('ru-modal-close');
      closeBtn.click();
      expect(modal.classList.contains('ru-hidden')).toBe(true);
    });

    test('displays GPC badge and disables ad and sharing toggles when GPC active', () => {
      Object.defineProperty(navigator, 'globalPrivacyControl', {
        value: true,
        configurable: true,
      });

      const manager = new PrivacyConsentManager();
      manager.init();

      const badge = document.querySelector('.ru-gpc-badge');
      expect(badge).not.toBeNull();
      expect(badge.textContent).toContain('GPC Honored');

      manager.openModal();
      const adToggle = document.getElementById('ru-toggle-advertising');
      const shareToggle = document.getElementById('ru-toggle-sharing');

      expect(adToggle.disabled).toBe(true);
      expect(adToggle.checked).toBe(false);
      expect(shareToggle.disabled).toBe(true);
      expect(shareToggle.checked).toBe(false);
    });
  });
});
