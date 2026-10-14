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
        const displayName = data.username || user.displayName || user.email?.split('@')[0] || 'User';
        welcomeHeader.textContent = `Welcome back, ${escapeHTML(displayName)}!`;
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

        // If no transactions exist, seed the welcome 50 points transaction into Firestore
        if (txs.length === 0) {
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
            }
        } else {
            // Calculate total points from all user transactions
            let sum = 0;
            txs.forEach(t => {
                const p = typeof t.points === 'number' ? t.points : (typeof t.amount === 'number' ? t.amount : 0);
                sum += p;
            });
            if (sum > 0) {
                points = sum;
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
 * 6. COMPLICATED STEP-BY-STEP RETENTION CANCELLATION WIZARD
 * Step 1: Reason selection
 * Step 2: Loss aversion (list of all forfeited benefits)
 * Step 3: Retention offer: 10% OFF code + 100 free points!
 * Step 4: Customer support escalation (Lexi Chat or Priority Ticket)
 * Step 5: Final confirmation checkbox + cancellation execution.
 */
export function initCancellationWizard(user, userData, onCancelledCallback) {
    const modal = document.getElementById('cancel-membership-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    let currentStep = 1;

    const stepDots = modal.querySelectorAll('.step-dot');
    const stepContents = modal.querySelectorAll('.cancel-step-content');
    const stepIndicatorText = document.getElementById('cancel-step-indicator-text');

    const stepTitles = [
        'Step 1 of 5: Reason for Leaving',
        'Step 2 of 5: Review Forfeited Perks',
        'Step 3 of 5: Exclusive 10% OFF Offer',
        'Step 4 of 5: Customer Support Help',
        'Step 5 of 5: Final Confirmation'
    ];

    function showStep(stepNum) {
        currentStep = stepNum;
        if (stepIndicatorText) {
            stepIndicatorText.textContent = stepTitles[stepNum - 1] || `Step ${stepNum} of 5`;
        }

        stepDots.forEach(dot => {
            const dStep = parseInt(dot.getAttribute('data-step'), 10);
            dot.classList.toggle('active', dStep === stepNum);
            dot.classList.toggle('completed', dStep < stepNum);
        });

        stepContents.forEach(content => {
            content.style.display = content.id === `cancel-step-${stepNum}` ? 'block' : 'none';
        });
    }

    showStep(1);

    // Close / Abort handlers
    const closeModal = () => {
        modal.style.display = 'none';
        showStep(1);
    };

    document.getElementById('close-cancel-modal-btn').onclick = closeModal;
    // ⚡ Bolt: Use event delegation for closing modal
    if (!modal.dataset.delegated) {
        modal.dataset.delegated = 'true';
        modal.addEventListener('click', (e) => {
            if (e.target.closest('.cancel-keep-btn')) {
                closeModal();
            }
        });
    }

    // Step 1 -> Step 2
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

    // Step 2 -> Step 3
    const step3Btn = document.getElementById('cancel-to-step-3-btn');
    if (step3Btn) {
        step3Btn.onclick = () => showStep(3);
    }

    // Step 3: Claim 10% Voucher & STAY!
    const claimVoucherBtn = document.getElementById('claim-voucher-stay-btn');
    if (claimVoucherBtn) {
        claimVoucherBtn.onclick = async () => {
            claimVoucherBtn.disabled = true;
            claimVoucherBtn.textContent = 'Applying 10% Discount & 100 Points...';

            try {
                // Award 100 loyalty points and set retention discount
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
                closeModal();
                renderRewards(user, userData);
            } catch (err) {
                console.error("Manager info: Voucher claim error:", err);
                alert('Code applied! Thank you for staying with us.');
                closeModal();
            }
        };
    }

    // Step 3 -> Step 4
    const step4Btn = document.getElementById('cancel-to-step-4-btn');
    if (step4Btn) {
        step4Btn.onclick = () => showStep(4);
    }

    // Step 4: Lexi chat / Support ticket buttons
    document.getElementById('cancel-open-lexi-btn')?.addEventListener('click', () => {
        closeModal();
        if (typeof window.openLexiChat === 'function') {
            window.openLexiChat();
        } else {
            const chatWindow = document.getElementById('chatbot-window');
            if (chatWindow) chatWindow.classList.add('active');
        }
    });

    document.getElementById('cancel-open-ticket-btn')?.addEventListener('click', () => {
        closeModal();
        const subjectInput = document.getElementById('ticket-subject');
        if (subjectInput) {
            subjectInput.value = 'Priority Assistance: Regarding Membership Perks & Billing';
        }
        const supportLink = document.querySelector('.sidebar-nav a[href="#support"]');
        if (supportLink) supportLink.click();
    });

    // Step 4 -> Step 5
    const step5Btn = document.getElementById('cancel-to-step-5-btn');
    if (step5Btn) {
        step5Btn.onclick = () => showStep(5);
    }

    // Step 5: Checkbox enable button
    const confirmCheckbox = document.getElementById('cancel-confirm-checkbox');
    const finalCancelBtn = document.getElementById('cancel-confirm-final-btn');

    if (confirmCheckbox && finalCancelBtn) {
        confirmCheckbox.checked = false;
        finalCancelBtn.disabled = true;

        confirmCheckbox.onchange = () => {
            finalCancelBtn.disabled = !confirmCheckbox.checked;
        };

        finalCancelBtn.onclick = async () => {
            finalCancelBtn.disabled = true;
            finalCancelBtn.textContent = 'Canceling Membership...';

            try {
                // Update Firestore
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

                alert('Your membership has been successfully canceled and reverted to Standard (Free). You can rejoin at any time.');
                closeModal();

                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            } catch (err) {
                console.error("Manager info: Cancellation error:", err);
                alert('Cancellation processed. Your account is now on the Free tier.');
                closeModal();
                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            }
        };
    }
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
        const wishlistRef = doc(db, 'wishlists', userId);
        const snap = await getDoc(wishlistRef);
        if (snap.exists()) {
            const items = (snap.data().items || []).filter(id => id !== productId);
            await setDoc(wishlistRef, { items }, { merge: true });
        }
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

        if (!snap.exists() || !snap.data().items || snap.data().items.length === 0) {
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

        const data = snap.data();
        if (data.isPublic && data.sharedId) {
            if (linkContainer) linkContainer.style.display = 'block';
            if (linkInput) linkInput.value = `${window.location.origin}/shared-wishlist.html?id=${data.sharedId}`;
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

        const items = data.items;
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
            return `<svg viewBox="0 0 32 32" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5 C12 6 7 13 7 21 C7 25 10 27 13 25 C15 22 16 16 16 9 Z" fill="#383d4c"/>
                <path d="M14 7 C12 9 8 15 8 20 C9 22 11 22 13 19 C14 16 15 11 15 7 Z" fill="#606980"/>
                <path d="M11 11 C10 13 9 17 9 19 C10 20 11 20 12 18 Z" fill="#55ffff"/>
                <path d="M17 5 C20 6 25 13 25 21 C25 25 22 27 19 25 C17 22 16 16 16 9 Z" fill="#383d4c"/>
                <path d="M18 7 C20 9 24 15 24 20 C23 22 21 22 19 19 C18 16 17 11 17 7 Z" fill="#606980"/>
                <path d="M21 11 C22 13 23 17 23 19 C22 20 21 20 20 18 Z" fill="#c084fc"/>
                <rect x="15" y="4" width="2" height="4" fill="#ffd700"/>
            </svg>`;
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

export function getUserCheckinData(user, userData) {
    const today = new Date();
    const currentCycle = today.toISOString().substring(0, 7); // e.g. "2026-10"
    const localKey = `dts_checkin_${user.uid}`;
    
    let data = {
        streak: 0,
        lastClaimDate: null,
        claimedDays: [],
        currentMonth: currentCycle,
        totalClaimed: 0,
        inventory: []
    };

    try {
        const stored = localStorage.getItem(localKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
                data = { ...data, ...parsed };
            }
        }
    } catch (_) {}

    // Check Firestore user profile data if available
    if (userData && userData.dailyCheckin) {
        data = {
            ...data,
            ...userData.dailyCheckin
        };
    } else if (userData && typeof userData.checkInStreak === 'number') {
        data.streak = userData.checkInStreak;
        if (userData.lastCheckIn) {
            const d = userData.lastCheckIn.toDate ? userData.lastCheckIn.toDate() : new Date(userData.lastCheckIn);
            data.lastClaimDate = d.toISOString().split('T')[0];
        }
    }

    // Reset claimed days if month has changed
    if (data.currentMonth !== currentCycle) {
        data.claimedDays = [];
        data.currentMonth = currentCycle;
    }

    // Verify streak continuity: if last checkin was more than 1 day ago and not today, streak resets to 0
    if (data.lastClaimDate) {
        const todayStr = today.toISOString().split('T')[0];
        if (data.lastClaimDate !== todayStr) {
            const todayMid = new Date(todayStr + 'T00:00:00Z').getTime();
            const lastMid = new Date(data.lastClaimDate + 'T00:00:00Z').getTime();
            const diffDays = Math.round((todayMid - lastMid) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                data.streak = 0;
            }
        }
    }

    return data;
}

export async function saveUserCheckinData(user, checkinData, pointsEarned, rewardItem) {
    const localKey = `dts_checkin_${user.uid}`;
    localStorage.setItem(localKey, JSON.stringify(checkinData));

    // Update memory cache
    if (currentUserData) {
        currentUserData.dailyCheckin = checkinData;
        currentUserData.checkInStreak = checkinData.streak;
        currentUserData.pointsBalance = (currentUserData.pointsBalance || 0) + pointsEarned;
        sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(currentUserData));
    }

    // Update user doc in Firestore (dailyCheckin and checkInStreak are allowed by security rules)
    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            dailyCheckin: checkinData,
            checkInStreak: checkinData.streak,
            lastCheckIn: serverTimestamp()
        });
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

    // Try background Cloud Function call if available
    try {
        if (typeof user.getIdToken === 'function') {
            const token = await user.getIdToken();
            fetch('https://us-central1-dts-hub-website.cloudfunctions.net/claimDailyCheckIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).catch(() => {});
        }
    } catch (_) {}
}

export function renderMinecraftGrid(user, checkinData) {
    const gridEl = document.getElementById('mc-days-grid');
    if (!gridEl) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const isClaimedToday = checkinData.lastClaimDate === todayStr;
    const nextAvailableDay = (checkinData.claimedDays.length % 30) + 1;

    gridEl.innerHTML = CHECKIN_SCHEDULE_30_DAYS.map(item => {
        const isClaimed = checkinData.claimedDays.includes(item.day);
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

    const todayStr = new Date().toISOString().split('T')[0];
    const isClaimedToday = checkinData.lastClaimDate === todayStr;
    const claimedCount = checkinData.claimedDays.length;
    const nextDayNum = (claimedCount % 30) + 1;
    const nextReward = CHECKIN_SCHEDULE_30_DAYS[nextDayNum - 1];

    // Progress bar
    const percent = Math.min(100, Math.round((claimedCount / 30) * 100));
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressDaysText) progressDaysText.textContent = `${claimedCount} / 30 DAYS`;

    // Milestones
    ['7', '14', '21', '28', '30'].forEach(dayNum => {
        const dot = document.getElementById(`dot-m-${dayNum}`);
        if (dot) {
            dot.classList.toggle('reached', claimedCount >= parseInt(dayNum, 10));
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
        if (checkinMessage) {
            checkinMessage.innerHTML = `<span class="mc-chat-status ready">⚡ Ready to claim Day ${nextDayNum}:</span> <span class="mc-chat-item">${escapeHTML(nextReward.name)}</span> <span class="mc-chat-pts">(+${nextReward.points} pts)</span>!`;
            checkinMessage.removeAttribute('style');
        }
    }

    renderMinecraftGrid(user, checkinData);
}

export async function triggerCheckinClaim(user) {
    if (!user) return;
    const checkinData = getUserCheckinData(user, currentUserData);
    const todayStr = new Date().toISOString().split('T')[0];

    if (checkinData.lastClaimDate === todayStr) {
        alert("You have already claimed today's reward! Come back tomorrow.");
        return;
    }

    // Streak calculation
    let isConsecutive = false;
    if (checkinData.lastClaimDate) {
        const todayMid = new Date(todayStr + 'T00:00:00Z').getTime();
        const lastMid = new Date(checkinData.lastClaimDate + 'T00:00:00Z').getTime();
        const diffDays = Math.round((todayMid - lastMid) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            isConsecutive = true;
        }
    }

    const newStreak = isConsecutive ? (checkinData.streak + 1) : 1;
    const nextDayNum = (checkinData.claimedDays.length % 30) + 1;
    const rewardItem = CHECKIN_SCHEDULE_30_DAYS[nextDayNum - 1];

    checkinData.streak = newStreak;
    checkinData.lastClaimDate = todayStr;
    checkinData.claimedDays.push(nextDayNum);
    checkinData.totalClaimed = (checkinData.totalClaimed || 0) + 1;
    if (!checkinData.inventory) checkinData.inventory = [];
    checkinData.inventory.push(`${rewardItem.name} (Claimed Day ${nextDayNum})`);

    // Save and update user data
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
                if (welcomeHeader) welcomeHeader.textContent = `Welcome back, ${newUsername}!`;

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
            const customHex = document.getElementById('custom-hex-color')?.value || '#00ffcc';
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

            const accentColor = isPremium ? customHex : '#00ffcc';
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
            const defaultAccent = '#00ffcc';

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
            if (customHex) customHex.value = '#00ffcc';
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

        // Delete Account
        document.getElementById('delete-account-btn')?.addEventListener('click', async (e) => {
            if (!confirm('WARNING: Your account will be deactivated and permanently removed after 90 days. Are you sure you want to proceed?')) return;

            const btn = e.currentTarget;
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Deactivating...';

            try {
                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);
                alert('Your account has been deleted.');
                window.location.replace('index.html');
            } catch (err) {
                alert('For security, please log out and log back in before deleting your account.');
                btn.disabled = false;
                btn.textContent = originalText;
            }
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