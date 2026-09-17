import { auth, db, getCachedUserProfile } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { productMap } from './products.js';
import { escapeHTML, formatDate } from './utils.js';
import { getCachedUserProfile } from './auth.js';

// DOM Elements
const profileDetails = document.getElementById('profile-details');
const ordersList = document.getElementById('orders-list');






// State Caches
let currentProfileCache = null;
let currentOrdersCache = null;

// Render Profile
async function renderProfile(user) {
    try {
        let userData = await getCachedUserProfile(user.uid);
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
        console.error("Error rendering profile:", error);
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
            ordersList.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 20px;">You haven't placed any orders yet.</p>`;
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
                    itemsHtml += `<div style="font-size: 0.9rem; color: var(--text-secondary);">• ${quantity}x ${escapeHTML(product.name)}</div>`;
                }
            }

            // Add tax logic matching checkout
            const subtotal = totalCost;
            const tax = subtotal * 0.07;
            const finalTotal = subtotal + tax;

            const orderCard = document.createElement('div');
            orderCard.style.cssText = "background: var(--bg-card); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
            orderCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <div>
                        <strong>Order #${escapeHTML(orderId.split('_')[1] || orderId)}</strong>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">${formatDate(order.orderDate)}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; background: rgba(136, 211, 206, 0.2); color: var(--accent-green); font-weight: bold;">
                            ${escapeHTML(order.status || 'Processing')}
                        </span>
                        <div style="font-weight: bold; margin-top: 5px;">$${finalTotal.toFixed(2)}</div>
                    </div>
                </div>
                <div>
                    <strong>Items:</strong>
                    <div style="margin-top: 5px; margin-bottom: 15px;">
                        ${itemsHtml || '<div style="font-size: 0.9rem; color: var(--text-secondary);">No items found.</div>'}
                    </div>
                    ${order.shippingInfo ? `
                    <div style="font-size: 0.85rem; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 10px;">
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
        console.error("Error rendering orders:", error);
        ordersList.innerHTML = `<p style="color: var(--accent-red);">Failed to load order history. Please try again later.</p>`;
    }
}


// Rewards Logic
async function renderRewards(user, userData) {
    const pointsEl = document.getElementById('user-loyalty-points');
    const historyList = document.getElementById('rewards-history-list');
    const msgEl = document.getElementById('no-rewards-msg');

    if (pointsEl && userData) {
        pointsEl.textContent = userData.loyaltyPoints || 0;
    }

    if (historyList) {
        try {
            const q = query(
                collection(db, 'loyalty_transactions'),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                msgEl.textContent = "You haven't earned any rewards yet.";
                msgEl.style.display = 'block';
                historyList.innerHTML = '';
                return;
            }

            msgEl.style.display = 'none';
            let html = '';

            querySnapshot.forEach(docSnap => {
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
        } catch (error) {
            console.error("Manager info: Error rendering rewards:", error);
            msgEl.textContent = "Failed to load rewards history.";
            msgEl.style.display = 'block';
        }
    }
}

// Authentication State Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        let userData = null;
        try {
            const cacheKey = `profile_${user.uid}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                userData = JSON.parse(cachedData);
            } else {
                const docSnap = await getDoc(doc(db, 'users', user.uid));
                if (docSnap.exists()) {
                    userData = docSnap.data();
                }
            }
        } catch (e) {
            console.error(e);
        }

        renderProfile(user);
        renderOrders(user);
        if (userData) {
            renderRewards(user, userData);
        }
    } else {
        window.location.replace('/sign in beta.html');
    }
});

async function renderRewards(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const balance = userDoc.exists() && typeof userDoc.data().pointsBalance === 'number'
            ? userDoc.data().pointsBalance
            : 0;

        document.getElementById('points-balance-display').textContent = balance;

        const transRef = collection(db, 'reward_transactions');
        const q = query(
            transRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const container = document.getElementById('reward-transactions-list');

        if (snap.empty) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No reward activity yet.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        snap.forEach(docSnap => {
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

    } catch (e) {
        console.error("Manager info: Error fetching rewards:", e);
        document.getElementById('points-balance-display').textContent = 'Error';
        document.getElementById('reward-transactions-list').innerHTML = '<p style="color: var(--accent-red);">Failed to load rewards.</p>';
    }
}
