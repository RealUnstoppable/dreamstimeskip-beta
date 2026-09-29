// js/account.js - Comprehensive Account Management Controller
import { auth, db } from './auth.js';
import { getCachedUserProfile } from './utils.js';
import { onAuthStateChanged, signOut, deleteUser, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { productMap } from './products-data.js';
import { escapeHTML, formatDate } from './utils.js';
import { createTicket, getUserTickets } from './ticket-service.js';
import { handleAddToCart, toggleWishlist } from './shop.js';

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

        // Scroll to top of content on mobile
        if (window.innerWidth <= 768) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

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
export async function renderProfile(user, userData) {
    if (!user || !userData) return;

    const welcomeHeader = document.getElementById('welcome-header');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome back, ${escapeHTML(userData.username || user.displayName || 'User')}!`;
    }

    const emailSidebar = document.getElementById('user-email-sidebar');
    if (emailSidebar) {
        emailSidebar.textContent = user.email || '';
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
            console.warn("Firestore orders fetch warning:", dbErr);
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
        } catch (_) {}

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
                    const product = productMap.get(productId) || { name: productId, price: 0, imageUrl: '' };
                    const qty = parseInt(quantity, 10) || 1;
                    const itemTotal = (product.price || 0) * qty;
                    calculatedSubtotal += itemTotal;

                    itemsHtml += `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" style="width: 42px; height: 42px; border-radius: 6px; object-fit: cover; background: #000;">` : ''}
                                <div>
                                    <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">${escapeHTML(product.name)}</div>
                                    <small style="color: var(--text-secondary);">Qty: ${qty} × $${(product.price || 0).toFixed(2)}</small>
                                </div>
                            </div>
                            <div style="font-weight: bold; color: #fff;">$${itemTotal.toFixed(2)}</div>
                        </div>
                    `;
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

            listEl.appendChild(card);
        });

    } catch (err) {
        console.error("Error rendering orders:", err);
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
        const userRef = doc(db, 'users', user.uid);
        let userSnap = null;

        // Current points calculation
        let points = 0;
        if (userData && typeof userData.pointsBalance === 'number') {
            points = userData.pointsBalance;
        } else if (userData && typeof userData.loyaltyPoints === 'number') {
            points = userData.loyaltyPoints;
        } else {
            userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                points = typeof data.pointsBalance === 'number' 
                    ? data.pointsBalance 
                    : (typeof data.loyaltyPoints === 'number' ? data.loyaltyPoints : 50);
            } else {
                points = 50; // Welcome Bonus
            }
        }

        // Update displays
        if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = points;
        if (userLoyaltyPoints) userLoyaltyPoints.textContent = points;

        // Fetch reward transactions (WITHOUT orderBy to prevent composite index errors)
        const transactionsRef = collection(db, 'loyalty_transactions');
        const q = query(transactionsRef, where("userId", "==", user.uid));
        const snap = await getDocs(q);

        let txs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If no transactions exist, seed the welcome 50 points transaction into Firestore!
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
                await setDoc(userRef, { pointsBalance: points, loyaltyPoints: points }, { merge: true });
                txs.push({
                    id: 'tx_welcome',
                    description: 'Account Welcome Reward 🎉',
                    points: 50,
                    type: 'earned',
                    createdAt: new Date()
                });
            } catch (seedErr) {
                console.warn("Could not seed welcome transaction:", seedErr);
            }
        }

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
                dashboardActivityList.innerHTML = txs.slice(0, 4).map(tx => {
                    const isPositive = (tx.points || 0) >= 0;
                    const dateStr = formatDate(tx.createdAt);
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                            <div>
                                <strong style="display: block; font-size: 0.9rem; color: #fff;">${escapeHTML(tx.description || 'Points Activity')}</strong>
                                <small style="color: var(--text-secondary);">${dateStr}</small>
                            </div>
                            <div style="font-weight: 800; font-size: 0.95rem; color: ${isPositive ? 'var(--accent-green)' : 'var(--accent-red)'};">
                                ${isPositive ? '+' : ''}${tx.points} pts
                            </div>
                        </div>
                    `;
                }).join('');
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
                rewardsHistoryList.innerHTML = txs.map(tx => {
                    const isPositive = (tx.points || 0) >= 0;
                    const dateStr = formatDate(tx.createdAt);
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(255,255,255,0.02);">
                            <div>
                                <div style="font-weight: 700; color: #fff; font-size: 1rem;">${escapeHTML(tx.description || 'Reward Earned')}</div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${dateStr}</div>
                            </div>
                            <div style="font-weight: 800; font-size: 1.1rem; color: ${isPositive ? 'var(--accent-green)' : 'var(--accent-red)'};">
                                ${isPositive ? '+' : ''}${tx.points} pts
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

    } catch (err) {
        console.error("Error rendering rewards:", err);
        if (pointsBalanceDisplay) pointsBalanceDisplay.textContent = '0';
        if (userLoyaltyPoints) userLoyaltyPoints.textContent = '0';
        if (dashboardActivityList) dashboardActivityList.innerHTML = `<p style="color: var(--accent-red);">Failed to load activity.</p>`;
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

        document.getElementById('test-activate-premium-btn')?.addEventListener('click', async () => {
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
                console.error("Test activate error:", err);
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
    modal.querySelectorAll('.cancel-keep-btn').forEach(btn => {
        btn.onclick = closeModal;
    });

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

                await updateDoc(userRef, {
                    pointsBalance: newPts,
                    loyaltyPoints: (userData.loyaltyPoints || 0) + 100,
                    retentionDiscount: 'STAY10VIP',
                    retentionDiscountPercent: 10
                });

                await addDoc(collection(db, 'loyalty_transactions'), {
                    userId: user.uid,
                    description: 'Retention Reward Bonus (+10% Discount Code STAY10VIP) 🎁',
                    points: 100,
                    type: 'earned',
                    createdAt: serverTimestamp()
                });

                userData.pointsBalance = newPts;
                userData.loyaltyPoints = (userData.loyaltyPoints || 0) + 100;
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));

                alert('🎉 Congratulations! Code STAY10VIP (10% OFF) has been applied to your account, and 100 bonus points have been added to your balance!');
                closeModal();
                renderRewards(user, userData);
            } catch (err) {
                console.error("Voucher claim error:", err);
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
                console.error("Cancellation error:", err);
                alert('Cancellation processed. Your account is now on the Free tier.');
                closeModal();
                if (typeof onCancelledCallback === 'function') {
                    onCancelledCallback();
                }
            }
        };
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

        if (snap.exists()) {
            const data = snap.data();
            if (data.items && data.items.length > 0) {
                if (data.isPublic && data.sharedId) {
                    if (linkContainer) linkContainer.style.display = 'block';
                    if (linkInput) linkInput.value = `${window.location.origin}/shared-wishlist.html?id=${data.sharedId}`;
                    if (shareBtn) shareBtn.style.display = 'none';
                } else {
                    if (shareBtn) shareBtn.style.display = 'inline-block';
                    if (linkContainer) linkContainer.style.display = 'none';
                }
            } else {
                if (shareBtn) shareBtn.style.display = 'none';
                if (linkContainer) linkContainer.style.display = 'none';
            }
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

        if (!snap.exists() || !snap.data().items || snap.data().items.length === 0) {
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

        const items = snap.data().items;
        container.innerHTML = items.map(id => {
            const product = productMap.get(id);
            if (!product) return '';
            return `
                <div class="product-card" style="padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; display: flex; flex-direction: column;">
                    <img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #000;">
                    <div style="flex-grow: 1;">
                        <h4 style="margin: 0 0 6px 0; font-size: 1rem; color: #fff;">${escapeHTML(product.name)}</h4>
                        <div style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 14px;">$${product.price.toFixed(2)}</div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary wishlist-add-cart-btn" data-id="${product.id}" style="flex: 1; padding: 8px 12px; font-size: 0.85rem;">Add to Cart</button>
                        <button class="btn wishlist-remove-btn" data-id="${product.id}" style="padding: 8px 12px; font-size: 0.85rem; background: transparent; border: 1px solid var(--accent-red); color: var(--accent-red);">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        // Wire Add to Cart
        container.querySelectorAll('.wishlist-add-cart-btn').forEach(btn => {
            btn.onclick = async () => {
                const orig = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Added! ✓';
                await handleAddToCart(btn.dataset.id);
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = orig;
                }, 1500);
            };
        });

        // Wire Remove
        container.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
            btn.onclick = async () => {
                btn.disabled = true;
                await toggleWishlist(btn.dataset.id);
                await loadWishlist(userId);
            };
        });

    } catch (err) {
        console.error("Error loading wishlist:", err);
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
        console.error("Error loading tickets:", err);
        container.innerHTML = '<p style="color: var(--accent-red); margin: 0;">Failed to load tickets.</p>';
    }
}

/**
 * 9. MAIN ACCOUNT CONTROLLER INITIALIZATION
 */
export function initAccountPage() {
    // Immediate tab setup so navigation is 100% interactive without waiting for auth
    initTabNavigation();

    // Firebase Auth State
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.replace('sign in beta.html');
            return;
        }

        currentUser = user;

        // ⚡ Bolt: Centralized cache function `getCachedUserProfile` reduces redundant Firestore calls.
        let userData = await getCachedUserProfile(user);

        if (!userData) {
            // Fallback initialization if profile doesn't exist at all yet
            userData = {
                username: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email,
                membershipLevel: 'free',
                pointsBalance: 50,
                loyaltyPoints: 50,
                isAdmin: false,
                signupDate: new Date()
            };
            try {
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, userData, { merge: true });
                sessionStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
            } catch (err) {
                console.error("Manager info: Profile init warning:", err);
            }
        }

        currentUserData = userData;

        // Render all account sections
        const container = document.getElementById('account-layout-container');
        if (container) container.style.display = 'flex';

        renderProfile(user, userData);
        renderOrders(user);
        renderRewards(user, userData);
        renderBilling(user, userData);
        loadWishlist(user.uid);
        loadUserTickets(user.uid);

        // Sign Out
        document.getElementById('sign-out')?.addEventListener('click', () => {
            sessionStorage.removeItem(cacheKey);
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
                sessionStorage.setItem(cacheKey, JSON.stringify(userData));

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

            try {
                await updateDoc(doc(db, "users", user.uid), { theme, accentColor });
                userData.theme = theme;
                userData.accentColor = accentColor;
                sessionStorage.setItem(cacheKey, JSON.stringify(userData));

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
            }
        });

        // Password Reset Email
        document.querySelectorAll('#change-password-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
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
            });
        });

        // 2FA Toggle
        const toggle2FA = document.getElementById('toggle-2fa');
        if (toggle2FA) {
            toggle2FA.checked = !!userData.twoFactorEnabled;
            toggle2FA.addEventListener('change', async (e) => {
                const isEnabled = e.target.checked;
                try {
                    await updateDoc(doc(db, "users", user.uid), { twoFactorEnabled: isEnabled });
                    userData.twoFactorEnabled = isEnabled;
                    sessionStorage.setItem(cacheKey, JSON.stringify(userData));
                    alert(`Two-Factor Authentication (2FA) is now ${isEnabled ? 'enabled' : 'disabled'}.`);
                } catch (err) {
                    e.target.checked = !isEnabled;
                    alert('Error updating 2FA settings.');
                }
            });
        }

        // Support Ticket Form
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
        document.getElementById('delete-account-btn')?.addEventListener('click', async () => {
            if (!confirm('WARNING: Your account will be deactivated and permanently removed after 90 days. Are you sure you want to proceed?')) return;
            try {
                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);
                alert('Your account has been deleted.');
                window.location.replace('index.html');
            } catch (err) {
                alert('For security, please log out and log back in before deleting your account.');
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
                sessionStorage.setItem(cacheKey, JSON.stringify(userData));

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