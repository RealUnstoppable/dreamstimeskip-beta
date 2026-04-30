export function calculateCartSummary(cart, products) {
    let itemCount = 0;
    let totalPrice = 0;

    for (const [productId, quantity] of Object.entries(cart)) {
        const product = products.find(p => p.id === productId);
        if (!product) continue; // Ignore items not found in product catalog

        const validQuantity = Math.max(0, parseInt(quantity) || 0);
        itemCount += validQuantity;
        totalPrice += product.price * validQuantity;
    }

    return { itemCount, totalPrice };
}
