<<<<<<< HEAD
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
=======
import { escapeHTML, formatDate } from './utils.js';

export function createTransactionHtml(tx, isCompact) {
    const isPositive = (tx.points || 0) >= 0;
    const dateStr = formatDate(tx.createdAt);

    if (isCompact) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                    <strong style="display: block; font-size: 0.9rem; color: #fff;">${escapeHTML(tx.description || 'Points Activity')}</strong>
                    <small style="color: var(--text-secondary);">${dateStr}</small>
                </div>
                <div style="font-weight: 800; font-size: 0.95rem; color: ${isPositive ? 'var(--accent-green)' : 'var(--accent-red)'};">
                    ${isPositive ? '+' : ''}${tx.points} pts
                </div>
            </div>
        `;
    }

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(255,255,255,0.02);">
            <div>
                <div style="font-weight: 700; color: #fff; font-size: 1rem;">${escapeHTML(tx.description || 'Reward Earned')}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${dateStr}</div>
            </div>
            <div style="font-weight: 800; font-size: 1.1rem; color: ${isPositive ? 'var(--accent-green)' : 'var(--accent-red)'};">
                ${isPositive ? '+' : ''}${tx.points} pts
            </div>
        </div>
    `;
}

export function generateProductCardHtml(product, mode, quantity = 1, isWishlisted = false, stats = { averageRating: 0, reviewCount: 0 }, generateStarsHtml = null) {
    if (!product) return '';

    if (mode === 'shop') {
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';
        const displayRating = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No reviews';
        const starsHtml = stats.averageRating > 0 && generateStarsHtml ? generateStarsHtml(stats.averageRating) : '';

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" title="Toggle Wishlist" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" class="product-image" data-id="${product.id}" loading="lazy" >
                <div class="product-info">
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${escapeHTML(product.description)}</p>
                    <div class="product-stars-container">
                        ${stats.averageRating > 0 ? `<span class="star-rating">${starsHtml}</span>` : ''}
                        <span class="rating-count">(${displayRating}${stats.reviewCount > 0 ? ` - ${stats.reviewCount} reviews` : ''})</span>
                    </div>
                    <div class="product-footer" >
                        <div>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            <span class="product-price ${product.price === 0 ? 'free-badge' : ''}">${product.price === 0 ? 'FREE (Beta)' : '$' + product.price.toFixed(2)}</span>
                        </div>
                        <div class="action-buttons-container">
                            <button class="view-reviews-btn" data-id="${product.id}">Reviews</button>
                            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                    <button class="reviews-btn" data-id="${product.id}">Read Reviews</button>
                </div>
            </div>
        `;
    }

    if (mode === 'cart') {
        return `
            <div class="cart-item">
                <img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" class="cart-item-img" loading="lazy">
                <div class="cart-item-info">
                    <h4>${escapeHTML(product.name)}</h4>
                    <p>${product.price === 0 ? '<span class="free-badge">FREE (Beta)</span>' : '$' + product.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" value="${quantity}" min="1" data-id="${product.id}" class="item-quantity-input" title="Quantity for ${escapeHTML(product.name)}" aria-label="Quantity for ${escapeHTML(product.name)}">
                    <button class="remove-item-btn" data-id="${product.id}" title="Remove item" aria-label="Remove item">&#128465;</button>
                </div>
            </div>
        `;
    }

    if (mode === 'checkout-summary') {
        return `<div class="summary-item"><span>${quantity}x ${escapeHTML(product.name)}</span> <span>$${(product.price * quantity).toFixed(2)}</span></div>`;
    }

    if (mode === 'wishlist-public') {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${product.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" alt="${escapeHTML(product.name)}">
                    <div>
                        <strong style="color: #fff;">${escapeHTML(product.name)}</strong>
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">$${product.price.toFixed(2)}</div>
                    </div>
                </div>
                <button onclick="window.location.href='shop.html'" style="padding: 5px 10px; background: var(--accent-color); color: #fff; border: none; border-radius: 4px; cursor: pointer;">View Shop</button>
            </div>
        `;
    }

    if (mode === 'wishlist-private') {
        return `
            <div class="product-card" style="padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 12px; display: flex; flex-direction: column;">
                <img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #000;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 6px 0; font-size: 1rem; color: #fff;">${escapeHTML(product.name)}</h4>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 14px;">$${product.price.toFixed(2)}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary wishlist-add-cart-btn" data-id="${product.id}" style="flex: 1; padding: 8px 12px; font-size: 0.85rem;">Add to Cart</button>
                    <button class="btn wishlist-remove-btn" data-id="${product.id}" style="padding: 8px 12px; font-size: 0.85rem; background: transparent; border: 1px solid var(--accent-red); color: var(--accent-red);">Remove</button>
                </div>
            </div>
        `;
    }

    if (mode === 'order-history') {
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" style="width: 42px; height: 42px; border-radius: 6px; object-fit: cover; background: #000;">` : ''}
                    <div>
                        <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">${escapeHTML(product.name)}</div>
                        <small style="color: var(--text-secondary);">Qty: ${quantity} × $${(product.price || 0).toFixed(2)}</small>
                    </div>
                </div>
                <div style="font-weight: bold; color: #fff;">$${((product.price || 0) * quantity).toFixed(2)}</div>
            </div>
        `;
>>>>>>> origin/main
    }

    return '';
}
