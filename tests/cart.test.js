import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dedicated High-Converting Cart Page & Conversion UX Standards', () => {
    let cartHtml;
    let cartCss;

    beforeAll(() => {
        cartHtml = fs.readFileSync(path.join(ROOT_DIR, 'cart.html'), 'utf8');
        cartCss = fs.readFileSync(path.join(ROOT_DIR, 'css/cart.css'), 'utf8');
    });

    it('contains responsive two-column grid layout and sticky order summary', () => {
        expect(cartHtml).toContain('cart-layout-grid');
        expect(cartHtml).toContain('cart-items-column');
        expect(cartHtml).toContain('cart-summary-column');
        expect(cartHtml).toContain('cart-order-summary-card');

        // Check CSS sticky summary and responsive grid
        expect(cartCss).toContain('position: sticky');
        expect(cartCss).toContain('grid-template-columns: 1fr 380px');
    });

    it('contains mobile stacked view with sticky checkout bar', () => {
        expect(cartHtml).toContain('cart-mobile-sticky-bar');
        expect(cartHtml).toContain('mobile-sticky-checkout-btn');
        expect(cartCss).toContain('.cart-mobile-sticky-bar');
        expect(cartCss).toContain('position: fixed');
    });

    it('contains itemized cart list container and clean empty cart state view', () => {
        expect(cartHtml).toContain('id="cart-items-list"');
        expect(cartHtml).toContain('id="cart-empty-view"');
        expect(cartHtml).toContain('Your cart is empty');
        expect(cartHtml).toContain('Explore the Shop');
    });

    it('contains upfront summary with subtotal, promo code input, tax, and estimated total', () => {
        expect(cartHtml).toContain('id="cart-summary-subtotal"');
        expect(cartHtml).toContain('id="cart-summary-discount-row"');
        expect(cartHtml).toContain('id="cart-promo-input"');
        expect(cartHtml).toContain('id="cart-apply-promo-btn"');
        expect(cartHtml).toContain('id="cart-summary-tax"');
        expect(cartHtml).toContain('id="cart-summary-total"');
        expect(cartHtml).toContain('All taxes and delivery fees are calculated upfront');
    });

    it('contains unmistakable primary checkout CTA and secondary continue shopping link', () => {
        expect(cartHtml).toContain('id="cart-checkout-btn"');
        expect(cartHtml).toContain('href="checkout.html"');
        expect(cartHtml).toContain('href="store.html"');
        expect(cartHtml).toContain('Continue Shopping');
        expect(cartHtml).toContain('data-telemetry-cta="checkout"');
    });

    it('includes trust badges, SSL/Stripe security notes, and fulfillment expectations', () => {
        expect(cartHtml).toContain('cart-trust-card');
        expect(cartHtml).toContain('cart-card-header');
        expect(cartHtml).toContain('cart-card-subtitle');
        expect(cartHtml).toContain('Order Guarantee &amp; Fulfillment');
        expect(cartHtml).toContain('Secure Stripe Checkout');
        expect(cartHtml).toContain('Instant Realm &amp; Digital Access');
        expect(cartHtml).toContain('256-bit SSL encryption');
        expect(cartHtml).toContain('Open a support ticket');
    });

    it('matches Your Cart bold typography across Order Summary and Order Guarantee titles', () => {
        expect(cartCss).toContain('.cart-summary-title,');
        expect(cartCss).toContain('.cart-trust-card-title {');
        expect(cartCss).toContain('font-size: 1.85rem');
        expect(cartCss).toContain('font-weight: 800');
        expect(cartCss).toContain('letter-spacing: -0.5px');
    });

    it('ensures cart page follows Google Publisher Policy by keeping checkout flows ad-free', () => {
        expect(cartHtml).not.toContain('ins class="adsbygoogle"');
        expect(cartHtml).not.toContain('data-ad-slot="cart-bottom-slot"');
    });

    it('mounts sitewide navbar and footer with loadNavbar and loadFooter', () => {
        expect(cartHtml).toContain('<header class="main-header"></header>');
        expect(cartHtml).toContain('<footer class="main-footer"></footer>');
        expect(cartHtml).toContain('loadNavbar');
        expect(cartHtml).toContain('loadFooter');
        expect(cartHtml).toContain('/js/cart.js');
    });

    it('uses natural, human store copy without robotic AI clichés', () => {
        const bannedWords = [/\belevate\b/i, /\bunleash\b/i, /\bseamless\b/i, /\bdive into\b/i, /\bembark\b/i];
        bannedWords.forEach(pattern => {
            expect(cartHtml).not.toMatch(pattern);
        });
    });
});

describe('Cart Business Logic, Pricing & Promo Codes (js/cart.js)', () => {
    let cartModule;
    let productsModule;

    beforeEach(async () => {
        localStorage.clear();
        sessionStorage.clear();
        document.body.innerHTML = `
            <div id="cart-items-list"></div>
            <div id="cart-empty-view" style="display: none;"></div>
            <div id="cart-items-column"></div>
            <span id="cart-summary-subtotal">$0.00</span>
            <div id="cart-summary-discount-row" style="display: none;">
                <span id="discount-code-tag"></span>
                <span id="cart-summary-discount">-$0.00</span>
            </div>
            <span id="cart-summary-tax">$0.00</span>
            <span id="cart-summary-total">$0.00</span>
            <button id="cart-checkout-btn">Checkout</button>
            <div id="cart-mobile-sticky-bar"></div>
            <span id="mobile-sticky-total">$0.00</span>
            <input id="cart-promo-input" value="">
            <button id="cart-apply-promo-btn">Apply</button>
            <div id="cart-promo-feedback"></div>
            <span id="nav-cart-badge" style="display: none;">0</span>
            <span id="uds-nav-cart-badge" style="display: none;">0</span>
        `;

        productsModule = await import('../js/products.js');
        cartModule = await import('../js/cart.js');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('uses O(1) productMap lookup for product pricing', () => {
        const { productMap } = productsModule;
        expect(productMap).toBeInstanceOf(Map);
        expect(productMap.has('unstoppable-hoodie')).toBe(true);
        expect(productMap.has('dts-model-tee')).toBe(true);

        const hoodie = productMap.get('unstoppable-hoodie');
        expect(hoodie.price).toBe(59.99);
    });

    it('calculates cart totals accurately with 8% estimated taxes', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1, // 59.99
            'dts-model-tee': 2       // 24.99 * 2 = 49.98
        }));

        cartModule.loadCartFromStorage();
        const totals = cartModule.calculateCartTotals();

        expect(totals.itemCount).toBe(3);
        expect(totals.subtotal).toBeCloseTo(109.97, 2);
        expect(totals.discountAmount).toBe(0);
        expect(totals.tax).toBeCloseTo(109.97 * 0.08, 2);
        expect(totals.total).toBeCloseTo(109.97 * 1.08, 2);
    });

    it('updates quantity and syncs state across localStorage and custom events', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1
        }));
        cartModule.loadCartFromStorage();

        let eventFired = false;
        window.addEventListener('cartUpdated', (e) => {
            eventFired = true;
            expect(e.detail.itemCount).toBe(3);
        }, { once: true });

        await cartModule.handleUpdateQuantity('unstoppable-hoodie', 3);

        const storedCart = JSON.parse(localStorage.getItem('localCart'));
        expect(storedCart['unstoppable-hoodie']).toBe(3);
        expect(localStorage.getItem('cartItemCount')).toBe('3');
        expect(eventFired).toBe(true);
    });

    it('removes item when quantity is 0 or negative', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 2,
            'dts-model-tee': 1
        }));
        cartModule.loadCartFromStorage();

        await cartModule.handleUpdateQuantity('unstoppable-hoodie', 0);

        const storedCart = JSON.parse(localStorage.getItem('localCart'));
        expect(storedCart['unstoppable-hoodie']).toBeUndefined();
        expect(storedCart['dts-model-tee']).toBe(1);
    });

    it('removes item via handleRemoveFromCart', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1,
            'dts-model-tee': 1
        }));
        cartModule.loadCartFromStorage();

        await cartModule.handleRemoveFromCart('unstoppable-hoodie');

        const storedCart = JSON.parse(localStorage.getItem('localCart'));
        expect(storedCart['unstoppable-hoodie']).toBeUndefined();
        expect(storedCart['dts-model-tee']).toBe(1);
    });

    it('applies built-in promo codes (STAY10DTS, STAY10VIP, DTS10) for 10% discount', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1 // 59.99
        }));
        cartModule.loadCartFromStorage();

        const success = await cartModule.handleApplyPromo('STAY10DTS');
        expect(success).toBe(true);

        const totals = cartModule.calculateCartTotals();
        expect(totals.discountAmount).toBeCloseTo(5.999, 2);
        expect(totals.discountedSubtotal).toBeCloseTo(53.991, 2);
        expect(totals.tax).toBeCloseTo(53.991 * 0.08, 2);
        expect(totals.total).toBeCloseTo(53.991 * 1.08, 2);

        expect(sessionStorage.getItem('appliedPromo')).toBe('STAY10DTS');
        expect(sessionStorage.getItem('discountRate')).toBe('0.1');
    });

    it('rejects invalid promo codes and clears discount', async () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1
        }));
        cartModule.loadCartFromStorage();

        // First apply valid
        await cartModule.handleApplyPromo('STAY10DTS');
        expect(sessionStorage.getItem('appliedPromo')).toBe('STAY10DTS');

        // Then apply invalid
        const result = await cartModule.handleApplyPromo('INVALID_CODE_XYZ');
        expect(result).toBe(false);

        const totals = cartModule.calculateCartTotals();
        expect(totals.discountAmount).toBe(0);
        expect(sessionStorage.getItem('appliedPromo')).toBeNull();

        const feedback = document.getElementById('cart-promo-feedback');
        expect(feedback.textContent).toContain('invalid or expired');
    });

    it('renders empty cart view when cart has no items', () => {
        localStorage.setItem('localCart', JSON.stringify({}));
        cartModule.loadCartFromStorage();
        cartModule.renderCart();

        const emptyView = document.getElementById('cart-empty-view');
        const checkoutBtn = document.getElementById('cart-checkout-btn');

        expect(emptyView.style.display).toBe('block');
        expect(checkoutBtn.getAttribute('disabled')).toBe('true');
    });

    it('renders itemized cards with accessible steppers and prices', () => {
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 2
        }));
        cartModule.loadCartFromStorage();
        cartModule.renderCart();

        const list = document.getElementById('cart-items-list');
        expect(list.innerHTML).toContain('Unstoppable Hoodie');
        expect(list.innerHTML).toContain('$59.99 each');
        expect(list.innerHTML).toContain('$119.98');
        expect(list.innerHTML).toContain('cart-stepper-btn cart-qty-minus');
        expect(list.innerHTML).toContain('cart-stepper-btn cart-qty-plus');
        expect(list.innerHTML).toContain('aria-label="Decrease quantity of Unstoppable Hoodie"');
        expect(list.innerHTML).toContain('aria-label="Increase quantity of Unstoppable Hoodie"');
    });

    it('renders HarmonyTunes Cap and catalog items with natural, human descriptions and typography', () => {
        localStorage.setItem('localCart', JSON.stringify({
            'harmonytunes-shirt': 1
        }));
        cartModule.loadCartFromStorage();
        cartModule.renderCart();

        const list = document.getElementById('cart-items-list');
        expect(list.innerHTML).toContain('HarmonyTunes Cap');
        expect(list.innerHTML).toContain('cart-item-desc');
        expect(list.innerHTML).toContain('Low-profile');
        expect(list.innerHTML).not.toContain('Dark cap with the HarmonyTunes logo. Perfect for music lovers.');
        expect(list.innerHTML).toContain('$24.99 each');
    });
});

describe('Navbar Cart Badge Updates (js/navbar.js)', () => {
    let navbarModule;

    beforeEach(async () => {
        document.body.innerHTML = `
            <div id="nav-cart-btn">
                <span id="nav-cart-badge" style="display: none;">0</span>
            </div>
            <div id="uds-nav-cart-btn">
                <span id="uds-nav-cart-badge" style="display: none;">0</span>
            </div>
        `;
        navbarModule = await import('../js/navbar.js');
    });

    it('displays and updates badge count when count > 0', () => {
        const { updateNavbarCartBadge } = navbarModule;
        updateNavbarCartBadge(5);

        const badge = document.getElementById('nav-cart-badge');
        const udsBadge = document.getElementById('uds-nav-cart-badge');

        expect(badge.style.display).toBe('inline-flex');
        expect(badge.textContent).toBe('5');
        expect(udsBadge.style.display).toBe('inline-flex');
        expect(udsBadge.textContent).toBe('5');
    });

    it('hides badge when count is 0 or negative', () => {
        const { updateNavbarCartBadge } = navbarModule;
        updateNavbarCartBadge(0);

        const badge = document.getElementById('nav-cart-badge');
        expect(badge.style.display).toBe('none');

        updateNavbarCartBadge(-2);
        expect(badge.style.display).toBe('none');
    });
});

describe('Lexi Chatbot Cart Routing Integration', () => {
    it('verifies openSitewideLexiCart routes directly to https://realunstoppable.store/cart.html', () => {
        const sitewidePlayerJs = fs.readFileSync(path.join(ROOT_DIR, 'js/sitewide-player.js'), 'utf8');
        expect(sitewidePlayerJs).toContain("openSitewideLexiCart() {");
        expect(sitewidePlayerJs).toContain("window.location.href = 'https://realunstoppable.store/cart.html'");
        expect(sitewidePlayerJs).not.toContain("alert('Lexi is sleeping')");
    });

    it('verifies chatbot open cart action routes directly to https://realunstoppable.store/cart.html', () => {
        const chatbotJs = fs.readFileSync(path.join(ROOT_DIR, 'js/chatbot.js'), 'utf8');
        expect(chatbotJs).toContain("const openCartBtn = e.target.closest('.chat-open-cart-action')");
        expect(chatbotJs).toContain("window.location.href = 'https://realunstoppable.store/cart.html'");
    });

    it('verifies store.html and js/shop.js route cart buttons to cart.html, and shop.html redirects', () => {
        const storeHtml = fs.readFileSync(path.join(ROOT_DIR, 'store.html'), 'utf8');
        const shopJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shop.js'), 'utf8');

        expect(storeHtml).toContain('href="cart.html"');
        expect(shopJs).toContain("window.location.href = 'cart.html'");

        const shopHtml = fs.readFileSync(path.join(ROOT_DIR, 'shop.html'), 'utf8');
        expect(shopHtml).toContain('url=/store');
    });
});
