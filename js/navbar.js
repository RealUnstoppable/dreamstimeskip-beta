import { auth, db } from './auth.js?v=1784516229';
import { getCachedUserProfile } from './utils.js';
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
        link: 'harmonytunes.html',
        isRead: false,
        preloaded: true
    },
    {
        id: 'pre-2',
        title: '🌌 Dreams TimeSkip — New Update',
        message: 'Explore the latest features in Dreams TimeSkip.',
        link: 'dreamstimeskip.html',
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

function escapeHTML(str) {
    if (str == null) return '';
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Bell SVG icon (YouTube-style)
const BELL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/></svg>`;

export function loadNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo un-text-logo">
            <span class="un-letters">UN</span><span class="un-250">250</span>
        </a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">Medixly</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="portfolio.html">About Me</a></li>
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
    }
    initCookieConsent();
}

export function loadUdsNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo un-text-logo">
            <span class="un-letters">UN</span><span class="un-250">250</span>
        </a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">Medixly</a></li>
            <li><a href="shop.html">Shop</a></li>
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
    }
    initCookieConsent();
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
                    try { markAsRead(id); } catch (_) {}
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

    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${escapeHTML(n.id)}" data-link="${escapeHTML(n.link || '')}">
            <div class="notif-content">
                <p class="notif-title">${escapeHTML(n.title)}</p>
                <small class="notif-msg">${escapeHTML(n.message)}</small>
            </div>
            ${!n.isRead ? '<span class="notif-dot"></span>' : ''}
        </div>
    `).join('');

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
                try { await markAsRead(id); } catch (_) {}
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
                        PRELOADED_NOTIFICATIONS.forEach(pre => {
                            if (!merged.find(n => n.id === pre.id)) merged.push(pre);
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