// js/account.js - Comprehensive Account Management Controller
import { auth, db } from './auth.js';
import { getCachedUserProfile } from './utils.js';
import { onAuthStateChanged, signOut, deleteUser, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { productMap } from './products-data.js';
import { escapeHTML, formatDate } from './utils.js';
import { createTransactionHtml, generateProductCardHtml } from './ui-utils.js';
import { createTicket, getUserTickets } from './ticket-service.js';

// Global state
let currentUser = null;
let currentUserData = null;
let isSeedingWelcomeTx = false;

/**
 * 1. TAB NAVIGATION & URL ROUTING
 * Initializes immediately on DOM ready so every sidebar button works without delay.
 */
export function initTabNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a.nav-link');
    const sections = document.querySelectorAll('.content-section');

    function switchTab(targetHash) {
        if (!targetHash || targetHash === '#' || targetHash === '') {
            targetHash = '#dashboard';
        }
        if (!targetHash.startsWith('#')) {
            targetHash = '#' + targetHash;
        }

        const targetSection = document.querySelector(targetHash);
        if (!targetSection) {
            targetHash = '#dashboard';
        }

        // Update nav links
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === targetHash);
        });

        // Update content sections
        sections.forEach(sec => {
            sec.classList.toggle('active', '#' + sec.id === targetHash);
        });

        // If user is loaded, refresh view when switching tabs
        if (currentUser) {
            if (targetHash === '#dashboard') {
                const checkinData = getUserCheckinData(currentUser, currentUserData);
                updateCheckinUI(currentUser, checkinData);
            } else if (targetHash === '#orders') {
                renderOrders(currentUser);
            } else if (targetHash === '#rewards') {
                renderRewards(currentUser, currentUserData);
            } else if (targetHash === '#wishlist') {
                loadWishlist(currentUser.uid);
            } else if (targetHash === '#support') {
                loadUserTickets(currentUser.uid);
            }
        }

        // Scroll to top of content on mobile
        if (window.innerWidth <= 768) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    window.switchAccountTab = switchTab;

    // Attach click listeners to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                history.pushState(null, '', hash);
                switchTab(hash);
            }
        });
    });

    // Delegate any in-page anchor links to tabs (e.g. from orders to support)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor && !anchor.closest('.sidebar-nav')) {
            const hash = anchor.getAttribute('href');
            if (hash && hash.length > 1 && document.querySelector(hash)) {
                e.preventDefault();
                history.pushState(null, '', hash);
                switchTab(hash);
            }
        }
    });

    // Listen to browser forward/back buttons
    window.addEventListener('hashchange', () => {
        switchTab(window.location.hash);
    });

    // Check URL hash on initial page load
    const initialHash = window.location.hash;
    switchTab(initialHash || '#dashboard');
}

/**
 * 2. PROFILE RENDERING
 */
export function renderProfile(user, userData) {
    if (!user) return;
    const data = userData || {};

    const welcomeHeader = document.getElementById('welcome-header');
    if (welcomeHeader) {
        const displayName = data.username || user.displayName || user.email?.split('@')[0] || 'Unstoppable';
        welcomeHeader.innerHTML = `<span class="welcome-prefix">Welcome back,</span> <span class="welcome-username">${escapeHTML(displayName)}!</span>`;
    }

    const emailSidebar = document.getElementById('user-email-sidebar');
    if (emailSidebar) {
        emailSidebar.textContent = user.email || data.email || '';
    }

    const usernameInput = document.getElementById('update-username');
    if (usernameInput) {
        usernameInput.value = userData.username || user.displayName || '';
    }

    const emailInput = document.getElementById('update-email');
    if (emailInput) {
        emailInput.value = user.email || '';
    }

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = userData.theme || 'system';
    }

    const isPremium = userData.membershipLevel === 'premium' || userData.membershipLevel === 'ultimate' || userData.isAdmin;
    const customHex = document.getElementById('custom-hex-color');
    if (customHex) {
        customHex.disabled = !isPremium;
        customHex.title = isPremium ? 'Select custom accent color' : 'Requires Premium or Ultimate';
        if (userData.accentColor && userData.accentColor.startsWith('#')) {
            customHex.value = userData.accentColor;
        } else {
            customHex.value = '#2563EB';
        }
    }

    if (userData.isAdmin) {
        const adminBtn = document.getElementById('admin-back-button');
        if (adminBtn) adminBtn.style.display = 'block';
    }
}

/**
 * 3. ORDER HISTORY RENDERING
 * Safe query without composite index requirement, plus offline/local order fallback.
 */
export async function renderOrders(user) {
    const listEl = document.getElementById('orders-list');
    const noOrdersMsg = document.getElementById('no-orders-msg');
    if (!listEl) return;

    try {
        let orders = [];

        // 1. Fetch from Firestore by userId only (safe from composite index errors)
        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where("userId", "==", user.uid));
            const snap = await getDocs(q);
            orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (dbErr) {
            console.warn("Manager info: Firestore orders fetch warning:", dbErr);
        }

        // 2. Fallback to localStorage lastCompletedOrder if applicable
        try {
            const lastLocalOrderStr = localStorage.getItem('lastCompletedOrder');
            if (lastLocalOrderStr) {
                const lastLocalOrder = JSON.parse(lastLocalOrderStr);
                if (lastLocalOrder && (lastLocalOrder.userId === user.uid || lastLocalOrder.userEmail === user.email)) {
                    if (!orders.find(o => o.orderId === lastLocalOrder.orderId || o.id === lastLocalOrder.orderId)) {
                        orders.push({ id: lastLocalOrder.orderId, ...lastLocalOrder });
                    }
                }
            }
        } catch (_) { /* ignore local storage error */ }

        // 3. Sort orders client-side by date descending
        orders.sort((a, b) => {
            const getTime = (val) => {
                if (!val) return 0;
                if (typeof val.toMillis === 'function') return val.toMillis();
                if (val instanceof Date) return val.getTime();
                return new Date(val).getTime() || 0;
            };
            return getTime(b.orderDate || b.createdAt) - getTime(a.orderDate || a.createdAt);
        });

        if (orders.length === 0) {
            if (noOrdersMsg) noOrdersMsg.style.display = 'none';
            listEl.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--border-color);">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">🛍️</div>
                    <h4 style="margin: 0 0 8px 0; color: #fff;">No Orders Yet</h4>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 20px;">You haven't placed any merchandise orders. Browse our store to unlock exclusive gear and earn 10 points for every dollar spent!</p>
                    <a href="shop.html" class="btn btn-primary" style="display: inline-block;">Browse Shop →</a>
                </div>
            `;
            return;
        }

        if (noOrdersMsg) noOrdersMsg.style.display = 'none';
        listEl.innerHTML = '';

        const fragment = document.createDocumentFragment();

        orders.forEach(order => {
            const orderId = order.orderId || order.id || 'ORD-UNKNOWN';
            const orderDateStr = formatDate(order.orderDate || order.createdAt);
            const status = order.status || 'Paid';
            const statusColor = status.toLowerCase() === 'paid' ? 'var(--accent-green)' : 'var(--accent-yellow)';

            // Render items
            let itemsHtml = '';
            let calculatedSubtotal = 0;

            if (order.items && typeof order.items === 'object') {
                for (const [productId, quantity] of Object.entries(order.items)) {
                    const product = productMap.get(productId) || { id: productId, name: productId, price: 0, imageUrl: '' };
                    const qty = parseInt(quantity, 10) || 1;
                    const itemTotal = (product.price || 0) * qty;
                    calculatedSubtotal += itemTotal;

                    itemsHtml += generateProductCardHtml(product, 'order-history', qty);
                }
            }

            const total = typeof order.total === 'number' && order.total > 0 
                ? order.total 
                : (calculatedSubtotal * 1.07);

            const card = document.createElement('div');
            card.className = 'card';
            card.style.marginBottom = '16px';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <strong style="font-size: 1.1rem; color: #fff;">Order #${escapeHTML(orderId)}</strong>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">Placed on ${orderDateStr}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; background: rgba(22, 163, 74, 0.15); color: ${statusColor}; border: 1px solid ${statusColor};">${escapeHTML(status)}</span>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-top: 4px;">$${total.toFixed(2)}</div>
                    </div>
                </div>
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Purchased Items</div>
                    ${itemsHtml || '<div style="color: var(--text-secondary);">Items details unavailable.</div>'}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap; gap: 8px;">
                    ${order.shippingInfo ? `<div><strong>Shipping to:</strong> ${escapeHTML(order.shippingInfo.name || '')} (${escapeHTML(order.shippingInfo.city || '')})</div>` : '<div></div>'}
                    <div>
                        <a href="#support" class="order-support-link" style="color: var(--accent-blue); text-decoration: none; font-weight: 600;">Need Help? Contact Support →</a>
                    </div>
                </div>
            `;

            // Wire support link to prefill ticket
            card.querySelector('.order-support-link')?.addEventListener('click', (e) => {
                e.preventDefault();
                const subjectInput = document.getElementById('ticket-subject');
                if (subjectInput) {
                    subjectInput.value = `Inquiry regarding Order #${orderId}`;
                }
                const link = document.querySelector('.sidebar-nav a[href="#support"]');
                if (link) link.click();
            });

            fragment.appendChild(card);
        });

        listEl.appendChild(fragment);

    } catch (err) {
        console.error("Manager info: Error rendering orders:", err);
        if (listEl) {
            listEl.innerHTML = `<p style="color: var(--accent-red);">Failed to load order history. Please try again later.</p>`;
        }
    }
}

/**
 * 4. LOYALTY REWARDS & POINTS TRACKING
 * Tracks points in Firestore, seeds welcome points, and displays recent activity.
 */
export async function renderRewards(user, userData) {
    const pointsBalanceDisplay = document.getElementById('points-balance-display');
    const userLoyaltyPoints = document.getElementById('user-loyalty-points');
    const dashboardActivityList = document.getElementById('reward-transactions-list');
    const rewardsHistoryList = document.getElementById('rewards-history-list');
    const noRewardsMsg = document.getElementById('no-rewards-msg');

    try {
        const referralLinkInput = document.getElementById('referral-link');
        if (referralLinkInput) {
            referralLinkInput.value = window.location.origin + '/sign in beta.html?ref=' + user.uid;
        }

        // Current points calculation: read cache or defaults
        let points = 50; // Standard Welcome Bonus
        if (userData && typeof userData.pointsBalance === 'number') {
            points = userData.pointsBalance;
        } else if (userData && typeof userData.loyaltyPoints === 'number') {
            points = userData.loyaltyPoints;
        } else {
            const localPts = parseInt(localStorage.getItem(`dts_points_${user.uid}`), 10);
            if (!isNaN(localPts) && localPts >= 0) {
                points = localPts;
            }
        }

        // Update displays immediately so it never hangs on "Loading..."
        if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = points;
        if (userLoyaltyPoints) userLoyaltyPoints.textContent = points;
        if (dashboardActivityList) {
            dashboardActivityList.innerHTML = `<p style="color: var(--text-secondary); margin: 0;">No activity yet. Earn 10 points for every dollar spent in the shop!</p>`;
        }

        // Fetch reward transactions (WITHOUT orderBy to prevent composite index errors, with 3s timeout)
        let txs = [];
        try {
            const transactionsRef = collection(db, 'loyalty_transactions');
            const q = query(transactionsRef, where("userId", "==", user.uid));
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
            const snap = await Promise.race([getDocs(q), timeoutPromise]);
            txs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (dbErr) {
            console.warn("Notice: loyalty_transactions query notice:", dbErr.message || dbErr);
        }

        // If no transactions exist, seed the welcome 50 points transaction into Firestore (with concurrency guard)
        if (txs.length === 0 && !isSeedingWelcomeTx && !sessionStorage.getItem(`welcome_seeded_${user.uid}`)) {
            isSeedingWelcomeTx = true;
            sessionStorage.setItem(`welcome_seeded_${user.uid}`, 'true');
            try {
                const welcomeTx = {
                    userId: user.uid,
                    description: 'Account Welcome Reward 🎉',
                    points: 50,
                    type: 'earned',
                    createdAt: serverTimestamp()
                };
                await addDoc(collection(db, 'loyalty_transactions'), welcomeTx);
                txs.push({
                    id: 'tx_welcome',
                    description: 'Account Welcome Reward 🎉',
                    points: 50,
                    type: 'earned',
                    createdAt: new Date()
                });
            } catch (seedErr) {
                console.warn("Notice: Could not seed welcome transaction:", seedErr);
            } finally {
                isSeedingWelcomeTx = false;
            }
        } else if (txs.length > 0) {
            // Calculate total points from all user transactions
            let sum = 0;
            txs.forEach(t => {
                const p = typeof t.points === 'number' ? t.points : (typeof t.amount === 'number' ? t.amount : 0);
                sum += p;
            });
            if (sum > 0) {
                points = sum;
            }

            // ⚡ Reconcile daily check-in streak with recorded transactions if needed
            try {
                const activeCheckin = getUserCheckinData(user, userData, txs);
                updateCheckinUI(user, activeCheckin);
                if (activeCheckin.streak > (userData?.dailyCheckin?.streak || 0) || (userData && !userData.dailyCheckin && activeCheckin.streak > 0)) {
                    const userRef = doc(db, "users", user.uid);
                    setDoc(userRef, {
                        dailyCheckin: activeCheckin,
                        checkInStreak: activeCheckin.streak,
                        lastClaimDate: activeCheckin.lastClaimDate
                    }, { merge: true }).catch(() => {});
                }
            } catch (chkErr) {
                console.warn("Notice: Check-in streak reconciliation notice:", chkErr);
            }
        }

        // Update cache and DOM with real computed points
        localStorage.setItem(`dts_points_${user.uid}`, points);
        if (userData) {
            userData.pointsBalance = points;
            userData.loyaltyPoints = points;
            sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
        }

        if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = points;
        if (userLoyaltyPoints) userLoyaltyPoints.textContent = points;

        // Sort client-side by date descending
        txs.sort((a, b) => {
            const getTime = (val) => {
                if (!val) return 0;
                if (typeof val.toMillis === 'function') return val.toMillis();
                if (val instanceof Date) return val.getTime();
                return new Date(val).getTime() || 0;
            };
            return getTime(b.createdAt) - getTime(a.createdAt);
        });

        // 1. Render Dashboard Recent Activity
        if (dashboardActivityList) {
            if (txs.length === 0) {
                dashboardActivityList.innerHTML = `<p style="color: var(--text-secondary); margin: 0;">No activity yet. Earn 10 points for every dollar spent in the shop!</p>`;
            } else {
                dashboardActivityList.innerHTML = txs.slice(0, 4).map(tx => createTransactionHtml(tx, true)).join('');
            }
        }

        // 2. Render Full Rewards History Tab
        if (rewardsHistoryList) {
            if (txs.length === 0) {
                if (noRewardsMsg) {
                    noRewardsMsg.textContent = "You haven't earned any rewards yet.";
                    noRewardsMsg.style.display = 'block';
                }
                rewardsHistoryList.innerHTML = '';
            } else {
                if (noRewardsMsg) noRewardsMsg.style.display = 'none';
                rewardsHistoryList.innerHTML = txs.map(tx => createTransactionHtml(tx, false)).join('');
            }
        }

    } catch (err) {
        console.error("Error rendering rewards:", err);
        const fallback = parseInt(localStorage.getItem(`dts_points_${user.uid}`), 10) || 50;
        if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = fallback;
        if (userLoyaltyPoints) userLoyaltyPoints.textContent = fallback;
        if (dashboardActivityList) dashboardActivityList.innerHTML = `<p style="color: var(--text-secondary); margin: 0;">No activity yet.</p>`;
    }
}

/**
 * 5. BILLING & PLANS SECTION
 * Shows active tier, perks, renewal info, and attaches the multi-step cancellation flow.
 */
export function renderBilling(user, userData) {
    const billingContainer = document.querySelector('#billing .card');
    if (!billingContainer) return;

    const membershipLevel = (userData.membershipLevel || 'free').toLowerCase();
    const isPaid = membershipLevel === 'premium' || membershipLevel === 'ultimate' || (userData.subscription && userData.subscription.status === 'active');
    const planTitle = membershipLevel === 'ultimate' ? 'Ultimate Plan ($14.13/mo)' :
                      membershipLevel === 'premium' ? 'Premium Plan ($10.86/mo)' : 'Standard (Free Forever)';

    if (isPaid) {
        billingContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin: 0; color: #fff;">Current Subscription</h4>
                    <p style="margin: 6px 0 0; color: var(--text-secondary);">Your membership plan is active and automatically renewed.</p>
                </div>
                <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; background: rgba(22, 163, 74, 0.2); color: var(--accent-green); border: 1px solid var(--accent-green);">● ACTIVE PLAN</span>
            </div>

            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                    <strong>Plan Tier:</strong>
                    <span style="font-weight: 800; color: var(--accent-blue); font-size: 1.1rem;">${escapeHTML(planTitle)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                    <strong>Billing Interval:</strong>
                    <span>Monthly (Renews on the 1st of every month)</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                    <strong>Payment Method:</strong>
                    <span>💳 Visa Card ending in 4242 (Stripe Test)</span>
                </div>
                <div>
                    <strong>Active VIP Privileges:</strong>
                    <ul style="list-style: none; padding: 8px 0 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
                        <li style="color: #e5e7eb;">✔ 3x XP multiplier across all DTS game servers</li>
                        <li style="color: #e5e7eb;">✔ Discord VIP channels & #exclusive-giveaways access</li>
                        <li style="color: #e5e7eb;">✔ 30 Monthly Loot Boxes & 6 Mythic Mystery Boxes</li>
                        <li style="color: #e5e7eb;">✔ 15% VIP Discount on all Merchandise</li>
                        <li style="color: #e5e7eb;">✔ Full theme access (Lotus Pink, Rainforest, Custom Hex)</li>
                    </ul>
                </div>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                <a href="memberships.html" class="btn btn-primary" style="padding: 10px 20px;">Change Plan</a>
                <button type="button" id="start-cancel-wizard-btn" class="btn" style="background: transparent; border: 1px solid var(--accent-red); color: var(--accent-red); padding: 10px 18px; border-radius: 8px; cursor: pointer;">Cancel Membership</button>
            </div>
        `;

        document.getElementById('start-cancel-wizard-btn')?.addEventListener('click', () => {
            initCancellationWizard(user, userData, () => {
                userData.membershipLevel = 'free';
                if (userData.subscription) userData.subscription.status = 'canceled';
                renderBilling(user, userData);
            });
        });

    } else {
        billingContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                <div>
                    <h4 style="margin: 0; color: #fff;">Current Plan</h4>
                    <p style="margin: 4px 0 0; color: var(--text-secondary);">You are currently on the <strong>Standard (Free)</strong> tier.</p>
                </div>
                <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; background: rgba(255, 255, 255, 0.08); color: #fff;">STANDARD FREE</span>
            </div>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #fff; font-weight: 600;">Upgrade to Premium or Ultimate to unlock:</p>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; font-size: 0.95rem; color: var(--text-secondary);">
                    <li>• Ad-Free experience across the entire DTS ecosystem</li>
                    <li>• 3x XP Battlepass multiplier on Minecraft servers</li>
                    <li>• 15% discount on all shop merchandise</li>
                    <li>• Custom Theme editor & exclusive Discord roles</li>
                </ul>
            </div>

            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <a href="memberships.html" class="btn btn-primary" style="padding: 10px 20px;">Upgrade Plan →</a>
                
                <!-- Quick plan test activation for development / verification -->
                <button type="button" id="test-activate-premium-btn" class="btn" style="background: rgba(37, 99, 235, 0.15); border: 1px solid var(--accent-blue); color: #fff; font-size: 0.85rem; padding: 8px 14px; border-radius: 8px; cursor: pointer;">
                    [Activate Premium (Test Mode)]
                </button>
            </div>
        `;

        document.getElementById('test-activate-premium-btn')?.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Activating...';
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    membershipLevel: 'premium',
                    subscription: {
                        status: 'active',
                        plan: 'premium',
                        startedAt: serverTimestamp()
                    }
                });
                userData.membershipLevel = 'premium';
                userData.subscription = { status: 'active', plan: 'premium' };
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
                alert('Premium plan activated in test mode! You can now test the cancellation flow.');
                renderBilling(user, userData);
            } catch (err) {
                console.error("Manager info: Test activate error:", err);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }
}

/**
 * HOSTILE UI / DARK PATTERN HELPER
 * Toggles button order and flips Big Blue Button so iOS / mobile users
 * who reflexively tap the big blue primary button accidentally tap 'Go Back'
 * and get restarted from Step 1.
 */
function setupHostileButtonSwapper(container) {
    if (!container || container.dataset.swapperAttached) return;
    container.dataset.swapperAttached = 'true';

    // On hover / mouseenter on container or continue buttons, swap button positions
    container.addEventListener('mouseenter', () => {
        container.classList.toggle('swap-order');
    });

    // For iOS / mobile touch devices: right when finger approaches or touches, swap!
    container.addEventListener('touchstart', () => {
        if (Math.random() > 0.25) {
            container.classList.toggle('swap-order');
        }
    }, { passive: true });
}

/**
 * COMPLICATED STEP-BY-STEP RETENTION CANCELLATION GAUNTLET WIZARD
 * Step 1: Reason selection
 * Step 2: Email verification
 * Step 3: Password verification
 * Step 4: Confirm password
 * Step 5: Minecraft username
 * Step 6: Discord username
 * Step 7: Last 4 digits of card
 * Step 8: Loss of Perks review
 * Step 9: Retention voucher 10% OFF code + 100 free points!
 * Popups: Confirm cancellation -> Password prompt -> Terminate ask -> Password prompt -> Final warning
 */
export function initCancellationWizard(user, userData, onCancelledCallback) {
    const modal = document.getElementById('cancel-membership-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    let currentStep = 1;

    const stepDots = modal.querySelectorAll('#cancel-step-dots .step-dot');
    const stepContents = modal.querySelectorAll('.cancel-step-content');
    const stepIndicatorText = document.getElementById('cancel-step-indicator-text');

    // Popups
    const subConfirmPopup = document.getElementById('sub-cancel-confirm-popup');
    const subTerminateAskPopup = document.getElementById('sub-cancel-terminate-ask-popup');
    const subTerminateConfirmPopup = document.getElementById('sub-cancel-terminate-confirm-popup');
    const subTerminateForeverPopup = document.getElementById('sub-cancel-terminate-forever-popup');

    // Inputs
    const emailInput = document.getElementById('cancel-email-input');
    const passwordInput = document.getElementById('cancel-password-input');
    const confirmPasswordInput = document.getElementById('cancel-confirm-password-input');
    const mcInput = document.getElementById('cancel-mc-input');
    const discordInput = document.getElementById('cancel-discord-input');
    const cardInput = document.getElementById('cancel-card-input');
    const noCardCheckbox = document.getElementById('cancel-no-card-checkbox');
    const popupPasswordInput = document.getElementById('sub-cancel-popup-password');
    const terminatePasswordInput = document.getElementById('sub-cancel-terminate-password');

    // Errors
    const emailError = document.getElementById('cancel-email-error');
    const passwordError = document.getElementById('cancel-password-error');
    const confirmPasswordError = document.getElementById('cancel-confirm-password-error');
    const mcError = document.getElementById('cancel-mc-error');
    const discordError = document.getElementById('cancel-discord-error');
    const cardError = document.getElementById('cancel-card-error');
    const popupPwdError = document.getElementById('sub-cancel-popup-pwd-error');
    const terminatePwdError = document.getElementById('sub-cancel-terminate-pwd-error');

    const stepTitles = [
        'Step 1 of 9: Reason for Leaving',
        'Step 2 of 9: Verify Account Email',
        'Step 3 of 9: Account Password Verification',
        'Step 4 of 9: Confirm Master Password',
        'Step 5 of 9: Minecraft IGN Synchronization',
        'Step 6 of 9: Discord Identity Check',
        'Step 7 of 9: Payment Card Verification',
        'Step 8 of 9: Review Forfeited VIP Perks',
        'Step 9 of 9: Exclusive Retention Offer'
    ];

    function hideAllPopups() {
        if (subConfirmPopup) subConfirmPopup.style.display = 'none';
        if (subTerminateAskPopup) subTerminateAskPopup.style.display = 'none';
        if (subTerminateConfirmPopup) subTerminateConfirmPopup.style.display = 'none';
        if (subTerminateForeverPopup) subTerminateForeverPopup.style.display = 'none';
    }

    function resetInputs() {
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        if (mcInput) mcInput.value = '';
        if (discordInput) discordInput.value = '';
        if (cardInput) cardInput.value = '';
        if (noCardCheckbox) noCardCheckbox.checked = false;
        if (popupPasswordInput) popupPasswordInput.value = '';
        if (terminatePasswordInput) terminatePasswordInput.value = '';

        [emailError, passwordError, confirmPasswordError, mcError, discordError, cardError, popupPwdError, terminatePwdError].forEach(errEl => {
            if (errEl) {
                errEl.textContent = '';
                errEl.style.display = 'none';
            }
        });
    }

    function showStep(stepNum) {
        currentStep = stepNum;
        if (stepIndicatorText) {
            stepIndicatorText.textContent = stepTitles[stepNum - 1] || `Step ${stepNum} of 9`;
        }

        stepDots.forEach(dot => {
            const dStep = parseInt(dot.getAttribute('data-step'), 10);
            dot.classList.toggle('active', dStep === stepNum);
            dot.classList.toggle('completed', dStep < stepNum);
        });

        stepContents.forEach(content => {
            content.style.display = content.id === `cancel-step-${stepNum}` ? 'block' : 'none';
        });

        const actionRow = document.getElementById(`cancel-actions-${stepNum}`);
        if (actionRow) {
            setupHostileButtonSwapper(actionRow);
            if (Math.random() > 0.5) actionRow.classList.add('swap-order');
            else actionRow.classList.remove('swap-order');
        }
    }

    function triggerReset(e) {
        e?.preventDefault();
        e?.stopPropagation();
        hideAllPopups();
        resetInputs();
        showStep(1);
        alert('⚠️ Action Aborted: You clicked "Go Back"! All verification has been wiped and reset back to Step 1.');
    }

    modal.querySelectorAll('.cancel-keep-btn, .tricky-goback-btn, [data-action="reset"]').forEach(btn => {
        btn.onclick = triggerReset;
    });

    document.getElementById('close-cancel-modal-btn').onclick = () => {
        modal.style.display = 'none';
        hideAllPopups();
        resetInputs();
        showStep(1);
    };

    // Step 1 -> Step 2 (Reason selection)
    const step2Btn = document.getElementById('cancel-to-step-2-btn');
    if (step2Btn) {
        step2Btn.onclick = () => {
            const selectedReason = modal.querySelector('input[name="cancel_reason"]:checked');
            if (!selectedReason) {
                alert('Please select a reason before continuing.');
                return;
            }
            showStep(2);
        };
    }

    // Step 2 -> Step 3 (Email)
    const step3Btn = document.getElementById('cancel-to-step-3-btn');
    if (step3Btn) {
        step3Btn.onclick = () => {
            const val = (emailInput?.value || '').trim().toLowerCase();
            const expected = (user?.email || userData?.email || '').trim().toLowerCase();
            if (!val) {
                if (emailError) {
                    emailError.textContent = 'Please enter your account email address.';
                    emailError.style.display = 'block';
                }
                return;
            }
            if (expected && val !== expected) {
                if (emailError) {
                    emailError.textContent = `Verification Failed: "${val}" does not match active account email on file. Please type it exactly.`;
                    emailError.style.display = 'block';
                }
                return;
            }
            if (emailError) emailError.style.display = 'none';
            showStep(3);
        };
    }

    // Step 3 -> Step 4 (Password)
    const step4Btn = document.getElementById('cancel-to-step-4-btn');
    if (step4Btn) {
        step4Btn.onclick = () => {
            const pwd = passwordInput?.value || '';
            if (!pwd || pwd.length < 6) {
                if (passwordError) {
                    passwordError.textContent = 'Please enter your account password (at least 6 characters).';
                    passwordError.style.display = 'block';
                }
                return;
            }
            if (passwordError) passwordError.style.display = 'none';
            showStep(4);
        };
    }

    // Step 4 -> Step 5 (Confirm Password)
    const step5Btn = document.getElementById('cancel-to-step-5-btn');
    if (step5Btn) {
        step5Btn.onclick = () => {
            const pwd = passwordInput?.value || '';
            const confirmVal = confirmPasswordInput?.value || '';
            if (!confirmVal || confirmVal !== pwd) {
                if (confirmPasswordError) {
                    confirmPasswordError.textContent = 'Password confirmation does not match the master password.';
                    confirmPasswordError.style.display = 'block';
                }
                return;
            }
            if (confirmPasswordError) confirmPasswordError.style.display = 'none';
            showStep(5);
        };
    }

    // Step 5 -> Step 6 (MC IGN)
    const step6Btn = document.getElementById('cancel-to-step-6-btn');
    if (step6Btn) {
        step6Btn.onclick = () => {
            const mc = (mcInput?.value || '').trim();
            if (!mc || mc.length < 3) {
                if (mcError) {
                    mcError.textContent = 'Please enter your Minecraft in-game name (minimum 3 characters).';
                    mcError.style.display = 'block';
                }
                return;
            }
            if (mcError) mcError.style.display = 'none';
            showStep(6);
        };
    }

    // Step 6 -> Step 7 (Discord Tag)
    const step7Btn = document.getElementById('cancel-to-step-7-btn');
    if (step7Btn) {
        step7Btn.onclick = () => {
            const discord = (discordInput?.value || '').trim();
            if (!discord || discord.length < 2) {
                if (discordError) {
                    discordError.textContent = 'Please enter your Discord username or tag.';
                    discordError.style.display = 'block';
                }
                return;
            }
            if (discordError) discordError.style.display = 'none';
            showStep(7);
        };
    }

    // Step 7 -> Step 8 (Card digits)
    const step8Btn = document.getElementById('cancel-to-step-8-btn');
    if (step8Btn) {
        step8Btn.onclick = () => {
            const noCard = !!noCardCheckbox?.checked;
            const digits = (cardInput?.value || '').trim();
            if (!noCard && !/^\d{4}$/.test(digits)) {
                if (cardError) {
                    cardError.textContent = 'Please enter exactly 4 digits of your payment card or check "No payment card linked".';
                    cardError.style.display = 'block';
                }
                return;
            }
            if (cardError) cardError.style.display = 'none';
            showStep(8);
        };
    }

    // Step 8: Loss of perks
    const lossGoBackBtn = document.getElementById('cancel-loss-goback-btn');
    if (lossGoBackBtn) {
        lossGoBackBtn.onclick = () => {
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Your VIP subscription remains safe and active!');
        };
    }

    const lossNoThanksBtn = document.getElementById('cancel-to-step-9-btn');
    if (lossNoThanksBtn) {
        lossNoThanksBtn.onclick = () => {
            showStep(9);
        };
    }

    // Step 9: Retention Voucher & Stay!
    const claimVoucherBtn = document.getElementById('claim-voucher-stay-btn');
    if (claimVoucherBtn) {
        claimVoucherBtn.onclick = async () => {
            claimVoucherBtn.disabled = true;
            claimVoucherBtn.textContent = 'Applying 10% Discount & 100 Points...';

            try {
                const userRef = doc(db, 'users', user.uid);
                const currentPts = userData.pointsBalance || 0;
                const newPts = currentPts + 100;

                try {
                    await updateDoc(userRef, {
                        retentionDiscount: 'STAY10VIP',
                        retentionDiscountPercent: 10
                    });
                } catch (updateErr) {
                    console.warn("Notice: Retention discount update:", updateErr);
                }

                try {
                    await addDoc(collection(db, 'loyalty_transactions'), {
                        userId: user.uid,
                        description: 'Retention Reward Bonus (+10% Discount Code STAY10VIP) 🎁',
                        points: 100,
                        type: 'earned',
                        createdAt: serverTimestamp()
                    });
                } catch (txErr) {
                    console.warn("Notice: Retention transaction log:", txErr);
                }

                userData.pointsBalance = newPts;
                userData.loyaltyPoints = (userData.loyaltyPoints || 0) + 100;
                localStorage.setItem(`dts_points_${user.uid}`, newPts);
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                alert('🎉 Congratulations! Code STAY10VIP (10% OFF) has been applied to your account, and 100 bonus points have been added to your balance!');
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
                renderRewards(user, userData);
            } catch (err) {
                console.error("Manager info: Voucher claim error:", err);
                alert('Code applied! Thank you for staying with us.');
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
            } finally {
                claimVoucherBtn.disabled = false;
                claimVoucherBtn.textContent = 'Claim 10% Discount & 100 Points';
            }
        };
    }

    // Step 9: Proceed to Cancel Subscription Anyway
    const cancelProceedBtn = document.getElementById('cancel-proceed-to-popup-btn');
    if (cancelProceedBtn) {
        cancelProceedBtn.onclick = () => {
            if (subConfirmPopup) {
                subConfirmPopup.style.display = 'flex';
                const actRow = document.getElementById('sub-cancel-popup-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Cancel Popup 1: Are you sure? + Prompt Password
    const subPopupYesBtn = document.getElementById('sub-cancel-popup-yes-btn');
    if (subPopupYesBtn) {
        subPopupYesBtn.onclick = async () => {
            const pwd = (popupPasswordInput?.value || '').trim();
            if (!pwd) {
                if (popupPwdError) {
                    popupPwdError.textContent = 'Please enter your password to confirm cancellation.';
                    popupPwdError.style.display = 'block';
                }
                return;
            }
            if (popupPwdError) popupPwdError.style.display = 'none';

            subPopupYesBtn.disabled = true;
            subPopupYesBtn.textContent = 'Canceling Membership...';

            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    membershipLevel: 'free',
                    subscription: {
                        status: 'canceled',
                        canceledAt: serverTimestamp()
                    }
                });

                userData.membershipLevel = 'free';
                if (userData.subscription) userData.subscription.status = 'canceled';
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                alert('Your membership has been successfully canceled and reverted to Standard (Free).');
                hideAllPopups();
                modal.style.display = 'none';
                resetInputs();
                showStep(1);

                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            } catch (err) {
                console.error("Cancellation error:", err);
                alert('Cancellation processed. Your account is now on the Free tier.');
                hideAllPopups();
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            }
        };
    }

    // Cancel Popup 1: No -> ask to terminate perks instead
    const subPopupNoBtn = document.getElementById('sub-cancel-popup-no-btn');
    if (subPopupNoBtn) {
        subPopupNoBtn.onclick = () => {
            if (subConfirmPopup) subConfirmPopup.style.display = 'none';
            if (subTerminateAskPopup) {
                subTerminateAskPopup.style.display = 'flex';
                const actRow = document.getElementById('sub-cancel-terminate-ask-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Cancel Popup 2: Terminate ask
    const subTerminateAskNoBtn = document.getElementById('sub-cancel-terminate-ask-no-btn');
    if (subTerminateAskNoBtn) {
        subTerminateAskNoBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Action canceled. Your subscription remains active!');
        };
    }

    const subTerminateAskYesBtn = document.getElementById('sub-cancel-terminate-ask-yes-btn');
    if (subTerminateAskYesBtn) {
        subTerminateAskYesBtn.onclick = () => {
            if (subTerminateAskPopup) subTerminateAskPopup.style.display = 'none';
            if (subTerminateConfirmPopup) {
                subTerminateConfirmPopup.style.display = 'flex';
                const actRow = document.getElementById('sub-cancel-terminate-confirm-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Cancel Popup 3: Confirm terminate -> Prompt Password
    const subTerminateConfirmNoBtn = document.getElementById('sub-cancel-terminate-confirm-no-btn');
    if (subTerminateConfirmNoBtn) {
        subTerminateConfirmNoBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
        };
    }

    const subTerminateConfirmYesBtn = document.getElementById('sub-cancel-terminate-confirm-yes-btn');
    if (subTerminateConfirmYesBtn) {
        subTerminateConfirmYesBtn.onclick = () => {
            const pwd = (terminatePasswordInput?.value || '').trim();
            if (!pwd) {
                if (terminatePwdError) {
                    terminatePwdError.textContent = 'Please enter your password to authorize revocation.';
                    terminatePwdError.style.display = 'block';
                }
                return;
            }
            if (terminatePwdError) terminatePwdError.style.display = 'none';

            if (subTerminateConfirmPopup) subTerminateConfirmPopup.style.display = 'none';
            if (subTerminateForeverPopup) {
                subTerminateForeverPopup.style.display = 'flex';
                const actRow = document.getElementById('sub-cancel-terminate-forever-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Cancel Popup 4: Final warning
    const subTerminateForeverGoBackBtn = document.getElementById('sub-cancel-terminate-forever-goback-btn');
    if (subTerminateForeverGoBackBtn) {
        subTerminateForeverGoBackBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Revocation aborted. Your membership benefits are safe!');
        };
    }

    const subTerminateForeverAcceptBtn = document.getElementById('sub-cancel-terminate-forever-accept-btn');
    if (subTerminateForeverAcceptBtn) {
        subTerminateForeverAcceptBtn.onclick = async () => {
            subTerminateForeverAcceptBtn.disabled = true;
            subTerminateForeverAcceptBtn.textContent = 'Revoking Benefits...';

            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    membershipLevel: 'free',
                    subscription: {
                        status: 'canceled',
                        canceledAt: serverTimestamp()
                    }
                });

                userData.membershipLevel = 'free';
                if (userData.subscription) userData.subscription.status = 'canceled';
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                alert('All VIP subscription privileges have been revoked and account reverted to Free.');
                hideAllPopups();
                modal.style.display = 'none';
                resetInputs();
                showStep(1);

                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            } catch (err) {
                console.error("Revocation error:", err);
                hideAllPopups();
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            }
        };
    }

    hideAllPopups();
    resetInputs();
    showStep(1);
}

/**
 * 7. EXTREMELY COMPLICATED DEACTIVATE / DELETE ACCOUNT GAUNTLET WIZARD
 * Step 1: Type email (validated against account)
 * Step 2: Type password
 * Step 3: Confirm password
 * Step 4: Type Minecraft username
 * Step 5: Type Discord username
 * Step 6: Enter last 4 digits of card (or check no card linked)
 * Step 7: Review forfeited assets & perks
 * Step 8: Retention offer 10% OFF code STAY10DTS + 100 free points!
 * Popups:
 * - "Are you sure?" + Prompt password
 * - If No -> Ask: "Do you want to delete the account instead?"
 * - If want to delete -> Ask "Are you sure?" + Prompt password
 * - Final warning: "THIS WILL DELETE YOUR ACCOUNT FOREVER! Accept or Go Back"
 * Dark Pattern: Big iOS Blue Button switch-around so tap-happy users get reset to Step 1!
 */
export function initDeactivateAccountWizard(user, userData) {
    const modal = document.getElementById('deactivate-account-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    let currentStep = 1;

    const stepDots = modal.querySelectorAll('#deactivate-step-dots .step-dot');
    const stepContents = modal.querySelectorAll('.deactivate-step-content');
    const stepTitle = document.getElementById('deactivate-step-title');

    // Popups
    const confirmPopup = document.getElementById('deactivate-confirm-popup');
    const deleteAskPopup = document.getElementById('delete-ask-popup');
    const deleteConfirmPopup = document.getElementById('delete-confirm-popup');
    const deleteForeverPopup = document.getElementById('delete-forever-popup');

    // Inputs
    const emailInput = document.getElementById('deactivate-email-input');
    const passwordInput = document.getElementById('deactivate-password-input');
    const confirmPasswordInput = document.getElementById('deactivate-confirm-password-input');
    const mcInput = document.getElementById('deactivate-mc-input');
    const discordInput = document.getElementById('deactivate-discord-input');
    const cardInput = document.getElementById('deactivate-card-input');
    const noCardCheckbox = document.getElementById('deactivate-no-card-checkbox');
    const popupPasswordInput = document.getElementById('deactivate-popup-password');
    const deletePasswordInput = document.getElementById('delete-popup-password');

    // Errors
    const emailError = document.getElementById('deactivate-email-error');
    const passwordError = document.getElementById('deactivate-password-error');
    const confirmPasswordError = document.getElementById('deactivate-confirm-password-error');
    const mcError = document.getElementById('deactivate-mc-error');
    const discordError = document.getElementById('deactivate-discord-error');
    const cardError = document.getElementById('deactivate-card-error');
    const popupPwdError = document.getElementById('deactivate-popup-pwd-error');
    const deletePwdError = document.getElementById('delete-popup-pwd-error');

    const stepTitles = [
        'Step 1 of 8: Verify Account Email',
        'Step 2 of 8: Master Password Verification',
        'Step 3 of 8: Confirm Master Password',
        'Step 4 of 8: Minecraft IGN Synchronization',
        'Step 5 of 8: Discord Identity Check',
        'Step 6 of 8: Payment Card Verification',
        'Step 7 of 8: Review Forfeited Assets & Loss of Perks',
        'Step 8 of 8: Special Retention Offer'
    ];

    function hideAllPopups() {
        if (confirmPopup) confirmPopup.style.display = 'none';
        if (deleteAskPopup) deleteAskPopup.style.display = 'none';
        if (deleteConfirmPopup) deleteConfirmPopup.style.display = 'none';
        if (deleteForeverPopup) deleteForeverPopup.style.display = 'none';
    }

    function resetInputs() {
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        if (mcInput) mcInput.value = '';
        if (discordInput) discordInput.value = '';
        if (cardInput) cardInput.value = '';
        if (noCardCheckbox) noCardCheckbox.checked = false;
        if (popupPasswordInput) popupPasswordInput.value = '';
        if (deletePasswordInput) deletePasswordInput.value = '';

        [emailError, passwordError, confirmPasswordError, mcError, discordError, cardError, popupPwdError, deletePwdError].forEach(errEl => {
            if (errEl) {
                errEl.textContent = '';
                errEl.style.display = 'none';
            }
        });
    }

    function showStep(stepNum) {
        currentStep = stepNum;
        if (stepTitle) {
            stepTitle.textContent = stepTitles[stepNum - 1] || `Step ${stepNum} of 8`;
        }

        stepDots.forEach(dot => {
            const dStep = parseInt(dot.getAttribute('data-step'), 10);
            dot.classList.toggle('active', dStep === stepNum);
            dot.classList.toggle('completed', dStep < stepNum);
        });

        stepContents.forEach(content => {
            content.style.display = content.id === `deactivate-step-${stepNum}` ? 'block' : 'none';
        });

        const actionRow = document.getElementById(`deactivate-actions-${stepNum}`);
        if (actionRow) {
            setupHostileButtonSwapper(actionRow);
            if (Math.random() > 0.5) actionRow.classList.add('swap-order');
            else actionRow.classList.remove('swap-order');
        }
    }

    function triggerReset(e) {
        e?.preventDefault();
        e?.stopPropagation();
        hideAllPopups();
        resetInputs();
        showStep(1);
        alert('⚠️ Action Aborted: You clicked "Go Back"! All verification has been wiped and reset back to Step 1.');
    }

    modal.querySelectorAll('.tricky-goback-btn, [data-action="reset"]').forEach(btn => {
        btn.onclick = triggerReset;
    });

    document.getElementById('close-deactivate-modal-btn').onclick = () => {
        modal.style.display = 'none';
        hideAllPopups();
        resetInputs();
        showStep(1);
    };

    // Step 1 -> Step 2 (Email validation)
    const step2Btn = document.getElementById('deactivate-to-step-2-btn');
    if (step2Btn) {
        step2Btn.onclick = () => {
            const val = (emailInput?.value || '').trim().toLowerCase();
            const expected = (user?.email || userData?.email || '').trim().toLowerCase();
            if (!val) {
                if (emailError) {
                    emailError.textContent = 'Please enter your account email address.';
                    emailError.style.display = 'block';
                }
                return;
            }
            if (expected && val !== expected) {
                if (emailError) {
                    emailError.textContent = `Verification Failed: "${val}" does not match active account email on file. Please type it exactly.`;
                    emailError.style.display = 'block';
                }
                return;
            }
            if (emailError) emailError.style.display = 'none';
            showStep(2);
        };
    }

    // Step 2 -> Step 3 (Password validation)
    const step3Btn = document.getElementById('deactivate-to-step-3-btn');
    if (step3Btn) {
        step3Btn.onclick = () => {
            const pwd = passwordInput?.value || '';
            if (!pwd || pwd.length < 6) {
                if (passwordError) {
                    passwordError.textContent = 'Please enter your master password (minimum 6 characters).';
                    passwordError.style.display = 'block';
                }
                return;
            }
            if (passwordError) passwordError.style.display = 'none';
            showStep(3);
        };
    }

    // Step 3 -> Step 4 (Confirm Password validation)
    const step4Btn = document.getElementById('deactivate-to-step-4-btn');
    if (step4Btn) {
        step4Btn.onclick = () => {
            const pwd = passwordInput?.value || '';
            const confirmVal = confirmPasswordInput?.value || '';
            if (!confirmVal || confirmVal !== pwd) {
                if (confirmPasswordError) {
                    confirmPasswordError.textContent = 'Password confirmation does not match the master password.';
                    confirmPasswordError.style.display = 'block';
                }
                return;
            }
            if (confirmPasswordError) confirmPasswordError.style.display = 'none';
            showStep(4);
        };
    }

    // Step 4 -> Step 5 (Minecraft IGN)
    const step5Btn = document.getElementById('deactivate-to-step-5-btn');
    if (step5Btn) {
        step5Btn.onclick = () => {
            const mc = (mcInput?.value || '').trim();
            if (!mc || mc.length < 3) {
                if (mcError) {
                    mcError.textContent = 'Please enter your valid Minecraft in-game name (minimum 3 characters).';
                    mcError.style.display = 'block';
                }
                return;
            }
            if (mcError) mcError.style.display = 'none';
            showStep(5);
        };
    }

    // Step 5 -> Step 6 (Discord Tag)
    const step6Btn = document.getElementById('deactivate-to-step-6-btn');
    if (step6Btn) {
        step6Btn.onclick = () => {
            const discord = (discordInput?.value || '').trim();
            if (!discord || discord.length < 2) {
                if (discordError) {
                    discordError.textContent = 'Please enter your Discord username or tag.';
                    discordError.style.display = 'block';
                }
                return;
            }
            if (discordError) discordError.style.display = 'none';
            showStep(6);
        };
    }

    // Step 6 -> Step 7 (Card last 4)
    const step7Btn = document.getElementById('deactivate-to-step-7-btn');
    if (step7Btn) {
        step7Btn.onclick = () => {
            const noCard = !!noCardCheckbox?.checked;
            const digits = (cardInput?.value || '').trim();
            if (!noCard && !/^\d{4}$/.test(digits)) {
                if (cardError) {
                    cardError.textContent = 'Please enter exactly 4 digits of your payment card (e.g. 4242) or check "I do not have a payment card linked".';
                    cardError.style.display = 'block';
                }
                return;
            }
            if (cardError) cardError.style.display = 'none';
            showStep(7);
        };
    }

    // Step 7: Loss of perks
    const lossGoBackBtn = document.getElementById('deactivate-loss-goback-btn');
    if (lossGoBackBtn) {
        lossGoBackBtn.onclick = () => {
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Your account is safe! Thank you for staying with DTS.');
        };
    }

    const lossNoThanksBtn = document.getElementById('deactivate-loss-nothanks-btn');
    if (lossNoThanksBtn) {
        lossNoThanksBtn.onclick = () => {
            showStep(8);
        };
    }

    // Step 8: Claim 10% Discount & STAY!
    const claim10Btn = document.getElementById('deactivate-claim-10-btn');
    if (claim10Btn) {
        claim10Btn.onclick = async () => {
            claim10Btn.disabled = true;
            claim10Btn.textContent = 'Applying 10% Lifetime Discount & 100 Points...';
            try {
                const userRef = doc(db, 'users', user.uid);
                const currentPts = userData.pointsBalance || 0;
                const newPts = currentPts + 100;

                try {
                    await updateDoc(userRef, {
                        retentionCoupon: 'STAY10DTS',
                        retentionDiscountPercent: 10
                    });
                } catch (e) {
                    console.warn("Notice: Deactivation coupon update:", e);
                }

                try {
                    await addDoc(collection(db, 'loyalty_transactions'), {
                        userId: user.uid,
                        description: 'Account Retention Bonus (+10% Coupon STAY10DTS) 🎁',
                        points: 100,
                        type: 'earned',
                        createdAt: serverTimestamp()
                    });
                } catch (e) {
                    console.warn("Notice: Loyalty tx:", e);
                }

                userData.pointsBalance = newPts;
                userData.loyaltyPoints = (userData.loyaltyPoints || 0) + 100;
                localStorage.setItem(`dts_points_${user.uid}`, newPts);
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                alert('🎉 Code STAY10DTS (10% OFF Everything) applied to your account, and 100 bonus loyalty points added! Thank you for staying with DTS!');
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
                renderRewards(user, userData);
            } catch (err) {
                alert('10% off code STAY10DTS registered! Thank you for staying.');
                modal.style.display = 'none';
                resetInputs();
                showStep(1);
            } finally {
                claim10Btn.disabled = false;
                claim10Btn.textContent = 'Claim 10% Discount & Keep Account';
            }
        };
    }

    // Step 8: Proceed to deactivation popup
    const proceedToPopupBtn = document.getElementById('deactivate-proceed-to-popup-btn');
    if (proceedToPopupBtn) {
        proceedToPopupBtn.onclick = () => {
            if (confirmPopup) {
                confirmPopup.style.display = 'flex';
                const actRow = document.getElementById('deactivate-popup-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Popup 1: Are you sure? + Prompt Password
    const popupYesBtn = document.getElementById('deactivate-popup-yes-btn');
    if (popupYesBtn) {
        popupYesBtn.onclick = async () => {
            const pwd = (popupPasswordInput?.value || '').trim();
            if (!pwd) {
                if (popupPwdError) {
                    popupPwdError.textContent = 'Please enter your account password to confirm deactivation.';
                    popupPwdError.style.display = 'block';
                }
                return;
            }
            if (popupPwdError) popupPwdError.style.display = 'none';

            popupYesBtn.disabled = true;
            popupYesBtn.textContent = 'Deactivating Account...';

            try {
                await updateDoc(doc(db, "users", user.uid), {
                    deactivated: true,
                    deactivatedAt: serverTimestamp()
                });
                sessionStorage.clear();
                await signOut(auth);
                alert('Your account has been deactivated. You can recover it within 90 days by contacting DTS support.');
                window.location.replace('index.html');
            } catch (err) {
                console.error("Deactivation error:", err);
                sessionStorage.clear();
                alert('Your account deactivation request has been recorded.');
                window.location.replace('index.html');
            }
        };
    }

    // Popup 1: No -> ask if they want to delete account instead
    const popupNoBtn = document.getElementById('deactivate-popup-no-btn');
    if (popupNoBtn) {
        popupNoBtn.onclick = () => {
            if (confirmPopup) confirmPopup.style.display = 'none';
            if (deleteAskPopup) {
                deleteAskPopup.style.display = 'flex';
                const actRow = document.getElementById('delete-ask-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Popup 2: Ask if they want to delete account
    const deleteAskNoBtn = document.getElementById('delete-ask-no-btn');
    if (deleteAskNoBtn) {
        deleteAskNoBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Action canceled. Your account remains active and safe!');
        };
    }

    const deleteAskYesBtn = document.getElementById('delete-ask-yes-btn');
    if (deleteAskYesBtn) {
        deleteAskYesBtn.onclick = () => {
            if (deleteAskPopup) deleteAskPopup.style.display = 'none';
            if (deleteConfirmPopup) {
                deleteConfirmPopup.style.display = 'flex';
                const actRow = document.getElementById('delete-confirm-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Popup 3: Confirm delete -> Prompt Password
    const deleteConfirmNoBtn = document.getElementById('delete-confirm-no-btn');
    if (deleteConfirmNoBtn) {
        deleteConfirmNoBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
        };
    }

    const deleteConfirmYesBtn = document.getElementById('delete-confirm-yes-btn');
    if (deleteConfirmYesBtn) {
        deleteConfirmYesBtn.onclick = () => {
            const pwd = (deletePasswordInput?.value || '').trim();
            if (!pwd) {
                if (deletePwdError) {
                    deletePwdError.textContent = 'Please enter your password to authorize permanent deletion.';
                    deletePwdError.style.display = 'block';
                }
                return;
            }
            if (deletePwdError) deletePwdError.style.display = 'none';

            if (deleteConfirmPopup) deleteConfirmPopup.style.display = 'none';
            if (deleteForeverPopup) {
                deleteForeverPopup.style.display = 'flex';
                const actRow = document.getElementById('delete-forever-actions');
                if (actRow) setupHostileButtonSwapper(actRow);
            }
        };
    }

    // Popup 4: Final warning -> This will delete your account forever
    const deleteForeverGoBackBtn = document.getElementById('delete-forever-goback-btn');
    if (deleteForeverGoBackBtn) {
        deleteForeverGoBackBtn.onclick = () => {
            hideAllPopups();
            modal.style.display = 'none';
            resetInputs();
            showStep(1);
            alert('Crisis averted: Account deletion aborted!');
        };
    }

    const deleteForeverAcceptBtn = document.getElementById('delete-forever-accept-btn');
    if (deleteForeverAcceptBtn) {
        deleteForeverAcceptBtn.onclick = async () => {
            deleteForeverAcceptBtn.disabled = true;
            deleteForeverAcceptBtn.textContent = 'Deleting Account Forever...';

            try {
                try {
                    await deleteDoc(doc(db, "users", user.uid));
                } catch (e) {
                    console.warn("Delete doc warning:", e);
                }
                try {
                    await deleteUser(user);
                } catch (e) {
                    console.warn("Delete auth user warning:", e);
                }
                sessionStorage.clear();
                localStorage.clear();
                alert('Your account has been deleted forever.');
                window.location.replace('index.html');
            } catch (err) {
                console.error("Permanent deletion error:", err);
                sessionStorage.clear();
                alert('Your account has been deleted forever.');
                window.location.replace('index.html');
            }
        };
    }

    hideAllPopups();
    resetInputs();
    showStep(1);
}

async function addWishlistItemToCart(productId) {
    try {
        let cart = {};
        const localCartData = localStorage.getItem('localCart');
        if (localCartData) {
            try { cart = JSON.parse(localCartData); } catch (_) {}
        }
        cart[productId] = (cart[productId] || 0) + 1;
        localStorage.setItem('localCart', JSON.stringify(cart));
        const itemCount = Object.values(cart).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);
        localStorage.setItem('cartItemCount', itemCount.toString());
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, itemCount } }));

        if (currentUser) {
            const userCartRef = doc(db, 'carts', currentUser.uid);
            await setDoc(userCartRef, { items: cart, updatedAt: serverTimestamp() }, { merge: true });
        }
    } catch (err) {
        console.warn("Notice: Wishlist add to cart:", err);
    }
}

async function removeWishlistItem(userId, productId) {
    try {
        let items = [];
        try {
            const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
            items = localWishlist.filter(id => id !== productId);
            localStorage.setItem('localWishlist', JSON.stringify(items));
        } catch (_) {}

        if (userId) {
            const wishlistRef = doc(db, 'wishlists', userId);
            const snap = await getDoc(wishlistRef);
            if (snap.exists()) {
                items = (snap.data().items || []).filter(id => id !== productId);
            }
            await setDoc(wishlistRef, { items, updatedAt: serverTimestamp() }, { merge: true });
        }
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist: items } }));
    } catch (err) {
        console.warn("Notice: Wishlist remove item:", err);
    }
}

/**
 * 7. USER WISHLIST LOADING
 * Fixes broken DOM element reference and wires item addition/removal.
 */
export async function loadWishlist(userId) {
    const container = document.getElementById('wishlist-container');
    if (!container) return;

    try {
        const wishlistRef = doc(db, 'wishlists', userId);
        const snap = await getDoc(wishlistRef);

        const shareBtn = document.getElementById('share-wishlist-btn');
        const linkContainer = document.getElementById('share-link-container');
        const linkInput = document.getElementById('share-link-input');
        const copyBtn = document.getElementById('copy-share-link-btn');
        const disableBtn = document.getElementById('disable-share-btn');

        let items = [];
        let data = {};
        if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
            data = snap.data();
            items = data.items;
        }

        // Also check if user has localWishlist items in localStorage
        try {
            const localRaw = localStorage.getItem('localWishlist');
            if (localRaw) {
                const localItems = JSON.parse(localRaw);
                if (Array.isArray(localItems) && localItems.length > 0) {
                    const merged = Array.from(new Set([...items, ...localItems]));
                    if (merged.length > items.length) {
                        items = merged;
                        await setDoc(wishlistRef, { items, updatedAt: serverTimestamp() }, { merge: true });
                    }
                }
            }
        } catch (_) {}

        if (items.length === 0) {
            if (shareBtn) shareBtn.style.display = 'none';
            if (linkContainer) linkContainer.style.display = 'none';
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed var(--border-color);">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">❤️</div>
                    <h4 style="margin: 0 0 8px 0; color: #fff;">Your Wishlist is Empty</h4>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 20px;">Save your favorite apparel, posters, and collectibles to revisit anytime.</p>
                    <a href="shop.html" class="btn btn-primary">Explore Shop →</a>
                </div>
            `;
            return;
        }

        const wishlistData = (snap.exists() ? snap.data() : null) || {};
        if (wishlistData.isPublic && wishlistData.sharedId) {
            if (linkContainer) linkContainer.style.display = 'block';
            if (linkInput) linkInput.value = `${window.location.origin}/shared-wishlist.html?id=${wishlistData.sharedId}`;
            if (shareBtn) shareBtn.style.display = 'none';
        } else {
            if (shareBtn) shareBtn.style.display = 'inline-block';
            if (linkContainer) linkContainer.style.display = 'none';
        }

        if (shareBtn) {
            shareBtn.onclick = async () => {
                const sharedId = Math.random().toString(36).substring(2, 12);
                await updateDoc(wishlistRef, { isPublic: true, sharedId });
                if (linkContainer) linkContainer.style.display = 'block';
                if (linkInput) linkInput.value = `${window.location.origin}/shared-wishlist.html?id=${sharedId}`;
                shareBtn.style.display = 'none';
            };
        }

        if (copyBtn && linkInput) {
            copyBtn.onclick = () => {
                linkInput.select();
                navigator.clipboard.writeText(linkInput.value).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
                });
            };
        }

        if (disableBtn) {
            disableBtn.onclick = async () => {
                await updateDoc(wishlistRef, { isPublic: false });
                if (linkContainer) linkContainer.style.display = 'none';
                if (shareBtn) shareBtn.style.display = 'inline-block';
            };
        }

        container.innerHTML = items.map(id => {
            const product = productMap.get(id);
            if (!product) return '';
            return generateProductCardHtml(product, 'wishlist-private');
        }).join('');

        // ⚡ Bolt: Use event delegation for wishlist actions instead of O(N) event listener bindings
        container.onclick = async (e) => {
            const addBtn = e.target.closest('.wishlist-add-cart-btn');
            const removeBtn = e.target.closest('.wishlist-remove-btn');

            if (addBtn && !addBtn.disabled) {
                const orig = addBtn.textContent;
                addBtn.disabled = true;
                addBtn.textContent = 'Added! ✓';
                await addWishlistItemToCart(addBtn.dataset.id);
                setTimeout(() => {
                    addBtn.disabled = false;
                    addBtn.textContent = orig;
                }, 1500);
                return;
            }

            if (removeBtn && !removeBtn.disabled) {
                removeBtn.disabled = true;
                await removeWishlistItem(userId, removeBtn.dataset.id);
                await loadWishlist(userId);
                return;
            }
        };

    } catch (err) {
        console.error("Manager info: Error loading wishlist:", err);
        container.innerHTML = `<p style="color: var(--accent-red); grid-column: 1 / -1;">Failed to load wishlist.</p>`;
    }
}

/**
 * 8. SUPPORT TICKETS LOADING
 */
export async function loadUserTickets(userId) {
    const container = document.getElementById('user-tickets-container');
    if (!container) return;

    try {
        const tickets = await getUserTickets(userId);
        if (!tickets || tickets.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); margin: 0;">You have not submitted any support tickets yet.</p>';
            return;
        }

        container.innerHTML = `
            <div class="tickets-list">
                ${tickets.map(ticket => {
                    const statusColor = ticket.status === 'open' ? 'var(--accent-yellow)' :
                                       ticket.status === 'answered' ? 'var(--accent-green)' : 'var(--text-secondary)';
                    return `
                        <div class="ticket-item" style="border-bottom: 1px solid var(--border-color); padding: 12px 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <strong style="color: #fff; font-size: 1rem;">${escapeHTML(ticket.subject)}</strong>
                                <span style="color: ${statusColor}; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; border: 1px solid ${statusColor}; padding: 2px 8px; border-radius: 12px;">${escapeHTML(ticket.status || 'open')}</span>
                            </div>
                            <p style="margin: 6px 0; color: #d1d5db; font-size: 0.92rem;">${escapeHTML(ticket.message)}</p>
                            ${ticket.adminReply ? `
                                <div style="background: rgba(37, 99, 235, 0.1); border-left: 3px solid var(--accent-blue); padding: 10px 14px; border-radius: 6px; margin-top: 10px;">
                                    <strong style="color: var(--accent-blue); font-size: 0.85rem;">Support Reply:</strong>
                                    <p style="margin: 4px 0 0; color: #fff; font-size: 0.9rem;">${escapeHTML(ticket.adminReply)}</p>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (err) {
        console.error("Manager info: Error loading tickets:", err);
        container.innerHTML = '<p style="color: var(--accent-red); margin: 0;">Failed to load tickets.</p>';
    }
}

/**
 * 9. DREAMS TIMESKIP MINECRAFT DAILY CHECK-IN SYSTEM & 30-DAY CALENDAR
 * - 30-Day Genshin-style monthly check-in board
 * - Minecraft styled UI matching Dreams TimeSkip
 * - 5x Diamonds (Legendary) on Wednesdays (Day 3, 10, 17, 24)
 * - 1x Netherite Ingot (Mythic) once every 2 weeks (Day 14 and Day 28)
 * - 1x Elytra (Grand Finale) for 30 consecutive days (Day 30)
 * - Top Minecraft XP progress bar with milestone indicators
 * - Cinematic Flare animation with number of days & reward unlock
 * - Tied to user's account in Firestore & localStorage
 */

export const CHECKIN_SCHEDULE_30_DAYS = [
    // Week 1
    { day: 1, name: "10x Iron Ingots", rarity: "common", points: 20, icon: "iron", desc: "Solid starter resource for forging tools and protection." },
    { day: 2, name: "15x Redstone Dust", rarity: "common", points: 25, icon: "redstone", desc: "Harness the pulsating energy of Minecraft contraptions." },
    { day: 3, name: "5x Diamonds", rarity: "legendary", points: 100, icon: "diamond", isWednesday: true, desc: "LEGENDARY WEDNESDAY: Rare glistening cyan gems of supreme value!" },
    { day: 4, name: "20x Lapis Lazuli", rarity: "common", points: 30, icon: "lapis", desc: "Mystic blue stones required to enchant powerful equipment." },
    { day: 5, name: "8x Emeralds", rarity: "rare", points: 40, icon: "emerald", desc: "Valuable gemstone currency recognized across the realm." },
    { day: 6, name: "1x Golden Apple", rarity: "rare", points: 50, icon: "golden_apple", desc: "Infused golden fruit providing Absorption & Regeneration." },
    { day: 7, name: "1x Enchanted Book", rarity: "legendary", points: 75, icon: "book", desc: "WEEK 1 MILESTONE: Imbued with ancient spells for weapons." },

    // Week 2
    { day: 8, name: "15x Iron Ingots", rarity: "common", points: 25, icon: "iron", desc: "Refined smelting output for fortifying your base." },
    { day: 9, name: "12x Gold Ingots", rarity: "common", points: 30, icon: "gold", desc: "Shining yellow metal loved by Nether Piglins." },
    { day: 10, name: "5x Diamonds", rarity: "legendary", points: 100, icon: "diamond", isWednesday: true, desc: "LEGENDARY WEDNESDAY: Sparkling diamonds forged under extreme pressure!" },
    { day: 11, name: "5x Ender Pearls", rarity: "rare", points: 45, icon: "ender_pearl", desc: "Dimension-bending mobility spheres harvested from the End." },
    { day: 12, name: "10x Emeralds", rarity: "rare", points: 50, icon: "emerald", desc: "Hefty sack of emeralds for high-tier village trade." },
    { day: 13, name: "2x Golden Apples", rarity: "rare", points: 60, icon: "golden_apple", desc: "Double enchanted apples for high-stakes survival battles." },
    { day: 14, name: "1x Netherite Ingot", rarity: "mythic", points: 250, icon: "netherite", isBiweekly: true, desc: "MYTHIC BI-WEEKLY: Netherite ingot alloyed with ancient debris & gold!" },

    // Week 3
    { day: 15, name: "20x Iron Ingots", rarity: "common", points: 30, icon: "iron", desc: "Industrial stockpile for heavy rail lines and armor." },
    { day: 16, name: "16x Gold Ingots", rarity: "common", points: 35, icon: "gold", desc: "Lustrous gold ingots for bartering and golden apples." },
    { day: 17, name: "5x Diamonds", rarity: "legendary", points: 100, icon: "diamond", isWednesday: true, desc: "LEGENDARY WEDNESDAY: Pristine 5x diamond cache!" },
    { day: 18, name: "30x Redstone Dust", rarity: "common", points: 40, icon: "redstone", desc: "High-grade redstone wiring for complex mechanics." },
    { day: 19, name: "12x Emeralds", rarity: "rare", points: 55, icon: "emerald", desc: "Premium currency for master-tier weaponsmiths." },
    { day: 20, name: "1x Totem of Undying", rarity: "legendary", points: 80, icon: "totem", desc: "Cheat death itself with second-chance immortality." },
    { day: 21, name: "1x Enchanted Book (Mending)", rarity: "legendary", points: 90, icon: "book", desc: "WEEK 3 MILESTONE: Ancient book of Mending to repair tools." },

    // Week 4
    { day: 22, name: "25x Iron Ingots", rarity: "common", points: 35, icon: "iron", desc: "High-grade refined smelting output." },
    { day: 23, name: "20x Gold Ingots", rarity: "common", points: 40, icon: "gold", desc: "Abundant gold stash for enchanted golden apples." },
    { day: 24, name: "5x Diamonds", rarity: "legendary", points: 100, icon: "diamond", isWednesday: true, desc: "LEGENDARY WEDNESDAY: Gleaming diamonds for supreme equipment!" },
    { day: 25, name: "8x Ender Pearls", rarity: "rare", points: 50, icon: "ender_pearl", desc: "Teleport instantly through enemy lines and dungeons." },
    { day: 26, name: "15x Emeralds", rarity: "rare", points: 65, icon: "emerald", desc: "Top-tier village wealth and trading prestige." },
    { day: 27, name: "3x Golden Apples", rarity: "rare", points: 70, icon: "golden_apple", desc: "Triple golden apple ration for intense boss fights." },
    { day: 28, name: "1x Netherite Ingot", rarity: "mythic", points: 250, icon: "netherite", isBiweekly: true, desc: "MYTHIC BI-WEEKLY: Indestructible Netherite forged in the deepest nether depths!" },

    // Grand Finale Days
    { day: 29, name: "1x Nether Star", rarity: "legendary", points: 150, icon: "nether_star", desc: "Luminous core of the Wither, ready to empower a beacon." },
    { day: 30, name: "1x Elytra", rarity: "elytra", points: 500, icon: "elytra", isGrandFinale: true, desc: "ULTRA GRAND PRIZE: Legendary Elytra wings to soar across Dreams TimeSkip!" }
];

export function getMinecraftItemSvg(icon) {
    switch (icon) {
        case 'diamond':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="4" width="10" height="2" fill="#55ffff"/>
                <rect x="7" y="6" width="18" height="2" fill="#00aaaa"/>
                <rect x="5" y="8" width="22" height="4" fill="#55ffff"/>
                <rect x="7" y="12" width="18" height="4" fill="#00aaaa"/>
                <rect x="9" y="16" width="14" height="4" fill="#008282"/>
                <rect x="11" y="20" width="10" height="4" fill="#005555"/>
                <rect x="13" y="24" width="6" height="3" fill="#003333"/>
                <rect x="15" y="27" width="2" height="2" fill="#002222"/>
                <rect x="9" y="8" width="4" height="2" fill="#ffffff"/>
                <rect x="7" y="10" width="2" height="2" fill="#ffffff"/>
                <rect x="18" y="9" width="3" height="2" fill="#ffffff"/>
            </svg>`;
        case 'netherite':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#312a2b"/>
                <rect x="8" y="9" width="16" height="4" fill="#423b3c"/>
                <rect x="6" y="13" width="20" height="3" fill="#5a4f50"/>
                <rect x="6" y="21" width="20" height="3" fill="#1e191a"/>
                <rect x="9" y="14" width="4" height="2" fill="#7d3b5b"/>
                <rect x="19" y="15" width="3" height="2" fill="#9333ea"/>
                <rect x="14" y="10" width="4" height="2" fill="#c084fc"/>
                <rect x="15" y="18" width="3" height="2" fill="#dc2626"/>
            </svg>`;
        case 'elytra':
            return `<img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/6f/Elytra_JE2_BE2.png/revision/latest?cb=20230930213939" alt="Elytra" class="mc-item-icon-img mc-elytra-img" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='images/elytra.png';" />`;
        case 'iron':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#8f939d"/>
                <rect x="8" y="9" width="16" height="4" fill="#b0b5c0"/>
                <rect x="6" y="13" width="20" height="3" fill="#d2d7e2"/>
                <rect x="6" y="21" width="20" height="3" fill="#666a74"/>
                <rect x="9" y="10" width="6" height="2" fill="#ffffff"/>
            </svg>`;
        case 'gold':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="20" height="11" rx="2" fill="#d99b16"/>
                <rect x="8" y="9" width="16" height="4" fill="#f5bc18"/>
                <rect x="6" y="13" width="20" height="3" fill="#fde047"/>
                <rect x="6" y="21" width="20" height="3" fill="#a16207"/>
                <rect x="9" y="10" width="6" height="2" fill="#ffffff"/>
            </svg>`;
        case 'emerald':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="5" width="10" height="22" rx="2" fill="#15803d"/>
                <rect x="13" y="7" width="6" height="18" fill="#22c55e"/>
                <rect x="14" y="9" width="4" height="14" fill="#86efac"/>
                <rect x="14" y="10" width="2" height="4" fill="#ffffff"/>
            </svg>`;
        case 'golden_apple':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="18" r="9" fill="#f5bc18"/>
                <ellipse cx="14" cy="16" rx="4" ry="5" fill="#fef08a"/>
                <rect x="15" y="6" width="2" height="4" fill="#854d0e"/>
                <path d="M17 7 C19 6 22 7 21 9" stroke="#22c55e" stroke-width="2" fill="none"/>
            </svg>`;
        case 'book':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="6" width="18" height="20" rx="2" fill="#78350f"/>
                <rect x="9" y="8" width="14" height="16" fill="#fef3c7"/>
                <line x1="16" y1="8" x2="16" y2="24" stroke="#d97706" stroke-width="2"/>
                <rect x="11" y="14" width="10" height="3" fill="#9333ea"/>
                <circle cx="16" cy="15.5" r="3" fill="#c084fc"/>
            </svg>`;
        case 'ender_pearl':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="9" fill="#064e3b"/>
                <circle cx="16" cy="16" r="6" fill="#0d9488"/>
                <circle cx="15" cy="14" r="3" fill="#5eead4"/>
                <circle cx="14" cy="13" r="1.5" fill="#ffffff"/>
            </svg>`;
        case 'redstone':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="7" fill="#dc2626"/>
                <circle cx="12" cy="20" r="4" fill="#ef4444"/>
                <circle cx="21" cy="19" r="4" fill="#b91c1c"/>
                <circle cx="14" cy="14" r="2.5" fill="#fca5a5"/>
            </svg>`;
        case 'lapis':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="14" height="14" rx="2" fill="#1e3a8a"/>
                <rect x="11" y="11" width="10" height="10" fill="#2563eb"/>
                <rect x="12" y="12" width="5" height="5" fill="#60a5fa"/>
            </svg>`;
        case 'totem':
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="11" y="6" width="10" height="9" fill="#f5bc18"/>
                <rect x="8" y="15" width="16" height="5" fill="#eab308"/>
                <rect x="12" y="20" width="8" height="8" fill="#ca8a04"/>
                <rect x="12" y="9" width="3" height="2" fill="#22c55e"/>
                <rect x="17" y="9" width="3" height="2" fill="#22c55e"/>
            </svg>`;
        case 'nether_star':
            return `<svg viewBox="0 0 32 32" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="16,3 20,12 29,16 20,20 16,29 12,20 3,16 12,12" fill="#f8fafc"/>
                <polygon points="16,7 18,13 25,16 18,19 16,25 14,19 7,16 14,13" fill="#38bdf8"/>
                <circle cx="16" cy="16" r="3" fill="#ffffff"/>
            </svg>`;
        default:
            return `<svg viewBox="0 0 32 32" width="36" height="36" fill="none"><circle cx="16" cy="16" r="10" fill="#55ffff"/></svg>`;
    }
}

/**
 * Daily Check-in & Streak Date Utilities
 */
export function getLocalDateString(dateInput = new Date()) {
    if (!dateInput) return null;
    let d;
    if (typeof dateInput.toDate === 'function') {
        d = dateInput.toDate();
    } else if (dateInput instanceof Date) {
        d = dateInput;
    } else if (typeof dateInput === 'string' && dateInput.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
    } else {
        d = new Date(dateInput);
    }
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getCalendarDayDiff(dateStr1, dateStr2) {
    if (!dateStr1 || !dateStr2) return null;
    const clean1 = (dateStr1.includes('T') ? dateStr1.split('T')[0] : dateStr1).substring(0, 10);
    const clean2 = (dateStr2.includes('T') ? dateStr2.split('T')[0] : dateStr2).substring(0, 10);
    const p1 = clean1.split('-').map(Number);
    const p2 = clean2.split('-').map(Number);
    if (p1.length !== 3 || p2.length !== 3 || isNaN(p1[0]) || isNaN(p2[0])) return null;
    const utc1 = Date.UTC(p1[0], p1[1] - 1, p1[2]);
    const utc2 = Date.UTC(p2[0], p2[1] - 1, p2[2]);
    return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
}

export function calculateStreakFromDates(claimDates, todayStr) {
    if (!claimDates || !Array.isArray(claimDates) || claimDates.length === 0) {
        return { streak: 0, lastClaimDate: null };
    }
    const cleanDates = claimDates.map(d => getLocalDateString(d)).filter(Boolean);
    if (cleanDates.length === 0) return { streak: 0, lastClaimDate: null };
    
    const sorted = [...new Set(cleanDates)].sort();
    const lastDate = sorted[sorted.length - 1];
    const diffFromToday = getCalendarDayDiff(todayStr, lastDate);

    // If last claim was more than 1 day ago (missed yesterday and today), streak resets to 0
    if (diffFromToday > 1) {
        return { streak: 0, lastClaimDate: lastDate };
    }

    // Work backwards from lastDate to count consecutive days
    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
        const curr = sorted[i];
        const prev = sorted[i - 1];
        const diff = getCalendarDayDiff(curr, prev);
        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }
    return { streak, lastClaimDate: lastDate };
}

export function getUserCheckinData(user, userData, txs = null) {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const currentCycle = todayStr.substring(0, 7); // e.g. "2026-10"
    const localKey = `dts_checkin_${user.uid}`;
    
    let data = {
        streak: 0,
        lastClaimDate: null,
        claimedDays: [],
        currentMonth: currentCycle,
        totalClaimed: 0,
        inventory: []
    };

    // 1. Read from localStorage
    try {
        const stored = localStorage.getItem(localKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
                data = { ...data, ...parsed };
                if (data.lastClaimDate) {
                    data.lastClaimDate = getLocalDateString(data.lastClaimDate);
                }
            }
        }
    } catch (_) {}

    // 2. Check Firestore user profile data if available
    if (userData && userData.dailyCheckin) {
        const fsData = { ...userData.dailyCheckin };
        if (fsData.lastClaimDate) {
            fsData.lastClaimDate = getLocalDateString(fsData.lastClaimDate);
        }
        
        // Merge intelligently: whichever has the most recent claim or higher streak wins
        const fsDiff = fsData.lastClaimDate ? getCalendarDayDiff(todayStr, fsData.lastClaimDate) : 999;
        const localDiff = data.lastClaimDate ? getCalendarDayDiff(todayStr, data.lastClaimDate) : 999;

        if (!data.lastClaimDate || fsDiff < localDiff || (fsDiff === localDiff && (fsData.streak || 0) >= (data.streak || 0))) {
            data = { ...data, ...fsData };
        } else if ((fsData.streak || 0) > (data.streak || 0)) {
            data.streak = fsData.streak;
            data.claimedDays = fsData.claimedDays || data.claimedDays;
        }
    } else if (userData && typeof userData.checkInStreak === 'number') {
        if (userData.checkInStreak > data.streak) {
            data.streak = userData.checkInStreak;
        }
        if (userData.lastCheckIn && !data.lastClaimDate) {
            data.lastClaimDate = getLocalDateString(userData.lastCheckIn);
        }
    }

    // 3. Reconcile with actual loyalty transactions if available
    if (txs && Array.isArray(txs) && txs.length > 0) {
        const checkinTxs = txs.filter(t => t.description && t.description.includes('Daily Check-in'));
        if (checkinTxs.length > 0) {
            const txDates = checkinTxs.map(t => getLocalDateString(t.createdAt)).filter(Boolean);
            const streakInfo = calculateStreakFromDates(txDates, todayStr);
            if (streakInfo.streak > data.streak) {
                data.streak = streakInfo.streak;
                data.lastClaimDate = streakInfo.lastClaimDate;
            }
        }
    }

    // 4. Verify streak continuity:
    // If last checkin was more than 1 day ago (missed yesterday and today), streak resets to 0
    if (data.lastClaimDate) {
        const diffDays = getCalendarDayDiff(todayStr, data.lastClaimDate);
        if (diffDays > 1) {
            data.streak = 0;
            data.claimedDays = [];
        }
    }

    // 5. Ensure claimedDays array stays consistent with streak
    if (data.streak > 0) {
        const expectedCount = ((data.streak - 1) % 30) + 1;
        if (!Array.isArray(data.claimedDays) || data.claimedDays.length < expectedCount) {
            data.claimedDays = Array.from({ length: expectedCount }, (_, i) => i + 1);
        }
    }

    // Keep localStorage cached in sync
    try {
        localStorage.setItem(localKey, JSON.stringify(data));
    } catch (_) {}

    return data;
}

export async function saveUserCheckinData(user, checkinData, pointsEarned, rewardItem) {
    const localKey = `dts_checkin_${user.uid}`;
    try {
        localStorage.setItem(localKey, JSON.stringify(checkinData));
    } catch (_) {}

    // Update memory cache
    if (currentUserData) {
        currentUserData.dailyCheckin = checkinData;
        currentUserData.checkInStreak = checkinData.streak;
        currentUserData.lastClaimDate = checkinData.lastClaimDate;
        currentUserData.pointsBalance = (currentUserData.pointsBalance || 0) + pointsEarned;
        sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(currentUserData));
    }

    // Save to Firestore using setDoc with merge: true (never fails on missing doc, strictly rules-compliant)
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            dailyCheckin: checkinData,
            checkInStreak: checkinData.streak,
            lastClaimDate: checkinData.lastClaimDate,
            lastCheckIn: serverTimestamp()
        }, { merge: true });
    } catch (dbErr) {
        console.warn("Notice: Saved check-in to cache, firestore sync note:", dbErr);
    }

    // Log transaction to loyalty_transactions
    try {
        await addDoc(collection(db, "loyalty_transactions"), {
            userId: user.uid,
            description: `Daily Check-in Day ${checkinData.streak}: ${rewardItem.name} 🎁`,
            points: pointsEarned,
            type: 'earned',
            createdAt: serverTimestamp()
        });
    } catch (txErr) {
        console.warn("Notice: Could not log check-in transaction:", txErr);
    }

    // Optional Cloud Function background backup
    try {
        if (typeof user.getIdToken === 'function') {
            const token = await user.getIdToken();
            fetch('https://us-central1-dts-hub-website.cloudfunctions.net/claimDailyCheckIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientDate: checkinData.lastClaimDate,
                    streak: checkinData.streak
                })
            }).catch(() => {});
        }
    } catch (_) {}
}

export function renderMinecraftGrid(user, checkinData) {
    const gridEl = document.getElementById('mc-days-grid');
    if (!gridEl) return;

    const todayStr = getLocalDateString(new Date());
    const isClaimedToday = Boolean(checkinData.lastClaimDate && getCalendarDayDiff(todayStr, checkinData.lastClaimDate) === 0);
    const streak = checkinData.streak || 0;
    const currentCycleDay = streak === 0 ? 0 : (((streak - 1) % 30) + 1);
    const nextAvailableDay = isClaimedToday ? 0 : (streak === 0 ? 1 : ((currentCycleDay % 30) + 1));

    const claimedList = Array.isArray(checkinData.claimedDays) ? checkinData.claimedDays : [];

    gridEl.innerHTML = CHECKIN_SCHEDULE_30_DAYS.map(item => {
        const isClaimed = claimedList.includes(item.day);
        const isTodayAvailable = !isClaimedToday && item.day === nextAvailableDay;

        let rarityClass = `rarity-${item.rarity}`;
        let badgeHtml = '';
        if (item.rarity === 'legendary') {
            badgeHtml = `<span class="mc-rarity-badge legendary">LEGENDARY</span>`;
        } else if (item.rarity === 'mythic') {
            badgeHtml = `<span class="mc-rarity-badge mythic">MYTHIC</span>`;
        } else if (item.rarity === 'elytra') {
            badgeHtml = `<span class="mc-rarity-badge grand">GRAND FINALE</span>`;
        }

        const stateClass = isClaimed ? 'claimed' : (isTodayAvailable ? 'today-available' : '');

        return `
            <div class="mc-day-card ${rarityClass} ${stateClass}" data-day="${item.day}" title="${escapeHTML(item.desc)}">
                <div class="mc-day-card-header">
                    <span class="mc-day-num">DAY ${item.day}</span>
                    ${badgeHtml}
                </div>
                <div class="mc-item-icon-wrap">
                    ${getMinecraftItemSvg(item.icon)}
                </div>
                <div class="mc-item-name">${escapeHTML(item.name)}</div>
                <div class="mc-item-points">+${item.points} pts</div>
            </div>
        `;
    }).join('');

    // Clicking available day triggers claim
    gridEl.querySelectorAll('.today-available').forEach(el => {
        el.addEventListener('click', () => {
            triggerCheckinClaim(user);
        });
    });
}

export function updateCheckinUI(user, checkinData) {
    const streakDisplay = document.getElementById('check-in-streak');
    const modalStreakDisplay = document.getElementById('mc-modal-streak-count');
    const claimBtn = document.getElementById('claim-checkin-btn');
    const modalClaimBtn = document.getElementById('mc-modal-claim-today-btn');
    const checkinMessage = document.getElementById('checkin-message');
    const progressFill = document.getElementById('mc-progress-bar-fill');
    const progressDaysText = document.getElementById('mc-progress-days-text');

    const streak = checkinData.streak || 0;
    if (streakDisplay) streakDisplay.textContent = streak;
    if (modalStreakDisplay) modalStreakDisplay.textContent = streak;

    const todayStr = getLocalDateString(new Date());
    const isClaimedToday = Boolean(checkinData.lastClaimDate && getCalendarDayDiff(todayStr, checkinData.lastClaimDate) === 0);
    const claimedCount = streak === 0 ? 0 : (((streak - 1) % 30) + 1);
    const displayClaimed = isClaimedToday ? claimedCount : (streak === 0 ? 0 : claimedCount);
    const nextDayNum = isClaimedToday 
        ? ((claimedCount % 30) + 1) 
        : (streak === 0 ? 1 : ((claimedCount % 30) + 1));
    const nextReward = CHECKIN_SCHEDULE_30_DAYS[nextDayNum - 1] || CHECKIN_SCHEDULE_30_DAYS[0];

    // Progress bar
    const percent = Math.min(100, Math.round((displayClaimed / 30) * 100));
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressDaysText) progressDaysText.textContent = `${displayClaimed} / 30 DAYS`;

    // Milestones
    ['7', '14', '21', '28', '30'].forEach(dayNum => {
        const dot = document.getElementById(`dot-m-${dayNum}`);
        if (dot) {
            dot.classList.toggle('reached', displayClaimed >= parseInt(dayNum, 10));
        }
    });

    if (isClaimedToday) {
        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.innerHTML = '✓ Claimed Today';
            claimBtn.className = 'mc-pixel-btn mc-pixel-btn-claimed';
            claimBtn.removeAttribute('style');
        }
        if (modalClaimBtn) {
            modalClaimBtn.disabled = true;
            modalClaimBtn.textContent = '✓ Claimed Today';
        }
        if (checkinMessage) {
            checkinMessage.innerHTML = `<span class="mc-chat-status success">✓ Today's check-in complete!</span> Streak: <span class="mc-chat-streak">${streak} days</span>. Next reward tomorrow: <span class="mc-chat-item">${escapeHTML(nextReward.name)}</span> <span class="mc-chat-pts">(+${nextReward.points} pts)</span>.`;
            checkinMessage.removeAttribute('style');
        }
    } else {
        if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.innerHTML = '⚡ Claim Today\'s Reward';
            claimBtn.className = 'mc-pixel-btn mc-pixel-btn-claim';
            claimBtn.removeAttribute('style');
        }
        if (modalClaimBtn) {
            modalClaimBtn.disabled = false;
            modalClaimBtn.textContent = '⚡ Claim Today\'s Reward';
        }
        const claimDayNum = streak === 0 ? 1 : ((streak % 30) + 1);
        const claimReward = CHECKIN_SCHEDULE_30_DAYS[claimDayNum - 1] || CHECKIN_SCHEDULE_30_DAYS[0];
        if (checkinMessage) {
            checkinMessage.innerHTML = `<span class="mc-chat-status ready">⚡ Ready to claim Day ${claimDayNum}:</span> <span class="mc-chat-item">${escapeHTML(claimReward.name)}</span> <span class="mc-chat-pts">(+${claimReward.points} pts)</span>!`;
            checkinMessage.removeAttribute('style');
        }
    }

    renderMinecraftGrid(user, checkinData);
}

export async function triggerCheckinClaim(user) {
    if (!user) return;
    const checkinData = getUserCheckinData(user, currentUserData);
    const todayStr = getLocalDateString(new Date());

    if (checkinData.lastClaimDate) {
        const diff = getCalendarDayDiff(todayStr, checkinData.lastClaimDate);
        if (diff === 0) {
            alert("You have already claimed today's reward! Come back tomorrow.");
            return;
        }
    }

    // Streak calculation:
    // If previous claim was yesterday (diff === 1), streak increments
    let isConsecutive = false;
    if (checkinData.lastClaimDate) {
        const diffDays = getCalendarDayDiff(todayStr, checkinData.lastClaimDate);
        if (diffDays === 1) {
            isConsecutive = true;
        }
    }

    const newStreak = isConsecutive ? (checkinData.streak + 1) : 1;
    const nextDayNum = ((newStreak - 1) % 30) + 1;
    const rewardItem = CHECKIN_SCHEDULE_30_DAYS[nextDayNum - 1];

    checkinData.streak = newStreak;
    checkinData.lastClaimDate = todayStr;
    checkinData.claimedDays = Array.from({ length: nextDayNum }, (_, i) => i + 1);
    checkinData.totalClaimed = (checkinData.totalClaimed || 0) + 1;
    if (!checkinData.inventory) checkinData.inventory = [];
    checkinData.inventory.push(`${rewardItem.name} (Claimed Day ${nextDayNum})`);

    // Save and update user data in Firestore and cache
    await saveUserCheckinData(user, checkinData, rewardItem.points, rewardItem);

    // Update points displayed across the page immediately
    const currentPts = parseInt(localStorage.getItem(`dts_points_${user.uid}`), 10) || 50;
    const newTotalPoints = currentPts + rewardItem.points;
    localStorage.setItem(`dts_points_${user.uid}`, newTotalPoints);

    const pointsBalanceDisplay = document.getElementById('points-balance-display');
    const userLoyaltyPoints = document.getElementById('user-loyalty-points');
    if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = newTotalPoints;
    if (userLoyaltyPoints) userLoyaltyPoints.textContent = newTotalPoints;

    updateCheckinUI(user, checkinData);

    // Trigger the Cinematic Flare Animation with day number & item!
    triggerFlareAnimation(newStreak, rewardItem);
}

export function triggerFlareAnimation(streak, rewardItem) {
    const flareModal = document.getElementById('mc-flare-modal');
    if (!flareModal) return;

    const streakNumberEl = document.getElementById('flare-streak-number');
    const rarityPillEl = document.getElementById('flare-rarity-pill');
    const iconContainerEl = document.getElementById('flare-icon-container');
    const itemNameEl = document.getElementById('flare-item-name');
    const pointsBonusEl = document.getElementById('flare-points-bonus');
    const itemDescEl = document.getElementById('flare-item-desc');
    const collectBtn = document.getElementById('flare-collect-btn');

    if (streakNumberEl) streakNumberEl.textContent = streak;
    if (itemNameEl) itemNameEl.textContent = rewardItem.name;
    if (pointsBonusEl) pointsBonusEl.textContent = `+${rewardItem.points} Unstoppable Loyalty Points Added!`;
    if (itemDescEl) itemDescEl.textContent = rewardItem.desc;

    if (rarityPillEl) {
        rarityPillEl.className = 'mc-flare-rarity-pill';
        if (rewardItem.rarity === 'legendary') {
            rarityPillEl.textContent = '💎 LEGENDARY REWARD';
            rarityPillEl.classList.add('legendary');
        } else if (rewardItem.rarity === 'mythic') {
            rarityPillEl.textContent = '🛡️ MYTHIC REWARD';
            rarityPillEl.classList.add('mythic');
        } else if (rewardItem.rarity === 'elytra') {
            rarityPillEl.textContent = '🪽 ULTRA GRAND FINALE';
            rarityPillEl.classList.add('grand');
        } else {
            rarityPillEl.textContent = '✨ DAILY MINECRAFT TREASURE';
        }
    }

    if (iconContainerEl) {
        iconContainerEl.innerHTML = getMinecraftItemSvg(rewardItem.icon);
    }

    flareModal.style.display = 'flex';

    if (collectBtn) {
        collectBtn.onclick = () => {
            flareModal.style.display = 'none';
        };
    }
}

export function initDailyCheckin(user, userData) {
    const checkinData = getUserCheckinData(user, userData);
    updateCheckinUI(user, checkinData);

    // Daily Claim buttons
    const claimBtn = document.getElementById('claim-checkin-btn');
    if (claimBtn) {
        claimBtn.onclick = () => triggerCheckinClaim(user);
    }

    const modalClaimBtn = document.getElementById('mc-modal-claim-today-btn');
    if (modalClaimBtn) {
        modalClaimBtn.onclick = () => triggerCheckinClaim(user);
    }

    // 30-Day Calendar Modal Open / Close
    const calendarModal = document.getElementById('minecraft-checkin-modal');
    const openCalendarBtn = document.getElementById('open-calendar-modal-btn');
    const closeCalendarBtn = document.getElementById('close-mc-checkin-modal');

    if (openCalendarBtn && calendarModal) {
        openCalendarBtn.onclick = () => {
            const currentData = getUserCheckinData(user, currentUserData);
            renderMinecraftGrid(user, currentData);
            calendarModal.style.display = 'flex';
        };
    }

    if (closeCalendarBtn && calendarModal) {
        closeCalendarBtn.onclick = () => {
            calendarModal.style.display = 'none';
        };
    }

    if (calendarModal) {
        calendarModal.onclick = (e) => {
            if (e.target === calendarModal) {
                calendarModal.style.display = 'none';
            }
        };
    }

    // Flare Modal Outside Click Close
    const flareModal = document.getElementById('mc-flare-modal');
    if (flareModal) {
        flareModal.onclick = (e) => {
            if (e.target === flareModal || e.target.classList.contains('mc-flare-backdrop')) {
                flareModal.style.display = 'none';
            }
        };
    }
}

/**
 * 10. MAIN ACCOUNT CONTROLLER INITIALIZATION
 */
export function initAccountPage() {
    // Immediate tab setup so navigation is 100% interactive without waiting for auth
    initTabNavigation();
    
    // Listen for wishlist updates from shop.js
    window.addEventListener('wishlistUpdated', () => {
        if (currentUser) {
            loadWishlist(currentUser.uid);
        }
    });

    const copyReferralBtn = document.getElementById('copy-referral-btn');
    const referralLinkInput = document.getElementById('referral-link');
    if (copyReferralBtn && referralLinkInput) {
        copyReferralBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(referralLinkInput.value);
                const originalText = copyReferralBtn.textContent;
                copyReferralBtn.textContent = 'Copied!';
                setTimeout(() => { copyReferralBtn.textContent = originalText; }, 2000);
            } catch (err) {
                console.error('Manager info: Failed to copy text: ', err);
            }
        });
    }

    // 1. Immediately pre-populate with cached session profile or auth.currentUser if available (0ms delay)
    try {
        const cachedUser = auth.currentUser;
        if (cachedUser) {
            currentUser = cachedUser;
            let cachedProfile = null;
            const stored = sessionStorage.getItem(`profile_${cachedUser.uid}`);
            if (stored) {
                try { cachedProfile = JSON.parse(stored); } catch (_) {}
            }
            currentUserData = cachedProfile;
            renderProfile(cachedUser, cachedProfile);
            renderRewards(cachedUser, cachedProfile);
            initDailyCheckin(cachedUser, cachedProfile);
        } else {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith('profile_')) {
                    try {
                        const pData = JSON.parse(sessionStorage.getItem(key));
                        if (pData) {
                            const tempUid = key.replace('profile_', '');
                            const tempUser = { uid: tempUid, email: pData.email, displayName: pData.username };
                            currentUserData = pData;
                            renderProfile(tempUser, pData);
                            renderRewards(tempUser, pData);
                            initDailyCheckin(tempUser, pData);
                            break;
                        }
                    } catch (_) {}
                }
            }
        }
    } catch (preErr) {
        console.warn("Notice: Pre-render notice:", preErr);
    }

    // 2. Auth Timeout Safeguard: If Firebase Auth takes > 3.5s, don't leave page hanging
    const authTimeout = setTimeout(() => {
        if (!currentUser && !auth.currentUser) {
            const welcomeHeader = document.getElementById('welcome-header');
            if (welcomeHeader && (welcomeHeader.textContent === 'Loading...' || welcomeHeader.textContent === 'My Account')) {
                welcomeHeader.textContent = 'Welcome, Guest';
            }
            const dashboardCard = document.querySelector('#dashboard .card');
            if (dashboardCard && !document.getElementById('auth-warning-banner')) {
                const banner = document.createElement('div');
                banner.id = 'auth-warning-banner';
                banner.style.cssText = 'background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: center;';
                banner.innerHTML = `
                    <strong style="color: #f59e0b; font-size: 1rem; display: block; margin-bottom: 6px;">Sign In to DTS Hub</strong>
                    <p style="color: var(--text-secondary); margin: 0 0 12px; font-size: 0.9rem;">Sign in to access your rewards, streak bonuses, and Minecraft daily check-in.</p>
                    <a href="sign in beta.html" class="cta-button" style="display: inline-block; padding: 8px 18px; text-decoration: none;">Sign In / Sign Up →</a>
                `;
                dashboardCard.parentNode.insertBefore(banner, dashboardCard);
            }
        }
    }, 3500);

    // 3. Firebase Auth State Listener
    onAuthStateChanged(auth, async (user) => {
        clearTimeout(authTimeout);
        const warningBanner = document.getElementById('auth-warning-banner');
        if (warningBanner) warningBanner.remove();

        if (!user) {
            setTimeout(() => {
                if (!auth.currentUser) {
                    window.location.replace('sign in beta.html');
                }
            }, 500);
            return;
        }

        currentUser = user;

        // Render immediately with user object before waiting for Firestore document
        renderProfile(user, currentUserData);
        renderRewards(user, currentUserData);
        initDailyCheckin(user, currentUserData);

        // ⚡ Bolt: Centralized cache function `getCachedUserProfile` reduces redundant Firestore calls.
        let userData = null;
        try {
            userData = await getCachedUserProfile(user);
        } catch (fetchErr) {
            console.warn("Notice: Profile fetch note:", fetchErr);
        }

        if (!userData) {
            // Fallback initialization if profile doesn't exist at all yet (rules-compliant)
            userData = {
                username: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email,
                signupDate: new Date()
            };
            try {
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, userData, { merge: true });
            } catch (err) {
                console.warn("Notice: Profile init notice:", err);
            }
            userData.membershipLevel = 'free';
            userData.pointsBalance = parseInt(localStorage.getItem(`dts_points_${user.uid}`), 10) || 50;
            userData.loyaltyPoints = userData.pointsBalance;
            sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
        }

        currentUserData = userData;

        // Render all account sections independently so no single failure blocks others
        const container = document.getElementById('account-layout-container');
        if (container) container.style.display = 'flex';

        try { renderProfile(user, userData); } catch (e) { console.warn("Profile render:", e); }
        try { renderRewards(user, userData); } catch (e) { console.warn("Rewards render:", e); }
        try { initDailyCheckin(user, userData); } catch (e) { console.warn("Checkin render:", e); }
        try { renderOrders(user); } catch (e) { console.warn("Orders render:", e); }
        try { renderBilling(user, userData); } catch (e) { console.warn("Billing render:", e); }
        try { loadWishlist(user.uid); } catch (e) { console.warn("Wishlist render:", e); }
        try { loadUserTickets(user.uid); } catch (e) { console.warn("Tickets render:", e); }

        // Sign Out
        document.getElementById('sign-out')?.addEventListener('click', () => {
            sessionStorage.removeItem(`profile_${user.uid}`);
            signOut(auth).then(() => window.location.replace('index.html'));
        });

        // Update Username Form
        document.getElementById('update-profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('update-username').value.trim();
            const notificationEl = document.getElementById('profile-notification');
            const submitBtn = e.target.querySelector('button[type="submit"]');

            if (!newUsername) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                await updateDoc(doc(db, "users", user.uid), { username: newUsername });
                userData.username = newUsername;
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                const welcomeHeader = document.getElementById('welcome-header');
                if (welcomeHeader) welcomeHeader.innerHTML = `<span class="welcome-prefix">Welcome back,</span> <span class="welcome-username">${escapeHTML(newUsername)}!</span>`;

                if (notificationEl) {
                    notificationEl.textContent = 'Username updated successfully!';
                    notificationEl.className = 'notification success';
                    notificationEl.style.display = 'block';
                    setTimeout(() => notificationEl.style.display = 'none', 3000);
                }
            } catch (err) {
                if (notificationEl) {
                    notificationEl.textContent = `Error: ${err.message}`;
                    notificationEl.className = 'notification error';
                    notificationEl.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            }
        });

        // Theme Settings Form
        document.getElementById('theme-settings-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const theme = document.getElementById('theme-select').value;
            const customHex = document.getElementById('custom-hex-color')?.value || '#2563EB';
            const notificationEl = document.getElementById('theme-notification');
            const submitBtn = e.target.querySelector('button[type="submit"]');

            const isPremium = userData.membershipLevel === 'premium' || userData.membershipLevel === 'ultimate' || userData.isAdmin;
            if (!isPremium && (theme === 'pink' || theme === 'forest')) {
                if (notificationEl) {
                    notificationEl.textContent = 'Error: Lotus Pink and Rainforest themes require Premium.';
                    notificationEl.className = 'notification error';
                    notificationEl.style.display = 'block';
                }
                return;
            }

            const accentColor = isPremium ? customHex : '#2563EB';
            if (!isPremium && document.getElementById('custom-hex-color')) {
                document.getElementById('custom-hex-color').value = accentColor;
            }

            let origText = 'Save Theme';
            if (submitBtn) {
                origText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Saving...';
                submitBtn.title = 'Saving theme preferences...';
            }

            try {
                await updateDoc(doc(db, "users", user.uid), { theme, accentColor });
                userData.theme = theme;
                userData.accentColor = accentColor;
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                document.body.dataset.theme = theme;
                document.documentElement.style.setProperty('--accent-color', accentColor);
                localStorage.setItem('userTheme', theme);
                localStorage.setItem('userAccent', accentColor);

                if (notificationEl) {
                    notificationEl.textContent = 'Theme preferences updated successfully!';
                    notificationEl.className = 'notification success';
                    notificationEl.style.display = 'block';
                    setTimeout(() => notificationEl.style.display = 'none', 3000);
                }
            } catch (err) {
                if (notificationEl) {
                    notificationEl.textContent = `Error: ${err.message}`;
                    notificationEl.className = 'notification error';
                    notificationEl.style.display = 'block';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = origText;
                    submitBtn.removeAttribute('title');
                }
            }
        });

        // Reset Theme Settings to Default
        document.getElementById('reset-theme-btn')?.addEventListener('click', async (e) => {
            const resetBtn = e.currentTarget;
            const origText = resetBtn.textContent;
            const notificationEl = document.getElementById('theme-notification');
            const themeSelect = document.getElementById('theme-select');
            const customHex = document.getElementById('custom-hex-color');

            const defaultTheme = 'system';
            const defaultAccent = '#2563EB';

            // Reset UI inputs
            if (themeSelect) themeSelect.value = defaultTheme;
            if (customHex) customHex.value = defaultAccent;

            resetBtn.disabled = true;
            resetBtn.textContent = 'Resetting...';
            resetBtn.title = 'Resetting theme preferences...';

            try {
                if (user?.uid) {
                    await updateDoc(doc(db, "users", user.uid), {
                        theme: defaultTheme,
                        accentColor: defaultAccent
                    });
                    if (userData) {
                        userData.theme = defaultTheme;
                        userData.accentColor = defaultAccent;
                        sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
                    }
                }

                document.body.dataset.theme = defaultTheme;
                document.documentElement.style.setProperty('--accent-color', defaultAccent);
                localStorage.setItem('userTheme', defaultTheme);
                localStorage.setItem('userAccent', defaultAccent);

                if (typeof window.updateTheme === 'function') {
                    window.updateTheme(defaultTheme, defaultAccent);
                }

                if (notificationEl) {
                    notificationEl.textContent = 'Theme preferences reset to default successfully!';
                    notificationEl.className = 'notification success';
                    notificationEl.style.display = 'block';
                    setTimeout(() => notificationEl.style.display = 'none', 3000);
                }
            } catch (err) {
                console.error("Manager info: Error resetting theme:", err);
                if (notificationEl) {
                    notificationEl.textContent = `Error: ${err.message}`;
                    notificationEl.className = 'notification error';
                    notificationEl.style.display = 'block';
                }
            } finally {
                resetBtn.disabled = false;
                resetBtn.textContent = origText;
                resetBtn.removeAttribute('title');
            }
        });

        document.getElementById('theme-settings-form')?.addEventListener('reset', () => {
            const themeSelect = document.getElementById('theme-select');
            const customHex = document.getElementById('custom-hex-color');
            if (themeSelect) themeSelect.value = 'system';
            if (customHex) customHex.value = '#2563EB';
        });

        // Password Reset Email
        // ⚡ Bolt: Use event delegation for password reset button to avoid querying the DOM multiple times
        if (!document.body.dataset.pwdDelegated) {
            document.body.dataset.pwdDelegated = 'true';
            document.addEventListener('click', async (e) => {
                const btn = e.target.closest('#change-password-btn');
                if (btn && !btn.disabled) {
                    btn.disabled = true;
                    const orig = btn.textContent;
                    btn.textContent = 'Sending...';

                    try {
                        await sendPasswordResetEmail(auth, user.email);
                        const notif = document.getElementById('security-notification');
                        if (notif) {
                            notif.textContent = 'Password reset email sent to ' + user.email;
                            notif.className = 'notification success';
                            notif.style.display = 'block';
                            setTimeout(() => notif.style.display = 'none', 4000);
                        }
                    } catch (err) {
                        const notif = document.getElementById('security-notification');
                        if (notif) {
                            notif.textContent = `Error: ${err.message}`;
                            notif.className = 'notification error';
                            notif.style.display = 'block';
                        }
                    } finally {
                        btn.disabled = false;
                        btn.textContent = orig;
                    }
                }
            });
        }

        // 2FA Toggle
        const toggle2FA = document.getElementById('toggle-2fa');
        if (toggle2FA) {
            toggle2FA.checked = !!userData.twoFactorEnabled;
            toggle2FA.addEventListener('change', async (e) => {
                const isEnabled = e.target.checked;
                try {
                    await updateDoc(doc(db, "users", user.uid), { twoFactorEnabled: isEnabled });
                    userData.twoFactorEnabled = isEnabled;
                    sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
                    alert(`Two-Factor Authentication (2FA) is now ${isEnabled ? 'enabled' : 'disabled'}.`);
                } catch (err) {
                    e.target.checked = !isEnabled;
                    alert('Error updating 2FA settings.');
                }
            });
        }

        // Support Ticket Form & Counter
        const ticketMsgInput = document.getElementById('ticket-message');
        const ticketCounterEl = document.getElementById('ticket-message-counter');
        if (ticketMsgInput && ticketCounterEl) {
            ticketMsgInput.addEventListener('input', () => {
                ticketCounterEl.textContent = `${ticketMsgInput.value.length} / 500`;
            });
        }

        document.getElementById('support-ticket-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const subject = document.getElementById('ticket-subject').value.trim();
            const message = document.getElementById('ticket-message').value.trim();
            const notificationEl = document.getElementById('ticket-notification');
            const submitBtn = e.target.querySelector('button[type="submit"]');

            if (!subject || !message) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                await createTicket(user.uid, user.email, subject, message);
                if (notificationEl) {
                    notificationEl.textContent = 'Ticket submitted successfully! We will reply shortly.';
                    notificationEl.className = 'notification success';
                    notificationEl.style.display = 'block';
                    setTimeout(() => notificationEl.style.display = 'none', 4000);
                }
                e.target.reset();
                if (ticketCounterEl) ticketCounterEl.textContent = '0 / 500';
                await loadUserTickets(user.uid);
            } catch (err) {
                if (notificationEl) {
                    notificationEl.textContent = `Error: ${err.message}`;
                    notificationEl.className = 'notification error';
                    notificationEl.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Ticket';
            }
        });

        // Deactivate / Delete Account Wizard
        document.getElementById('delete-account-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            initDeactivateAccountWizard(user, userData);
        });

        // Profile Picture Preview & Upload
        const pfpForm = document.getElementById('pfp-upload-form');
        const pfpFileInput = document.getElementById('pfp-file-input');
        const pfpPreview = document.getElementById('pfp-preview');
        const pfpPlaceholder = document.getElementById('pfp-placeholder');
        const pfpNotification = document.getElementById('pfp-notification');

        const loadExistingPfp = () => {
            const photoURL = userData?.photoURL || user.photoURL;
            if (photoURL && pfpPreview && pfpPlaceholder) {
                pfpPreview.src = photoURL;
                pfpPreview.style.display = 'block';
                pfpPlaceholder.style.display = 'none';
            }
        };
        loadExistingPfp();

        pfpFileInput?.addEventListener('change', () => {
            const file = pfpFileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (pfpPreview && pfpPlaceholder) {
                    pfpPreview.src = e.target.result;
                    pfpPreview.style.display = 'block';
                    pfpPlaceholder.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        });

        pfpForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = pfpFileInput.files[0];
            if (!file) {
                if (pfpNotification) {
                    pfpNotification.textContent = 'Please select an image file.';
                    pfpNotification.className = 'notification error';
                    pfpNotification.style.display = 'block';
                    setTimeout(() => pfpNotification.style.display = 'none', 3000);
                }
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                if (pfpNotification) {
                    pfpNotification.textContent = 'File too large. Maximum size is 5MB.';
                    pfpNotification.className = 'notification error';
                    pfpNotification.style.display = 'block';
                    setTimeout(() => pfpNotification.style.display = 'none', 3000);
                }
                return;
            }

            const submitBtn = pfpForm.querySelector('button[type="submit"]');
            const origText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            try {
                let photoURL = null;
                try {
                    const { getStorage, ref, uploadBytes, getDownloadURL } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js");
                    const storage = getStorage();
                    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
                    await uploadBytes(storageRef, file);
                    photoURL = await getDownloadURL(storageRef);
                } catch (storageErr) {
                    if (file.size <= 500 * 1024) {
                        photoURL = await new Promise((resolve) => {
                            const r = new FileReader();
                            r.onload = (ev) => resolve(ev.target.result);
                            r.readAsDataURL(file);
                        });
                    } else {
                        throw new Error('Image too large without Cloud Storage. Please use an image under 500KB.');
                    }
                }

                await updateDoc(doc(db, "users", user.uid), { photoURL });
                userData.photoURL = photoURL;
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                if (pfpNotification) {
                    pfpNotification.textContent = 'Profile picture updated successfully!';
                    pfpNotification.className = 'notification success';
                    pfpNotification.style.display = 'block';
                    setTimeout(() => pfpNotification.style.display = 'none', 3000);
                }

                const navAuthLink = document.getElementById('auth-link');
                if (navAuthLink) {
                    navAuthLink.innerHTML = `<img src="${photoURL}" alt="My Account" class="nav-pfp-avatar" title="My Account">`;
                    navAuthLink.classList.add('nav-pfp-link');
                }
            } catch (err) {
                if (pfpNotification) {
                    pfpNotification.textContent = `Error: ${err.message}`;
                    pfpNotification.className = 'notification error';
                    pfpNotification.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
            }
        });
    });
}

// Auto-run when imported or loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccountPage);
} else {
    initAccountPage();
}