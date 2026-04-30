import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./auth.js', () => ({
  auth: {},
  db: {}
}));

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock('./shop.js', () => ({
  products: [
    { id: '1', name: 'Product 1', price: 10 },
    { id: '2', name: 'Product 2', price: 20 },
  ]
}));

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

describe('checkout', () => {
  let checkoutContainer;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="checkout-container"></div><div id="checkout-message"></div>';
    checkoutContainer = document.getElementById('checkout-container');

    vi.clearAllMocks();

    delete window.location;
    window.location = { replace: vi.fn(), href: '' };

    // We import dynamically to make sure it picks up document.body changes and vi.clearAllMocks
    await import('./checkout.js');
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should initialize auth listener on load', () => {
    expect(onAuthStateChanged).toHaveBeenCalled();
  });

  describe('auth state changed', () => {
    it('should redirect to sign in if user is not authenticated', async () => {
      const authCallback = onAuthStateChanged.mock.calls[0][1];
      await authCallback(null);
      expect(window.location.replace).toHaveBeenCalledWith('/sign in beta.html');
    });

    it('should render empty cart message if user cart is empty', async () => {
      const authCallback = onAuthStateChanged.mock.calls[0][1];
      getDoc.mockResolvedValueOnce({ exists: () => false });

      await authCallback({ uid: 'user123' });

      expect(getDoc).toHaveBeenCalled();
      expect(checkoutContainer.innerHTML).toContain('Your cart is empty.');
    });

    it('should render checkout form and summary if user has items in cart', async () => {
      const authCallback = onAuthStateChanged.mock.calls[0][1];
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ items: { '1': 2, '2': 1 } }) // 2 of Product 1 ($10), 1 of Product 2 ($20)
      });

      await authCallback({ uid: 'user123' });

      expect(checkoutContainer.innerHTML).toContain('Checkout');
      expect(checkoutContainer.innerHTML).toContain('Shipping Information');
      expect(checkoutContainer.innerHTML).toContain('2x Product 1');
      expect(checkoutContainer.innerHTML).toContain('$20.00'); // 2 * $10 = $20
      expect(checkoutContainer.innerHTML).toContain('1x Product 2');
      expect(checkoutContainer.innerHTML).toContain('$20.00'); // 1 * $20 = $20

      const subtotal = 40;
      const tax = 40 * 0.07;
      const total = subtotal + tax;

      expect(checkoutContainer.innerHTML).toContain(`$${subtotal.toFixed(2)}`);
      expect(checkoutContainer.innerHTML).toContain(`$${tax.toFixed(2)}`);
      expect(checkoutContainer.innerHTML).toContain(`$${total.toFixed(2)}`);
    });
  });

  describe('handlePlaceOrder', () => {
    beforeEach(async () => {
      const authCallback = onAuthStateChanged.mock.calls[0][1];

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ items: { '1': 1 } })
      });

      await authCallback({ uid: 'user123' });

      document.getElementById('name').value = 'John Doe';
      document.getElementById('address').value = '123 Main St';
      document.getElementById('city').value = 'Anytown';
      document.getElementById('zip').value = '12345';
    });

    it('should call runTransaction and redirect on success', async () => {
      runTransaction.mockResolvedValueOnce();

      const form = document.getElementById('checkout-form');
      const submitEvent = new Event('submit', { cancelable: true });

      // jsdom might need an await here because of event loop?
      form.dispatchEvent(submitEvent);
      await new Promise(process.nextTick);

      expect(runTransaction).toHaveBeenCalled();
      const messageEl = document.getElementById('checkout-message');
      expect(messageEl.textContent).toBe('Order placed successfully! Redirecting...');
      expect(messageEl.style.color).toBe('var(--accent-green)');
    });

    it('should show error message if runTransaction fails', async () => {
      runTransaction.mockRejectedValueOnce(new Error('Transaction failed'));

      const form = document.getElementById('checkout-form');
      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      await new Promise(process.nextTick);

      expect(runTransaction).toHaveBeenCalled();
      const messageEl = document.getElementById('checkout-message');
      expect(messageEl.textContent).toBe('There was an error placing your order. Please try again.');
      expect(messageEl.style.color).toBe('var(--accent-red)');

      const placeOrderBtn = document.getElementById('place-order-btn');
      expect(placeOrderBtn.disabled).toBe(false);
      expect(placeOrderBtn.textContent).toBe('Place Order');
    });
  });
});
