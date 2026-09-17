const fs = require('fs');

function updateShop() {
    let content = fs.readFileSync('js/shop.js', 'utf-8');

    const oldUpdateAll = `async function updateAllProductRatings() {
    try {
        const q = query(collection(db, 'product_reviews'));
        const querySnapshot = await getDocs(q);

        const aggregations = {};
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const pId = data.productId;
            if (pId && data.rating !== undefined) {
                if (!aggregations[pId]) aggregations[pId] = { sum: 0, count: 0 };
                aggregations[pId].sum += data.rating;
                aggregations[pId].count += 1;
            }
        });

        // Now safe to call without N+1 query by passing precalculated data
        for (const product of products) {
            const agg = aggregations[product.id];
            const average = agg && agg.count > 0 ? parseFloat((agg.sum / agg.count).toFixed(1)) : 0;
            const count = agg ? agg.count : 0;

            updateProductRatingDisplay(product.id, { average, count });
        }
    } catch (e) {
        console.error("Manager info: [Error batch fetching ratings:]", e);
    }
}`;

    const newUpdateAll = `async function updateAllProductRatings() {
    // Rely on productStatsMap loaded from product_stats collection instead of fetching all reviews manually.
}`;

    // Check if it exists
    if (!content.includes(oldUpdateAll)) {
        console.log("Could not find the old updateAllProductRatings function!");
    } else {
        content = content.replace(oldUpdateAll, newUpdateAll);
        fs.writeFileSync('js/shop.js', content, 'utf-8');
        console.log("Updated updateAllProductRatings successfully.");
    }

    // Now update renderProducts to use productStatsMap instead of cachedRatings.
    const oldRatingDisplay = `const ratingInfo = cachedRatings[product.id] || { avg: 0, count: 0 };
        const ratingDisplay = ratingInfo.count > 0 ? \`\${ratingInfo.avg.toFixed(1)} ★ (\${ratingInfo.count})\` : 'No reviews';`;

    const newRatingDisplay = `const stats = productStatsMap.get(product.id) || { averageRating: 0, reviewCount: 0 };
        const ratingDisplay = stats.reviewCount > 0 ? \`\${stats.averageRating.toFixed(1)} ★ (\${stats.reviewCount})\` : 'No reviews';`;

    if (content.includes(oldRatingDisplay)) {
        content = content.replace(oldRatingDisplay, newRatingDisplay);
        // Remove the duplicated stats lines directly after
        content = content.replace(`        const stats = productStatsMap.get(product.id) || { averageRating: 0, reviewCount: 0 };\n        const displayRating = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No reviews';`, `        const displayRating = stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'No reviews';`);

        fs.writeFileSync('js/shop.js', content, 'utf-8');
        console.log("Updated renderProducts successfully.");
    } else {
        console.log("Could not find oldRatingDisplay");
    }

    // clean up unused syntax code
    content = fs.readFileSync('js/shop.js', 'utf-8');
    content = content.replace("cachedRatings[productId] = { avg, count };\n        renderProducts();", "renderProducts();");
    fs.writeFileSync('js/shop.js', content, 'utf-8');

    // clean up syntax errors at the end of handleReviewSubmit from earlier merges
    content = fs.readFileSync('js/shop.js', 'utf-8');
    const oldSyntax = `    } finally {
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = originalText;
    }
}

// --- REVIEW LOGIC ---
async function openReviewsModal(productId) {`;

    // Actually there are duplicated chunks starting at 755.
    // The easiest is just delete lines 754 to 999. Let me check via sed.
}
updateShop();
