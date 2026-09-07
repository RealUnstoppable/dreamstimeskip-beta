import { jest } from '@jest/globals';

document.body.innerHTML = `
    <div id="product-grid"></div>
    <button id="cart-button"></button>
    <div id="cart-modal"></div>
    <button id="close-cart-btn"></button>
    <div id="cart-items-container"></div>
    <span id="cart-item-count"></span>
    <span id="cart-total-price"></span>
    <button id="checkout-btn"></button>
    <div id="nav-cta-container"></div>
    <div class="hamburger"></div>
    <div class="nav-links"></div>
`;

describe('handleUpdateQuantity', () => {
    let handleUpdateQuantity;
    let cart;

    beforeAll(async () => {
        const module = await import('../js/shop.js');
        handleUpdateQuantity = module.handleUpdateQuantity;
        cart = module.cart;
    });

    beforeEach(() => {
        // Reset cart to a known state
        for (let key in cart) delete cart[key];
    });

    test('updates quantity to a valid number greater than 0', async () => {
        cart['unstoppable-hoodie'] = 1;
        await handleUpdateQuantity('unstoppable-hoodie', 5);
        expect(cart['unstoppable-hoodie']).toBe(5);
    });

    test('removes item when quantity is 0', async () => {
        cart['unstoppable-hoodie'] = 2;
        await handleUpdateQuantity('unstoppable-hoodie', 0);
        expect(cart['unstoppable-hoodie']).toBeUndefined();
    });

    test('removes item when quantity is negative', async () => {
        cart['unstoppable-hoodie'] = 3;
        await handleUpdateQuantity('unstoppable-hoodie', -1);
        expect(cart['unstoppable-hoodie']).toBeUndefined();
    });

    test('parses float quantities as integers', async () => {
        cart['unstoppable-hoodie'] = 1;
        await handleUpdateQuantity('unstoppable-hoodie', 2.5);
        expect(cart['unstoppable-hoodie']).toBe(2);
    });

    test('parses string quantities as integers', async () => {
        cart['unstoppable-hoodie'] = 1;
        await handleUpdateQuantity('unstoppable-hoodie', '4');
        expect(cart['unstoppable-hoodie']).toBe(4);
    });
});
