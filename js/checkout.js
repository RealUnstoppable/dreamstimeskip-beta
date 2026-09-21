// js/checkout.js
import { auth, db, safeRedirect } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, runTransaction } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { products, productMap } from './products.js';
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML, getCachedUserProfile } from "./utils.js";

let currentUser = null;
let userCart = {};
let discount = 0;
let appliedPromo = '';
let pointsToRedeem = 0;

export function setCurrentUser(user) {
    currentUser = user;
}

export function setUserCart(cart) {
    userCart = cart;
}

const checkoutContainer = document.getElementById('checkout-container');

function renderCheckoutPage() {
    if (!checkoutContainer) return;

    if (Object.keys(userCart).length === 0) {
        checkoutContainer.innerHTML = '<h1>Your cart is empty.</h1><a href="/shop.html" class="cta-button">Continue Shopping</a>';
        return;
    }

    const renderSummary = () => {
        const { totalPrice: subtotal } = calculateCartSummary(userCart, productMap);
        
        const discountAmount = subtotal * discount;
        const discountedSubtotal = subtotal - discountAmount;
        const tax = discountedSubtotal * 0.07;
        const total = discountedSubtotal + tax;

        return { subtotal, discountAmount, discountedSubtotal, tax, total };
    };

    const updateSummaryUI = () => {
        const { subtotal, discountAmount, discountedSubtotal, tax, total } = renderSummary();
        document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('summary-discount').textContent = `-$${discountAmount.toFixed(2)}`;
        document.getElementById('summary-discount-row').style.display = discount > 0 ? 'flex' : 'none';
        document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
        const points = Math.floor(subtotal * 10);
        document.getElementById('summary-points').textContent = `✨ You will earn ${points} Unstoppable Points with this order!`;

    };

    const { subtotal, discountAmount, tax, total } = renderSummary();

    checkoutContainer.innerHTML = `
        <h1>Checkout</h1>
        <div class="checkout-layout">
            <div class="checkout-form-container">
                <form id="checkout-form">
                    <section>
                        <h3>Shipping Information</h3>
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" ${currentUser ? `value="${escapeHTML(currentUser.email || '')}"` : 'placeholder="you@example.com"'} required>
                        </div>
                        <div class="form-group">
                            <label for="address">Address</label>
                            <input type="text" id="address" required>
                        </div>
                        <div class="form-group-inline">
                            <div class="form-group">
                                <label for="city">City</label>
                                <input type="text" id="city" required>
                            </div>
                            <div class="form-group">
                                <label for="zip">ZIP Code</label>
                                <input type="text" id="zip" required>
                            </div>
                        </div>
                    </section>
                    
                    <section style="margin-top: 30px;">
                        <h3>Payment Information (Stripe Test)</h3>
                        <div class="form-group">
                            <label for="card-number">Card Number</label>
                            <input type="text" id="card-number" placeholder="4242 4242 4242 4242" required>
                        </div>
                        <div class="form-group-inline">
                            <div class="form-group">
                                <label for="card-expiry">Expiry (MM/YY)</label>
                                <input type="text" id="card-expiry" placeholder="12/26" required>
                            </div>
                            <div class="form-group">
                                <label for="card-cvc">CVC</label>
                                <input type="text" id="card-cvc" placeholder="123" required>
                            </div>
                        </div>
                    </section>

                    <div style="background: rgba(255, 255, 0, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeeba; margin-top: 20px;">
                        <p style="margin: 0; color: #ffca2c; font-size: 0.9rem;"><strong>TEST MODE:</strong> Use the test card number 4242 4242 4242 4242 to simulate a successful payment.</p>
                    </div>
                    <button type="submit" class="cta-button place-order-button" id="place-order-btn">Pay Now</button>
                    <div id="checkout-message"></div>
                </form>
            </div>
            <div class="checkout-summary-container">
                <h3>Order Summary</h3>
                <div id="summary-items">
                    ${Object.entries(userCart).map(([productId, quantity]) => {
                        const product = productMap.get(productId);
                        return `<div class="summary-item"><span>${quantity}x ${escapeHTML(product.name)}</span> <span>$${(product.price * quantity).toFixed(2)}</span></div>`;
                    }).join('')}
                </div>
                
                
                <div class="form-group" style="margin-top: 20px;">
                    <label for="promo-code" style="font-size: 0.9rem;">Promo Code</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="promo-code" placeholder="e.g. DTS10" style="flex: 1; padding: 8px;">
                        <button type="button" id="apply-promo-btn" style="padding: 8px 15px; background: var(--text-secondary); color: white; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
                    </div>
                    <small id="promo-message" class="promo-message-text"></small>
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <label for="points-slider" style="font-size: 0.9rem; display: flex; justify-content: space-between;">
                        <span>Loyalty Points</span>
                        <span>Available: <strong id="points-available">${window.userPointsBalance}</strong></span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" id="points-slider" min="0" max="${window.userPointsBalance}" step="100" value="0" style="flex: 1;">
                        <span style="font-weight: bold;" id="points-to-redeem-display">0</span>
                    </div>
                    <small id="points-message" style="display: block; margin-top: 5px; color: var(--accent-green);">100 points = $1.00 off</small>
                </div>


                <div class="summary-calculation">
                    <div class="summary-item"><span>Subtotal</span> <span id="summary-subtotal">$${subtotal.toFixed(2)}</span></div>
                    <div class="summary-item discount-row" id="summary-discount-row"><span>Discount</span> <span id="summary-discount">-$0.00</span></div>
                    <div class="summary-item"><span>Tax</span> <span id="summary-tax">$${tax.toFixed(2)}</span></div>

                    <div class="summary-total"><span>Total</span> <span id="summary-total">${total.toFixed(2)}</span></div>
                    <div style="margin-top: 15px; font-size: 0.9rem; color: var(--accent-blue); text-align: center; font-weight: 500;" id="summary-points">✨ You will earn ${Math.floor(subtotal * 10)} Unstoppable Points with this order!</div>

                </div>
            </div>
        </div>
    `;

    document.getElementById('apply-promo-btn').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const originalText = btn.textContent;
        const code = document.getElementById('promo-code').value.trim().toUpperCase();
        const msgEl = document.getElementById('promo-message');
        if (!code) {
            msgEl.textContent = 'Please enter a promo code.';
            msgEl.style.color = 'var(--accent-red)';
            discount = 0;
            appliedPromo = '';
            updateSummaryUI();
            return;
        }
        msgEl.textContent = 'Applying...';
        msgEl.style.color = 'var(--text-secondary)';

        btn.disabled = true;
        btn.textContent = 'Applying...';
        btn.title = 'Processing your request...';

        try {
            const promoRef = doc(db, 'promo_codes', code);
            const promoSnap = await getDoc(promoRef);
            if (promoSnap.exists()) {
                const promoData = promoSnap.data();
                if (promoData.active) {
                    discount = promoData.discount / 100;
                    appliedPromo = code;
                    msgEl.textContent = `${promoData.discount}% discount applied!`;
                    msgEl.style.color = 'var(--accent-green)';
                } else {
                    discount = 0;
                    appliedPromo = '';
                    msgEl.textContent = 'Promo code is inactive.';
                    msgEl.style.color = 'var(--accent-red)';
                }
            } else {
                discount = 0;
                appliedPromo = '';
                msgEl.textContent = 'Invalid promo code.';
                msgEl.style.color = 'var(--accent-red)';
            }
        } catch (error) {
            console.error('Manager info: Error applying promo code:', error);
            discount = 0;
            appliedPromo = '';
            msgEl.textContent = 'Error applying promo code.';
            msgEl.style.color = 'var(--accent-red)';
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.removeAttribute('title');
        }
        updateSummaryUI();
    });

    
    const pointsSlider = document.getElementById('points-slider');
    if (pointsSlider) {
        pointsSlider.addEventListener('input', (e) => {
            pointsToRedeem = parseInt(e.target.value, 10) || 0;
            document.getElementById('points-to-redeem-display').textContent = pointsToRedeem;
            updateSummaryUI();
        });
    }

    document.getElementById('checkout-form').addEventListener('submit', handlePlaceOrder);
}


function updateSummaryUI() {
    let subtotal = 0;
    Object.entries(userCart).forEach(([productId, quantity]) => {
        const product = productMap.get(productId);
        if (product) subtotal += product.price * quantity;
    });

    const promoDiscountAmount = subtotal * discount;
    const pointsDiscountAmount = pointsToRedeem / 100;
    const totalDiscount = promoDiscountAmount + pointsDiscountAmount;
    
    let subtotalAfterDiscount = subtotal - totalDiscount;
    if (subtotalAfterDiscount < 0) subtotalAfterDiscount = 0;
    
    const tax = subtotalAfterDiscount * 0.08;
    const total = subtotalAfterDiscount + tax;

    document.getElementById('summary-subtotal').textContent = `${subtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById('summary-discount-row');
    if (totalDiscount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('summary-discount').textContent = `-${totalDiscount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('summary-tax').textContent = `${tax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `${total.toFixed(2)}`;
    document.getElementById('summary-points').textContent = `✨ You will earn ${Math.floor(subtotalAfterDiscount * 10)} Unstoppable Points with this order!`;
}


export async function processOrderTransaction(uid, cart, orderDetails) {
    const orderDocId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const fullOrder = {
        orderId: orderDocId,
        userId: uid || 'guest',
        userEmail: orderDetails.email || '',
        items: cart,
        orderDate: serverTimestamp(),
        status: 'Paid',
        total: orderDetails.total || 0,
        shippingInfo: orderDetails.shippingInfo,
        paymentStatus: 'Paid via Stripe Test (Card ending in 4242)',
        appliedPromo: orderDetails.appliedPromo || '',
        pointsRedeemed: orderDetails.pointsRedeemed || 0,
        earnedPoints: orderDetails.earnedPoints || 0
    };

    // If signed in, write to Firestore
    if (currentUser && currentUser.uid) {
        try {
            await addDoc(collection(db, 'orders'), fullOrder);
            await setDoc(doc(db, 'carts', currentUser.uid), { items: {} });

            if (orderDetails.earnedPoints) {
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const currentPoints = userSnap.data().pointsBalance || 0;
                    const newBal = Math.max(0, currentPoints - (orderDetails.pointsRedeemed || 0) + orderDetails.earnedPoints);
                    await setDoc(userRef, { pointsBalance: newBal }, { merge: true });
                }
            }
        } catch (dbErr) {
            console.warn("Firestore order write warning:", dbErr);
        }
    }

    // Always clear localStorage cart
    localStorage.removeItem('localCart');
    localStorage.removeItem('cartItemCount');
    localStorage.setItem('lastCompletedOrder', JSON.stringify({
        ...fullOrder,
        orderDate: new Date().toISOString()
    }));

    // Broadcast cartUpdated event so Lexi and headers clear the count
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {}, itemCount: 0, totalPrice: 0 } }));
    if (typeof window.updateLexiCartCount === 'function') {
        window.updateLexiCartCount(0);
    }

    return orderDocId;
}

export async function handlePlaceOrder(e) {
    e.preventDefault();
    const placeOrderBtn = document.getElementById('place-order-btn');
    const messageEl = document.getElementById('checkout-message');
    
    // Stripe Test Logic
    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
    if (!cardNumber.startsWith('4242') || cardNumber.length < 16) {
        messageEl.textContent = 'Payment Failed: Please use the Stripe test card 4242 4242 4242 4242.';
        messageEl.style.color = 'var(--accent-red)';
        return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing Payment...';

    const emailInput = document.getElementById('email');
    const emailVal = emailInput ? emailInput.value : (currentUser ? currentUser.email : '');

    // Calculate final total
    let subtotal = 0;
    Object.entries(userCart).forEach(([productId, quantity]) => {
        const product = productMap.get(productId);
        if (product) subtotal += product.price * quantity;
    });
    const promoDiscountAmount = subtotal * discount;
    const pointsDiscountAmount = pointsToRedeem / 100;
    const totalDiscount = promoDiscountAmount + pointsDiscountAmount;
    const subtotalAfterDiscount = Math.max(0, subtotal - totalDiscount);
    const tax = subtotalAfterDiscount * 0.08;
    const finalTotal = subtotalAfterDiscount + tax;

    const shippingInfo = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
    };

    const orderDetails = {
        email: emailVal,
        total: finalTotal,
        shippingInfo: shippingInfo,
        appliedPromo: appliedPromo,
        pointsRedeemed: pointsToRedeem,
        earnedPoints: Math.floor(subtotalAfterDiscount * 10)
    };

    try {
        const orderId = await processOrderTransaction(currentUser ? currentUser.uid : null, userCart, orderDetails);

        // Render sleek order confirmation receipt
        checkoutContainer.innerHTML = `
            <div style="max-width: 620px; margin: 30px auto; text-align: center; background: var(--primary-card-color, #1a1a24); border: 1px solid var(--border-color, #333); border-radius: 20px; padding: 40px 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 255, 204, 0.15); border: 2px solid #00ffcc; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #00ffcc; font-size: 2rem;">✓</div>
                <h1 style="color: #ffffff; font-size: 1.8rem; margin-bottom: 8px;">Payment Successful!</h1>
                <p style="color: var(--text-secondary, #aaa); margin-bottom: 25px; font-size: 0.95rem;">
                    Thank you, <strong>${escapeHTML(shippingInfo.name)}</strong>. Your order has been placed and confirmed.
                </p>
                
                <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 18px 20px; margin-bottom: 25px; text-align: left; font-size: 0.9rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                        <span style="color: var(--text-secondary, #888);">Order Reference:</span>
                        <strong style="color: #00ffcc; font-family: monospace; letter-spacing: 1px;">#${orderId}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                        <span style="color: var(--text-secondary, #888);">Payment Method:</span>
                        <span style="color: #ffffff;">Stripe Test (•••• 4242)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                        <span style="color: var(--text-secondary, #888);">Total Charged:</span>
                        <strong style="color: #00ffcc; font-size: 1.05rem;">$${finalTotal.toFixed(2)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color: var(--text-secondary, #888);">Shipping Destination:</span>
                        <span style="color: #ffffff; text-align: right;">${escapeHTML(shippingInfo.address)}, ${escapeHTML(shippingInfo.city)} ${escapeHTML(shippingInfo.zip)}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="shop.html" class="cta-button" style="padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Continue Shopping</a>
                    <a href="account.html#orders" class="cta-button" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Order History</a>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Manager info: Error placing order:", error.message);
        messageEl.textContent = 'There was an error placing your order. Please try again.';
        messageEl.style.color = 'var(--accent-red)';
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Pay Now';
    }
}

onAuthStateChanged(auth, async (user) => {
    let localCart = {};
    try {
        const localRaw = localStorage.getItem('localCart');
        if (localRaw) localCart = JSON.parse(localRaw);
    } catch (_) {}

    if (user) {
        currentUser = user;
        try {
            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};
            userCart = (firestoreCart && Object.keys(firestoreCart).length > 0) ? firestoreCart : localCart;
        } catch (_) {
            userCart = localCart;
        }

        try {
            const userData = await getCachedUserProfile(user);
            window.userPointsBalance = userData ? (userData.pointsBalance || 0) : 0;
        } catch (_) {
            window.userPointsBalance = 0;
        }
    } else {
        currentUser = null;
        userCart = localCart;
        window.userPointsBalance = 0;
    }

    renderCheckoutPage();
});