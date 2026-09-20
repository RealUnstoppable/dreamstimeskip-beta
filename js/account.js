import { auth, db, getCachedUserProfile } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { productMap } from './products.js';
import { escapeHTML, formatDate, getCachedUserProfile } from './utils.js';

// DOM Elements
const profileDetails = document.getElementById('profile-details');
const ordersList = document.getElementById('orders-list');






// State Caches
let currentProfileCache = null;
let currentOrdersCache = null;

// Render Profile
async function renderProfile(user, userDataParam = null) {
    try {
        let userData = userDataParam || await getCachedUserProfile(user.uid);
        if (!userData) {
            // Graceful instantiation if user doc is missing
            userData = {
                email: user.email,
                username: user.email.split('@')[0],
                membershipLevel: 'free',
                isAdmin: false,
                isBanned: false,
                signupDate: new Date()
            };
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, userData, { merge: true });
        }

        // Memoization check
        const serializedData = JSON.stringify(userData);
        if (serializedData === currentProfileCache) return;
        currentProfileCache = serializedData;

        profileDetails.innerHTML = `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Username:</strong> <span>${escapeHTML(userData.username || 'User')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Email:</strong> <span>${escapeHTML(userData.email || user.email)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <strong>Membership:</strong> <span class="membership-status ${escapeHTML(userData.membershipLevel)}">${escapeHTML(userData.membershipLevel).toUpperCase()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <strong>Joined:</strong> <span>${formatDate(userData.signupDate)}</span>
            </div>
        `;
    } catch (error) {
        console.error("Manager info: Error rendering profile:", error);
        profileDetails.innerHTML = `<p style="color: var(--accent-red);">Failed to load profile. Please try again later.</p>`;
    }
}

// Render Orders
async function renderOrders(user) {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("orderDate", "desc")
        );

        const querySnapshot = await getDocs(q);

        // Memoization check
        const serializedOrders = JSON.stringify(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        if (serializedOrders === currentOrdersCache) return;
        currentOrdersCache = serializedOrders;

        if (querySnapshot.empty) {
            ordersList.innerHTML = `<p class="empty-message" style="color: var(--text-secondary); text-align: center; padding: 20px;">You haven't placed any orders yet.</p>`;
            return;
        }

        const fragment = document.createDocumentFragment();

        querySnapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const orderId = docSnap.id;

            let totalCost = 0;
            let itemsHtml = '';

            if (order.items) {
                for (const [productId, quantity] of Object.entries(order.items)) {
                    const product = productMap.get(productId) || { name: productId, price: 0 };
                    totalCost += product.price * quantity;
                    itemsHtml += `<div class="order-item">• ${quantity}x ${escapeHTML(product.name)}</div>`;
                }
            }

            // Add tax logic matching checkout
            const subtotal = totalCost;
            const tax = subtotal * 0.07;
            const finalTotal = subtotal + tax;

            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-card-header">
                    <div>
                        <strong>Order #${escapeHTML(orderId.split('_')[1] || orderId)}</strong>
                        <div class="order-date">${formatDate(order.orderDate)}</div>
                    </div>
                    <div class="order-status-container">
                        <span class="order-status-badge">
                            ${escapeHTML(order.status || 'Processing')}
                        </span>
                        <div class="order-total">$${finalTotal.toFixed(2)}</div>
                    </div>
                </div>
                <div>
                    <strong>Items:</strong>
                    <div class="order-items-list">
                        ${itemsHtml || '<div class="order-item">No items found.</div>'}
                    </div>
                    ${order.shippingInfo ? `
                    <div class="order-shipping-info">
                        <strong>Shipping To:</strong> ${escapeHTML(order.shippingInfo.name)} - ${escapeHTML(order.shippingInfo.city)}
                    </div>
                    ` : ''}
                </div>
            `;
            fragment.appendChild(orderCard);
        });

        ordersList.innerHTML = ''; // Clear loading text
        ordersList.appendChild(fragment);

    } catch (error) {
        console.error("Manager info: Error rendering orders:", error);
        ordersList.innerHTML = `<p style="color: var(--accent-red);">Failed to load order history. Please try again later.</p>`;
    }
}


// Rewards Logic
// Rewards merged function below

// Authentication State Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        let userData = null;
        try {
            userData = await getCachedUserProfile(user);
        } catch (e) {
            console.error("Manager info: Error fetching user profile:", e);
        }

        renderProfile(user, userData);
        renderOrders(user);
        if (userData) {
            renderRewards(user, userData);
        }
    } else {
        window.location.replace('/sign in beta.html');
    }
});

let currentRewardsCache = null;

async function renderRewards(user, userData) {
    try {
        const pointsEl = document.getElementById('user-loyalty-points');
        const historyList = document.getElementById('rewards-history-list');
        const msgEl = document.getElementById('no-rewards-msg');

        if (pointsEl && userData) {
            pointsEl.textContent = userData.loyaltyPoints || 0;
        }

        const balanceEl = document.getElementById('points-balance-display');
        const container = document.getElementById('reward-transactions-list');

        let balance = 0;
        if (userData && typeof userData.pointsBalance === 'number') {
            balance = userData.pointsBalance;
        } else {
             const userRef = doc(db, 'users', user.uid);
             const userDoc = await getDoc(userRef);
             balance = userDoc.exists() && typeof userDoc.data().pointsBalance === 'number'
                ? userDoc.data().pointsBalance
                : 0;
        }

        if (balanceEl) {
             balanceEl.textContent = balance;
        }

        const loyaltyQ = query(
            collection(db, 'loyalty_transactions'),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const rewardQ = query(
            collection(db, 'reward_transactions'),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const [loyaltySnap, rewardSnap] = await Promise.all([getDocs(loyaltyQ), getDocs(rewardQ)]);

        const serializedRewards = JSON.stringify({
            loyalty: loyaltySnap.docs.map(d => ({id: d.id, ...d.data()})),
            rewards: rewardSnap.docs.map(d => ({id: d.id, ...d.data()}))
        });

        if (serializedRewards === currentRewardsCache) return;
        currentRewardsCache = serializedRewards;

        if (historyList) {
            if (loyaltySnap.empty) {
                if(msgEl) {
                    msgEl.textContent = "You haven't earned any rewards yet.";
                    msgEl.style.display = 'block';
                }
                historyList.innerHTML = '';
            } else {
                if(msgEl) msgEl.style.display = 'none';
                let html = '';
                loyaltySnap.forEach(docSnap => {
                    const data = docSnap.data();
                    const dateStr = formatDate(data.createdAt);
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color);">
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary);">${escapeHTML(data.description || 'Reward')}</div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary);">${dateStr}</div>
                            </div>
                            <div style="font-weight: bold; color: var(--accent-green);">+${data.points} pts</div>
                        </div>
                    `;
                });
                historyList.innerHTML = html;
            }
        }

        if (container) {
            if (rewardSnap.empty) {
                container.innerHTML = '<p style="color: var(--text-secondary);">No reward activity yet.</p>';
            } else {
                const fragment = document.createDocumentFragment();
                rewardSnap.forEach(docSnap => {
                    const data = docSnap.data();
                    const dateStr = formatDate(data.createdAt);
                    const el = document.createElement('div');
                    el.style.cssText = "display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 5px 0; font-size: 0.9rem;";

                    const amountColor = data.amount > 0 ? "var(--accent-green)" : "var(--text-color)";
                    const amountPrefix = data.amount > 0 ? "+" : "";

                    el.innerHTML = `
                        <div>
                            <span style="display: block; font-weight: bold;">${escapeHTML(data.reason || 'Reward')}</span>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">${dateStr}</span>
                        </div>
                        <div style="color: ${amountColor}; font-weight: bold;">
                            ${amountPrefix}${data.amount}
                        </div>
                    `;
                    fragment.appendChild(el);
                });
                container.innerHTML = '';
                container.appendChild(fragment);
            }
        }

    } catch (e) {
        console.error("Manager info: Error fetching rewards:", e);
        if(document.getElementById('points-balance-display')) document.getElementById('points-balance-display').textContent = 'Error';
        if(document.getElementById('reward-transactions-list')) document.getElementById('reward-transactions-list').innerHTML = '<p style="color: var(--accent-red);">Failed to load rewards.</p>';
        if(document.getElementById('no-rewards-msg')) {
             document.getElementById('no-rewards-msg').textContent = "Failed to load rewards history.";
             document.getElementById('no-rewards-msg').style.display = 'block';
        }
    }
}