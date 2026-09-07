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
