export function calculateCartSummary(cart, products) {
    let itemCount = 0;
    let totalPrice = 0;

    // ⚡ Bolt: Convert array to a hash map once to prevent O(N) lookup per cart item
    const productMap = products.reduce((map, p) => {
        map[p.id] = p;
        return map;
    }, {});

    for (const [productId, quantity] of Object.entries(cart)) {
        const product = productMap[productId];
        if (!product) continue; // Ignore items not found in product catalog

        const validQuantity = Math.max(0, parseInt(quantity) || 0);
        itemCount += validQuantity;
        totalPrice += product.price * validQuantity;
    }

    return { itemCount, totalPrice };
}
