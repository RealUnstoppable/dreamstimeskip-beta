import { escapeHTML } from './utils.js';
import { productMap } from './products.js';

export function generateProductCardHtml(product, mode, extraData = {}) {
    if (!product) return '';

    if (mode === 'checkout-summary') {
        const quantity = extraData.quantity || 1;
        return \`<div class="summary-item"><span>\${quantity}x \${escapeHTML(product.name)}</span> <span>$\${(product.price * quantity).toFixed(2)}</span></div>\`;
    } else if (mode === 'wishlist') {
        return \`
            <div class="product-card" style="padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; display: flex; flex-direction: column;">
                <img src="\${product.imageUrl}" alt="\${escapeHTML(product.name)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #000;">
                <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">\${escapeHTML(product.name)}</h3>
                <p style="color: var(--accent-green); font-weight: 700; margin-bottom: 12px;">$\${product.price.toFixed(2)}</p>
                <div style="margin-top: auto; display: flex; gap: 8px;">
                    <button class="cta-button cart-btn" data-id="\${product.id}" style="flex: 1; padding: 8px;">Add to Cart</button>
                    <button class="cta-button wishlist-btn" data-id="\${product.id}" style="padding: 8px; background: rgba(255,255,255,0.1); color: var(--accent-red);">❤️</button>
                </div>
            </div>
        \`;
    } else if (mode === 'shop') {
        const isWishlisted = extraData.isWishlisted || false;
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';
        const stats = extraData.stats || { averageRating: 0, reviewCount: 0 };
        const starsHtml = extraData.starsHtml || '';

        return \`
            <div class="product-card">
                <button class="wishlist-btn \${activeClass}" data-id="\${product.id}" title="Toggle Wishlist" aria-label="Toggle Wishlist">
                    \${heartIcon}
                </button>
                <img src="\${product.imageUrl}" alt="\${escapeHTML(product.name)}" class="product-image" data-id="\${product.id}" loading="lazy" >
                <div class="product-info">
                    <h3>\${escapeHTML(product.name)}</h3>

                    <p>\${escapeHTML(product.description || '')}</p>
                    <div class="product-rating" data-id="\${product.id}" style="cursor: pointer;">
                        \${starsHtml} <span class="rating-text">\${stats.reviewCount > 0 ? \\\`(\\\${stats.reviewCount})\\\` : 'No reviews'}</span>
                    </div>

                    <div class="price-action-wrapper">
                        <span class="price">$\${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn cta-button" data-id="\${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        \`;
    }

    return '';
}
