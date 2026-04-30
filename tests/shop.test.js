import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

let cleanupListeners;

// Setup DOM before importing shop.js
beforeEach(() => {
  document.body.innerHTML = `
    <div id="product-grid"></div>
    <button id="cart-button"></button>
    <div id="cart-modal" style="display: none;"></div>
    <button id="close-cart-btn"></button>
    <div id="cart-items-container"></div>
    <span id="cart-item-count">0</span>
    <span id="cart-total-price">$0.00</span>
    <button id="checkout-btn" disabled></button>
    <div id="nav-cta-container"></div>
    <div class="hamburger"></div>
    <div class="nav-links"></div>
  `;

  // Clear localStorage
  localStorage.clear();

  // Reset mocks
  jest.clearAllMocks();

  // Mock addEventListener on the document so we can clean it up
  const originalAddEventListener = document.addEventListener;
  const originalWindowAddEventListener = window.addEventListener;
  const addedListeners = [];
  const addedWindowListeners = [];

  document.addEventListener = (type, listener, options) => {
    addedListeners.push({type, listener, options});
    originalAddEventListener.call(document, type, listener, options);
  };

  window.addEventListener = (type, listener, options) => {
    addedWindowListeners.push({type, listener, options});
    originalWindowAddEventListener.call(window, type, listener, options);
  };

  cleanupListeners = () => {
    addedListeners.forEach(({type, listener, options}) => {
      document.removeEventListener(type, listener, options);
    });
    document.addEventListener = originalAddEventListener;

    addedWindowListeners.forEach(({type, listener, options}) => {
      window.removeEventListener(type, listener, options);
    });
    window.addEventListener = originalWindowAddEventListener;
  };

  // Isolate module imports to reset state between tests
  jest.isolateModules(() => {
    require('../js/shop.js');
  });
});

afterEach(() => {
    cleanupListeners();
});

describe('Shop.js Functionality', () => {

  it('should render products on DOMContentLoaded', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');
    expect(productGrid.innerHTML).toContain('Unstoppable Hoodie');
    expect(productGrid.innerHTML).toContain('DTS Model Tee');
  });

  it('should open and close the cart modal', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const cartButton = document.getElementById('cart-button');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');

    cartButton.click();
    expect(cartModal.style.display).toBe('block');

    closeCartBtn.click();
    expect(cartModal.style.display).toBe('none');
  });

  it('should add an item to the cart', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');

    // Find the first add-to-cart button and click it
    const addBtn = productGrid.querySelector('.add-to-cart-btn');
    addBtn.click();

    // Wait for async operations to complete
    await new Promise(process.nextTick);

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemCountEl = document.getElementById('cart-item-count');

    // Should update item count
    expect(cartItemCountEl.textContent).toBe('1');
    // Should render the item in the cart
    expect(cartItemsContainer.innerHTML).toContain('Unstoppable Hoodie');

    // The checkout button should be enabled
    const checkoutBtn = document.getElementById('checkout-btn');
    expect(checkoutBtn.disabled).toBe(false);
  });

  it('should update cart item quantity', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');
    const addBtn = productGrid.querySelector('.add-to-cart-btn');
    addBtn.click(); // Add 1

    // Wait for async operations to complete
    await new Promise(process.nextTick);

    const cartItemsContainer = document.getElementById('cart-items-container');
    const quantityInput = cartItemsContainer.querySelector('.item-quantity-input');

    // Simulate updating quantity to 3
    quantityInput.value = '3';
    quantityInput.dispatchEvent(new Event('change', { bubbles: true }));

    await new Promise(process.nextTick);

    const cartItemCountEl = document.getElementById('cart-item-count');
    expect(cartItemCountEl.textContent).toBe('3');
  });

  it('should remove item from cart when quantity is set to 0', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');
    const addBtn = productGrid.querySelector('.add-to-cart-btn');
    addBtn.click(); // Add 1

    // Wait for async operations to complete
    await new Promise(process.nextTick);

    const cartItemsContainer = document.getElementById('cart-items-container');
    const quantityInput = cartItemsContainer.querySelector('.item-quantity-input');

    // Simulate updating quantity to 0
    quantityInput.value = '0';
    quantityInput.dispatchEvent(new Event('change', { bubbles: true }));

    await new Promise(process.nextTick);

    const cartItemCountEl = document.getElementById('cart-item-count');
    expect(cartItemCountEl.textContent).toBe('0');
    expect(cartItemsContainer.innerHTML).toContain('Your cart is empty.');
  });

  it('should remove item from cart when remove button is clicked', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');
    const addBtn = productGrid.querySelector('.add-to-cart-btn');
    addBtn.click(); // Add 1

    // Wait for async operations to complete
    await new Promise(process.nextTick);

    const cartItemsContainer = document.getElementById('cart-items-container');
    const removeBtn = cartItemsContainer.querySelector('.remove-item-btn');

    removeBtn.click();

    await new Promise(process.nextTick);

    const cartItemCountEl = document.getElementById('cart-item-count');
    expect(cartItemCountEl.textContent).toBe('0');
    expect(cartItemsContainer.innerHTML).toContain('Your cart is empty.');
  });

  it('should save to localStorage when unauthenticated', async () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const productGrid = document.getElementById('product-grid');
    const addBtn = productGrid.querySelector('.add-to-cart-btn');
    addBtn.click(); // Add 1

    // Wait for async operations to complete
    await new Promise(process.nextTick);

    const localCart = JSON.parse(localStorage.getItem('localCart'));
    expect(localCart['unstoppable-hoodie']).toBe(1);
  });

});
