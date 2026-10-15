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

const LOGO_MASK_DATA = 'data:image/png;base64,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';

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

    const doDismiss = () => {
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
    };

    if (force) {
        doDismiss();
    } else {
        const elapsed = Date.now() - shownTimestamp;
        const remainingMinTime = (elapsed < MIN_DISPLAY_MS) ? (MIN_DISPLAY_MS - elapsed) : 0;
        setTimeout(doDismiss, remainingMinTime);
    }
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
