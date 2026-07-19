import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { productMap } from './products.js';

// DOM Elements
const profileDetails = document.getElementById('profile-details');
const ordersList = document.getElementById('orders-list');

// Utility to escape HTML
function escapeHTML(str) {
    if (typeof str !== 'string') return String(str).replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Format Date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

// Render Profile
async function renderProfile(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        let userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Graceful instantiation if user doc is missing
            await setDoc(userRef, {
                email: user.email,
                username: user.email.split('@')[0],
                membershipLevel: 'free',
                isAdmin: false,
                isBanned: false,
                signupDate: new Date()
            }, { merge: true });
            userDoc = await getDoc(userRef);
        }

        const userData = userDoc.data();

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
        console.error("Manager info: Error rendering orders:", error);
        ordersList.innerHTML = `<p style="color: var(--accent-red);">Failed to load order history. Please try again later.</p>`;
    }
}

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        renderProfile(user);
        renderOrders(user);
    } else {
        window.location.replace('/sign in beta.html');
    }
});
