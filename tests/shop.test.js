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

    test('logs error when product is not found', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await handleUpdateQuantity('non-existent-product', 5);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Product not found: non-existent-product');
        consoleErrorSpy.mockRestore();
    });

    test('logs error when saveCart fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const originalSetItem = localStorage.setItem;
        const testError = new Error('Storage full');

        localStorage.setItem = jest.fn(() => {
            throw testError;
        });

        await handleUpdateQuantity('unstoppable-hoodie', 5);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update quantity:', testError);

        localStorage.setItem = originalSetItem;
        consoleErrorSpy.mockRestore();
    });
});
