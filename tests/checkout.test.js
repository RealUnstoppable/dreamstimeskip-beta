import { jest } from '@jest/globals';
import { processOrderTransaction } from '../js/checkout.js';
import { db } from '../js/auth.js';
import { doc, runTransaction } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

describe('processOrderTransaction', () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup a mock transaction object that has get, set, update
        mockTransaction = {
            get: jest.fn(),
            set: jest.fn(),
            update: jest.fn()
        };

        // Make runTransaction execute the callback immediately with our mock transaction
        runTransaction.mockImplementation((db, callback) => callback(mockTransaction));

        // Mock doc to return string representations for easy assertion
        doc.mockImplementation((db, collection, id) => `${collection}/${id}`);
    });

    test('should process an order successfully with existing and non-existing product stats', async () => {
        const uid = 'testuser123';
        const cart = {
            'productA': 2,
            'productB': 1
        };
        const orderDetails = { total: 50, status: 'Processing' };

        // Mock get responses
        // productA exists, productB does not exist
        mockTransaction.get.mockImplementation(async (ref) => {
            if (ref === 'product_stats/productA') {
                return {
                    exists: () => true,
                    data: () => ({ orderedCount: 5 })
                };
            }
            if (ref === 'product_stats/productB') {
                return {
                    exists: () => false,
                    data: () => ({})
                };
            }
            return null;
        });

        // Use a mock Date.now() for deterministic order id testing
        const mockNow = 1600000000000;
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(mockNow);

        await processOrderTransaction(uid, cart, orderDetails);

        dateSpy.mockRestore();

        // Verify transaction gets
        expect(mockTransaction.get).toHaveBeenCalledTimes(2);
        expect(mockTransaction.get).toHaveBeenCalledWith('product_stats/productA');
        expect(mockTransaction.get).toHaveBeenCalledWith('product_stats/productB');

        // Verify order creation
        expect(mockTransaction.set).toHaveBeenCalledWith(`orders/${uid}_${mockNow}`, orderDetails);

        // Verify product stats updates
        // productA existed with count 5, ordered 2 -> update to 7
        expect(mockTransaction.update).toHaveBeenCalledWith('product_stats/productA', { orderedCount: 7 });
        // productB did not exist, ordered 1 -> set to 1
        expect(mockTransaction.set).toHaveBeenCalledWith('product_stats/productB', { orderedCount: 1 });

        // Verify cart clearing
        expect(mockTransaction.update).toHaveBeenCalledWith(`carts/${uid}`, { items: {} });
    });

    test('should handle errors and bubble them up', async () => {
        const uid = 'testuser123';
        const cart = { 'productA': 2 };
        const orderDetails = {};

        // Mock get to reject to simulate an error in the transaction
        mockTransaction.get.mockImplementation(async () => {
            throw new Error('Database error');
        });

        await expect(processOrderTransaction(uid, cart, orderDetails)).rejects.toThrow('Database error');
    });
});
