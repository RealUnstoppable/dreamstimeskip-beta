import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

export const ADSENSE_CLIENT_ID = 'ca-pub-4254213062632381';
export const DEFAULT_AD_SLOT = '9876543210';
export const DEFAULT_SLOT_ID = DEFAULT_AD_SLOT;

let adsInitialized = false;
let adObserver = null;

/**
 * Checks whether user has opted out of personalized advertising or has GPC enabled.
 */
export function isNonPersonalizedAdsRequested() {
    try {
        if (typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true) {
            return true;
        }
        if (typeof localStorage !== 'undefined') {
            if (localStorage.getItem('cookiesAccepted') === 'false') return true;
            if (localStorage.getItem('user_ad_consent') === 'false') return true;
            const ruConsentRaw = localStorage.getItem('ru_consent');
            if (ruConsentRaw) {
                const ruConsent = JSON.parse(ruConsentRaw);
                if (ruConsent && ruConsent.advertising === false) return true;
            }
        }
    } catch (_) {}
    return false;
}

/**
 * Ensures Google AdSense core script is loaded asynchronously without blocking rendering.
 */
export function ensureAdSenseScript() {
    if (typeof document === 'undefined') return;

    // Set non-personalized ads flag if user declined or has GPC
    if (isNonPersonalizedAdsRequested()) {
        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.requestNonPersonalizedAds = 1;
        } catch (_) {}
    }

    // Check if script is already present in document
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

/**
 * Removes all ad elements from the page for premium / ad-free members.
 */
export function removeAllAds() {
    if (typeof document === 'undefined') return;
    const selectors = [
        '.site-ad-section',
        '.ad-container',
        '.ad-banner-container',
        '.ad-rail-wrapper',
        '.ad-mobile-sticky'
    ];
    document.querySelectorAll(selectors.join(', ')).forEach(el => {
        try {
            el.remove();
        } catch (_) {}
    });
}

/**
 * Safely initializes a single <ins class="adsbygoogle"> unit.
 * Prevents "All ins elements in the DOM with class=adsbygoogle already have ads in them" errors.
 */
export function mountAdUnit(insElement) {
    if (!insElement || !(insElement instanceof HTMLElement)) return;

    // Check if already processed by AdSense or our orchestrator
    if (
        insElement.getAttribute('data-ad-initialized') === 'true' ||
        insElement.hasAttribute('data-adsbygoogle-status')
    ) {
        return;
    }

    // Mark as initialized before pushing
    insElement.setAttribute('data-ad-initialized', 'true');

    // Observe unfilled status for graceful collapse
    setupUnfilledObserver(insElement);

    // Push into AdSense queue
    try {
        window.adsbygoogle = window.adsbygoogle || [];
        if (isNonPersonalizedAdsRequested()) {
            window.adsbygoogle.requestNonPersonalizedAds = 1;
        }
        window.adsbygoogle.push({});
    } catch (err) {
        console.warn('AdSense notice: Safe ad push caught:', err?.message || err);
    }
}

/**
 * Monitors data-ad-status to collapse unfilled ads with zero layout shift.
 */
function setupUnfilledObserver(insElement) {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
                const status = insElement.getAttribute('data-ad-status');
                const container = insElement.closest('.ad-container') || insElement.parentElement;
                const section = insElement.closest('.site-ad-section');

                if (status === 'unfilled') {
                    if (container) {
                        container.classList.add('ad-unfilled-collapsed');
                        container.style.display = 'none';
                    }
                    if (section) {
                        section.classList.add('ad-unfilled-collapsed');
                        section.style.display = 'none';
                    }
                    observer.disconnect();
                } else if (status === 'filled') {
                    if (container) {
                        container.classList.add('ad-status-done');
                    }
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(insElement, { attributes: true, attributeFilter: ['data-ad-status'] });
}

/**
 * Setup IntersectionObserver for below-the-fold units (Active View & RPM optimization).
 */
function getOrCreateAdObserver() {
    if (typeof window === 'undefined') return null;
    if (adObserver) return adObserver;

    if ('IntersectionObserver' in window) {
        adObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const ins = target.tagName === 'INS' ? target : target.querySelector('ins.adsbygoogle');
                        if (ins) {
                            mountAdUnit(ins);
                        }
                        adObserver.unobserve(target);
                    }
                });
            },
            {
                rootMargin: '250px 0px 250px 0px',
                threshold: 0
            }
        );
    }

    return adObserver;
}

/**
 * Scans the DOM and registers uninitialized ad slots for active view loading.
 */
export function refreshAds() {
    if (typeof document === 'undefined') return;

    ensureAdSenseScript();

    const observer = getOrCreateAdObserver();
    const candidateInsElements = document.querySelectorAll('ins.adsbygoogle:not([data-ad-initialized="true"])');

    candidateInsElements.forEach((ins) => {
        // If element is already processed by AdSense directly, skip
        if (ins.hasAttribute('data-adsbygoogle-status')) {
            ins.setAttribute('data-ad-initialized', 'true');
            setupUnfilledObserver(ins);
            return;
        }

        const container = ins.closest('.ad-container') || ins;
        if (observer) {
            observer.observe(container);
        } else {
            // Fallback if IntersectionObserver is unsupported
            mountAdUnit(ins);
        }
    });
}

/**
 * Main initialization entry point. Checks user tier and wires up ads.
 */
export async function initAds() {
    if (adsInitialized) {
        refreshAds();
        return;
    }
    adsInitialized = true;

    // Check auth state for ad-free experience
    if (typeof onAuthStateChanged === 'function' && auth) {
        onAuthStateChanged(auth, async (user) => {
            let isAdFree = false;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const level = (data.membershipLevel || '').toLowerCase();
                        if (level === 'premium' || level === 'ultimate') {
                            isAdFree = true;
                        }
                    }
                } catch (err) {
                    console.error('Manager info: Error checking membership for ads:', err);
                }
            }

            if (isAdFree) {
                console.log('User has Ad-Free experience.');
                removeAllAds();
            } else {
                ensureAdSenseScript();
                refreshAds();
            }
        });
    } else {
        ensureAdSenseScript();
        refreshAds();
    }
}

// Auto-init on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initAds());
    } else {
        initAds();
    }
}
