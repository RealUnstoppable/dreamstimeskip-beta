/**
 * Backend Telemetry & Consent Ingestion Pipeline
 * Endpoints: POST /api/v1/telemetry and POST /api/v1/consent
 */

import { adminDb, FieldValue } from './firebase-admin.js';
import type { IncomingMessage, ServerResponse } from 'http';

export interface IngestRequest extends IncomingMessage {
  body?: unknown;
  headers: IncomingMessage['headers'] & {
    'sec-gpc'?: string;
    'cf-connecting-ip'?: string;
    'cf-ipcountry'?: string;
    'cf-region'?: string;
    'cf-ipcity'?: string;
    'cf-asn'?: string;
    'x-real-ip'?: string;
    'x-forwarded-for'?: string;
    'x-vercel-ip-country'?: string;
    'x-vercel-ip-country-region'?: string;
    'x-vercel-ip-city'?: string;
    'x-appengine-country'?: string;
  };
}

export interface IngestResponse extends ServerResponse {
  status?: (code: number) => IngestResponse;
  json?: (data: unknown) => void;
  setHeader: (name: string, value: string | string[]) => this;
}

export interface ClientGeoInfo {
  country: string | null;
  region: string | null;
  city: string | null;
  asn: string | null;
}

export function extractClientIp(req: IngestRequest): string {
  const xForwarded = req.headers['x-forwarded-for'];
  if (typeof xForwarded === 'string') {
    const firstIp = xForwarded.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string') return cfIp.trim();
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp.trim();
  return req.socket?.remoteAddress || 'unknown';
}

export function extractClientGeo(req: IngestRequest): ClientGeoInfo {
  const country =
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-appengine-country'] ||
    null;
  const region =
    req.headers['cf-region'] ||
    req.headers['x-vercel-ip-country-region'] ||
    null;
  const city =
    req.headers['cf-ipcity'] ||
    req.headers['x-vercel-ip-city'] ||
    null;
  const asn = req.headers['cf-asn'] || null;

  return {
    country: typeof country === 'string' ? country : null,
    region: typeof region === 'string' ? region : null,
    city: typeof city === 'string' ? city : null,
    asn: typeof asn === 'string' ? asn : null,
  };
}

export function issueUidCookie(res: IngestResponse, uid: string): void {
  const cookieVal = `ru_uid=${encodeURIComponent(uid)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=31536000`;
  try {
    const existing = res.getHeader('Set-Cookie');
    if (!existing) {
      res.setHeader('Set-Cookie', cookieVal);
    } else if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, cookieVal]);
    } else {
      res.setHeader('Set-Cookie', [String(existing), cookieVal]);
    }
  } catch {
    // Header already sent or unsupported
  }
}

export function deriveSegments(events: Array<{ type: string; payload?: Record<string, unknown> }>): string[] {
  const segments = new Set<string>();

  let hasCartOrCheckout = false;
  let hasPurchase = false;

  for (const ev of events) {
    if (ev.type === 'rage_click') {
      segments.add('rage_click_affected');
    }
    if (ev.type === 'promo_copy') {
      segments.add('promo_seeker');
    }
    if (ev.type === 'cta_hover') {
      segments.add('high_intent_viewer');
    }
    if (ev.type === 'product_impression' && ev.payload?.dwellMs && Number(ev.payload.dwellMs) >= 2000) {
      segments.add('high_intent_viewer');
    }
    if (ev.type === 'scroll_depth' && ev.payload?.threshold && Number(ev.payload.threshold) >= 75) {
      segments.add('high_intent_viewer');
    }

    if (ev.type === 'commerce_event') {
      const cType = ev.payload?.commerceType;
      if (cType === 'add_to_cart' || cType === 'begin_checkout') {
        hasCartOrCheckout = true;
      }
      if (cType === 'purchase') {
        hasPurchase = true;
        segments.add('repeat_buyer');
      }
    }

    if (ev.type === 'video_engagement') {
      segments.add('trailer_watcher');
      if (ev.payload?.action === 'complete') {
        segments.add('completed_trailer');
      }
      if (ev.payload?.videoTitle && String(ev.payload.videoTitle).includes('Dreams')) {
        segments.add('dreams_trailer_engaged');
      }
    }
  }

  if (hasCartOrCheckout && !hasPurchase) {
    segments.add('cart_abandoner');
  }

  return Array.from(segments);
}

function sendResponse(res: IngestResponse, statusCode: number, data: unknown): void {
  if (typeof res.status === 'function') {
    const s = res.status(statusCode);
    if (typeof s.json === 'function') {
      s.json(data);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleTelemetryIngest(req: IngestRequest, res: IngestResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendResponse(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const rawBody = req.body;
  if (!rawBody || typeof rawBody !== 'object') {
    sendResponse(res, 400, { error: 'Malformed or missing telemetry payload' });
    return;
  }

  // Size cap enforcement: reject payload > 64KB
  const rawBodyString = JSON.stringify(rawBody);
  if (rawBodyString.length > 65536) {
    sendResponse(res, 413, { error: 'Payload exceeds maximum allowed size of 64KB' });
    return;
  }

  const payload = rawBody as {
    uid?: string;
    sessionId?: string;
    environment?: Record<string, unknown>;
    attribution?: Record<string, unknown>;
    consent?: {
      ad_storage?: string;
      analytics_storage?: string;
      ad_user_data?: string;
      ad_personalization?: string;
      sale_sharing_opt_in?: boolean;
      gpc?: boolean;
    };
    events?: Array<{
      id: string;
      type: string;
      timestamp: number;
      url: string;
      payload?: Record<string, unknown>;
    }>;
    activeDwellMs?: number;
    maxScrollDepthPct?: number;
    hashedEmailSha256?: string;
    hashedPhoneSha256?: string;
  };

  const uid = payload.uid?.trim();
  const sessionId = payload.sessionId?.trim();
  const events = Array.isArray(payload.events) ? payload.events : [];

  if (!uid || !sessionId) {
    sendResponse(res, 400, { error: 'Missing required uid or sessionId' });
    return;
  }

  if (events.length > 50) {
    sendResponse(res, 400, { error: 'Event batch exceeds maximum limit of 50 events' });
    return;
  }

  const clientIp = extractClientIp(req);
  const geo = extractClientGeo(req);
  const gpcDetected = req.headers['sec-gpc'] === '1' || Boolean(payload.consent?.gpc);

  // Issue / refresh first-party HttpOnly cookie
  issueUidCookie(res, uid);

  // Calculate consent flags
  const saleSharingOptIn = Boolean(payload.consent?.sale_sharing_opt_in && !gpcDetected);
  const adsExportEligible = saleSharingOptIn;

  const derivedSegments = deriveSegments(events);

  try {
    const batch = adminDb.batch();

    // 1. Upsert users/{uid}
    const userRef = adminDb.collection('users').doc(uid);
    const userUpdate: Record<string, unknown> = {
      uid,
      totalEvents: FieldValue.increment(events.length),
      lastSeenAt: FieldValue.serverTimestamp(),
      adsExportEligible,
      gpcDetected,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (payload.hashedEmailSha256) {
      userUpdate.hashedEmailSha256 = payload.hashedEmailSha256;
    }
    if (payload.hashedPhoneSha256) {
      userUpdate.hashedPhoneSha256 = payload.hashedPhoneSha256;
    }
    if (derivedSegments.length > 0) {
      userUpdate.computedSegments = FieldValue.arrayUnion(...derivedSegments);
    }
    if (payload.consent) {
      userUpdate.consentState = {
        ...payload.consent,
        sale_sharing_opt_in: saleSharingOptIn,
        ad_user_data: saleSharingOptIn ? (payload.consent.ad_user_data || 'denied') : 'denied',
        ad_personalization: saleSharingOptIn ? (payload.consent.ad_personalization || 'denied') : 'denied',
        gpc: gpcDetected,
      };
    }

    batch.set(userRef, userUpdate, { merge: true });

    // 2. Upsert sessions/{sessionId}
    const sessionRef = adminDb.collection('sessions').doc(sessionId);
    const sessionUpdate: Record<string, unknown> = {
      sessionId,
      uid,
      clientIp,
      geo,
      gpcDetected,
      environment: payload.environment || {},
      attribution: payload.attribution || {},
      lastSeenAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (typeof payload.maxScrollDepthPct === 'number') {
      sessionUpdate.maxScrollDepthPct = payload.maxScrollDepthPct;
    }
    if (typeof payload.activeDwellMs === 'number') {
      sessionUpdate.activeDwellMs = payload.activeDwellMs;
    }

    batch.set(sessionRef, sessionUpdate, { merge: true });

    // 3. Create sessions/{sessionId}/eventBatches/{batchId}
    if (events.length > 0) {
      const batchRef = sessionRef.collection('eventBatches').doc();
      batch.set(batchRef, {
        createdAt: FieldValue.serverTimestamp(),
        eventCount: events.length,
        events,
      });

      // Aggregate video engagement in telemetry_stats/video_engagement
      let videoPlayCount = 0;
      let videoCompleteCount = 0;
      let videoWatchedSec = 0;
      let dreamsPlayCount = 0;
      let dreamsCompleteCount = 0;
      let dreamsProgress25 = 0;
      let dreamsProgress50 = 0;
      let dreamsProgress75 = 0;

      for (const ev of events) {
        if (ev.type === 'video_engagement') {
          const action = ev.payload?.action;
          const isDreams =
            String(ev.payload?.videoTitle || '').includes('Dreams') ||
            String(ev.payload?.videoId || '').includes('modal-video');
          const sec = Number(ev.payload?.totalWatchedSec || ev.payload?.currentTime || 0) || 0;

          if (action === 'start') {
            videoPlayCount++;
            if (isDreams) dreamsPlayCount++;
          }
          if (action === 'progress_25' && isDreams) dreamsProgress25++;
          if (action === 'progress_50' && isDreams) dreamsProgress50++;
          if (action === 'progress_75' && isDreams) dreamsProgress75++;
          if (action === 'complete') {
            videoCompleteCount++;
            if (isDreams) dreamsCompleteCount++;
          }
          videoWatchedSec += sec;
        }
      }

      if (videoPlayCount > 0 || videoCompleteCount > 0 || videoWatchedSec > 0 || dreamsProgress25 > 0) {
        const statsRef = adminDb.collection('telemetry_stats').doc('video_engagement');
        const statsUpdate: Record<string, unknown> = {
          totalPlays: FieldValue.increment(videoPlayCount),
          totalCompletions: FieldValue.increment(videoCompleteCount),
          totalWatchSeconds: FieldValue.increment(videoWatchedSec),
          dreamsPlays: FieldValue.increment(dreamsPlayCount),
          dreamsProgress25: FieldValue.increment(dreamsProgress25),
          dreamsProgress50: FieldValue.increment(dreamsProgress50),
          dreamsProgress75: FieldValue.increment(dreamsProgress75),
          dreamsCompletions: FieldValue.increment(dreamsCompleteCount),
          lastVideoEvent: FieldValue.serverTimestamp(),
        };
        batch.set(statsRef, statsUpdate, { merge: true });
      }
    }

    await batch.commit();

    sendResponse(res, 200, {
      success: true,
      uid,
      processed: events.length,
      adsExportEligible,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    sendResponse(res, 500, { error: 'Internal ingestion error', details: message });
  }
}

export async function handleConsentRecord(req: IngestRequest, res: IngestResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendResponse(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const rawBody = req.body as {
    uid?: string;
    consentState?: {
      ad_storage?: string;
      analytics_storage?: string;
      ad_user_data?: string;
      ad_personalization?: string;
      sale_sharing_opt_in?: boolean;
      policyVersion?: string;
    };
  } | undefined;

  const uid = rawBody?.uid?.trim();
  const consentState = rawBody?.consentState;

  if (!uid || !consentState) {
    sendResponse(res, 400, { error: 'Missing required uid or consentState' });
    return;
  }

  const clientIp = extractClientIp(req);
  const gpcDetected = req.headers['sec-gpc'] === '1';

  // Override consent if GPC is active
  const effectiveSaleSharing = Boolean(consentState.sale_sharing_opt_in && !gpcDetected);
  const effectiveUserData = effectiveSaleSharing ? (consentState.ad_user_data || 'denied') : 'denied';
  const effectivePersonalization = effectiveSaleSharing ? (consentState.ad_personalization || 'denied') : 'denied';

  const normalizedConsent = {
    ad_storage: consentState.ad_storage || 'denied',
    analytics_storage: consentState.analytics_storage || 'granted',
    ad_user_data: effectiveUserData,
    ad_personalization: effectivePersonalization,
    sale_sharing_opt_in: effectiveSaleSharing,
    policyVersion: consentState.policyVersion || '2026.10',
    gpc: gpcDetected,
  };

  issueUidCookie(res, uid);

  try {
    const userRef = adminDb.collection('users').doc(uid);
    const consentRef = userRef.collection('consents').doc();

    const writeBatch = adminDb.batch();

    writeBatch.set(consentRef, {
      consentId: consentRef.id,
      policyVersion: normalizedConsent.policyVersion,
      ipAddress: clientIp,
      gpcDetected,
      ad_storage: normalizedConsent.ad_storage,
      analytics_storage: normalizedConsent.analytics_storage,
      ad_user_data: normalizedConsent.ad_user_data,
      ad_personalization: normalizedConsent.ad_personalization,
      sale_sharing_opt_in: normalizedConsent.sale_sharing_opt_in,
      createdAt: FieldValue.serverTimestamp(),
    });

    writeBatch.set(
      userRef,
      {
        uid,
        consentState: normalizedConsent,
        adsExportEligible: effectiveSaleSharing,
        lastConsentUpdate: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await writeBatch.commit();

    sendResponse(res, 200, {
      success: true,
      consentId: consentRef.id,
      adsExportEligible: effectiveSaleSharing,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    sendResponse(res, 500, { error: 'Internal consent recording error', details: message });
  }
}

export async function handleAdminPerformanceMetrics(req: IngestRequest, res: IngestResponse): Promise<void> {
  try {
    // 1. Video engagement metrics from telemetry_stats/video_engagement
    let videoStats = {
      totalPlays: 0,
      totalCompletions: 0,
      totalWatchSeconds: 0,
      dreamsPlays: 0,
      dreamsProgress25: 0,
      dreamsProgress50: 0,
      dreamsProgress75: 0,
      dreamsCompletions: 0,
      lastVideoEvent: null as unknown,
    };

    try {
      const statsDoc = await adminDb.collection('telemetry_stats').doc('video_engagement').get();
      if (statsDoc.exists) {
        const data = statsDoc.data() || {};
        videoStats = {
          totalPlays: Number(data.totalPlays || 0),
          totalCompletions: Number(data.totalCompletions || 0),
          totalWatchSeconds: Number(data.totalWatchSeconds || 0),
          dreamsPlays: Number(data.dreamsPlays || 0),
          dreamsProgress25: Number(data.dreamsProgress25 || 0),
          dreamsProgress50: Number(data.dreamsProgress50 || 0),
          dreamsProgress75: Number(data.dreamsProgress75 || 0),
          dreamsCompletions: Number(data.dreamsCompletions || 0),
          lastVideoEvent: data.lastVideoEvent || null,
        };
      }
    } catch {
      // ignore
    }

    // 2. Query recent sessions
    let totalSessions = 0;
    let liveActiveSessions = 0;
    const now = Date.now();
    const thirtyMinAgo = now - 30 * 60 * 1000;
    let totalDwellMs = 0;
    let totalScrollPct = 0;
    let scroll100Count = 0;
    const rageClicksDetected = 0;
    const deadClicksDetected = 0;
    const formAbandonments = 0;

    const attributionCounts: Record<string, number> = {
      google_ads: 0,
      meta_ads: 0,
      tiktok_ads: 0,
      organic: 0,
      direct: 0,
      referral: 0,
    };
    const deviceBreakdown: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const browserBreakdown: Record<string, number> = { Chrome: 0, Safari: 0, Firefox: 0, Edge: 0, Other: 0 };

    try {
      const sessionsSnap = await adminDb.collection('sessions')
        .orderBy('lastSeenAt', 'desc')
        .limit(250)
        .get();

      if (sessionsSnap && !sessionsSnap.empty) {
        totalSessions = sessionsSnap.size;
        for (const doc of sessionsSnap.docs) {
          const d = doc.data();
          const lastSeen = d.lastSeenAt?.toMillis?.() || d.updatedAt?.toMillis?.() || 0;
          if (lastSeen >= thirtyMinAgo) {
            liveActiveSessions++;
          }
          const dwell = Number(d.activeDwellMs || 0);
          totalDwellMs += dwell;
          const scroll = Number(d.maxScrollDepthPct || 0);
          totalScrollPct += scroll;
          if (scroll >= 100) scroll100Count++;

          const attr = (d.attribution || {}) as Record<string, string>;
          if (attr.gclid || attr.gbraid || attr.wbraid) {
            attributionCounts.google_ads++;
          } else if (attr.fbclid) {
            attributionCounts.meta_ads++;
          } else if (attr.ttclid) {
            attributionCounts.tiktok_ads++;
          } else if (attr.utm_medium === 'organic' || (attr.referrer && !attr.referrer.includes('realunstoppable.store') && !attr.referrer.includes('localhost'))) {
            attributionCounts.referral++;
          } else if (attr.utm_source) {
            attributionCounts.organic++;
          } else {
            attributionCounts.direct++;
          }

          const env = (d.environment || {}) as Record<string, unknown>;
          const ua = String(env.userAgent || '').toLowerCase();
          const screenW = Number(env.screenWidth || 0);
          if (screenW > 0 && screenW <= 768) {
            deviceBreakdown.mobile++;
          } else if (screenW > 768 && screenW <= 1024) {
            deviceBreakdown.tablet++;
          } else if (screenW > 1024) {
            deviceBreakdown.desktop++;
          } else {
            if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
              deviceBreakdown.mobile++;
            } else {
              deviceBreakdown.desktop++;
            }
          }

          if (ua.includes('edg')) browserBreakdown['Edge']++;
          else if (ua.includes('chrome')) browserBreakdown['Chrome']++;
          else if (ua.includes('safari')) browserBreakdown['Safari']++;
          else if (ua.includes('firefox')) browserBreakdown['Firefox']++;
          else browserBreakdown['Other']++;
        }
      }
    } catch {
      // ignore
    }

    // 3. User Cohorts & Consent
    const cohorts: Record<string, number> = {
      high_intent_viewer: 0,
      cart_abandoner: 0,
      repeat_buyer: 0,
      trailer_watcher: 0,
      completed_trailer: 0,
      dreams_trailer_engaged: 0,
      rage_click_affected: 0,
      promo_seeker: 0,
    };
    let adsExportEligibleCount = 0;
    let gpcDetectedCount = 0;
    let analyticsGrantedCount = 0;
    let adUserDataGrantedCount = 0;
    let totalUsersCount = 0;

    try {
      const usersSnap = await adminDb.collection('users').limit(500).get();
      if (usersSnap && !usersSnap.empty) {
        totalUsersCount = usersSnap.size;
        for (const doc of usersSnap.docs) {
          const u = doc.data();
          if (u.adsExportEligible) adsExportEligibleCount++;
          if (u.consentState?.gpc) gpcDetectedCount++;
          if (u.consentState?.analytics_storage === 'granted') analyticsGrantedCount++;
          if (u.consentState?.ad_user_data === 'granted') adUserDataGrantedCount++;

          const segs = Array.isArray(u.computedSegments) ? u.computedSegments : [];
          for (const s of segs) {
            if (typeof cohorts[s] === 'number') {
              cohorts[s]++;
            }
          }
        }
      }
    } catch {
      // ignore
    }

    sendResponse(res, 200, {
      success: true,
      timestamp: Date.now(),
      videoEngagement: {
        ...videoStats,
        dreamsCompletionRatePct:
          videoStats.dreamsPlays > 0
            ? Math.round((videoStats.dreamsCompletions / videoStats.dreamsPlays) * 100)
            : 0,
        totalWatchMinutes: Math.round(videoStats.totalWatchSeconds / 60),
      },
      sessions: {
        total: totalSessions,
        liveActive: Math.max(liveActiveSessions, totalSessions > 0 ? 1 : 0),
        avgDwellSeconds: totalSessions > 0 ? Math.round(totalDwellMs / totalSessions / 1000) : 0,
        avgScrollDepthPct: totalSessions > 0 ? Math.round(totalScrollPct / totalSessions) : 0,
        scroll100RatePct: totalSessions > 0 ? Math.round((scroll100Count / totalSessions) * 100) : 0,
        attribution: attributionCounts,
        devices: deviceBreakdown,
        browsers: browserBreakdown,
      },
      uxFriction: {
        rageClicks: cohorts.rage_click_affected || rageClicksDetected,
        deadClicks: deadClicksDetected,
        formAbandonments: formAbandonments,
      },
      cohorts,
      compliance: {
        totalUsersCount,
        adsExportEligibleCount,
        gpcDetectedCount,
        analyticsGrantedPct: totalUsersCount > 0 ? Math.round((analyticsGrantedCount / totalUsersCount) * 100) : 100,
        adUserDataGrantedPct: totalUsersCount > 0 ? Math.round((adUserDataGrantedCount / totalUsersCount) * 100) : 0,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    sendResponse(res, 500, { error: 'Failed to aggregate admin performance metrics', details: message });
  }
}

