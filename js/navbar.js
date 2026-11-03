import { auth, db } from './auth.js?v=1784516229';
import { escapeHTML, getCachedUserProfile } from './utils.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { subscribeToNotifications, markAsRead } from './notifications-service.js?v=1784516229';
import './sitewide-player.js?v=20260924';
import './ads.js';
import './chatbot.js?v=20260925';
import { initCookieConsent } from './cookie-consent.js';
import { openUserMailboxModal } from './mailbox.js';

let notificationUnsubscribe = null;

export const getReadNotificationIds = () => {
    try {
        return new Set(JSON.parse(localStorage.getItem('read_notification_ids') || '[]'));
    } catch (_) {
        return new Set();
    }
};

export const markNotificationAsReadLocally = (id) => {
    if (!id) return;
    try {
        const set = getReadNotificationIds();
        set.add(id);
        localStorage.setItem('read_notification_ids', JSON.stringify(Array.from(set)));
    } catch (_) {}
};

// Preloaded / fallback notifications shown when none from Firebase
const PRELOADED_NOTIFICATIONS = [
    {
        id: 'pre-1',
        title: '🎶 Check out Medixly',
        message: 'Stream your favourite hits on Medixly now.',
        link: 'medixly.html',
        isRead: false,
        preloaded: true
    },
    {
        id: 'pre-2',
        title: '🌌 Dreams TimeSkip — New Update',
        message: 'Explore the latest features in Dreams TimeSkip.',
        link: 'dts.html',
        isRead: false,
        preloaded: true
    },
    {
        id: 'pre-3',
        title: '👟 Unstoppable — New Drops',
        message: 'Fresh styles just landed in the Unstoppable Collection.',
        link: 'unstoppable.html',
        isRead: false,
        preloaded: true
    }
];



// Bell SVG icon (YouTube-style)
const BELL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/></svg>`;

export function loadNavbar() {
    const currentPath = typeof window !== 'undefined' ? (window.location.pathname || '').toLowerCase() : '';
    const cleanPath = currentPath.split('?')[0].split('#')[0];
    const isMedixlyPage = typeof window !== 'undefined' && cleanPath.includes('medixly');
    
    // STRICT check: ONLY visible on dts.html (or clean /dts route)
    // Strictly hides this link on index.html, medixly.html, autolux, and all other pages
    const isDtsPage = typeof window !== 'undefined' && (
        cleanPath.endsWith('/dts.html') ||
        cleanPath.endsWith('/dts') ||
        cleanPath === 'dts.html' ||
        cleanPath === '/dts.html' ||
        cleanPath === '/dts' ||
        (document.body && document.body.classList.contains('page-dts'))
    ) && !cleanPath.includes('new-dts') && !cleanPath.includes('first-look') && !cleanPath.includes('index') && !cleanPath.includes('medixly');

    if (isMedixlyPage) {
        const medixlyHeaderHTML = `
        <nav class="navbar medixly-desktop-navbar">
            <!-- Left side: Medixly logo BY un + Expandable Ecosystem Arrow -->
            <div class="medixly-nav-left">
                <a href="https://realunstoppable.store/medixly.html" id="navbar-logo-link" class="medixly-brand-lockup" aria-label="Medixly BY un">
                    <img src="/images/medixly-logo.png" alt="Medixly" style="height: 81px; margin-top: 2px;" id="medixly-navbar-logo">
                    <div class="medixly-brand-text">
                        <span class="medixly-brand-title">Medixly</span>
                        <span class="medixly-brand-subtitle">BY un</span>
                    </div>
                </a>
                <button type="button" id="medixly-ecosystem-toggle" class="medixly-ecosystem-arrow-btn" aria-label="Toggle Ecosystem Navigation" aria-expanded="false" title="Explore Unstoppable Ecosystem">
                    <span class="ecosystem-arrow-icon">&gt;</span>
                </button>
            </div>

            <!-- Right side: Upgrade, Notifications, Settings, Sign In -->
            <div class="medixly-nav-right">
                <!-- Upgrade Button ($0.99 Today) -->
                <a href="https://realunstoppable.store/medixly-pricing.html" id="nav-upgrade-btn" data-id="nav-memberships-btn" class="medixly-header-btn medixly-upgrade-btn" title="Upgrade ($0.99 Today)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>Upgrade ($0.99 Today)</span>
                </a>

                <!-- Notifications -->
                <div class="notification-wrapper" id="notification-wrapper">
                    <button class="notification-bell-btn desktop-only" id="notification-bell-btn" aria-label="Notifications" title="Notifications">
                        ${BELL_SVG}
                        <span class="notification-badge" style="display:none;" id="notification-badge">0</span>
                    </button>
                    <button class="notification-mobile-btn mobile-only" id="notification-mobile-btn">
                        <span>Notifications</span>
                        <span class="notification-badge mobile-badge" style="display:none;" id="notification-mobile-badge">0</span>
                    </button>
                    <div class="notification-dropdown" id="notification-dropdown">
                        <div class="notification-dropdown-header">
                            <span>Notifications</span>
                            <button class="notif-mark-all-read" id="notif-mark-all-read">Mark all as read</button>
                        </div>
                        <div class="notification-list" id="notification-list"></div>
                        <div class="notification-dropdown-footer" style="padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; background: rgba(0,0,0,0.25);">
                            <button type="button" class="open-mailbox-btn" style="width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                                📬 Open Mailbox
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Settings Button -->
                <button type="button" id="header-settings-btn" class="medixly-header-btn medixly-settings-btn" aria-label="Settings" title="Settings & Sound Profile">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Settings</span>
                </button>

                <!-- Sign In Button -->
                <a href="sign in beta.html" id="auth-link" class="medixly-header-btn medixly-auth-btn" title="Sign In">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span id="auth-link-text">Sign In</span>
                </a>
            </div>
        </nav>
        <!-- Collapsible Ecosystem Drawer (Underneath Primary Header) -->
        <div id="medixly-ecosystem-drawer" class="medixly-ecosystem-drawer" aria-hidden="true">
            <div class="medixly-ecosystem-track">
                <a href="https://realunstoppable.store/index.html" class="medixly-eco-link"><span>Home</span></a>
                <a href="https://realunstoppable.store/unstoppable.html" class="medixly-eco-link"><span>Unstoppable</span></a>
                <a href="https://realunstoppable.store/dts.html" class="medixly-eco-link"><span>Dreams TimeSkip</span></a>
                <a href="https://realunstoppable.store/store.html" class="medixly-eco-link"><span>Shop</span></a>
                <a href="https://realunstoppable.store/cart.html" class="medixly-eco-link"><span>Cart</span></a>
                <a href="https://realunstoppable.store/blog.html" class="medixly-eco-link"><span>Blog</span></a>
                <a href="https://autolux.realunstoppable.store/" class="medixly-eco-link" target="_blank" rel="noopener"><span>Autolux</span></a>
            </div>
        </div>`;

        const header = document.querySelector('.main-header');
        if (header) {
            header.innerHTML = medixlyHeaderHTML;
            attachNavEvents();
            attachNotificationEvents();
            updateAuthLink();
            initSettingsModal();
            initMedixlyEcosystemDrawer();
        }
        initCookieConsent();
        return;
    }

    const logoContent = `<span class="un-letters">un</span><span class="un-250">250</span>`;

    const dtsStoreNavItem = isDtsPage ? `
            <li class="nav-dts-store-item">
                <a href="#store" id="nav-dts-store-btn" class="nav-dts-store-btn" aria-label="Dreams TimeSkip Store">
                    <span class="mc-nav-store-icon">🛒</span>
                    <span class="mc-nav-store-text">STORE</span>
                </a>
            </li>` : '';

    const dtsHeaderStoreBtn = isDtsPage ? `
        <div class="nav-header-actions" style="display: flex; align-items: center; gap: 10px;">
            <a href="#store" id="nav-dts-store-header-btn" class="nav-dts-store-btn dts-store-header-btn" aria-label="Dreams TimeSkip Store">
                <span class="mc-nav-store-icon">🛒</span>
                <span class="mc-nav-store-text">STORE</span>
            </a>
            <button class="hamburger" title="Open menu" aria-label="Open menu">
                <span class="bar"></span><span class="bar"></span><span class="bar"></span>
                <span class="hamburger-badge" style="display:none;" id="hamburger-badge">0</span>
            </button>
        </div>` : `
        <button class="hamburger" title="Open menu" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            <span class="hamburger-badge" style="display:none;" id="hamburger-badge">0</span>
        </button>`;

    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" id="navbar-logo-link" class="nav-logo un-text-logo" style="display: flex; align-items: center;">
            ${logoContent}
        </a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dts.html">Dreams TimeSkip</a></li>
            <li><a href="medixly.html">Medixly</a></li>
            <li><a href="store.html">Shop</a></li>
            <li>
                <a href="cart.html" id="nav-cart-btn" class="nav-cart-btn" aria-label="Shopping Cart" title="View Cart">
                    <span class="nav-cart-icon" style="font-size: 1.15rem; line-height: 1;">🛒</span>
                    <span id="nav-cart-badge" class="nav-cart-badge" style="display:none;">0</span>
                </a>
            </li>
            ${dtsStoreNavItem}
            <li><a href="blog.html">Blog</a></li>
            <li><a href="https://autolux.realunstoppable.store">Autolux</a></li>
            <li class="nav-notification-item">
                <div class="notification-wrapper" id="notification-wrapper">
                    <!-- Desktop bell button -->
                    <button class="notification-bell-btn desktop-only" id="notification-bell-btn" aria-label="Notifications" title="Notifications">
                        ${BELL_SVG}
                        <span class="notification-badge" style="display:none;" id="notification-badge">0</span>
                    </button>
                    <!-- Mobile text button -->
                    <button class="notification-mobile-btn mobile-only" id="notification-mobile-btn">
                        <span>Notifications</span>
                        <span class="notification-badge mobile-badge" style="display:none;" id="notification-mobile-badge">0</span>
                    </button>
                    <div class="notification-dropdown" id="notification-dropdown">
                        <div class="notification-dropdown-header">
                            <span>Notifications</span>
                            <button class="notif-mark-all-read" id="notif-mark-all-read">Mark all as read</button>
                        </div>
                        <div class="notification-list" id="notification-list"></div>
                        <div class="notification-dropdown-footer" style="padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; background: rgba(0,0,0,0.25);">
                            <button type="button" class="open-mailbox-btn" style="width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                                📬 Open Mailbox
                            </button>
                        </div>
                    </div>
                </div>
            </li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        ${dtsHeaderStoreBtn}
    </nav>`;

    const header = document.querySelector('.main-header');
    if (header) {
        header.innerHTML = headerHTML;
        attachNavEvents();
        attachNotificationEvents();
        updateAuthLink();
        initNavbarCart();
    }
    initCookieConsent();
}

export function loadUdsNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo un-text-logo">
            <span class="un-letters">un</span><span class="un-250">250</span>
        </a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dts.html">Dreams TimeSkip</a></li>
            <li><a href="medixly.html">Medixly</a></li>
            <li><a href="store.html">Shop</a></li>
            <li>
                <a href="cart.html" id="uds-nav-cart-btn" class="nav-cart-btn" aria-label="Shopping Cart" title="View Cart">
                    <span class="nav-cart-icon" style="font-size: 1.15rem; line-height: 1;">🛒</span>
                    <span id="uds-nav-cart-badge" class="nav-cart-badge" style="display:none;">0</span>
                </a>
            </li>
            <li class="nav-dropdown-wrapper">
                <a href="#" style="cursor: default;">Autolux ▾</a>
                <div class="nav-dropdown">
                    <a href="https://autolux.realunstoppable.store">Overview</a>
                    <a href="detailing.html">Services</a>
                </div>
            </li>
            <li class="nav-notification-item">
                <div class="notification-wrapper" id="notification-wrapper">
                    <!-- Desktop bell button -->
                    <button class="notification-bell-btn desktop-only" id="notification-bell-btn" aria-label="Notifications" title="Notifications">
                        ${BELL_SVG}
                        <span class="notification-badge" style="display:none;" id="notification-badge">0</span>
                    </button>
                    <!-- Mobile text button -->
                    <button class="notification-mobile-btn mobile-only" id="notification-mobile-btn">
                        <span>Notifications</span>
                        <span class="notification-badge mobile-badge" style="display:none;" id="notification-mobile-badge">0</span>
                    </button>
                    <div class="notification-dropdown" id="notification-dropdown">
                        <div class="notification-dropdown-header">
                            <span>Notifications</span>
                            <button class="notif-mark-all-read" id="notif-mark-all-read">Mark all as read</button>
                        </div>
                        <div class="notification-list" id="notification-list"></div>
                        <div class="notification-dropdown-footer" style="padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; background: rgba(0,0,0,0.25);">
                            <button type="button" class="open-mailbox-btn" style="width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                                📬 Open Mailbox
                            </button>
                        </div>
                    </div>
                </div>
            </li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        <button class="hamburger" title="Open menu" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            <span class="hamburger-badge" style="display:none;" id="hamburger-badge">0</span>
        </button>
    </nav>`;

    const header = document.querySelector('.main-header');
    if (header) {
        header.innerHTML = headerHTML;
        attachNavEvents();
        attachNotificationEvents();
        updateAuthLink();
        initNavbarCart();
    }
    initCookieConsent();
}

export function updateNavbarCartBadge(count) {
    const badges = [
        document.getElementById('nav-cart-badge'),
        document.getElementById('uds-nav-cart-badge')
    ];
    badges.forEach(badge => {
        if (badge) {
            const validCount = Math.max(0, parseInt(count, 10) || 0);
            if (validCount > 0) {
                badge.style.display = 'inline-flex';
                badge.textContent = validCount;
            } else {
                badge.style.display = 'none';
            }
        }
    });
}

function initNavbarCart() {
    let count = 0;
    try {
        const stored = localStorage.getItem('cartItemCount');
        if (stored !== null && stored !== '') {
            count = parseInt(stored, 10) || 0;
        } else {
            const raw = localStorage.getItem('localCart');
            if (raw) {
                const parsed = JSON.parse(raw);
                count = Object.values(parsed).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);
            }
        }
    } catch (_) {}
    updateNavbarCartBadge(count);

    if (typeof window !== 'undefined' && !window._navbarCartListenerAttached) {
        window._navbarCartListenerAttached = true;
        window.addEventListener('cartUpdated', (e) => {
            let c = 0;
            if (e.detail && typeof e.detail.itemCount === 'number') {
                c = e.detail.itemCount;
            } else {
                try {
                    c = parseInt(localStorage.getItem('cartItemCount') || '0', 10) || 0;
                } catch (_) {}
            }
            updateNavbarCartBadge(c);
        });
        window.addEventListener('storage', (e) => {
            if (e.key === 'localCart' || e.key === 'cartItemCount') {
                let c = 0;
                try {
                    c = parseInt(localStorage.getItem('cartItemCount') || '0', 10) || 0;
                } catch (_) {}
                updateNavbarCartBadge(c);
            }
        });
    }
}

export function isDesktopAppEnvironment() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.medixlyDesktop) ||
           Boolean(window.medixlyDesktopBridge?.isDesktop) ||
           Boolean(window.__FORCE_DESKTOP_ENV__) ||
           (document.body && document.body.classList.contains('is-desktop-mac'));
}

export function showDesktopUnavailableToast(title = 'This section') {
    if (typeof document === 'undefined') return;
    let toast = document.getElementById('desktop-unavailable-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'desktop-unavailable-toast';
        toast.className = 'desktop-unavailable-toast';
        document.body.appendChild(toast);
    }
    const cleanTitle = (title || 'This section').replace(/\s+/g, ' ').trim();
    toast.innerHTML = `
        <div class="desktop-toast-content">
            <svg class="desktop-toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div class="desktop-toast-text">
                <div class="desktop-toast-title">Section Unavailable</div>
                <div class="desktop-toast-desc">${escapeHTML(cleanTitle)} is currently available on the web (realunstoppable.store). Routed back to Medixly.</div>
            </div>
        </div>
    `;
    toast.classList.remove('fade-out');
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.classList.remove('show', 'fade-out');
        }, 300);
    }, 3600);
}

export function routeSafelyToMedixlyApp() {
    if (typeof document === 'undefined') return;
    const viewHome = document.getElementById('view-home');
    const viewPlaylist = document.getElementById('view-playlist');
    const viewPlaylists = document.getElementById('view-playlists');
    const viewLyrics = document.getElementById('view-lyrics');
    const fullscreenPlayer = document.getElementById('fullscreen-player');

    if (viewHome) viewHome.style.display = 'block';
    if (viewPlaylist) viewPlaylist.style.display = 'none';
    if (viewPlaylists) viewPlaylists.style.display = 'none';
    if (viewLyrics) viewLyrics.style.display = 'none';
    if (fullscreenPlayer) fullscreenPlayer.style.display = 'none';

    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.history && window.history.replaceState) {
            try {
                window.history.replaceState({}, document.title, 'medixly.html');
            } catch (_) {}
        }
    }
}

if (typeof window !== 'undefined') {
    window.isDesktopAppEnvironment = isDesktopAppEnvironment;
    window.showDesktopUnavailableToast = showDesktopUnavailableToast;
    window.routeSafelyToMedixlyApp = routeSafelyToMedixlyApp;
}

function attachNavEvents() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Smooth scroll for in-page Store navigation links
        document.querySelectorAll('a[href="#store"]').forEach(storeLink => {
            storeLink.addEventListener('click', (e) => {
                const target = document.getElementById('store');
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, '', '#store');
                    }
                }
            });
        });
    }

    // Header Navigation Guard for macOS Desktop App
    // Intercepts navigation to external website sections and routes safely back to Medixly
    const isDesktop = isDesktopAppEnvironment();
    const isMedixlyPage = typeof window !== 'undefined' && window.location.pathname.includes('medixly');

    if (isDesktop || isMedixlyPage) {
        const logoLink = document.getElementById('navbar-logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                if (isDesktopAppEnvironment()) {
                    e.preventDefault();
                    e.stopPropagation();
                    routeSafelyToMedixlyApp();
                }
            });
        }

        const allNavLinks = document.querySelectorAll('.nav-links a, .nav-logo, .medixly-header-btn, .medixly-eco-link');
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!isDesktopAppEnvironment()) return;

                const href = (link.getAttribute('href') || '').trim();
                const isMedixlyTarget = href === 'medixly.html' || href === '/medixly.html' || href === '/medixly' || href.startsWith('medixly');
                const isAuthTarget = link.id === 'auth-link' || href.includes('sign in beta') || href.includes('account.html') || href.includes('admin.html');
                const isMembershipsTarget = link.id === 'nav-memberships-btn' || link.id === 'nav-upgrade-btn' || href.includes('memberships') || href.includes('medixly-pricing');

                if (isMedixlyTarget) {
                    e.preventDefault();
                    e.stopPropagation();
                    routeSafelyToMedixlyApp();
                    return;
                }

                if (isAuthTarget) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window.openMedixlyAuthModal === 'function') {
                        window.openMedixlyAuthModal();
                    } else {
                        showDesktopUnavailableToast('Account Settings');
                        routeSafelyToMedixlyApp();
                    }
                    return;
                }

                if (isMembershipsTarget) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window.openMedixlyAuthModal === 'function') {
                        window.openMedixlyAuthModal();
                    } else {
                        showDesktopUnavailableToast('Memberships');
                        routeSafelyToMedixlyApp();
                    }
                    return;
                }

                // Any other header section (Unstoppable, DTS, Shop, Cart, Memberships, Blog, Autolux)
                e.preventDefault();
                e.stopPropagation();
                const linkTitle = link.querySelector('span')?.textContent || link.textContent || 'This Section';
                showDesktopUnavailableToast(linkTitle.trim());
                routeSafelyToMedixlyApp();
            });
        });
    }
}

export function initMedixlyEcosystemDrawer() {
    const toggleBtn = document.getElementById('medixly-ecosystem-toggle');
    const drawer = document.getElementById('medixly-ecosystem-drawer');
    if (!toggleBtn || !drawer) return;

    function toggleDrawer(forceState) {
        const isOpen = typeof forceState === 'boolean' ? forceState : !drawer.classList.contains('is-open');
        drawer.classList.toggle('is-open', isOpen);
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
    });

    document.addEventListener('click', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleDrawer(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            toggleDrawer(false);
            toggleBtn.focus();
        }
    });
}

function attachNotificationEvents() {
    const bellBtn = document.getElementById('notification-bell-btn');
    const mobileBtn = document.getElementById('notification-mobile-btn');
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;

    const toggleDropdown = (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('notif-open');
        dropdown.classList.toggle('notif-open', !isOpen);
        if (!isOpen && bellBtn) {
            // Animate bell
            bellBtn.classList.add('bell-ring');
            setTimeout(() => bellBtn.classList.remove('bell-ring'), 600);
        }
    };

    if (bellBtn) bellBtn.addEventListener('click', toggleDropdown);
    if (mobileBtn) mobileBtn.addEventListener('click', toggleDropdown);

    // Close on outside click
    document.addEventListener('click', (e) => {
        const clickedInsideDropdown = dropdown.contains(e.target);
        const clickedBell = bellBtn && bellBtn.contains(e.target);
        const clickedMobile = mobileBtn && mobileBtn.contains(e.target);
        
        if (!clickedInsideDropdown && !clickedBell && !clickedMobile) {
            dropdown.classList.remove('notif-open');
        }
    });

    // Mark all as read
    const markAllBtn = document.getElementById('notif-mark-all-read');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const list = document.getElementById('notification-list');
            if (!list) return;
            const items = list.querySelectorAll('.notification-item:not(.empty-notifs)');
            items.forEach(item => {
                const id = item.getAttribute('data-id');
                if (id) {
                    markNotificationAsReadLocally(id);
                    if (!id.startsWith('pre-')) {
                        try { markAsRead(id); } catch (_) { /* ignore read error */ }
                    }
                }
            });
            list.innerHTML = `
                <div class="notification-item empty-notifs" style="text-align: center; padding: 24px 16px; color: var(--text-secondary); cursor: default;">
                    <div style="font-size: 1.5rem; margin-bottom: 6px;">✨</div>
                    <div style="font-weight: 600; color: #fff; margin-bottom: 2px;">No new notifications</div>
                    <small>You're all caught up!</small>
                </div>
            `;
            updateNotificationBadge(0);
        });
    }

    // Open Mailbox button listener
    document.querySelectorAll('.open-mailbox-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.remove('notif-open');
            const cleanPath = (typeof window !== 'undefined' ? (window.location.pathname || '') : '').toLowerCase();
            if (cleanPath.includes('account')) {
                const mailboxNav = document.querySelector('a[href="#mailbox"]');
                if (mailboxNav) {
                    mailboxNav.click();
                    return;
                }
            }
            if (typeof openUserMailboxModal === 'function') {
                openUserMailboxModal();
            }
        });
    });

    // Load preloaded notifications immediately
    renderNotifications(PRELOADED_NOTIFICATIONS);
    const initialUnread = (PRELOADED_NOTIFICATIONS || []).filter(n => !getReadNotificationIds().has(n.id)).length;
    updateNotificationBadge(initialUnread);
}

function updateNotificationBadge(unreadCount) {
    const badges = [
        document.getElementById('notification-badge'),
        document.getElementById('notification-mobile-badge'),
        document.getElementById('hamburger-badge')
    ];
    badges.forEach(badge => {
        if (badge) {
            if (unreadCount > 0) {
                badge.style.display = 'flex';
                badge.textContent = unreadCount;
            } else {
                badge.style.display = 'none';
            }
        }
    });
}

export function renderNotifications(notifications) {
    const list = document.getElementById('notification-list');
    if (!list) return;

    const readIds = getReadNotificationIds();
    const activeNotifications = (notifications || []).filter(n => !n.isRead && !readIds.has(n.id));

    if (activeNotifications.length === 0) {
        list.innerHTML = `
            <div class="notification-item empty-notifs" style="text-align: center; padding: 24px 16px; color: var(--text-secondary); cursor: default;">
                <div style="font-size: 1.5rem; margin-bottom: 6px;">✨</div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 2px;">No new notifications</div>
                <small>You're all caught up!</small>
            </div>
        `;
        updateNotificationBadge(0);
        return;
    }

    list.innerHTML = activeNotifications.map(n => {
        let icon = BELL_SVG;
        if (n.type === 'reward') icon = '🎁';
        if (n.type === 'ticket_reply') icon = '💬';

        return `
        <div class="notification-item unread" data-id="${escapeHTML(n.id)}" data-link="${escapeHTML(n.link || '')}">
            <div class="notif-icon" style="font-size: 1.2rem; margin-right: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${icon}</div>
            <div class="notif-content">
                <p class="notif-title">${escapeHTML(n.title)}</p>
                <small class="notif-msg">${escapeHTML(n.message)}</small>
            </div>
            <span class="notif-dot"></span>
        </div>
        `;
    }).join('');

    list.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            const currentItem = e.currentTarget;
            const id = currentItem.getAttribute('data-id');
            const link = currentItem.getAttribute('data-link');
            
            markNotificationAsReadLocally(id);
            if (id && !id.startsWith('pre-') && !currentItem.classList.contains('read-processed')) {
                currentItem.classList.add('read-processed');
                try { await markAsRead(id); } catch (_) { /* ignore read error */ }
            }

            // Immediately animate & remove from active dropdown
            currentItem.style.transition = 'all 0.2s ease';
            currentItem.style.opacity = '0';
            currentItem.style.transform = 'translateX(20px)';
            setTimeout(() => {
                currentItem.remove();
                const remaining = list.querySelectorAll('.notification-item:not(.empty-notifs)').length;
                updateNotificationBadge(remaining);
                if (remaining === 0) {
                    list.innerHTML = `
                        <div class="notification-item empty-notifs" style="text-align: center; padding: 24px 16px; color: var(--text-secondary); cursor: default;">
                            <div style="font-size: 1.5rem; margin-bottom: 6px;">✨</div>
                            <div style="font-weight: 600; color: #fff; margin-bottom: 2px;">No new notifications</div>
                            <small>You're all caught up!</small>
                        </div>
                    `;
                }
            }, 200);

            if (link && link !== 'undefined' && link !== 'null' && link !== '') {
                setTimeout(() => {
                    window.location.href = link;
                }, 250);
            }
        });
    });

    updateNotificationBadge(activeNotifications.length);
}

function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                let userData = await getCachedUserProfile({uid: user.uid});

                // Fetch real-time notifications and merge with preloaded
                try {
                    if (notificationUnsubscribe) notificationUnsubscribe();
                    notificationUnsubscribe = subscribeToNotifications(user.uid, (notifications) => {
                        // Merge Firebase notifications on top of preloaded (avoid dupes)
                        const merged = [...notifications];
                        // ⚡ Bolt: O(1) Set lookup replaces O(N) merged.find()
                        const mergedIds = new Set(merged.map(n => n.id));
                        PRELOADED_NOTIFICATIONS.forEach(pre => {
                            if (!mergedIds.has(pre.id)) merged.push(pre);
                        });
                        renderNotifications(merged);
                        const unreadCount = merged.filter(n => !n.isRead).length;
                        updateNotificationBadge(unreadCount);
                    });
                } catch(err) { console.error('Manager info: Notification error ', err); }

                const destination = userData && userData.isAdmin ? 'admin.html' : 'account.html';
                authLink.href = destination;

                // If user has a profile photo, replace the "My Account" text with a circle avatar
                const photoURL = userData && userData.photoURL ? userData.photoURL : (user.photoURL || null);
                if (photoURL) {
                    authLink.innerHTML = `<img src="${escapeHTML(photoURL)}" alt="My Account" class="nav-pfp-avatar" title="My Account">`;
                    authLink.classList.add('nav-pfp-link');
                } else {
                    authLink.textContent = "My Account";
                    authLink.classList.remove('nav-pfp-link');
                }
            } catch (e) {
                console.error("Manager info: Nav Error: [" + e.message + "]", e);
            }
        } else {
            authLink.href = 'sign in beta.html';
            authLink.innerHTML = 'Sign In / Sign Up';
            authLink.classList.remove('nav-pfp-link');

            if (notificationUnsubscribe) {
                notificationUnsubscribe();
                notificationUnsubscribe = null;
            }
            updateNotificationBadge(0);
            // Show preloaded for non-logged-in users too
            renderNotifications(PRELOADED_NOTIFICATIONS);
            updateNotificationBadge(PRELOADED_NOTIFICATIONS.length);
        }
    });
}

/**
 * Open Medixly Desktop Settings & Sound Profile Modal
 */
export function openMedixlySettingsModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('medixly-settings-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    syncSettingsModalWithEngine();

    // Trigger EQ graph resize & render when modal is displayed
    if (typeof window !== 'undefined' && window.MedixlyEQGraph) {
        try {
            const inst = window.MedixlyEQGraph.getInstance('medixly-eq-canvas');
            if (inst) {
                inst.resizeCanvas();
                const b = parseFloat(document.getElementById('eq-slider-bass')?.value || 0);
                const m = parseFloat(document.getElementById('eq-slider-mid')?.value || 0);
                const t = parseFloat(document.getElementById('eq-slider-treble')?.value || 0);
                inst.setValues(b, m, t);
            }
        } catch (_) {}
    }

    // Refresh history list in modal
    if (typeof window.renderSettingsHistory === 'function') {
        window.renderSettingsHistory();
    }
}

/**
 * Close Medixly Desktop Settings & Sound Profile Modal
 */
export function closeMedixlySettingsModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('medixly-settings-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

/**
 * Sync UI sliders and preset buttons with current active audio mix engine state
 */
export function syncSettingsModalWithEngine() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const mixEngine = typeof window.__getMixEngine === 'function' ? window.__getMixEngine() : null;
    let b = 0, m = 0, t = 0;
    if (mixEngine) {
        const profile = typeof mixEngine.getSoundProfile === 'function' ? mixEngine.getSoundProfile() : null;
        if (profile) {
            const activeKey = profile.activeProfile || 'flat';
            document.querySelectorAll('#medixly-eq-presets .medixly-preset-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.preset === activeKey);
            });
            const eq = profile.preset || {};
            b = typeof eq.bass === 'number' ? eq.bass : 0;
            m = typeof eq.mid === 'number' ? eq.mid : 0;
            t = typeof eq.treble === 'number' ? eq.treble : 0;
            const bassInput = document.getElementById('eq-slider-bass');
            const midInput = document.getElementById('eq-slider-mid');
            const trebleInput = document.getElementById('eq-slider-treble');
            if (bassInput) bassInput.value = b;
            if (midInput) midInput.value = m;
            if (trebleInput) trebleInput.value = t;
            const bassVal = document.getElementById('eq-val-bass');
            const midVal = document.getElementById('eq-val-mid');
            const trebleVal = document.getElementById('eq-val-treble');
            if (bassVal) bassVal.textContent = (b > 0 ? '+' : '') + b + ' dB';
            if (midVal) midVal.textContent = (m > 0 ? '+' : '') + m + ' dB';
            if (trebleVal) trebleVal.textContent = (t > 0 ? '+' : '') + t + ' dB';
        }

        const currentCrossfade = mixEngine.defaultCrossfadeDuration || 5;
        document.querySelectorAll('#medixly-crossfade-selector .crossfade-pill').forEach(pill => {
            const dur = parseFloat(pill.dataset.duration);
            pill.classList.toggle('active', dur === currentCrossfade);
        });
    }

    if (typeof window !== 'undefined' && window.MedixlyEQGraph) {
        try {
            const inst = window.MedixlyEQGraph.getInstance('medixly-eq-canvas');
            if (inst) inst.setValues(b, m, t);
        } catch (_) {}
    }
}

/**
 * Check if the active user holds a Premium / Ultra subscription
 */
function isUserPremiumSubscribed() {
    if (typeof window === 'undefined') return false;
    if (window.audioAdManager && typeof window.audioAdManager.isUserPremium === 'function') {
        if (window.audioAdManager.isUserPremium()) return true;
    }
    if (window.__isUserPremium === true) return true;
    if (window.currentUserDocData) {
        const tier = (window.currentUserDocData.membershipTier || '').toLowerCase();
        if (tier === 'premium' || tier === 'ultra' || window.currentUserDocData.isPremium) return true;
    }
    try {
        const cached = localStorage.getItem('medixly_is_premium');
        if (cached === 'true') return true;
    } catch (_) {}
    return false;
}

/**
 * Show a sleek modal / toast informing free users that Accent Theme Colors require Premium
 */
function promptPremiumUpgrade(featureName = 'Accent Theme Colors') {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('medixly-upgrade-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'medixly-upgrade-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(18, 18, 24, 0.96);
        border: 1px solid rgba(245, 158, 11, 0.4);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
        border-radius: 12px;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10000;
        animation: toastFadeIn 0.25s ease-out;
        color: #fff;
        max-width: 90vw;
    `;

    toast.innerHTML = `
        <span style="font-size: 1.4rem;">🔒</span>
        <div style="display: flex; flex-direction: column; gap: 2px;">
            <strong style="font-size: 0.88rem; color: #fbbf24;">Medixly Premium Exclusive</strong>
            <span style="font-size: 0.8rem; color: #cbd5e1;">${featureName} are reserved for Premium subscribers.</span>
        </div>
        <a href="medixly-pricing.html" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; font-size: 0.82rem; padding: 6px 14px; border-radius: 999px; text-decoration: none; white-space: nowrap;">Upgrade ($0.99)</a>
        <button type="button" style="background: transparent; border: none; color: #9ca3af; font-size: 1.2rem; cursor: pointer; padding: 0 4px;" aria-label="Dismiss">&times;</button>
    `;

    toast.querySelector('button')?.addEventListener('click', () => toast.remove());
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 6000);
}

/**
 * Initializes listeners for Settings modal, EQ presets, sliders, crossfade pills, and update trigger
 */
export function initSettingsModal() {
    if (typeof document === 'undefined') return;

    // Header settings button
    const settingsBtn = document.getElementById('header-settings-btn');
    if (settingsBtn && !settingsBtn.dataset.bound) {
        settingsBtn.dataset.bound = 'true';
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMedixlySettingsModal();
        });
    }

    // Jump Back In "History" see-all link on main page
    const homeHistBtn = document.getElementById('home-history-btn');
    if (homeHistBtn && !homeHistBtn.dataset.bound) {
        homeHistBtn.dataset.bound = 'true';
        homeHistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openMedixlySettingsModal();
            setTimeout(() => {
                const histSec = document.getElementById('medixly-history-section');
                if (histSec) histSec.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    }

    // Close button & backdrop
    const closeBtn = document.getElementById('medixly-settings-close-btn');
    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = 'true';
        closeBtn.addEventListener('click', () => closeMedixlySettingsModal());
    }

    const backdrop = document.getElementById('medixly-settings-backdrop');
    if (backdrop && !backdrop.dataset.bound) {
        backdrop.dataset.bound = 'true';
        backdrop.addEventListener('click', () => closeMedixlySettingsModal());
    }

    // ESC key listener
    if (typeof window !== 'undefined' && !window._medixlySettingsEscBound) {
        window._medixlySettingsEscBound = true;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMedixlySettingsModal();
            }
        });
    }

    // Initialize Apple Settings-style 2D Visual Frequency Curve Graph
    let eqGraph = null;
    if (typeof window !== 'undefined' && window.MedixlyEQGraph) {
        try {
            eqGraph = window.MedixlyEQGraph.init('medixly-eq-canvas', (values) => {
                const b = values.bass;
                const m = values.mid;
                const t = values.treble;
                const bIn = document.getElementById('eq-slider-bass');
                const mIn = document.getElementById('eq-slider-mid');
                const tIn = document.getElementById('eq-slider-treble');
                if (bIn) bIn.value = b;
                if (mIn) mIn.value = m;
                if (tIn) tIn.value = t;
                const bVal = document.getElementById('eq-val-bass');
                const mVal = document.getElementById('eq-val-mid');
                const tVal = document.getElementById('eq-val-treble');
                if (bVal) bVal.textContent = (b > 0 ? '+' : '') + b + ' dB';
                if (mVal) mVal.textContent = (m > 0 ? '+' : '') + m + ' dB';
                if (tVal) tVal.textContent = (t > 0 ? '+' : '') + t + ' dB';

                document.querySelectorAll('#medixly-eq-presets .medixly-preset-btn').forEach(btn => btn.classList.remove('active'));

                const mixEngine = typeof window.__getMixEngine === 'function' ? window.__getMixEngine() : null;
                if (mixEngine && typeof mixEngine.setGlobalEQ === 'function') {
                    mixEngine.setGlobalEQ({ bass: b, mid: m, treble: t });
                } else if (mixEngine && typeof mixEngine.setEQ === 'function') {
                    mixEngine.setEQ(b, m, t);
                }
            });
        } catch (_) {}
    }

    // EQ Preset buttons
    const presetButtons = document.querySelectorAll('#medixly-eq-presets .medixly-preset-btn');
    presetButtons.forEach(btn => {
        if (!btn.dataset.bound) {
            btn.dataset.bound = 'true';
            btn.addEventListener('click', () => {
                const presetKey = btn.dataset.preset;
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const mixEngine = typeof window.__getMixEngine === 'function' ? window.__getMixEngine() : null;
                if (mixEngine && typeof mixEngine.applySoundProfile === 'function') {
                    mixEngine.applySoundProfile(presetKey);
                    const prof = mixEngine.getSoundProfile();
                    if (prof && prof.preset) {
                        const { bass = 0, mid = 0, treble = 0 } = prof.preset;
                        const bIn = document.getElementById('eq-slider-bass');
                        const mIn = document.getElementById('eq-slider-mid');
                        const tIn = document.getElementById('eq-slider-treble');
                        if (bIn) bIn.value = bass;
                        if (mIn) mIn.value = mid;
                        if (tIn) tIn.value = treble;
                        const bVal = document.getElementById('eq-val-bass');
                        const mVal = document.getElementById('eq-val-mid');
                        const tVal = document.getElementById('eq-val-treble');
                        if (bVal) bVal.textContent = (bass > 0 ? '+' : '') + bass + ' dB';
                        if (mVal) mVal.textContent = (mid > 0 ? '+' : '') + mid + ' dB';
                        if (tVal) tVal.textContent = (treble > 0 ? '+' : '') + treble + ' dB';

                        if (eqGraph) eqGraph.setValues(bass, mid, treble);
                    }
                }
            });
        }
    });

    // 3-Band Sliders
    ['bass', 'mid', 'treble'].forEach(band => {
        const slider = document.getElementById(`eq-slider-${band}`);
        if (slider && !slider.dataset.bound) {
            slider.dataset.bound = 'true';
            slider.addEventListener('input', () => {
                const b = parseFloat(document.getElementById('eq-slider-bass')?.value || 0);
                const m = parseFloat(document.getElementById('eq-slider-mid')?.value || 0);
                const t = parseFloat(document.getElementById('eq-slider-treble')?.value || 0);
                const bVal = document.getElementById('eq-val-bass');
                const mVal = document.getElementById('eq-val-mid');
                const tVal = document.getElementById('eq-val-treble');
                if (bVal) bVal.textContent = (b > 0 ? '+' : '') + b + ' dB';
                if (mVal) mVal.textContent = (m > 0 ? '+' : '') + m + ' dB';
                if (tVal) tVal.textContent = (t > 0 ? '+' : '') + t + ' dB';

                presetButtons.forEach(b => b.classList.remove('active'));

                const mixEngine = typeof window.__getMixEngine === 'function' ? window.__getMixEngine() : null;
                if (mixEngine && typeof mixEngine.setGlobalEQ === 'function') {
                    mixEngine.setGlobalEQ({ bass: b, mid: m, treble: t });
                } else if (mixEngine && typeof mixEngine.setEQ === 'function') {
                    mixEngine.setEQ(b, m, t);
                }

                if (eqGraph) eqGraph.setValues(b, m, t);
            });
        }
    });

    // Crossfade Pills
    const crossfadePills = document.querySelectorAll('#medixly-crossfade-selector .crossfade-pill');
    crossfadePills.forEach(pill => {
        if (!pill.dataset.bound) {
            pill.dataset.bound = 'true';
            pill.addEventListener('click', () => {
                const dur = parseFloat(pill.dataset.duration) || 5;
                crossfadePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const mixEngine = typeof window.__getMixEngine === 'function' ? window.__getMixEngine() : null;
                if (mixEngine && typeof mixEngine.setCrossfadeDuration === 'function') {
                    mixEngine.setCrossfadeDuration(dur);
                }
                if (typeof window !== 'undefined') {
                    window.__medixlyCrossfadeDuration = dur;
                }
            });
        }
    });

    // Theme Picker Dots inside Settings (Locked to Premium / Ultra)
    const themeDots = document.querySelectorAll('#medixly-settings-theme-colors .theme-dot, #medixly-theme-colors .theme-dot');
    themeDots.forEach(dot => {
        if (!dot.dataset.bound) {
            dot.dataset.bound = 'true';
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!isUserPremiumSubscribed()) {
                    promptPremiumUpgrade('Custom Accent Theme Colors');
                    return;
                }

                const color = dot.dataset.color;
                if (window.MedixlyThemeProvider && typeof window.MedixlyThemeProvider.setAccentPreset === 'function') {
                    window.MedixlyThemeProvider.setAccentPreset(color);
                } else if (typeof window.updateTheme === 'function') {
                    window.updateTheme(document.documentElement.dataset.theme || 'black', color);
                }
                themeDots.forEach(d => d.classList.toggle('selected', d === dot));
            });
        }
    });

    // History controls inside Settings Modal
    const historySearch = document.getElementById('settings-history-search');
    if (historySearch && !historySearch.dataset.bound) {
        historySearch.dataset.bound = 'true';
        historySearch.addEventListener('input', (e) => {
            if (typeof window.renderSettingsHistory === 'function') {
                window.renderSettingsHistory(e.target.value.trim());
            }
        });
    }

    const deleteHourBtn = document.getElementById('history-delete-hour-btn');
    if (deleteHourBtn && !deleteHourBtn.dataset.bound) {
        deleteHourBtn.dataset.bound = 'true';
        deleteHourBtn.addEventListener('click', () => {
            if (typeof window.deleteHistoryLastHour === 'function') {
                window.deleteHistoryLastHour();
            }
        });
    }

    const clearAllHistBtn = document.getElementById('history-clear-all-btn');
    if (clearAllHistBtn && !clearAllHistBtn.dataset.bound) {
        clearAllHistBtn.dataset.bound = 'true';
        clearAllHistBtn.addEventListener('click', () => {
            if (typeof window.clearAllListeningHistory === 'function') {
                window.clearAllListeningHistory();
            }
        });
    }
}

if (typeof window !== 'undefined') {
    window.openMedixlySettingsModal = openMedixlySettingsModal;
    window.closeMedixlySettingsModal = closeMedixlySettingsModal;
    window.initSettingsModal = initSettingsModal;
}
