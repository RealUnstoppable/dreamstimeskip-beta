import { auth, db } from './auth.js?v=1784516229';
import { escapeHTML, getCachedUserProfile } from './utils.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { subscribeToNotifications, markAsRead } from './notifications-service.js?v=1784516229';
import './sitewide-player.js?v=20260924';
import './ads.js';
import './chatbot.js?v=20260925';
import { initCookieConsent } from './cookie-consent.js';

let notificationUnsubscribe = null;

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
    const isMedixlyPage = window.location.pathname.includes('medixly');
    const logoContent = isMedixlyPage
        ? `<span class="un-letters">un</span><span style="font-weight: 800; margin: 0 10px; font-size: 1.2rem; color: var(--text-primary);">x</span><img src="/images/medixly-logo.png" alt="Medixly" style="height: 54px; margin-top: 2px;" id="medixly-navbar-logo">`
        : `<span class="un-letters">un</span><span class="un-250">250</span>`;

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
                <a href="cart.html" id="nav-cart-btn" class="nav-cart-btn" aria-label="Cart">
                    <span>Cart</span>
                    <span id="nav-cart-badge" class="nav-cart-badge" style="display:none;">0</span>
                </a>
            </li>
            <li><a href="memberships.html">Memberships</a></li>
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
                <a href="cart.html" id="uds-nav-cart-btn" class="nav-cart-btn" aria-label="Cart">
                    <span>Cart</span>
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

        const allNavLinks = document.querySelectorAll('.nav-links a, .nav-logo');
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!isDesktopAppEnvironment()) return;

                const href = (link.getAttribute('href') || '').trim();
                const isMedixlyTarget = href === 'medixly.html' || href === '/medixly.html' || href === '/medixly' || href.startsWith('medixly');
                const isAuthTarget = link.id === 'auth-link' || href.includes('sign in beta') || href.includes('account.html') || href.includes('admin.html');

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
            const items = document.querySelectorAll('.notification-item.unread');
            items.forEach(item => {
                item.classList.remove('unread');
                const id = item.getAttribute('data-id');
                if (id && !id.startsWith('pre-')) {
                    try { markAsRead(id); } catch (_) { /* ignore read error */ }
                }
            });
            updateNotificationBadge(0);
        });
    }

    // Load preloaded notifications immediately
    renderNotifications(PRELOADED_NOTIFICATIONS);
    updateNotificationBadge(PRELOADED_NOTIFICATIONS.length);
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

function renderNotifications(notifications) {
    const list = document.getElementById('notification-list');
    if (!list) return;

    if (notifications.length === 0) {
        list.innerHTML = '<div class="notification-item"><small>You\'re all caught up! 🎉</small></div>';
        return;
    }

    list.innerHTML = notifications.map(n => {
        let icon = BELL_SVG;
        if (n.type === 'reward') icon = '🎁';
        if (n.type === 'ticket_reply') icon = '💬';

        return `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${escapeHTML(n.id)}" data-link="${escapeHTML(n.link || '')}">
            <div class="notif-icon" style="font-size: 1.2rem; margin-right: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${icon}</div>
            <div class="notif-content">
                <p class="notif-title">${escapeHTML(n.title)}</p>
                <small class="notif-msg">${escapeHTML(n.message)}</small>
            </div>
            ${!n.isRead ? '<span class="notif-dot"></span>' : ''}
        </div>
        `;
    }).join('');

    list.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const link = e.currentTarget.getAttribute('data-link');
            e.currentTarget.classList.remove('unread');
            // Remove the blue dot
            const dot = e.currentTarget.querySelector('.notif-dot');
            if (dot) dot.remove();

            if (id && !id.startsWith('pre-') && !e.currentTarget.classList.contains('read-processed')) {
                e.currentTarget.classList.add('read-processed');
                try { await markAsRead(id); } catch (_) { /* ignore read error */ }
            }

            // Recount badge
            const unread = document.querySelectorAll('.notification-item.unread').length;
            updateNotificationBadge(unread);

            if (link && link !== 'undefined' && link !== 'null' && link !== '') {
                window.location.href = link;
            }
        });
    });
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