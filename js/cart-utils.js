export function calculateCartSummary(cart, products) {
    let itemCount = 0;
    let totalPrice = 0;

    // ⚡ Bolt: Caching array to a Map inside the function helps slightly for very large carts,
    // but the best architecture is using a globally pre-computed Map (like in shop.js).
    // Kept scoped here to maintain exact test compatibility for this isolated utility.
    const productMap = new Map(products.map(p => [p.id, p]));

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
