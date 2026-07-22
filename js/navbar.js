import { auth, db } from './auth.js?v=1784516229';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { subscribeToNotifications, markAsRead } from './notifications-service.js?v=1784516229';

let notificationUnsubscribe = null;

function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function loadNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo">un<span></span></a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">HarmonyTunes</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="memberships.html">Memberships</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="portfolio.html">About Me</a></li>
            <li><a href="uds.html">UDS</a></li>
            <li><div class="notification-wrapper"><span class="notification-bell">🔔<span class="notification-badge" style="display:none;" id="notification-badge">0</span></span><div class="notification-dropdown" id="notification-dropdown"></div></div></li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        <button class="hamburger" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
    </nav>`;

    const header = document.querySelector('.main-header');
    if (header) {
        header.innerHTML = headerHTML;
        attachNavEvents();
        updateAuthLink();
    }
}

export function loadUdsNavbar() {
    const headerHTML = `
    <nav class="navbar">
        <a href="index.html" class="nav-logo">un<span></span></a>
        <ul class="nav-links">
            <li><a href="unstoppable.html">Unstoppable</a></li>
            <li><a href="dreamstimeskip.html">Dreams TimeSkip</a></li>
            <li><a href="harmonytunes.html">HarmonyTunes</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li class="nav-dropdown-wrapper">
                <a href="#" style="cursor: default;">UDS ▾</a>
                <div class="nav-dropdown">
                    <a href="uds.html">Overview</a>
                    <a href="detailing.html">Services</a>
                </div>
            </li>
            <li><div class="notification-wrapper"><span class="notification-bell">🔔<span class="notification-badge" style="display:none;" id="notification-badge">0</span></span><div class="notification-dropdown" id="notification-dropdown"></div></div></li>
            <li><a href="sign in beta.html" id="auth-link">Sign In / Sign Up</a></li>
        </ul>
        <button class="hamburger" aria-label="Open menu">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
    </nav>`;

    const header = document.querySelector('.main-header');
    if (header) {
        header.innerHTML = headerHTML;
        attachNavEvents();
        updateAuthLink(); // Check login status immediately after loading
    }
}

function attachNavEvents() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const cacheKey = `profile_${user.uid}`;
                const cachedProfile = sessionStorage.getItem(cacheKey);
                let userData = null;

                if (cachedProfile) {
                    userData = JSON.parse(cachedProfile);
                } else {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        userData = userDoc.data();
                        sessionStorage.setItem(cacheKey, JSON.stringify(userData));
                    }
                }


                // Fetch notifications
                try {
                    if (notificationUnsubscribe) {
                        notificationUnsubscribe();
                    }
                    notificationUnsubscribe = subscribeToNotifications(user.uid, (notifications) => {
                        const badge = document.getElementById('notification-badge');
                        const dropdown = document.getElementById('notification-dropdown');
                        if (badge && dropdown) {
                            const unreadCount = notifications.filter(n => !n.isRead).length;
                            if (unreadCount > 0) {
                                badge.style.display = 'inline-block';
                                badge.textContent = unreadCount;
                            } else {
                                badge.style.display = 'none';
                            }

                            if (notifications.length === 0) {
                                dropdown.innerHTML = '<div class="notification-item"><small>No notifications</small></div>';
                            } else {
                                dropdown.innerHTML = notifications.map(n => `
                                    <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${escapeHTML(n.id)}" data-link="${escapeHTML(n.link)}">
                                        <p style="margin:0; font-size: 0.9rem;">${escapeHTML(n.title)}</p>
                                        <small>${escapeHTML(n.message)}</small>
                                    </div>
                                `).join('');

                                dropdown.querySelectorAll('.notification-item').forEach(item => {
                                    item.addEventListener('click', async (e) => {
                                        const id = e.currentTarget.getAttribute('data-id');
                                        const link = e.currentTarget.getAttribute('data-link');
                                        if (id && !e.currentTarget.classList.contains('read-processed')) {
                                            e.currentTarget.classList.add('read-processed');
                                            try {
                                                await markAsRead(id);
                                            } catch (err) {
                                                console.error('Failed to mark as read', err);
                                            }
                                        }
                                        if (link && link !== 'undefined' && link !== 'null') window.location.href = link;
                                    });
                                });
                            }
                        }
                    });
                } catch(err) { console.error('Notification error', err); }

                const destination = userData && userData.isAdmin ? 'admin.html' : 'account.html';
                authLink.href = destination;
                authLink.textContent = "My Account";
            } catch (e) {
                console.error("Nav Error - Manager info: [" + e.message + "]", e);
            }
        } else {
            authLink.href = 'sign in beta.html';
            authLink.textContent = "Sign In / Sign Up";

            if (notificationUnsubscribe) {
                notificationUnsubscribe();
                notificationUnsubscribe = null;
            }
            const badge = document.getElementById('notification-badge');
            const dropdown = document.getElementById('notification-dropdown');
            if (badge) badge.style.display = 'none';
            if (dropdown) dropdown.innerHTML = '';
        }
    });
}