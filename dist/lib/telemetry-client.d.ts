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
export declare function generateId(): string;
export declare function hashSha256(val: string): Promise<string>;
export declare function isGpcActive(): boolean;
export declare function getInitialConsent(): ConsentState;
export declare class TelemetryCollector {
    private uid;
    private sessionId;
    private sessionLastActive;
    private consent;
    private eventQueue;
    private flushTimer;
    private readonly maxBatchSize;
    private readonly flushIntervalMs;
    private readonly sessionDurationMs;
    private cachedEnvironment;
    private cachedAttribution;
    private cachedHashedEmail;
    private cachedHashedPhone;
    private activeDwellMs;
    private lastDwellStart;
    private isWindowVisible;
    private maxScrollDepth;
    private readonly firedScrollDepths;
    private domMutatedRecently;
    private mutationObserver;
    private clickHistory;
    constructor();
    private resolveUid;
    private resolveSession;
    private refreshSession;
    private initConsentMode;
    updateConsent(updated: Partial<ConsentState>): void;
    getConsent(): ConsentState;
    syncConsentToServer(consent: ConsentState): Promise<void>;
    private initEnvironment;
    private initAttribution;
    private initListeners;
    private accumulateDwell;
    private initMicroTrackers;
    private trackPageView;
    private initScrollDepth;
    private initProductImpressions;
    private initClickTelemetry;
    private initCtaHover;
    private initFormTracking;
    private initPromoCopy;
    enqueue(type: string, payload?: Record<string, unknown>): void;
    trackCommerceEvent(type: 'view_item' | 'add_to_cart' | 'remove_from_cart' | 'begin_checkout' | 'purchase', payload: CommercePayload): Promise<void>;
    flush(): void;
}
export declare function getTelemetryCollector(): TelemetryCollector;
export declare function initTelemetry(): TelemetryCollector;
