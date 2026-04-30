import { jest } from '@jest/globals';

jest.unstable_mockModule('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
    onAuthStateChanged: jest.fn(),
}));

const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => 'mock-timestamp');
const mockRunTransaction = jest.fn();

jest.unstable_mockModule('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    doc: mockDoc,
    getDoc: mockGetDoc,
    setDoc: mockSetDoc,
    serverTimestamp: mockServerTimestamp,
    runTransaction: mockRunTransaction,
}));

jest.unstable_mockModule('./auth.js', () => ({
    auth: {},
    db: {},
}));

jest.unstable_mockModule('./shop.js', () => ({
    products: [
        { id: 'prod1', name: 'Product 1', price: 10 }
    ],
}));

describe('handlePlaceOrder', () => {
    let handlePlaceOrder, setCurrentUser, setUserCart;

    beforeEach(async () => {
        // Reset DOM
        document.body.innerHTML = `
            <div id="checkout-container"></div>
            <button id="place-order-btn">Place Order</button>
            <div id="checkout-message"></div>
            <input id="name" value="Test Name" />
            <input id="address" value="123 Test St" />
            <input id="city" value="Test City" />
            <input id="zip" value="12345" />
        `;

        jest.clearAllMocks();

        // Import module under test dynamically after setting up mocks
        const module = await import('./checkout.js');
        handlePlaceOrder = module.handlePlaceOrder;
        setCurrentUser = module.setCurrentUser;
        setUserCart = module.setUserCart;

        // Set mock state
        setCurrentUser({ uid: 'user123' });
        setUserCart({ 'prod1': 2 });

        jest.useFakeTimers();

        // Suppress expected jsdom navigation error messages that happen when JSDOM internals throw error
        jest.spyOn(console, 'error').mockImplementation((msg) => {
            if (msg && msg.type === 'not implemented') return;
            if (msg && msg.toString && msg.toString().includes('Not implemented: navigation')) return;
        });

        // We will intercept the global `setTimeout` instead to test what it does.
        global.setTimeout = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('should successfully place an order and redirect on success', async () => {
        const mockEvent = { preventDefault: jest.fn() };

        // Mock a successful transaction
        mockRunTransaction.mockImplementation(async (db, transactionCb) => {
            const mockTransaction = {
                set: jest.fn(),
                get: jest.fn().mockResolvedValue({ exists: () => false }),
                update: jest.fn()
            };
            await transactionCb(mockTransaction);
        });

        await handlePlaceOrder(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();

        const placeOrderBtn = document.getElementById('place-order-btn');
        expect(placeOrderBtn.disabled).toBe(true);
        expect(placeOrderBtn.textContent).toBe('Processing...');

        expect(mockRunTransaction).toHaveBeenCalled();

        const messageEl = document.getElementById('checkout-message');
        expect(messageEl.textContent).toBe('Order placed successfully! Redirecting...');
        expect(messageEl.style.color).toBe('var(--accent-green)');

        // We intercepted setTimeout above
        expect(global.setTimeout).toHaveBeenCalled();
        const timeoutCb = global.setTimeout.mock.calls[0][0];
        const timeoutMs = global.setTimeout.mock.calls[0][1];

        expect(timeoutMs).toBe(3000);
        expect(timeoutCb.toString()).toContain("window.location.href = './account.html'");
    });

    it('should show error message and re-enable button when transaction fails', async () => {
        const mockEvent = { preventDefault: jest.fn() };

        // Mock a failing transaction
        const testError = new Error('Transaction failed');
        mockRunTransaction.mockRejectedValue(testError);

        console.error.mockRestore();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await handlePlaceOrder(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockRunTransaction).toHaveBeenCalled();

        const placeOrderBtn = document.getElementById('place-order-btn');
        expect(placeOrderBtn.disabled).toBe(false);
        expect(placeOrderBtn.textContent).toBe('Place Order');

        const messageEl = document.getElementById('checkout-message');
        expect(messageEl.textContent).toBe('There was an error placing your order. Please try again.');
        expect(messageEl.style.color).toBe('var(--accent-red)');

        expect(consoleSpy).toHaveBeenCalledWith("Error placing order:", testError);
    });
});
