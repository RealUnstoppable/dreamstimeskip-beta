/**
 * js/signup-origin-tracker.js
 * Universal Cross-Site Signup Origin Tracker for dts-hub-website Firebase.
 * Records sourceSite, landing page, referral params, and timestamps on registration.
 * Works across:
 * 1. ezmanage.realunstoppable.store
 * 2. autolux.realunstoppable.store
 * 3. realunstoppable.store (index.html, dts.html, medixly.html)
 */

import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * Automatically detects which site or sub-page the user is currently on.
 */
export function detectSignupOrigin() {
    if (typeof window === 'undefined') return { sourceSite: 'realunstoppable.store', sourceCategory: 'hub' };

    const host = (window.location.hostname || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();
    const search = new URLSearchParams(window.location.search || '');

    // 1. Check Subdomain Roots
    if (host.includes('ezmanage')) {
        return {
            sourceSite: 'ezmanage.realunstoppable.store',
            sourceCategory: 'workforce_management',
            service: 'ezManage'
        };
    }

    if (host.includes('autolux')) {
        return {
            sourceSite: 'autolux.realunstoppable.store',
            sourceCategory: 'auto_detailing',
            service: 'AutoLux'
        };
    }

    // 2. Check Specific Sub-Pages on Main Domain
    if (path.includes('medixly') || path.includes('harmonytunes')) {
        return {
            sourceSite: 'realunstoppable.store/medixly',
            sourceCategory: 'music_streaming',
            service: 'Medixly'
        };
    }

    if (path.includes('dts') || path.includes('timeskip') || search.get('source') === 'dts') {
        return {
            sourceSite: 'realunstoppable.store/dts',
            sourceCategory: 'minecraft_gaming',
            service: 'Dreams TimeSkip'
        };
    }

    if (path.includes('store') || path.includes('shop') || search.get('source') === 'store') {
        return {
            sourceSite: 'realunstoppable.store/store',
            sourceCategory: 'merchandise',
            service: 'Unstoppable Shop'
        };
    }

    // 3. Fallback to Main Hub
    return {
        sourceSite: 'realunstoppable.store',
        sourceCategory: 'hub',
        service: 'Unstoppable Hub'
    };
}

/**
 * Records or enriches user signup origin metadata in Firestore without overwriting existing data.
 * @param {object} firestore - Firestore instance
 * @param {object} user - Firebase Auth user object
 * @param {object} extraMeta - Additional metadata (e.g. utm tags)
 */
export async function recordSignupOrigin(firestore, user, extraMeta = {}) {
    if (!firestore || !user || !user.uid) return null;

    const origin = detectSignupOrigin();
    const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;

    const signupMetadata = {
        sourceSite: origin.sourceSite,
        sourceCategory: origin.sourceCategory,
        sourceService: origin.service,
        signupUrl: typeof window !== 'undefined' ? window.location.href : '',
        signupPath: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
        utmSource: search ? (search.get('utm_source') || search.get('source') || null) : null,
        utmMedium: search ? search.get('utm_medium') : null,
        utmCampaign: search ? search.get('utm_campaign') : null,
        recordedAt: serverTimestamp(),
        ...extraMeta
    };

    try {
        const userRef = doc(firestore, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            const data = snap.data();
            // Preserve original sourceSite if already recorded
            if (!data.sourceSite) {
                await setDoc(userRef, { signupOrigin: signupMetadata, sourceSite: origin.sourceSite }, { merge: true });
            }
        } else {
            await setDoc(userRef, { signupOrigin: signupMetadata, sourceSite: origin.sourceSite }, { merge: true });
        }
        return signupMetadata;
    } catch (err) {
        console.warn('Manager info: Failed to record signup origin:', err.message || err);
        return signupMetadata;
    }
}

if (typeof window !== 'undefined') {
    window.detectSignupOrigin = detectSignupOrigin;
    window.recordSignupOrigin = recordSignupOrigin;
}
