// js/site-loader.js
/**
 * Rockstar-style Loading Screen for the Unstoppable Ecosystem
 * Features:
 * - Authentic "un" logo with touching stems
 * - Cinematic Rockstar Games-inspired badge & lighting
 * - Left-to-right sweeping light wave with glowing corona
 * - Threshold delay (only shows if page takes longer than 250ms to load)
 * - Minimum display duration to prevent jarring visual flashes
 * - Automatic dismissal when page is fully loaded or after safety timeout
 */

const LOGO_MASK_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAACICAYAAACSjLXTAAAVzklEQVR42u1dC7hWUxrudM7pRLpIdDVoNB4hlwwiZMwMj2u5l7tRiMn9GmLcjUu5jQbjFlPuxp1ckkgKk0JiyhRKiVLSufTNeme/+5njzDnZ///vf33fOu31PO9jaqqz99rrXev73u+ymohIkwwZMhSGbBIyZMiIlCFDRqQMGTIiZciQISNShgwZkTJkyIiUIUNjwH8ATom8z/woAbYAAAAASUVORK5CYII=';

const SHOW_DELAY_MS = 250;      // Only show if loading takes longer than this
const MIN_DISPLAY_MS = 600;     // Ensure smooth, complete wave cycle if shown
const MAX_SAFETY_TIMEOUT_MS = 5000; // Force dismiss if slow 3rd party scripts hang
const FADE_OUT_DURATION_MS = 450;

let loaderElement = null;
let showTimer = null;
let safetyTimer = null;
let shownTimestamp = 0;
let isLoaderVisible = false;
let isDismissed = false;

/**
 * Creates and injects the loader DOM structure
 */
function createLoaderDOM() {
    if (typeof document === 'undefined') return null;
    let existing = document.getElementById('un-site-loader');
    if (existing) return existing;

    const overlay = document.createElement('div');
    overlay.id = 'un-site-loader';
    overlay.className = 'un-site-loader-overlay hidden';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', 'Loading page');

    overlay.innerHTML = `
        <div class="un-loader-halo"></div>
        <div class="un-loader-badge">
            <div class="un-loader-logo-wrap">
                <div class="un-loader-logo-base"></div>
                <div class="un-loader-wave-mask">
                    <div class="un-loader-wave-beam"></div>
                </div>
            </div>
        </div>
        <div class="un-loader-caption">
            <span class="un-loader-caption-text">Loading</span>
            <span class="un-loader-dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
    `;

    // Ensure CSS custom property for data URI is available
    overlay.style.setProperty('--un-loader-mask', `url("${LOGO_MASK_DATA}")`);

    const container = document.body || document.documentElement;
    if (container) {
        container.appendChild(overlay);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(overlay);
        });
    }

    return overlay;
}

/**
 * Shows the site loader
 */
export function showSiteLoader(options = {}) {
    if (typeof document === 'undefined') return;
    if (isLoaderVisible) return;

    if (!loaderElement) {
        loaderElement = createLoaderDOM();
    }
    if (!loaderElement) return;

    isLoaderVisible = true;
    isDismissed = false;
    shownTimestamp = Date.now();

    loaderElement.style.display = 'flex';
    // Force reflow so the transition fires
    void loaderElement.offsetHeight;
    loaderElement.classList.remove('hidden');
    loaderElement.setAttribute('aria-hidden', 'false');

    // Safety timeout to prevent permanent blocking
    clearTimeout(safetyTimer);
    safetyTimer = setTimeout(() => {
        hideSiteLoader();
    }, options.maxTimeoutMs || MAX_SAFETY_TIMEOUT_MS);
}

/**
 * Hides the site loader with smooth fadeout
 */
export function hideSiteLoader(force = false) {
    if (typeof document === 'undefined') return;
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }
    if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = null;
    }

    if (!isLoaderVisible || isDismissed) {
        if (loaderElement) {
            loaderElement.classList.add('hidden');
            loaderElement.style.display = 'none';
        }
        return;
    }

    const elapsed = Date.now() - shownTimestamp;
    const remainingMinTime = (!force && elapsed < MIN_DISPLAY_MS) ? (MIN_DISPLAY_MS - elapsed) : 0;

    setTimeout(() => {
        isDismissed = true;
        isLoaderVisible = false;

        if (loaderElement) {
            loaderElement.classList.add('hidden');
            loaderElement.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                if (!isLoaderVisible && loaderElement) {
                    loaderElement.style.display = 'none';
                }
            }, FADE_OUT_DURATION_MS);
        }
    }, remainingMinTime);
}

/**
 * Checks if loader is currently visible
 */
export function isSiteLoaderActive() {
    return isLoaderVisible;
}

/**
 * Automatically initializes loader on page start
 */
export function initSiteLoader() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__UN_SITE_LOADER_INITIALIZED__) return;
    window.__UN_SITE_LOADER_INITIALIZED__ = true;

    // Pre-create the element early
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!loaderElement) loaderElement = createLoaderDOM();
        });
    } else {
        loaderElement = createLoaderDOM();
    }

    // If page is already loaded, do nothing
    if (document.readyState === 'complete') {
        return;
    }

    // Schedule delayed show: only show if page load takes longer than SHOW_DELAY_MS
    showTimer = setTimeout(() => {
        if (document.readyState !== 'complete') {
            showSiteLoader();
        }
    }, SHOW_DELAY_MS);

    // Dismiss when window load event fires
    const onLoadComplete = () => {
        hideSiteLoader();
        window.removeEventListener('load', onLoadComplete);
    };

    if (document.readyState === 'complete') {
        onLoadComplete();
    } else {
        window.addEventListener('load', onLoadComplete);
    }
}

// Auto-run if running in a browser environment
if (typeof window !== 'undefined') {
    window.showSiteLoader = showSiteLoader;
    window.hideSiteLoader = hideSiteLoader;
    window.isSiteLoaderActive = isSiteLoaderActive;
    initSiteLoader();
}
