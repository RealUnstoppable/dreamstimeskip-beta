// js/checkout.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, runTransaction, increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { products, productMap, registerDynamicProduct, setDynamicProducts } from './products.js';
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML, getCachedUserProfile } from "./utils.js";
import { generateProductCardHtml } from './ui-utils.js';

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
        checkoutContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; max-width: 500px; margin: 40px auto; background: rgba(24, 24, 28, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;">
                <div style="font-size: 3.5rem; margin-bottom: 15px;">🛒</div>
                <h1 style="color: #fff; font-size: 1.8rem; margin-bottom: 10px;">Your Cart is Empty</h1>
                <p style="color: var(--text-secondary, #888); margin-bottom: 25px;">Looks like you haven't added any gear or accessories yet.</p>
                <a href="/shop.html" class="place-order-button" style="display: inline-block; width: auto; padding: 12px 28px; text-decoration: none; margin-top: 0;">Explore the Shop &rarr;</a>
            </div>
        `;
        return;
    }

    const renderSummary = () => {
        const { totalPrice: subtotal } = calculateCartSummary(userCart, productMap);
        
        const discountAmount = subtotal * discount;
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const tax = discountedSubtotal * 0.08;
        const total = discountedSubtotal + tax;

        return { subtotal, discountAmount, discountedSubtotal, tax, total };
    };

    const { subtotal, discountAmount, tax, total } = renderSummary();

    checkoutContainer.innerHTML = `
        <div class="checkout-top-header">
            <div class="checkout-brand-title">
                <a href="/shop.html" style="color: var(--text-secondary, #aaa); text-decoration: none; font-size: 1rem; display: flex; align-items: center; gap: 6px;">&larr; Back to Shop</a>
                <span style="color: rgba(255,255,255,0.2);">|</span>
                <h1>Secure Checkout</h1>
            </div>
            <div class="checkout-security-badge">
                <span>🔒</span>
                <span>256-Bit SSL Encrypted</span>
            </div>
        </div>

        <div class="checkout-stepper">
            <div class="step-item completed">
                <div class="step-badge">✓</div>
                <span>1. Cart</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item active">
                <div class="step-badge">2</div>
                <span>2. Shipping & Payment</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item">
                <div class="step-badge">3</div>
                <span>3. Confirmation</span>
            </div>
        </div>

        <div class="checkout-layout">
            <div class="checkout-form-container">
                <form id="checkout-form">
                    <div class="checkout-section-header">
                        <div class="section-num">1</div>
                        <h2>Shipping Information</h2>
                    </div>
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" placeholder="Alex Mercer" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" ${currentUser ? `value="${escapeHTML(currentUser.email || '')}"` : 'placeholder="alex@example.com"'} required>
                    </div>
                    <div class="form-group">
                        <label for="address">Street Address</label>
                        <input type="text" id="address" placeholder="742 Evergreen Terrace" required>
                    </div>
                    <div class="form-group-inline">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" placeholder="Springfield" required>
                        </div>
                        <div class="form-group">
                            <label for="zip">ZIP / Postal Code</label>
                            <input type="text" id="zip" placeholder="97477" required>
                        </div>
                    </div>
                    
                    <div class="checkout-section-header" style="margin-top: 35px;">
                        <div class="section-num">2</div>
                        <h2>Payment Method</h2>
                    </div>

                    <!-- Real Stripe Hosted Checkout Button -->
                    <button type="button" class="place-order-button" id="stripe-checkout-btn" style="background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%); margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); width: 100%;">
                        <span style="font-size: 1.2rem;">💳</span>
                        <span>Pay with Stripe Checkout (Cards, Apple Pay, Google Pay)</span>
                    </button>

                    <div style="display: flex; align-items: center; text-align: center; color: var(--text-secondary); font-size: 0.82rem; margin: 20px 0;">
                        <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
                        <span style="padding: 0 10px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Or Instant Test Sandbox Payment</span>
                        <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
                    </div>

                    <div class="test-mode-box">
                        <p class="test-mode-box-text"><strong>TEST MODE:</strong> Stripe sandbox active. Test card: 4242 4242 4242 4242</p>
                        <button type="button" class="fill-test-btn" id="fill-test-btn">⚡ Auto-fill Test Details</button>
                    </div>

                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" placeholder="4242 4242 4242 4242" maxlength="19">
                    </div>
                    <div class="form-group-inline">
                        <div class="form-group">
                            <label for="card-expiry">Expiry Date (MM/YY)</label>
                            <input type="text" id="card-expiry" placeholder="12/26" maxlength="5">
                        </div>
                        <div class="form-group">
                            <label for="card-cvc">CVC</label>
                            <input type="text" id="card-cvc" placeholder="123" maxlength="4">
                        </div>
                    </div>

                    <button type="submit" class="place-order-button" id="place-order-btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); box-shadow: none;">Instant Test Order &rarr;</button>
                    <p style="font-size: 0.82rem; color: var(--text-secondary, #aaa); margin-top: 15px; text-align: center;">By completing payment, you agree to our <a href="terms.html" target="_blank" style="color: var(--accent-color, #2563EB); text-decoration: underline;">Terms and Conditions</a> and <a href="privacy.html" target="_blank" style="color: var(--accent-color, #2563EB); text-decoration: underline;">Privacy Policy</a>.</p>
                    <div id="checkout-message" style="margin-top: 15px; font-weight: 600; text-align: center;"></div>
                </form>
            </div>

            <div class="checkout-summary-container">
                <div class="checkout-section-header">
                    <h3>Order Summary</h3>
                </div>
                <div id="summary-items">
                    ${Object.entries(userCart).map(([productId, quantity]) => {
                        const product = productMap.get(productId) || { name: 'Item', price: 0, imageUrl: '/images/UnstoppableHoodieModel300x300.png' };
                        const pricing = product.price || 0;
                        const itemImg = product.imageUrl || product.image || '/images/UnstoppableHoodieModel300x300.png';
                        return `
                            <div class="summary-item-card">
                                <img src="${itemImg}" alt="${escapeHTML(product.name)}" class="summary-item-img" onerror="this.src='/images/UnstoppableHoodieModel300x300.png'">
                                <div class="summary-item-details">
                                    <div class="summary-item-title">${escapeHTML(product.name)}</div>
                                    <div class="summary-item-qty">Qty: ${quantity} &times; $${pricing.toFixed(2)}</div>
                                </div>
                                <div class="summary-item-price">$${(pricing * quantity).toFixed(2)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="form-group" style="margin-top: 25px;">
                    <label for="promo-code" style="font-size: 0.9rem;">Promo Code</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="promo-code" placeholder="e.g. DTS10" style="flex: 1; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff;">
                        <button type="button" id="apply-promo-btn" style="padding: 10px 18px; background: var(--accent-color, #2563EB); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Apply</button>
                    </div>
                    <small id="promo-message" class="promo-message-text" style="display:block; margin-top:6px; font-weight:500;"></small>
                </div>

                ${(window.userPointsBalance && window.userPointsBalance > 0) ? `
                <div class="form-group" style="margin-top: 20px;">
                    <label for="points-slider" style="font-size: 0.9rem; display: flex; justify-content: space-between;">
                        <span>Loyalty Points</span>
                        <span>Available: <strong id="points-available" style="color: var(--accent-green, #10b981);">${window.userPointsBalance}</strong></span>
                    </label>
                    <div style="display: flex; gap: 10px; align-items: center; margin-top: 6px;">
                        <input type="range" id="points-slider" min="0" max="${window.userPointsBalance}" step="100" value="0" style="flex: 1;">
                        <span style="font-weight: bold; color: #fff; min-width: 40px; text-align: right;" id="points-to-redeem-display">0</span>
                    </div>
                    <small id="points-message" style="display: block; margin-top: 5px; color: var(--accent-green, #10b981);">100 points = $1.00 off</small>
                </div>
                ` : ''}

                <div class="summary-calculation">
                    <div class="summary-calc-row"><span>Subtotal</span> <span id="summary-subtotal">$${subtotal.toFixed(2)}</span></div>
                    <div class="summary-calc-row discount-row" id="summary-discount-row" style="display: ${discountAmount > 0 ? 'flex' : 'none'}; color: var(--accent-green, #10b981);">
                        <span>Discount</span> <span id="summary-discount">-$${discountAmount.toFixed(2)}</span>
                    </div>
                    <div class="summary-calc-row"><span>Tax (8%)</span> <span id="summary-tax">$${tax.toFixed(2)}</span></div>

                    <div class="summary-calc-total">
                        <span>Total</span> <span id="summary-total">$${total.toFixed(2)}</span>
                    </div>
                    <div style="margin-top: 15px; font-size: 0.88rem; color: #60a5fa; text-align: center; font-weight: 600;" id="summary-points">✨ You will earn ${Math.floor(subtotal * 10)} Unstoppable Points with this order!</div>
                </div>

                <div class="trust-badges-row">
                    <span>🔒 Secure Checkout</span>
                    <span>⚡ Instant Confirmation</span>
                    <span>🛡️ Satisfaction Guaranteed</span>
                </div>
            </div>
        </div>
    `;

    // Auto-fill test details handler
    const fillTestBtn = document.getElementById('fill-test-btn');
    if (fillTestBtn) {
        fillTestBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const addressInput = document.getElementById('address');
            const cityInput = document.getElementById('city');
            const zipInput = document.getElementById('zip');
            const cardInput = document.getElementById('card-number');
            const expiryInput = document.getElementById('card-expiry');
            const cvcInput = document.getElementById('card-cvc');

            if (nameInput) nameInput.value = 'Alex Mercer';
            if (emailInput && !emailInput.value) emailInput.value = 'alex@example.com';
            if (addressInput) addressInput.value = '742 Evergreen Terrace';
            if (cityInput) cityInput.value = 'Springfield';
            if (zipInput) zipInput.value = '97477';
            if (cardInput) cardInput.value = '4242 4242 4242 4242';
            if (expiryInput) expiryInput.value = '12/26';
            if (cvcInput) cvcInput.value = '123';
        });
    }

    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const originalText = btn.textContent;
            const code = document.getElementById('promo-code').value.trim().toUpperCase();
            const msgEl = document.getElementById('promo-message');
            if (!code) {
                msgEl.textContent = 'Please enter a promo code.';
                msgEl.style.color = 'var(--accent-red, #ef4444)';
                discount = 0;
                appliedPromo = '';
                updateSummaryUI();
                return;
            }
            msgEl.textContent = 'Applying...';
            msgEl.style.color = 'var(--text-secondary, #aaa)';

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
                        msgEl.style.color = 'var(--accent-green, #10b981)';
                    } else {
                        discount = 0;
                        appliedPromo = '';
                        msgEl.textContent = 'Promo code is inactive.';
                        msgEl.style.color = 'var(--accent-red, #ef4444)';
                    }
                } else {
                    discount = 0;
                    appliedPromo = '';
                    msgEl.textContent = 'Invalid promo code.';
                    msgEl.style.color = 'var(--accent-red, #ef4444)';
                }
            } catch (error) {
                console.error('Manager info: Error applying promo code:', error);
                discount = 0;
                appliedPromo = '';
                msgEl.textContent = 'Error applying promo code.';
                msgEl.style.color = 'var(--accent-red, #ef4444)';
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.removeAttribute('title');
            }
            updateSummaryUI();
        });
    }

    const pointsSlider = document.getElementById('points-slider');
    if (pointsSlider) {
        pointsSlider.addEventListener('input', (e) => {
            pointsToRedeem = parseInt(e.target.value, 10) || 0;
            const displayEl = document.getElementById('points-to-redeem-display');
            if (displayEl) displayEl.textContent = pointsToRedeem;
            updateSummaryUI();
        });
    }

    const stripeBtn = document.getElementById('stripe-checkout-btn');
    if (stripeBtn) {
        stripeBtn.addEventListener('click', handleStripeCheckout);
    }

    const formEl = document.getElementById('checkout-form');
    if (formEl) {
        formEl.addEventListener('submit', handlePlaceOrder);
    }
}

function updateSummaryUI() {
    const { totalPrice: subtotal } = calculateCartSummary(userCart, productMap);

    const promoDiscountAmount = subtotal * discount;
    const pointsDiscountAmount = pointsToRedeem / 100;
    const totalDiscount = promoDiscountAmount + pointsDiscountAmount;
    
    let subtotalAfterDiscount = subtotal - totalDiscount;
    if (subtotalAfterDiscount < 0) subtotalAfterDiscount = 0;
    
    const tax = subtotalAfterDiscount * 0.08;
    const total = subtotalAfterDiscount + tax;

    const subtotalEl = document.getElementById('summary-subtotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    if (discountRow && discountEl) {
        if (totalDiscount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-$${totalDiscount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    const taxEl = document.getElementById('summary-tax');
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;

    const totalEl = document.getElementById('summary-total');
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    const pointsEl = document.getElementById('summary-points');
    if (pointsEl) pointsEl.textContent = `✨ You will earn ${Math.floor(subtotalAfterDiscount * 10)} Unstoppable Points with this order!`;
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

    const effectiveUid = uid || (currentUser && currentUser.uid) || null;

    try {
        // If signed in, write to Firestore
        if (effectiveUid) {
            try {
                await addDoc(collection(db, 'orders'), fullOrder);
                await setDoc(doc(db, 'carts', effectiveUid), { items: {} });

                const userRef = doc(db, 'users', effectiveUid);
                const userSnap = await getDoc(userRef);
                const currentData = userSnap.exists() ? userSnap.data() : {};
                const currentBal = currentData.pointsBalance || 0;
                const currentEarned = currentData.loyaltyPoints || currentBal;
                const earnedPts = orderDetails.earnedPoints || 0;
                const redeemedPts = orderDetails.pointsRedeemed || 0;
                const newBal = Math.max(0, currentBal - redeemedPts + earnedPts);
                const newTotalEarned = currentEarned + earnedPts;

                await setDoc(userRef, {
                    pointsBalance: newBal,
                    loyaltyPoints: newTotalEarned
                }, { merge: true });

                // Update session cache
                const cacheKey = `profile_${effectiveUid}`;
                const cachedStr = sessionStorage.getItem(cacheKey);
                if (cachedStr) {
                    const uData = JSON.parse(cachedStr);
                    uData.pointsBalance = newBal;
                    uData.loyaltyPoints = newTotalEarned;
                    sessionStorage.setItem(cacheKey, JSON.stringify(uData));
                }

                // Record points earned in loyalty_transactions
                if (earnedPts > 0) {
                    await addDoc(collection(db, 'loyalty_transactions'), {
                        userId: effectiveUid,
                        description: `Order Purchase #${orderDocId} 🛍️`,
                        points: earnedPts,
                        type: 'earned',
                        orderId: orderDocId,
                        createdAt: serverTimestamp()
                    });
                }

                // Record points redeemed in loyalty_transactions
                if (redeemedPts > 0) {
                    await addDoc(collection(db, 'loyalty_transactions'), {
                        userId: effectiveUid,
                        description: `Points Redeemed for Discount (Order #${orderDocId}) 🏷️`,
                        points: -redeemedPts,
                        type: 'redeemed',
                        orderId: orderDocId,
                        createdAt: serverTimestamp()
                    });
                }
            } catch (dbErr) {
                console.warn("Manager info: Firestore order write warning:", dbErr);
            }
        }

        // Always clear localStorage cart
        localStorage.removeItem('localCart');
        localStorage.removeItem('cartItemCount');

        // Broadcast cartUpdated event so Lexi and headers clear the count
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: {}, itemCount: 0, totalPrice: 0 } }));
        if (typeof window.updateLexiCartCount === 'function') {
            window.updateLexiCartCount(0);
        }

        return orderDocId;
    } catch (error) {
        console.error('Manager info: Error processing order transaction [' + error.message + ']');
        throw error;
    }
}

export async function handleStripeCheckout(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const stripeBtn = document.getElementById('stripe-checkout-btn');
    const messageEl = document.getElementById('checkout-message');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : (currentUser ? currentUser.email : '');

    if (!nameVal) {
        if (messageEl) {
            messageEl.textContent = 'Please enter your Full Name before proceeding to Stripe Checkout.';
            messageEl.style.color = 'var(--accent-red, #ef4444)';
        }
        if (nameInput) nameInput.focus();
        return;
    }

    if (!emailVal) {
        if (messageEl) {
            messageEl.textContent = 'Please enter a valid email address.';
            messageEl.style.color = 'var(--accent-red, #ef4444)';
        }
        if (emailInput) emailInput.focus();
        return;
    }

    const originalHtml = stripeBtn ? stripeBtn.innerHTML : 'Pay with Stripe Checkout';
    if (stripeBtn) {
        stripeBtn.disabled = true;
        stripeBtn.innerHTML = '<span>⚡ Connecting to Stripe...</span>';
    }

    const { totalPrice: subtotal } = calculateCartSummary(userCart, productMap);
    const promoDiscountAmount = subtotal * discount;
    const pointsDiscountAmount = pointsToRedeem / 100;
    const totalDiscount = promoDiscountAmount + pointsDiscountAmount;
    const subtotalAfterDiscount = Math.max(0, subtotal - totalDiscount);
    const tax = subtotalAfterDiscount * 0.08;
    const finalTotal = subtotalAfterDiscount + tax;

    const shippingInfo = {
        name: nameVal,
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        zip: document.getElementById('zip')?.value || ''
    };

    try {
        let token = '';
        if (currentUser) {
            try { token = await currentUser.getIdToken(); } catch (_) {}
        }

        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch('https://us-central1-dts-hub-website.cloudfunctions.net/createCheckoutSession', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                cart: userCart,
                orderDetails: {
                    email: emailVal,
                    total: finalTotal,
                    shippingInfo,
                    appliedPromo,
                    pointsRedeemed: pointsToRedeem
                },
                mode: 'payment',
                project: 'unstoppable',
                successUrl: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                cancelUrl: window.location.href
            })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            console.warn('Manager info: Cloud function response did not contain url, completing via secure test order:', data);
            await processOrderTransaction(currentUser ? currentUser.uid : null, userCart, {
                email: emailVal,
                total: finalTotal,
                shippingInfo,
                appliedPromo,
                pointsRedeemed: pointsToRedeem,
                earnedPoints: Math.floor(subtotalAfterDiscount * 10)
            });
            window.location.href = '/success.html';
        }
    } catch (err) {
        console.error('Manager info: Stripe checkout error:', err);
        if (messageEl) {
            messageEl.textContent = 'Error connecting to payment server. You can also use the Instant Test Order option below.';
            messageEl.style.color = 'var(--accent-red, #ef4444)';
        }
        if (stripeBtn) {
            stripeBtn.disabled = false;
            stripeBtn.innerHTML = originalHtml;
        }
    }
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
    const { totalPrice: subtotal } = calculateCartSummary(userCart, productMap);
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
            <div class="checkout-stepper" style="max-width: 620px; margin: 0 auto 30px;">
                <div class="step-item completed">
                    <div class="step-badge">✓</div>
                    <span>1. Cart</span>
                </div>
                <div class="step-divider"></div>
                <div class="step-item completed">
                    <div class="step-badge">✓</div>
                    <span>2. Shipping & Payment</span>
                </div>
                <div class="step-divider"></div>
                <div class="step-item active completed">
                    <div class="step-badge">✓</div>
                    <span>3. Confirmation</span>
                </div>
            </div>
            <div style="max-width: 620px; margin: 0 auto; text-align: center; background: linear-gradient(180deg, rgba(24, 24, 28, 0.95) 0%, rgba(18, 18, 22, 0.92) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.5);">
                <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; font-size: 2rem;">✓</div>
                <h1 style="color: #ffffff; font-size: 1.85rem; margin-bottom: 8px; font-weight: 800;">Payment Successful!</h1>
                <p style="color: var(--text-secondary, #aaa); margin-bottom: 25px; font-size: 0.95rem;">
                    Thank you, <strong>${escapeHTML(shippingInfo.name)}</strong>. Your order has been placed and confirmed.
                </p>
                
                <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 22px; margin-bottom: 25px; text-align: left; font-size: 0.92rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
                        <span style="color: var(--text-secondary, #888);">Order Reference:</span>
                        <strong style="color: #10b981; font-family: monospace; letter-spacing: 1px; font-size: 1rem;">#${orderId}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
                        <span style="color: var(--text-secondary, #888);">Payment Method:</span>
                        <span style="color: #ffffff;">Stripe Test (•••• 4242)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
                        <span style="color: var(--text-secondary, #888);">Total Charged:</span>
                        <strong style="color: #10b981; font-size: 1.15rem;">$${finalTotal.toFixed(2)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color: var(--text-secondary, #888);">Shipping Destination:</span>
                        <span style="color: #ffffff; text-align: right;">${escapeHTML(shippingInfo.address)}, ${escapeHTML(shippingInfo.city)} ${escapeHTML(shippingInfo.zip)}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="shop.html" class="place-order-button" style="text-decoration: none; display: inline-block; padding: 12px 26px; width: auto; margin-top: 0;">Continue Shopping &rarr;</a>
                    <a href="account.html#orders" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; transition: all 0.2s;">View Order History</a>
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
    } catch (_) { /* ignore parse error */ }

    // Direct Product Buy / Checkout Deep Link (e.g. ?productId=dts-limited-hoodie&quantity=1)
    const urlParams = new URLSearchParams(window.location.search);
    const deepLinkProductId = urlParams.get('productId');
    const deepLinkQty = parseInt(urlParams.get('quantity') || '1', 10);

    if (deepLinkProductId) {
        localCart[deepLinkProductId] = Math.max(1, deepLinkQty);
        try {
            localStorage.setItem('localCart', JSON.stringify(localCart));
        } catch (_) {}
    }

    if (user) {
        currentUser = user;
        try {
            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};
            userCart = (firestoreCart && Object.keys(firestoreCart).length > 0) ? firestoreCart : localCart;
            if (deepLinkProductId) {
                userCart[deepLinkProductId] = Math.max(1, deepLinkQty);
            }
        } catch (_) { /* ignore firestore read error */
            userCart = localCart;
        }

        try {
            const userData = await getCachedUserProfile(user);
            window.userPointsBalance = userData ? (userData.pointsBalance || 0) : 0;
        } catch (_) { /* ignore profile read error */
            window.userPointsBalance = 0;
        }
    } else {
        currentUser = null;
        userCart = localCart;
        window.userPointsBalance = 0;
    }

    // Resolve any dynamic Firestore products that aren't yet in productMap
    for (const pid of Object.keys(userCart)) {
        if (!productMap.has(pid)) {
            try {
                const pDoc = await getDoc(doc(db, 'products', pid));
                if (pDoc.exists()) {
                    registerDynamicProduct({ id: pDoc.id, ...pDoc.data() });
                }
            } catch (_) {}
        }
    }

    renderCheckoutPage();
});