// js/cart.js - Dedicated High-Converting Cart Page Controller
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { productMap, products, getProductPricing } from './products.js';
import { escapeHTML } from './utils.js';

let currentUser = null;
let cart = {};
let discountRate = 0;
let appliedPromoCode = '';

// Dynamic DOM Element Helper
const getEl = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);

/**
 * Load cart state from localStorage and optional session promo
 */
export function loadCartFromStorage() {
    try {
        const rawCart = localStorage.getItem('localCart');
        cart = rawCart ? JSON.parse(rawCart) : {};
    } catch (_) {
        cart = {};
    }

    try {
        const storedPromo = sessionStorage.getItem('appliedPromo');
        const storedDiscount = sessionStorage.getItem('discountRate');
        if (storedPromo && storedDiscount) {
            appliedPromoCode = storedPromo;
            discountRate = parseFloat(storedDiscount) || 0;
        }
    } catch (_) {}

    return cart;
}

/**
 * Synchronize cart state across localStorage, Firestore (if logged in),
 * Lexi orb, and sitewide events.
 */
export async function syncCartState() {
    let totalCount = 0;
    for (const qty of Object.values(cart)) {
        totalCount += Math.max(0, parseInt(qty, 10) || 0);
    }

    try {
        localStorage.setItem('localCart', JSON.stringify(cart));
        localStorage.setItem('cartItemCount', totalCount.toString());
    } catch (_) {}

    // Update Lexi orb badge
    if (typeof window !== 'undefined' && typeof window.updateLexiCartCount === 'function') {
        window.updateLexiCartCount(totalCount);
    }

    // Save to Firestore if user is authenticated
    const user = currentUser || (auth && auth.currentUser);
    if (user && db) {
        try {
            const userCartRef = doc(db, 'carts', user.uid);
            await setDoc(userCartRef, { items: cart }, { merge: true });
        } catch (err) {
            console.error('Manager info: Error saving cart to Firestore:', err.message || err);
        }
    }

    // Dispatch sitewide cartUpdated event
    if (typeof window !== 'undefined') {
        const { totalPrice } = calculateCartTotals();
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cart, itemCount: totalCount, totalPrice }
        }));
    }
}

/**
 * Calculate financial totals with O(1) Map lookups
 */
export function calculateCartTotals() {
    let itemCount = 0;
    let subtotal = 0;

    for (const [productId, quantity] of Object.entries(cart)) {
        // ⚡ Bolt: O(1) productMap lookup replaces O(N) array search
        const product = productMap.get(productId);
        if (!product) continue;

        const validQuantity = Math.max(0, parseInt(quantity, 10) || 0);
        if (validQuantity > 0) {
            itemCount += validQuantity;
            subtotal += product.price * validQuantity;
        }
    }

    const discountAmount = subtotal * discountRate;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = discountedSubtotal * 0.08; // 8% estimated taxes
    const total = discountedSubtotal + tax;

    return {
        itemCount,
        subtotal,
        discountAmount,
        discountedSubtotal,
        tax,
        total
    };
}

/**
 * Render the itemized cart cards and summary card
 */
export function renderCart() {
    const { itemCount, subtotal, discountAmount, tax, total } = calculateCartTotals();
    const activeEntries = Object.entries(cart).filter(([_, qty]) => (parseInt(qty, 10) || 0) > 0);

    const cartItemsContainer = getEl('cart-items-list');
    const emptyCartView = getEl('cart-empty-view');
    const checkoutBtn = getEl('cart-checkout-btn');
    const mobileStickyBar = getEl('cart-mobile-sticky-bar');
    const summarySubtotalEl = getEl('cart-summary-subtotal');
    const summaryTaxEl = getEl('cart-summary-tax');
    const summaryTotalEl = getEl('cart-summary-total');
    const mobileStickyTotalEl = getEl('mobile-sticky-total');
    const summaryDiscountRow = getEl('cart-summary-discount-row');
    const summaryDiscountEl = getEl('cart-summary-discount');
    const discountCodeTag = getEl('discount-code-tag');

    if (activeEntries.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCartView) emptyCartView.style.display = 'block';
        if (checkoutBtn) {
            checkoutBtn.setAttribute('disabled', 'true');
            checkoutBtn.style.opacity = '0.45';
            checkoutBtn.style.pointerEvents = 'none';
        }
        if (mobileStickyBar) mobileStickyBar.classList.remove('visible');
    } else {
        if (emptyCartView) emptyCartView.style.display = 'none';
        if (cartItemsContainer) {
            cartItemsContainer.style.display = 'flex';
            cartItemsContainer.innerHTML = activeEntries.map(([productId, quantity]) => {
                // ⚡ Bolt: O(1) Map lookup
                const product = productMap.get(productId);
                if (!product) return '';

                const q = Math.max(1, parseInt(quantity, 10) || 1);
                const itemTotal = (product.price * q).toFixed(2);
                const category = product.category || (product.name.includes('Hoodie') || product.name.includes('Tee') || product.name.includes('Cap') ? 'Apparel' : (product.name.includes('Vinyl') ? 'Music' : 'Merch'));

                return `
                <div class="cart-item-card" data-product-id="${escapeHTML(product.id)}">
                    <img src="${escapeHTML(product.imageUrl)}" alt="${escapeHTML(product.name)}" class="cart-item-image" loading="lazy">
                    <div class="cart-item-details">
                        <span class="cart-item-category-badge">${escapeHTML(category)}</span>
                        <h2 class="cart-item-title">${escapeHTML(product.name)}</h2>
                        <p class="cart-item-unit-price">$${product.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-stepper" role="group" aria-label="Quantity controls for ${escapeHTML(product.name)}">
                            <button type="button" class="cart-stepper-btn cart-qty-minus" data-id="${escapeHTML(product.id)}" aria-label="Decrease quantity of ${escapeHTML(product.name)}">&minus;</button>
                            <input type="number" class="cart-stepper-input cart-qty-input" data-id="${escapeHTML(product.id)}" value="${q}" min="1" max="99" aria-label="Quantity for ${escapeHTML(product.name)}">
                            <button type="button" class="cart-stepper-btn cart-qty-plus" data-id="${escapeHTML(product.id)}" aria-label="Increase quantity of ${escapeHTML(product.name)}">&plus;</button>
                        </div>
                        <div class="cart-item-subtotal">$${itemTotal}</div>
                        <button type="button" class="cart-item-remove-btn cart-remove-btn" data-id="${escapeHTML(product.id)}" aria-label="Remove ${escapeHTML(product.name)} from cart" title="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>`;
            }).join('');
        }

        if (checkoutBtn) {
            checkoutBtn.removeAttribute('disabled');
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.pointerEvents = 'auto';
        }
        if (mobileStickyBar) mobileStickyBar.classList.add('visible');
    }

    // Update Summary Display
    if (summarySubtotalEl) summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTaxEl) summaryTaxEl.textContent = `$${tax.toFixed(2)}`;
    if (summaryTotalEl) summaryTotalEl.textContent = `$${total.toFixed(2)}`;
    if (mobileStickyTotalEl) mobileStickyTotalEl.textContent = `$${total.toFixed(2)}`;

    if (summaryDiscountRow && summaryDiscountEl) {
        if (discountRate > 0) {
            summaryDiscountRow.style.display = 'flex';
            summaryDiscountEl.textContent = `-$${discountAmount.toFixed(2)}`;
            if (discountCodeTag) discountCodeTag.textContent = appliedPromoCode ? ` (${escapeHTML(appliedPromoCode)})` : '';
        } else {
            summaryDiscountRow.style.display = 'none';
        }
    }
}

/**
 * Handle quantity update
 */
export async function handleUpdateQuantity(productId, newQuantity) {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = Math.min(99, qty);
    }
    renderCart();
    await syncCartState();
}

/**
 * Handle item removal
 */
export async function handleRemoveFromCart(productId) {
    if (cart[productId]) {
        delete cart[productId];
        renderCart();
        await syncCartState();
    }
}

/**
 * Apply promo code with Firestore verification and fallback support
 */
export async function handleApplyPromo(code) {
    const promoFeedbackEl = getEl('cart-promo-feedback');
    const applyPromoBtn = getEl('cart-apply-promo-btn');

    if (!code || typeof code !== 'string') {
        if (promoFeedbackEl) {
            promoFeedbackEl.className = 'cart-promo-feedback error';
            promoFeedbackEl.textContent = 'Please enter a promo code.';
        }
        return false;
    }

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
        if (promoFeedbackEl) {
            promoFeedbackEl.className = 'cart-promo-feedback error';
            promoFeedbackEl.textContent = 'Please enter a promo code.';
        }
        return false;
    }

    if (applyPromoBtn) {
        applyPromoBtn.disabled = true;
        applyPromoBtn.textContent = 'Checking...';
    }

    try {
        let foundDiscount = 0;

        // 1. Check known built-in ecosystem codes
        if (cleanCode === 'STAY10DTS' || cleanCode === 'STAY10VIP' || cleanCode === 'DTS10') {
            foundDiscount = 0.10;
        } else if (cleanCode === 'UNSTOPPABLE20' || cleanCode === 'VIP20') {
            foundDiscount = 0.20;
        }

        // 2. Query Firestore if db is reachable and code not already matched
        if (foundDiscount === 0 && db) {
            try {
                const promoRef = doc(db, 'promo_codes', cleanCode);
                const promoSnap = await getDoc(promoRef);
                if (promoSnap.exists()) {
                    const data = promoSnap.data();
                    if (data && data.active && typeof data.discount === 'number') {
                        foundDiscount = data.discount / 100;
                    }
                }
            } catch (err) {
                console.warn('Manager info: Firestore promo lookup error (fallback active):', err.message || err);
            }
        }

        if (foundDiscount > 0) {
            discountRate = foundDiscount;
            appliedPromoCode = cleanCode;
            try {
                sessionStorage.setItem('appliedPromo', cleanCode);
                sessionStorage.setItem('discountRate', foundDiscount.toString());
            } catch (_) {}

            if (promoFeedbackEl) {
                promoFeedbackEl.className = 'cart-promo-feedback success';
                promoFeedbackEl.textContent = `✓ Promo code ${escapeHTML(cleanCode)} applied (${Math.round(foundDiscount * 100)}% off)!`;
            }
            renderCart();
            return true;
        } else {
            discountRate = 0;
            appliedPromoCode = '';
            try {
                sessionStorage.removeItem('appliedPromo');
                sessionStorage.removeItem('discountRate');
            } catch (_) {}

            if (promoFeedbackEl) {
                promoFeedbackEl.className = 'cart-promo-feedback error';
                promoFeedbackEl.textContent = `Promo code "${escapeHTML(cleanCode)}" is invalid or expired.`;
            }
            renderCart();
            return false;
        }
    } finally {
        if (applyPromoBtn) {
            applyPromoBtn.disabled = false;
            applyPromoBtn.textContent = 'Apply';
        }
    }
}

// Event Delegation setup
export function setupCartEventListeners() {
    const cartItemsContainer = getEl('cart-items-list');
    const applyPromoBtn = getEl('cart-apply-promo-btn');
    const promoInput = getEl('cart-promo-input');

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const minusBtn = e.target.closest('.cart-qty-minus');
            const plusBtn = e.target.closest('.cart-qty-plus');
            const removeBtn = e.target.closest('.cart-remove-btn');

            if (minusBtn) {
                const id = minusBtn.dataset.id;
                const currentQty = parseInt(cart[id], 10) || 1;
                handleUpdateQuantity(id, currentQty - 1);
            } else if (plusBtn) {
                const id = plusBtn.dataset.id;
                const currentQty = parseInt(cart[id], 10) || 1;
                handleUpdateQuantity(id, currentQty + 1);
            } else if (removeBtn) {
                const id = removeBtn.dataset.id;
                handleRemoveFromCart(id);
            }
        });

        cartItemsContainer.addEventListener('change', (e) => {
            const input = e.target.closest('.cart-qty-input');
            if (input) {
                const id = input.dataset.id;
                const val = parseInt(input.value, 10);
                handleUpdateQuantity(id, val);
            }
        });
    }

    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', () => {
            handleApplyPromo(promoInput.value);
        });

        promoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyPromo(promoInput.value);
            }
        });
    }

    // Reactive cross-tab storage sync
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
            if (e.key === 'localCart') {
                loadCartFromStorage();
                renderCart();
            }
        });
    }
}

// Initialise auth listener and render on load
export function initCartPage() {
    loadCartFromStorage();
    setupCartEventListeners();
    renderCart();

    if (auth && typeof onAuthStateChanged === 'function') {
        onAuthStateChanged(auth, async (user) => {
            currentUser = user;
            if (user && db) {
                try {
                    const userCartRef = doc(db, 'carts', user.uid);
                    const docSnap = await getDoc(userCartRef);
                    if (docSnap.exists()) {
                        const firestoreCart = docSnap.data().items;
                        if (firestoreCart && Object.keys(firestoreCart).length > 0) {
                            // Merge local items into firestore or use firestore if local is empty
                            if (Object.keys(cart).length === 0) {
                                cart = firestoreCart;
                                syncCartState();
                                renderCart();
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Manager info: Non-blocking Firestore cart fetch notice:', err.message || err);
                }
            }
        });
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartPage);
    } else {
        initCartPage();
    }
}
