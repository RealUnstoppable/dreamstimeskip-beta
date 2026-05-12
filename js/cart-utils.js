let lastProducts = null;
let lastProductMap = null;

export function calculateCartSummary(cart, products) {
    let itemCount = 0;
    let totalPrice = 0;

    // ⚡ Bolt: Cache the product Map to avoid redundant O(N) array transformations on every call.
    // We memoize the Map based on the products array reference.
    if (products !== lastProducts) {
        lastProductMap = new Map(products.map(p => [p.id, p]));
        lastProducts = products;
    }
    const productMap = lastProductMap;

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
