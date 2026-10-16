/**
 * First-Party Cross-Browser Telemetry & Consent Client SDK
 * Production-grade collector for realunstoppable.store
 */

export interface ConsentState {
  ad_storage: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  sale_sharing_opt_in: boolean;
  timestamp: number;
  gpc: boolean;
  policyVersion: string;
}

export interface EnvironmentData {
  screenWidth: number;
  screenHeight: number;
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
  timeZone: string;
  languages: readonly string[];
  connectionType: string | null;
  platform: string;
  userAgent: string;
  highEntropyValues?: Record<string, unknown> | null;
}

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  ttclid?: string;
  referrer: string;
  landingPath: string;
}

export interface TelemetryEvent {
  id: string;
  type: string;
  timestamp: number;
  url: string;
  payload: Record<string, unknown>;
}

export interface TelemetryPayload {
  uid: string;
  sessionId: string;
  environment: EnvironmentData;
  attribution: AttributionData;
  consent: ConsentState;
  events: TelemetryEvent[];
  activeDwellMs?: number;
  maxScrollDepthPct?: number;
  hashedEmailSha256?: string;
  hashedPhoneSha256?: string;
}

export interface CommercePayload {
  currency?: string;
  value?: number;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
    [key: string]: unknown;
  }>;
  userEmail?: string;
  userPhone?: string;
  [key: string]: unknown;
}

// Memory fallback store for strict private browsing
const memoryStore = new Map<string, string>();

function safeStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? memoryStore.get(key) ?? null;
  } catch {
    try {
      return sessionStorage.getItem(key) ?? memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }
}

function safeStorageSet(key: string, val: string): void {
  try {
    localStorage.setItem(key, val);
  } catch {
    try {
      sessionStorage.setItem(key, val);
    } catch {
      memoryStore.set(key, val);
    }
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSec: number): void {
  if (typeof document === 'undefined') return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'ru_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
}

export async function hashSha256(val: string): Promise<string> {
  const normalized = val.trim().toLowerCase();
  if (!normalized) return '';
  const subtle =
    (typeof window !== 'undefined' && window.crypto?.subtle) ||
    (typeof globalThis !== 'undefined' && (globalThis as unknown as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle);
  if (subtle) {
    try {
      const buffer = new TextEncoder().encode(normalized);
      const hash = await subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      // Fall through to fallback
    }
  }
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const nodeCrypto = await import('crypto');
      return nodeCrypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
    }
  } catch {
    // Non-node environment without subtle
  }
  return '';
}

export function isGpcActive(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

const DEFAULT_POLICY_VERSION = '2026.10';

export function getInitialConsent(): ConsentState {
  const gpc = isGpcActive();
  const raw = safeStorageGet('ru_consent');
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ConsentState;
      if (gpc) {
        parsed.sale_sharing_opt_in = false;
        parsed.ad_user_data = 'denied';
        parsed.ad_personalization = 'denied';
        parsed.gpc = true;
      }
      return parsed;
    } catch {
      // fallback
    }
  }

  return {
    ad_storage: 'denied',
    analytics_storage: 'granted',
    ad_user_data: gpc ? 'denied' : 'denied',
    ad_personalization: gpc ? 'denied' : 'denied',
    sale_sharing_opt_in: !gpc,
    timestamp: Date.now(),
    gpc,
    policyVersion: DEFAULT_POLICY_VERSION,
  };
}

function pushGtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === 'function') {
    w.gtag(...args);
  } else {
    w.dataLayer.push(args);
  }
}

export class TelemetryCollector {
  private uid: string;
  private sessionId: string;
  private sessionLastActive: number;
  private consent: ConsentState;
  private eventQueue: TelemetryEvent[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly maxBatchSize = 25;
  private readonly flushIntervalMs = 8000;
  private readonly sessionDurationMs = 30 * 60 * 1000;

  private cachedEnvironment: EnvironmentData | null = null;
  private cachedAttribution: AttributionData | null = null;
  private cachedHashedEmail: string | undefined;
  private cachedHashedPhone: string | undefined;

  private activeDwellMs = 0;
  private lastDwellStart = Date.now();
  private isWindowVisible = true;
  private maxScrollDepth = 0;
  private readonly firedScrollDepths = new Set<number>();

  private domMutatedRecently = false;
  private mutationObserver: MutationObserver | null = null;
  private clickHistory: Array<{ x: number; y: number; time: number }> = [];

  constructor() {
    this.uid = this.resolveUid();
    const sessionInfo = this.resolveSession();
    this.sessionId = sessionInfo.sessionId;
    this.sessionLastActive = sessionInfo.lastActive;
    this.consent = getInitialConsent();

    this.initConsentMode();
    this.initEnvironment();
    this.initAttribution();
    this.initListeners();
    this.initMicroTrackers();
  }

  private resolveUid(): string {
    let id = getCookie('ru_uid') || safeStorageGet('ru_uid');
    if (!id) {
      id = generateId();
    }
    setCookie('ru_uid', id, 365 * 24 * 60 * 60);
    safeStorageSet('ru_uid', id);
    return id;
  }

  private resolveSession(): { sessionId: string; lastActive: number } {
    const now = Date.now();
    let sid = getCookie('ru_sid') || safeStorageGet('ru_sid');
    const lastActiveStr = safeStorageGet('ru_sid_active');
    let lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : now;

    if (!sid || now - lastActive > this.sessionDurationMs) {
      sid = 'sid_' + generateId();
      lastActive = now;
    }

    this.refreshSession(sid, now);
    return { sessionId: sid, lastActive };
  }

  private refreshSession(sid: string = this.sessionId, now: number = Date.now()): void {
    this.sessionId = sid;
    this.sessionLastActive = now;
    setCookie('ru_sid', sid, 1800);
    safeStorageSet('ru_sid', sid);
    safeStorageSet('ru_sid_active', now.toString());
  }

  private initConsentMode(): void {
    pushGtag('consent', 'default', {
      ad_storage: this.consent.ad_storage,
      analytics_storage: this.consent.analytics_storage,
      ad_user_data: this.consent.ad_user_data,
      ad_personalization: this.consent.ad_personalization,
    });
  }

  public updateConsent(updated: Partial<ConsentState>): void {
    const gpc = isGpcActive();
    const nextConsent: ConsentState = {
      ...this.consent,
      ...updated,
      timestamp: Date.now(),
      gpc,
    };

    if (gpc || nextConsent.sale_sharing_opt_in === false) {
      nextConsent.sale_sharing_opt_in = false;
      nextConsent.ad_user_data = 'denied';
      nextConsent.ad_personalization = 'denied';
    }

    this.consent = nextConsent;
    safeStorageSet('ru_consent', JSON.stringify(nextConsent));

    pushGtag('consent', 'update', {
      ad_storage: nextConsent.ad_storage,
      analytics_storage: nextConsent.analytics_storage,
      ad_user_data: nextConsent.ad_user_data,
      ad_personalization: nextConsent.ad_personalization,
    });

    this.syncConsentToServer(nextConsent);
  }

  public getConsent(): ConsentState {
    return { ...this.consent };
  }

  public async syncConsentToServer(consent: ConsentState): Promise<void> {
    try {
      await fetch('/api/v1/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        keepalive: true,
        body: JSON.stringify({
          uid: this.uid,
          consentState: consent,
        }),
      });
    } catch {
      // Non-blocking
    }
  }

  private initEnvironment(): void {
    if (typeof window === 'undefined') return;

    const nav = navigator as unknown as {
      hardwareConcurrency?: number;
      deviceMemory?: number;
      connection?: { effectiveType?: string };
      userAgentData?: {
        getHighEntropyValues: (hints: string[]) => Promise<Record<string, unknown>>;
      };
      languages?: readonly string[];
    };

    const env: EnvironmentData = {
      screenWidth: screen.width,
      screenHeight: screen.height,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      colorDepth: screen.colorDepth || 24,
      hardwareConcurrency: nav.hardwareConcurrency || null,
      deviceMemory: nav.deviceMemory || null,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      languages: nav.languages || [navigator.language || 'en'],
      connectionType: nav.connection?.effectiveType || null,
      platform: navigator.platform || '',
      userAgent: navigator.userAgent || '',
      highEntropyValues: null,
    };

    this.cachedEnvironment = env;

    if (nav.userAgentData?.getHighEntropyValues) {
      nav.userAgentData
        .getHighEntropyValues(['architecture', 'model', 'platform', 'platformVersion', 'fullVersionList', 'bitness'])
        .then((values) => {
          if (this.cachedEnvironment) {
            this.cachedEnvironment.highEntropyValues = values;
          }
        })
        .catch(() => {
          // graceful fallback
        });
    }
  }

  private initAttribution(): void {
    if (typeof window === 'undefined') return;

    const stored = safeStorageGet('ru_attr');
    if (stored) {
      try {
        this.cachedAttribution = JSON.parse(stored);
        return;
      } catch {
        // Parse fresh
      }
    }

    const params = new URLSearchParams(window.location.search);
    const attr: AttributionData = {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined,
      gclid: params.get('gclid') || undefined,
      gbraid: params.get('gbraid') || undefined,
      wbraid: params.get('wbraid') || undefined,
      fbclid: params.get('fbclid') || undefined,
      ttclid: params.get('ttclid') || undefined,
      referrer: document.referrer || '',
      landingPath: window.location.pathname + window.location.search,
    };

    this.cachedAttribution = attr;
    safeStorageSet('ru_attr', JSON.stringify(attr));
  }

  private initListeners(): void {
    if (typeof document === 'undefined') return;

    // Resilient flush on visibilitychange and pagehide (vital for Mobile Safari)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.accumulateDwell();
        this.isWindowVisible = false;
        this.flush();
      } else {
        this.isWindowVisible = true;
        this.lastDwellStart = Date.now();
      }
    });

    window.addEventListener('pagehide', () => {
      this.accumulateDwell();
      this.flush();
    });

    window.addEventListener('focus', () => {
      if (!this.isWindowVisible) {
        this.isWindowVisible = true;
        this.lastDwellStart = Date.now();
      }
    });

    window.addEventListener('blur', () => {
      this.accumulateDwell();
      this.isWindowVisible = false;
    });

    // Mutation observer to detect dead clicks
    if (typeof MutationObserver !== 'undefined' && document.body) {
      this.mutationObserver = new MutationObserver(() => {
        this.domMutatedRecently = true;
      });
      this.mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    }
  }

  private accumulateDwell(): void {
    if (this.isWindowVisible) {
      const delta = Date.now() - this.lastDwellStart;
      if (delta > 0 && delta < 24 * 60 * 60 * 1000) {
        this.activeDwellMs += delta;
      }
      this.lastDwellStart = Date.now();
    }
  }

  private initMicroTrackers(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // 1. Page view
    this.trackPageView();

    // 2. Scroll depth
    this.initScrollDepth();

    // 3. Product impressions
    this.initProductImpressions();

    // 4. Click telemetry (CTA, outbound, rage clicks, dead clicks)
    this.initClickTelemetry();

    // 5. CTA hover
    this.initCtaHover();

    // 6. Form interactions
    this.initFormTracking();

    // 7. Promo copy / paste
    this.initPromoCopy();

    // 8. Universal Video Engagement Tracker (Dreams OG Trailer & site videos)
    this.initVideoTracking();
  }

  private trackPageView(): void {
    let loadTiming: Record<string, unknown> | null = null;
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        loadTiming = {
          dns: nav.domainLookupEnd - nav.domainLookupStart,
          tcp: nav.connectEnd - nav.connectStart,
          ttfb: nav.responseStart - nav.requestStart,
          response: nav.responseEnd - nav.responseStart,
          domComplete: nav.domComplete,
          duration: nav.duration,
        };
      }
    } catch {
      // performance navigation not supported
    }

    this.enqueue('page_view', {
      title: document.title,
      referrer: document.referrer,
      loadTiming,
    });
  }

  private initScrollDepth(): void {
    let ticking = false;
    const calculateScroll = () => {
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollable = docHeight - winHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.round((scrollTop / scrollable) * 100)) : 100;

      if (pct > this.maxScrollDepth) {
        this.maxScrollDepth = pct;
      }

      const thresholds = [25, 50, 75, 100];
      for (const t of thresholds) {
        if (pct >= t && !this.firedScrollDepths.has(t)) {
          this.firedScrollDepths.add(t);
          this.enqueue('scroll_depth', { threshold: t, currentPct: pct });
        }
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(calculateScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  private initProductImpressions(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const dwellMap = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            dwellMap.set(el, now);
          } else {
            const start = dwellMap.get(el);
            if (start) {
              const duration = now - start;
              if (duration >= 1000) {
                this.enqueue('product_impression', {
                  sku: el.getAttribute('data-telemetry-sku') || el.dataset.telemetrySku,
                  price: el.getAttribute('data-telemetry-price') || el.dataset.telemetryPrice || null,
                  dwellMs: duration,
                });
              }
              dwellMap.delete(el);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const observeSkus = () => {
      document.querySelectorAll('[data-telemetry-sku]').forEach((el) => observer.observe(el));
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeSkus);
    } else {
      observeSkus();
    }
  }

  private initClickTelemetry(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      const now = Date.now();
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const x = e.clientX;
      const y = e.clientY;

      // Check rage clicks: 3+ clicks within 800ms inside 50px radius
      this.clickHistory.push({ x, y, time: now });
      this.clickHistory = this.clickHistory.filter((c) => now - c.time <= 800);
      if (this.clickHistory.length >= 3) {
        const first = this.clickHistory[0];
        const allWithinRadius = this.clickHistory.every((c) => {
          const dist = Math.hypot(c.x - first.x, c.y - first.y);
          return dist <= 50;
        });

        if (allWithinRadius) {
          this.enqueue('rage_click', {
            x,
            y,
            clickCount: this.clickHistory.length,
            targetTag: target.tagName,
            targetClass: target.className,
          });
          this.clickHistory = [];
        }
      }

      // Check CTA clicks
      const ctaEl = target.closest('[data-telemetry-cta]') as HTMLElement | null;
      if (ctaEl) {
        this.enqueue('click_telemetry', {
          ctaType: ctaEl.getAttribute('data-telemetry-cta') || 'general',
          text: (ctaEl.innerText || '').slice(0, 50).trim(),
          id: ctaEl.id || null,
        });
      }

      // Outbound link clicks
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href, window.location.href);
          if (url.hostname && url.hostname !== window.location.hostname) {
            this.enqueue('click_telemetry', {
              outbound: true,
              href: anchor.href,
              text: (anchor.innerText || '').slice(0, 50).trim(),
            });
          }
        } catch {
          // ignore invalid URLs
        }
      }

      // Check dead clicks: non-interactive element with no DOM or URL change in 500ms
      const isInteractive = Boolean(
        target.closest('a, button, input, select, textarea, [role="button"], [role="link"], label')
      );
      if (!isInteractive) {
        const initialUrl = window.location.href;
        this.domMutatedRecently = false;
        setTimeout(() => {
          if (!this.domMutatedRecently && window.location.href === initialUrl) {
            this.enqueue('dead_click', {
              x,
              y,
              targetTag: target.tagName,
              targetClass: typeof target.className === 'string' ? target.className.slice(0, 80) : '',
            });
          }
        }, 500);
      }
    });
  }

  private initCtaHover(): void {
    const hoverSelector = '[data-telemetry-cta], .pricing-tier, .add-to-cart, .checkout-btn';
    const hoverTimers = new WeakMap<Element, number>();

    document.addEventListener('mouseover', (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(hoverSelector);
      if (target && !hoverTimers.has(target)) {
        hoverTimers.set(target, Date.now());
      }
    });

    document.addEventListener('mouseout', (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(hoverSelector);
      if (target && hoverTimers.has(target)) {
        const start = hoverTimers.get(target)!;
        const duration = Date.now() - start;
        hoverTimers.delete(target);
        if (duration >= 400) {
          this.enqueue('cta_hover', {
            target: target.tagName,
            id: target.id || null,
            ctaAttr: target.getAttribute('data-telemetry-cta') || null,
            durationMs: duration,
          });
        }
      }
    });
  }

  private initFormTracking(): void {
    const isSensitiveInput = (input: HTMLInputElement): boolean => {
      const type = (input.type || '').toLowerCase();
      const name = (input.name || '').toLowerCase();
      const autocomplete = (input.autocomplete || '').toLowerCase();
      return (
        type === 'password' ||
        autocomplete.startsWith('cc-') ||
        autocomplete.includes('cvv') ||
        autocomplete.includes('csc') ||
        name.includes('cvv') ||
        name.includes('cvc') ||
        name.includes('ssn') ||
        name.includes('cardnumber')
      );
    };

    const formDwell = new WeakMap<Element, number>();
    const submittedForms = new WeakSet<HTMLFormElement>();

    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target instanceof HTMLInputElement && isSensitiveInput(target)) return;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        formDwell.set(target, Date.now());
      }
    });

    document.addEventListener('focusout', (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target instanceof HTMLInputElement && isSensitiveInput(target)) return;
      if (formDwell.has(target)) {
        const start = formDwell.get(target)!;
        const duration = Date.now() - start;
        formDwell.delete(target);
        const form = target.closest('form');
        this.enqueue('form_interaction', {
          formId: form?.id || null,
          fieldName: (target as HTMLInputElement).name || (target as HTMLInputElement).id || 'unnamed',
          fieldType: (target as HTMLInputElement).type || target.tagName.toLowerCase(),
          timeSpentMs: duration,
          abandoned: form ? !submittedForms.has(form) : true,
        });
      }
    });

    document.addEventListener('submit', (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      if (form) {
        submittedForms.add(form);
      }
    });
  }

  private initPromoCopy(): void {
    const handlePromoEvent = (e: ClipboardEvent, eventType: 'copy' | 'paste') => {
      const target = e.target as HTMLElement | null;
      const promoEl = target?.closest('[data-telemetry-promo]') as HTMLElement | null;
      if (promoEl) {
        this.enqueue('promo_copy', {
          action: eventType,
          promoTag: promoEl.getAttribute('data-telemetry-promo') || 'promo',
        });
      }
    };

    document.addEventListener('copy', (e) => handlePromoEvent(e, 'copy'));
    document.addEventListener('paste', (e) => handlePromoEvent(e, 'paste'));
  }

  private initVideoTracking(): void {
    if (typeof document === 'undefined') return;

    const trackedVideos = new WeakSet<HTMLVideoElement>();

    const attachVideoListeners = (video: HTMLVideoElement) => {
      if (trackedVideos.has(video)) return;
      trackedVideos.add(video);

      const videoId =
        video.id ||
        video.getAttribute('data-telemetry-video') ||
        'vid_' + Math.random().toString(36).substring(2, 8);

      const getVideoTitle = (): string => {
        const explicit = video.getAttribute('data-telemetry-video');
        if (explicit) return explicit;
        if (video.id === 'modal-video') {
          return document.title.includes('Dreams') ? 'Dreams OG Official Trailer' : 'Site Feature Trailer';
        }
        if (video.classList.contains('dts-bg-video')) return 'DTS Background Visual';
        const src = video.currentSrc || video.querySelector('source')?.getAttribute('src') || '';
        if (src.includes('dreams-trailer')) return 'Dreams OG Official Trailer';
        if (src) {
          const parts = src.split('/');
          return parts[parts.length - 1].split('?')[0];
        }
        return video.id || 'Site Video';
      };

      const firedMilestones = new Set<number>();
      let playStartMs = 0;
      let totalWatchedSec = 0;

      video.addEventListener('play', () => {
        playStartMs = Date.now();
        this.enqueue('video_engagement', {
          videoId,
          videoTitle: getVideoTitle(),
          action: 'start',
          currentTime: Math.round(video.currentTime || 0),
          duration: Math.round(video.duration || 0),
          percent: video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        });
      });

      video.addEventListener('timeupdate', () => {
        if (!video.duration || isNaN(video.duration)) return;
        const pct = Math.round((video.currentTime / video.duration) * 100);
        const milestones = [25, 50, 75];
        for (const m of milestones) {
          if (pct >= m && !firedMilestones.has(m)) {
            firedMilestones.add(m);
            this.enqueue('video_engagement', {
              videoId,
              videoTitle: getVideoTitle(),
              action: `progress_${m}`,
              currentTime: Math.round(video.currentTime),
              duration: Math.round(video.duration),
              percent: pct,
              page: typeof window !== 'undefined' ? window.location.pathname : '',
            });
          }
        }
      });

      video.addEventListener('ended', () => {
        if (playStartMs > 0) {
          totalWatchedSec += Math.round((Date.now() - playStartMs) / 1000);
          playStartMs = 0;
        }
        this.enqueue('video_engagement', {
          videoId,
          videoTitle: getVideoTitle(),
          action: 'complete',
          currentTime: Math.round(video.duration || video.currentTime || 0),
          duration: Math.round(video.duration || video.currentTime || 0),
          percent: 100,
          totalWatchedSec,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        });
      });

      video.addEventListener('pause', () => {
        if (video.ended) return;
        if (playStartMs > 0) {
          totalWatchedSec += Math.round((Date.now() - playStartMs) / 1000);
          playStartMs = 0;
        }
        this.enqueue('video_engagement', {
          videoId,
          videoTitle: getVideoTitle(),
          action: 'pause',
          currentTime: Math.round(video.currentTime || 0),
          duration: Math.round(video.duration || 0),
          percent: video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0,
          totalWatchedSec,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        });
      });
    };

    const scanVideos = () => {
      document.querySelectorAll('video').forEach((v) => attachVideoListeners(v));
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scanVideos);
    } else {
      scanVideos();
    }

    if (typeof MutationObserver !== 'undefined' && document.body) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLVideoElement) {
              attachVideoListeners(node);
            } else if (node instanceof HTMLElement) {
              node.querySelectorAll('video').forEach((v) => attachVideoListeners(v));
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // YouTube Iframe PostMessage Listener
    window.addEventListener('message', (e) => {
      if (typeof e.data === 'string') {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.event === 'infoDelivery' && parsed.info?.playerState !== undefined) {
            const state = parsed.info.playerState;
            let action: string | null = null;
            if (state === 1) action = 'start';
            else if (state === 0) action = 'complete';
            else if (state === 2) action = 'pause';

            if (action) {
              this.enqueue('video_engagement', {
                videoId: 'youtube_player',
                videoTitle: 'Unstoppable YouTube Channel Video',
                action,
                currentTime: Math.round(parsed.info.currentTime || 0),
                duration: Math.round(parsed.info.duration || 0),
                percent: parsed.info.duration ? Math.round((parsed.info.currentTime / parsed.info.duration) * 100) : 0,
                page: window.location.pathname,
              });
            }
          }
        } catch {
          // not youtube JSON
        }
      }
    });
  }

  public trackVideo(videoId: string, action: string, metadata: Record<string, unknown> = {}): void {
    this.enqueue('video_engagement', {
      videoId,
      action,
      ...metadata,
    });
  }

  public enqueue(type: string, payload: Record<string, unknown> = {}): void {
    const now = Date.now();
    this.refreshSession(this.sessionId, now);

    const event: TelemetryEvent = {
      id: generateId(),
      type,
      timestamp: now,
      url: typeof window !== 'undefined' ? window.location.href : '',
      payload,
    };

    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        this.flush();
      }, this.flushIntervalMs);
    }
  }

  public async trackCommerceEvent(
    type: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase',
    payload: CommercePayload
  ): Promise<void> {
    const { userEmail, userPhone, ...cleanEcommerce } = payload;

    let hashedEmail = '';
    let hashedPhone = '';
    if (userEmail) {
      hashedEmail = await hashSha256(userEmail);
      this.cachedHashedEmail = hashedEmail;
    }
    if (userPhone) {
      hashedPhone = await hashSha256(userPhone);
      this.cachedHashedPhone = hashedPhone;
    }

    // Google Ads Enhanced Conversions dataLayer push
    if (typeof window !== 'undefined') {
      const w = window as unknown as { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: type,
        ecommerce: cleanEcommerce,
        ...(hashedEmail || hashedPhone
          ? {
              user_data: {
                sha256_email_address: hashedEmail || undefined,
                sha256_phone_number: hashedPhone || undefined,
              },
            }
          : {}),
      });
    }

    this.enqueue('commerce_event', {
      commerceType: type,
      ...cleanEcommerce,
    });
  }

  public flush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.eventQueue.length === 0) return;

    this.accumulateDwell();
    const batch = [...this.eventQueue];
    this.eventQueue = [];

    const payload: TelemetryPayload = {
      uid: this.uid,
      sessionId: this.sessionId,
      environment: this.cachedEnvironment || {
        screenWidth: 0,
        screenHeight: 0,
        innerWidth: 0,
        innerHeight: 0,
        devicePixelRatio: 1,
        colorDepth: 24,
        hardwareConcurrency: null,
        deviceMemory: null,
        timeZone: 'UTC',
        languages: ['en'],
        connectionType: null,
        platform: '',
        userAgent: '',
      },
      attribution: this.cachedAttribution || {
        referrer: '',
        landingPath: '',
      },
      consent: this.consent,
      events: batch,
      activeDwellMs: this.activeDwellMs,
      maxScrollDepthPct: this.maxScrollDepth,
      hashedEmailSha256: this.cachedHashedEmail,
      hashedPhoneSha256: this.cachedHashedPhone,
    };

    const jsonString = JSON.stringify(payload);
    const endpoint = '/api/v1/telemetry';

    let beaconSent = false;
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const blob = new Blob([jsonString], { type: 'application/json' });
        beaconSent = navigator.sendBeacon(endpoint, blob);
      } catch {
        beaconSent = false;
      }
    }

    if (!beaconSent && typeof fetch === 'function') {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString,
        keepalive: true,
        credentials: 'same-origin',
      }).catch(() => {
        // Silent failure in background
      });
    }
  }
}

// Global Singleton
let clientInstance: TelemetryCollector | null = null;

export function getTelemetryCollector(): TelemetryCollector {
  if (!clientInstance && typeof window !== 'undefined') {
    clientInstance = new TelemetryCollector();
  }
  return clientInstance!;
}

export function initTelemetry(): TelemetryCollector {
  return getTelemetryCollector();
}

if (typeof window !== 'undefined') {
  (window as unknown as { __ru_telemetry?: TelemetryCollector }).__ru_telemetry = initTelemetry();
}
