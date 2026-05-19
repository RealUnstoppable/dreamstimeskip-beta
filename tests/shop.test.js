import { jest } from '@jest/globals';
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
