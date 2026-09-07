// js/checkout.js
import { auth, db, safeRedirect } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { products, productMap } from './products.js';

let currentUser = null;
let userCart = {};

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

    let discount = 0;
    let appliedPromo = '';

    const renderSummary = () => {
        const subtotal = Object.entries(userCart).reduce((sum, [productId, quantity]) => {
            const product = productMap.get(productId);
            return sum + (product.price * quantity);
        }, 0);
        
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
                        return `<div class="summary-item"><span>${quantity}x ${product.name}</span> <span>$${(product.price * quantity).toFixed(2)}</span></div>`;
                    }).join('')}
                </div>
                
                <div class="form-group" style="margin-top: 20px;">
                    <label for="promo-code" style="font-size: 0.9rem;">Promo Code</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="promo-code" placeholder="e.g. DTS10" style="flex: 1; padding: 8px;">
                        <button type="button" id="apply-promo-btn" style="padding: 8px 15px; background: var(--text-secondary); color: white; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
                    </div>
                    <small id="promo-message" style="display: block; margin-top: 5px;"></small>
                </div>

                <div class="summary-calculation">
                    <div class="summary-item"><span>Subtotal</span> <span id="summary-subtotal">$${subtotal.toFixed(2)}</span></div>
                    <div class="summary-item" id="summary-discount-row" style="display: none; color: var(--accent-green);"><span>Discount</span> <span id="summary-discount">-$0.00</span></div>
                    <div class="summary-item"><span>Tax</span> <span id="summary-tax">$${tax.toFixed(2)}</span></div>
                    <div class="summary-total"><span>Total</span> <span id="summary-total">$${total.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('apply-promo-btn').addEventListener('click', () => {
        const code = document.getElementById('promo-code').value.trim().toUpperCase();
        const msgEl = document.getElementById('promo-message');
        if (code === 'DTS10') {
            discount = 0.10;
            appliedPromo = 'DTS10';
            msgEl.textContent = '10% discount applied!';
            msgEl.style.color = 'var(--accent-green)';
            updateSummaryUI();
        } else {
            discount = 0;
            appliedPromo = '';
            msgEl.textContent = 'Invalid promo code.';
            msgEl.style.color = 'var(--accent-red)';
            updateSummaryUI();
        }
    });

    document.getElementById('checkout-form').addEventListener('submit', handlePlaceOrder);
}

export async function processOrderTransaction(uid, cart, orderDetails) {
    try {
        await runTransaction(db, async (transaction) => {
            const productIds = Object.keys(cart);
            const statRefs = productIds.map(id => doc(db, 'product_stats', id));
            const statDocs = await Promise.all(statRefs.map(ref => transaction.get(ref)));

            const currentStats = {};
            statDocs.forEach((statDoc, index) => {
                const productId = productIds[index];
                currentStats[productId] = statDoc;
            });

            const newOrderRef = doc(db, 'orders', `${uid}_${Date.now()}`);
            transaction.set(newOrderRef, orderDetails);

            for (const [productId, quantity] of Object.entries(cart)) {
                const productStatRef = doc(db, 'product_stats', productId);
                const statDoc = currentStats[productId];

                if (!statDoc.exists()) {
                    transaction.set(productStatRef, { orderedCount: quantity });
                } else {
                    const newCount = statDoc.data().orderedCount + quantity;
                    transaction.update(productStatRef, { orderedCount: newCount });
                }
            }

            const userCartRef = doc(db, 'carts', uid);
            transaction.update(userCartRef, { items: {} });
        });
    } catch (error) {
        console.error('Manager info: Error processing order transaction:', error);
        throw error;
    }
}

export async function handlePlaceOrder(e) {
    e.preventDefault();
    const placeOrderBtn = document.getElementById('place-order-btn');
    const messageEl = document.getElementById('checkout-message');
    
    // Stripe Test Logic
    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
    if (!cardNumber.startsWith('4242')) {
        messageEl.textContent = 'Payment Failed: Invalid test card. Use 4242...';
        messageEl.style.color = 'var(--accent-red)';
        return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing Payment...';

    const orderDetails = {
        userId: currentUser.uid,
        items: userCart,
        orderDate: serverTimestamp(),
        status: 'Paid',
        shippingInfo: {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
        },
        paymentStatus: 'Test Payment Successful'
    };

    try {
        await processOrderTransaction(currentUser.uid, userCart, orderDetails);
        messageEl.textContent = 'Payment successful! Order placed. Redirecting...';
        messageEl.style.color = 'var(--accent-green)';
        setTimeout(() => safeRedirect('./account.html'), 3000);
    } catch (error) {
        console.error("Error placing order - Manager info:", error.message);
        messageEl.textContent = 'There was an error placing your order. Please try again.';
        messageEl.style.color = 'var(--accent-red)';
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Pay Now';
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userCartRef = doc(db, 'carts', user.uid);
        const docSnap = await getDoc(userCartRef);
        userCart = docSnap.exists() ? docSnap.data().items : {};
        renderCheckoutPage();
    } else {
        safeRedirect('/sign in beta.html');
    }
});