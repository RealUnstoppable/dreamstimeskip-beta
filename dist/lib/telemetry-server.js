/**
 * Backend Telemetry & Consent Ingestion Pipeline
 * Endpoints: POST /api/v1/telemetry and POST /api/v1/consent
 */
import { adminDb, FieldValue } from './firebase-admin.js';
export function extractClientIp(req) {
    const xForwarded = req.headers['x-forwarded-for'];
    if (typeof xForwarded === 'string') {
        const firstIp = xForwarded.split(',')[0]?.trim();
        if (firstIp)
            return firstIp;
    }
    const cfIp = req.headers['cf-connecting-ip'];
    if (typeof cfIp === 'string')
        return cfIp.trim();
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string')
        return realIp.trim();
    return req.socket?.remoteAddress || 'unknown';
}
export function extractClientGeo(req) {
    const country = req.headers['cf-ipcountry'] ||
        req.headers['x-vercel-ip-country'] ||
        req.headers['x-appengine-country'] ||
        null;
    const region = req.headers['cf-region'] ||
        req.headers['x-vercel-ip-country-region'] ||
        null;
    const city = req.headers['cf-ipcity'] ||
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
export function issueUidCookie(res, uid) {
    const cookieVal = `ru_uid=${encodeURIComponent(uid)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=31536000`;
    try {
        const existing = res.getHeader('Set-Cookie');
        if (!existing) {
            res.setHeader('Set-Cookie', cookieVal);
        }
        else if (Array.isArray(existing)) {
            res.setHeader('Set-Cookie', [...existing, cookieVal]);
        }
        else {
            res.setHeader('Set-Cookie', [String(existing), cookieVal]);
        }
    }
    catch {
        // Header already sent or unsupported
    }
}
export function deriveSegments(events) {
    const segments = new Set();
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
    }
    if (hasCartOrCheckout && !hasPurchase) {
        segments.add('cart_abandoner');
    }
    return Array.from(segments);
}
function sendResponse(res, statusCode, data) {
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
export async function handleTelemetryIngest(req, res) {
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
    const payload = rawBody;
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
        const userUpdate = {
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
        const sessionUpdate = {
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
        }
        await batch.commit();
        sendResponse(res, 200, {
            success: true,
            uid,
            processed: events.length,
            adsExportEligible,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        sendResponse(res, 500, { error: 'Internal ingestion error', details: message });
    }
}
export async function handleConsentRecord(req, res) {
    if (req.method !== 'POST') {
        sendResponse(res, 405, { error: 'Method Not Allowed' });
        return;
    }
    const rawBody = req.body;
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
        writeBatch.set(userRef, {
            uid,
            consentState: normalizedConsent,
            adsExportEligible: effectiveSaleSharing,
            lastConsentUpdate: FieldValue.serverTimestamp(),
        }, { merge: true });
        await writeBatch.commit();
        sendResponse(res, 200, {
            success: true,
            consentId: consentRef.id,
            adsExportEligible: effectiveSaleSharing,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        sendResponse(res, 500, { error: 'Internal consent recording error', details: message });
    }
}
