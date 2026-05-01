import { jest } from '@jest/globals';
import { handleAddToCart, cart } from './shop.js';

describe('shop.js handleAddToCart', () => {
    let consoleErrorSpy;
    let originalSetItem;

    beforeEach(() => {
        // Clear cart
        for (const key in cart) {
            delete cart[key];
        }
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        originalSetItem = localStorage.setItem;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        localStorage.setItem = originalSetItem;
    });

    test('should add item to cart on success', async () => {
        const productId = 'unstoppable-hoodie';
        await handleAddToCart(productId);

        expect(cart[productId]).toBe(1);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('should handle error and call console.error', async () => {
        const productId = 'unstoppable-hoodie';
        const testError = new Error('localStorage is full');
        // Mock localStorage.setItem to throw an error, which saveCart will propagate
        localStorage.setItem = jest.fn(() => {
            throw testError;
        });

        await handleAddToCart(productId);

        expect(cart[productId]).toBe(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to add to cart:', testError);
    });
});
