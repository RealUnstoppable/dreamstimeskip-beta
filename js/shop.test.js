describe('shop.js', () => {
    let shopModule;

    beforeEach(async () => {
        // Setup DOM *before* importing the module so the global variables are set correctly
        document.body.innerHTML = `
            <div id="product-grid"></div>
            <button id="cart-button"></button>
            <div id="cart-modal"></div>
            <button id="close-cart-btn"></button>
            <div id="cart-items-container"></div>
            <span id="cart-item-count">0</span>
            <span id="cart-total-price">$0.00</span>
            <button id="checkout-btn"></button>
            <div id="nav-cta-container"></div>
            <button class="hamburger"></button>
            <div class="nav-links"></div>
        `;

        // Reset localStorage
        localStorage.clear();

        // Reset mocks
        jest.clearAllMocks();
        jest.resetModules();

        // Ensure state is cleared before reloading the module
        shopModule = await import('./shop.js');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.resetModules();
    });

    it('exports products array', () => {
        expect(Array.isArray(shopModule.products)).toBe(true);
        expect(shopModule.products.length).toBeGreaterThan(0);
        expect(shopModule.products[0]).toHaveProperty('id');
        expect(shopModule.products[0]).toHaveProperty('name');
        expect(shopModule.products[0]).toHaveProperty('price');
    });

    it('renders products on DOMContentLoaded', () => {
        // Dispatch DOMContentLoaded event
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        const productGrid = document.getElementById('product-grid');
        expect(productGrid.innerHTML).toContain('Unstoppable Hoodie');
        expect(productGrid.querySelectorAll('.product-card').length).toBe(shopModule.products.length);
    });

    it('handles adding to cart', async () => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Initial state
        expect(document.getElementById('cart-item-count').textContent).toBe('0');
        expect(document.getElementById('cart-total-price').textContent).toBe('$0.00');

        // Click add to cart for first product
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.click();

        // Wait for async operations (saveCart)
        await Promise.resolve();
        await new Promise(process.nextTick);

        expect(document.getElementById('cart-item-count').textContent).toBe('1');

        const firstProductPrice = shopModule.products[0].price;
        expect(document.getElementById('cart-total-price').textContent).toBe(`$${firstProductPrice.toFixed(2)}`);

        // Check localStorage since user is not logged in
        const localCart = JSON.parse(localStorage.getItem('localCart'));
        expect(localCart).toEqual({ [shopModule.products[0].id]: 1 });
    });

    it('handles cart removal', async () => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Add to cart first
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.click();

        await Promise.resolve();
        await new Promise(process.nextTick);

        expect(document.getElementById('cart-item-count').textContent).toBe('1');

        // Open cart modal
        document.getElementById('cart-button').click();

        // Remove from cart
        const removeBtn = document.querySelector('.remove-item-btn');
        expect(removeBtn).not.toBeNull();
        removeBtn.click();

        await Promise.resolve();
        await new Promise(process.nextTick);

        expect(document.getElementById('cart-item-count').textContent).toBe('0');
        expect(document.getElementById('cart-total-price').textContent).toBe('$0.00');

        const localCart = JSON.parse(localStorage.getItem('localCart'));
        expect(localCart).toEqual({});
    });

    it('handles quantity update', async () => {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Add to cart first
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.click();

        await Promise.resolve();
        await new Promise(process.nextTick);

        // Update quantity
        const quantityInput = document.querySelector('.item-quantity-input');
        expect(quantityInput).not.toBeNull();
        quantityInput.value = '3';
        const changeEvent = new Event('change', { bubbles: true });
        quantityInput.dispatchEvent(changeEvent);

        await Promise.resolve();
        await new Promise(process.nextTick);

        expect(document.getElementById('cart-item-count').textContent).toBe('3');

        const firstProductPrice = shopModule.products[0].price;
        expect(document.getElementById('cart-total-price').textContent).toBe(`$${(firstProductPrice * 3).toFixed(2)}`);

        const localCart = JSON.parse(localStorage.getItem('localCart'));
        expect(localCart).toEqual({ [shopModule.products[0].id]: 3 });
    });
});
