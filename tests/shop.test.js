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

describe('review interactions and rendering', () => {
    let renderReviewItemHtml;
    let getUserReactions;
    let setUserReaction;

    beforeAll(async () => {
        const module = await import('../js/shop.js');
        renderReviewItemHtml = module.renderReviewItemHtml;
        getUserReactions = module.getUserReactions;
        setUserReaction = module.setUserReaction;
    });

    beforeEach(() => {
        localStorage.clear();
    });

    test('renders review item with avatar, date, content and kebab menu', () => {
        const review = {
            id: 'rev_1',
            productId: 'unstoppable-hoodie',
            userId: 'user_123',
            authorName: 'Alex Mercer',
            rating: 5,
            text: 'Amazing comfort and fit!',
            likes: 4
        };

        const html = renderReviewItemHtml(review, 'user_999', [], {});

        expect(html).toContain('Alex Mercer');
        expect(html).toContain('A'); // avatar initial
        expect(html).toContain('Amazing comfort and fit!');
        expect(html).toContain('review-menu-btn');
        expect(html).toContain('btn-view-profile');
        // Non-owner should not see edit/delete
        expect(html).not.toContain('btn-edit-review');
        expect(html).not.toContain('btn-delete-review');
        // Like and Dislike buttons present like YouTube
        expect(html).toContain('btn-reaction-like');
        expect(html).toContain('btn-reaction-dislike');
        expect(html).toContain('4'); // likes count
    });

    test('renders Edit and Delete options for owner of review', () => {
        const review = {
            id: 'rev_mine',
            productId: 'unstoppable-hoodie',
            userId: 'my_uid',
            authorName: 'Owner User',
            rating: 4,
            text: 'My personal review'
        };

        const html = renderReviewItemHtml(review, 'my_uid', [], {});

        expect(html).toContain('btn-edit-review');
        expect(html).toContain('btn-delete-review');
        expect(html).toContain('btn-view-profile');
    });

    test('renders Edit and Delete for local author review even if unauthenticated', () => {
        const review = {
            id: 'rev_local_1',
            productId: 'unstoppable-hoodie',
            userId: null,
            authorName: 'Guest',
            rating: 5,
            text: 'Guest review'
        };

        const html = renderReviewItemHtml(review, null, ['rev_local_1'], {});

        expect(html).toContain('btn-edit-review');
        expect(html).toContain('btn-delete-review');
    });

    test('renders YouTube like active state when user has liked review', () => {
        const review = {
            id: 'rev_liked',
            productId: 'unstoppable-hoodie',
            userId: 'other_user',
            authorName: 'Sam',
            rating: 5,
            text: 'Great product',
            likes: 12
        };

        const html = renderReviewItemHtml(review, 'my_uid', [], { rev_liked: 'like' });

        expect(html).toContain('btn-reaction-like liked');
        expect(html).toContain('12');
    });

    test('getUserReactions and setUserReaction persist correctly in localStorage', () => {
        expect(getUserReactions()).toEqual({});

        setUserReaction('rev_test', 'like');
        expect(getUserReactions()).toEqual({ rev_test: 'like' });

        setUserReaction('rev_test', 'dislike');
        expect(getUserReactions()).toEqual({ rev_test: 'dislike' });

        setUserReaction('rev_test', null);
        expect(getUserReactions()).toEqual({});
    });
});


