import { jest } from '@jest/globals';
import { productMap } from '../js/products-data.js';

document.body.innerHTML = `
    <div id="product-grid"></div>
    <button id="cart-button"></button>
    <div id="cart-modal"></div>
    <button id="close-cart-btn"></button>
    <div id="cart-items-container"></div>
    <span id="cart-item-count"></span>
    <span id="cart-total-price"></span>
    <button id="checkout-btn"></button>
    <div id="nav-cta-container"></div>
    <div class="hamburger"></div>
    <div class="nav-links"></div>
    <div id="reviews-modal" style="display: none;"></div>
    <div id="reviews-list-container"></div>
    <div id="review-submission-section"></div>
    <div id="login-prompt-section"></div>
    <form id="review-form"></form>
    <div id="review-notification"></div>
    <textarea id="review-text"></textarea>
    <button id="submit-review-btn"></button>
    <div id="detail-product-name"></div>
    <img id="detail-main-image" />
    <div id="detail-thumbnails"></div>
    <div id="detail-original-price"></div>
    <div id="detail-sale-price"></div>
    <div id="detail-discount-badge"></div>
    <div id="detail-description"></div>
    <input id="detail-quantity-input" />
    <span id="modal-average-rating"></span>
    <span id="modal-stars-display"></span>
    <span id="modal-review-count"></span>
    <div id="reviews-list"></div>
`;

describe('handleUpdateQuantity', () => {
    let handleUpdateQuantity;
    let cart;

    beforeAll(async () => {
        const module = await import('../js/shop.js');
        handleUpdateQuantity = module.handleUpdateQuantity;
        cart = module.cart;
    });

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

    test('caps quantity at 99 when quantity > 99', async () => {
        cart['unstoppable-hoodie'] = 1;
        await handleUpdateQuantity('unstoppable-hoodie', 150);
        expect(cart['unstoppable-hoodie']).toBe(99);
    });

    test('prevents string concatenation when adding to cart with existing string quantity', async () => {
        const { handleAddToCart } = await import('../js/shop.js');
        cart['unstoppable-hoodie'] = '1';
        await handleAddToCart('unstoppable-hoodie', null, 1);
        expect(cart['unstoppable-hoodie']).toBe(2);
        await handleAddToCart('unstoppable-hoodie', null, 1);
        expect(cart['unstoppable-hoodie']).toBe(3);
    });

    test('logs error when product is not found', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await handleUpdateQuantity('non-existent-product', 5);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Manager info: Product not found: non-existent-product');
        consoleErrorSpy.mockRestore();
    });

    test('logs error when update fails unexpectedly', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const testError = new Error('Unexpected failure');
        const origGet = productMap.get;
        productMap.get = jest.fn(() => {
            throw testError;
        });

        await handleUpdateQuantity('unstoppable-hoodie', 5);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Manager info: Failed to update quantity ', testError);

        productMap.get = origGet;
        consoleErrorSpy.mockRestore();
    });
});

describe('loadProductStats', () => {
    let loadProductStats;

    beforeAll(async () => {
        // Just rely on the missing firebase config throwing an error naturally
        const module = await import('../js/shop.js');
        loadProductStats = module.loadProductStats;
    });

    test('logs error when getDocs fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await loadProductStats();

        // Since the environment isn't fully mocked, getDocs should fail on its own
        // We just need to check if the error is caught and logged correctly.
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Manager info: Error fetching product_stats:',
            expect.any(String)
        );

        consoleErrorSpy.mockRestore();
    });
});

describe('openReviewsModal', () => {
    let openReviewsModal;
    let productStatsMap;

    beforeAll(async () => {
        const module = await import('../js/shop.js');
        openReviewsModal = module.openReviewsModal;
        productStatsMap = module.productStatsMap;
    });

    test('displays valid stats when product has existing ratings', async () => {
        productStatsMap.set('unstoppable-hoodie', {
            averageRating: 4.8,
            reviewCount: 12
        });

        await openReviewsModal('unstoppable-hoodie');

        expect(document.getElementById('modal-average-rating').textContent).toBe('4.8');
        expect(document.getElementById('modal-review-count').textContent).toBe('(12 reviews)');
        expect(document.getElementById('modal-stars-display').innerHTML).toContain('★');
    });

    test('gracefully falls back to 0.0 and (0 reviews) when product has no stats', async () => {
        productStatsMap.delete('unstoppable-hoodie');

        await openReviewsModal('unstoppable-hoodie');

        expect(document.getElementById('modal-average-rating').textContent).toBe('0.0');
        expect(document.getElementById('modal-review-count').textContent).toBe('(0 reviews)');
        expect(document.getElementById('modal-stars-display').innerHTML).toBe('☆☆☆☆☆');
    });

    test('handles NaN and undefined gracefully without rendering NaN to users', async () => {
        productStatsMap.set('unstoppable-hoodie', {
            averageRating: NaN,
            reviewCount: undefined
        });

        await openReviewsModal('unstoppable-hoodie');

        expect(document.getElementById('modal-average-rating').textContent).toBe('0.0');
        expect(document.getElementById('modal-review-count').textContent).toBe('(0 reviews)');
        expect(document.getElementById('modal-stars-display').innerHTML).toBe('☆☆☆☆☆');
    });
});

