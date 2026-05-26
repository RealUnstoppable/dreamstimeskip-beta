import { jest } from '@jest/globals';

// MOCK REQUIRED DOM ELEMENTS BEFORE IMPORTING SHOP.JS
document.body.innerHTML = `
    <div id="cart-item-count"></div>
    <div id="cart-total-price"></div>
    <button id="checkout-btn"></button>
    <div id="nav-cta-container"></div>
    <div class="hamburger"></div>
    <div class="nav-links"></div>
    <div id="product-grid"></div>
    <div id="cart-items-container"></div>
`;

import { handleUpdateQuantity, cart } from '../js/shop.js';

describe('handleUpdateQuantity', () => {
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
