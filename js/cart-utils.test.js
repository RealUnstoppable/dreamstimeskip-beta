import test from 'node:test';
import assert from 'node:assert';
import { calculateCartSummary } from './cart-utils.js';

test('calculateCartSummary', async (t) => {
    const products = [
        { id: 'p1', price: 10.00 },
        { id: 'p2', price: 20.50 }
    ];

    await t.test('calculates empty cart', () => {
        const result = calculateCartSummary({}, products);
        assert.deepStrictEqual(result, { itemCount: 0, totalPrice: 0 });
    });

    await t.test('calculates correct totals for valid cart', () => {
        const cart = { 'p1': 2, 'p2': 1 };
        const result = calculateCartSummary(cart, products);
        assert.deepStrictEqual(result, { itemCount: 3, totalPrice: 40.50 });
    });

    await t.test('ignores products not found in the product list', () => {
        const cart = { 'p1': 1, 'invalid_p': 5 };
        const result = calculateCartSummary(cart, products);
        assert.deepStrictEqual(result, { itemCount: 1, totalPrice: 10.00 });
    });

    await t.test('handles invalid string quantities gracefully', () => {
        const cart = { 'p1': 'abc' };
        const result = calculateCartSummary(cart, products);
        assert.deepStrictEqual(result, { itemCount: 0, totalPrice: 0 });
    });

    await t.test('handles negative quantities gracefully', () => {
        const cart = { 'p1': -5 };
        const result = calculateCartSummary(cart, products);
        assert.deepStrictEqual(result, { itemCount: 0, totalPrice: 0 });
    });
});
