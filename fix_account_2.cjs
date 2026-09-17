const fs = require('fs');
let content = fs.readFileSync('js/account.js', 'utf8');

// Also fix renderOrders
const renderOrdersStr = `async function renderOrders(user) {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("orderDate", "desc")
        );

        const querySnapshot = await getDocs(q);

        // Quick stringify to check for changes
        const snapshotData = JSON.stringify(querySnapshot.docs.map(d => ({id: d.id, ...d.data()})));
        if (currentOrdersCache === snapshotData) return; // Skip unnecessary re-renders
        currentOrdersCache = snapshotData;

        if (querySnapshot.empty) {
            ordersList.innerHTML = \`<p style="color: var(--text-secondary); text-align: center; padding: 20px;">You haven't placed any orders yet.</p>\`;
            return;
        }

        const fragment = document.createDocumentFragment();

        querySnapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const orderId = docSnap.id;

            let totalCost = 0;
            let itemsHtml = '';

            if (order.items) {
                for (const [productId, quantity] of Object.entries(order.items)) {
                    const product = productMap.get(productId) || { name: productId, price: 0 };
                    totalCost += product.price * quantity;
                    itemsHtml += \`<div style="font-size: 0.9rem; color: var(--text-secondary);">• \${quantity}x \${escapeHTML(product.name)}</div>\`;
                }
            }

            // Add tax logic matching checkout
            const subtotal = totalCost;
            const tax = subtotal * 0.07;
            const finalTotal = subtotal + tax;

            const orderCard = document.createElement('div');
            orderCard.style.cssText = "background: var(--bg-card); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
            orderCard.innerHTML = \`
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <div>
                        <strong>Order #\${escapeHTML(orderId.split('_')[1] || orderId)}</strong>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">\${formatDate(order.orderDate)}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; background: rgba(136, 211, 206, 0.2); color: var(--accent-green); font-weight: bold;">
                            \${escapeHTML(order.status || 'Processing')}
                        </span>
                        <div style="font-weight: bold; margin-top: 5px;">$\${finalTotal.toFixed(2)}</div>
                    </div>
                </div>
                <div>
                    <strong>Items:</strong>
                    <div style="margin-top: 5px; margin-bottom: 15px;">
                        \${itemsHtml || '<div style="font-size: 0.9rem; color: var(--text-secondary);">No items found.</div>'}
                    </div>
                    \${order.shippingInfo ? \`
                    <div style="font-size: 0.85rem; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 10px;">
                        <strong>Shipping To:</strong> \${escapeHTML(order.shippingInfo.name)} - \${escapeHTML(order.shippingInfo.city)}
                    </div>
                    \` : ''}
                </div>
            \`;
            fragment.appendChild(orderCard);
        });

        ordersList.innerHTML = ''; // Clear loading text
        ordersList.appendChild(fragment);

    } catch (error) {
        console.error("Manager info: Error rendering orders:", error);
        ordersList.innerHTML = \`<p style="color: var(--accent-red);">Failed to load order history. Please try again later.</p>\`;
    }
}`;

content = content.replace(/async function renderOrders\(user\) \{[\s\S]*?\}\n\}\n/m, renderOrdersStr + "\n");

fs.writeFileSync('js/account.js', content);
