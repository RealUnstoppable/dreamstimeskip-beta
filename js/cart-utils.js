import { escapeHTML } from './utils.js';
import { productMap } from './products.js';

export function calculateCartSummary(cart, productsList) {
    let itemCount = 0;
    let totalPrice = 0;

    for (const [productId, quantity] of Object.entries(cart)) {
        // ⚡ Bolt: O(1) lookup to prevent O(N) array search on each loop iteration
        const product = productMap.get(productId);
        if (!product) continue; // Ignore items not found in product catalog

        const validQuantity = Math.max(0, parseInt(quantity) || 0);
        itemCount += validQuantity;
        totalPrice += product.price * validQuantity;
    }

    return { itemCount, totalPrice };
}

export function generateCartItemsHtml(cart, productMap, renderType = 'shop') {
    if (Object.keys(cart).length === 0) {
        return renderType === 'shop'
            ? '<p class="empty-cart-message">Your cart is empty.</p>'
            : '<h1>Your cart is empty.</h1><a href="/shop.html" class="cta-button">Continue Shopping</a>';
    }

    return Object.entries(cart).map(([productId, quantity]) => {
        const product = productMap.get(productId);
        if (!product) return '';

        if (renderType === 'checkout') {
            return `<div class="summary-item"><span>${quantity}x ${escapeHTML(product.name)}</span> <span>$${(product.price * quantity).toFixed(2)}</span></div>`;
        }

        return `
            <div class="cart-item">
                <img src="${product.imageUrl}" alt="${escapeHTML(product.name)}" class="cart-item-img" loading="lazy">
                <div class="cart-item-info">
                    <h4>${escapeHTML(product.name)}</h4>
                    <p>${product.price === 0 ? '<span class="free-badge">FREE (Beta)</span>' : '$' + product.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <input type="number" value="${quantity}" min="1" data-id="${productId}" class="item-quantity-input" title="Quantity for ${escapeHTML(product.name)}" aria-label="Quantity for ${escapeHTML(product.name)}">
                    <button class="remove-item-btn" data-id="${productId}" title="Remove item" aria-label="Remove item">&#128465;</button>
                </div>
            </div>
        `;
    }).join('');
}
