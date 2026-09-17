const fs = require('fs');
let content = fs.readFileSync('functions/index.js', 'utf8');

content = content.replace(/\/\/ 🛍️ Award Points on Order Creation[\s\S]*?\/\/ 🎁 Loyalty Points on Order Creation[\s\S]*?exports\.onOrderCreated = onDocumentCreated\("orders\/\{orderId\}", async \(event\) => \{[\s\S]*?\}\);\n\n?\s*\}\);\n\s*\} catch \(error\) \{\n\s*console\.error\("Error updating loyalty points - Manager info: \[" \+ error\.message \+ "\]"\);\n\s*return null;\n\s*\}\n\}\);\n/g, `// 🛍️ Award Points and 🎁 Loyalty Points on Order Creation
exports.onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  if (!snap) return null;
  const newOrder = snap.data();
  const userId = newOrder.userId;
  const subtotal = newOrder.subtotal || 0;
  const items = newOrder.items;

  if (!userId) return null;

  const db = admin.firestore();

  // 10 points per $1 spent
  const rewardPointsToAward = subtotal > 0 ? Math.floor(subtotal * 10) : 0;

  // 10 loyalty points per item quantity
  let loyaltyPointsEarned = 0;
  if (items) {
    for (const item of Object.values(items)) {
      const quantity = typeof item === 'object' && item.quantity !== undefined ? item.quantity : item;
      loyaltyPointsEarned += (parseInt(quantity) || 0) * 10;
    }
  }

  if (rewardPointsToAward <= 0 && loyaltyPointsEarned <= 0) return null;

  const userRef = db.collection("users").doc(userId);

  try {
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      let currentRewardPoints = 0;
      let currentLoyaltyPoints = 0;

      if (userDoc.exists) {
        const data = userDoc.data();
        if (typeof data.pointsBalance === 'number') currentRewardPoints = data.pointsBalance;
        if (typeof data.loyaltyPoints === 'number') currentLoyaltyPoints = data.loyaltyPoints;
      }

      const updateData = {};

      if (rewardPointsToAward > 0) {
        updateData.pointsBalance = currentRewardPoints + rewardPointsToAward;
        const rewardTxRef = db.collection("reward_transactions").doc();
        transaction.set(rewardTxRef, {
          userId: userId,
          amount: rewardPointsToAward,
          reason: "Purchase Reward",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      if (loyaltyPointsEarned > 0) {
        updateData.loyaltyPoints = currentLoyaltyPoints + loyaltyPointsEarned;
        const loyaltyTxRef = db.collection("loyalty_transactions").doc();
        transaction.set(loyaltyTxRef, {
          userId: userId,
          points: loyaltyPointsEarned,
          orderId: event.params.orderId,
          description: \`Earned points from Order #\${event.params.orderId.split('_')[1] || event.params.orderId}\`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (Object.keys(updateData).length > 0) {
          transaction.set(userRef, updateData, { merge: true });
      }
    });
  } catch (error) {
    console.error("Manager info: Error updating order points: [" + error.message + "]");
    return null;
  }
});
`);

// First let's check if the regex matches to avoid writing empty replacements.
console.log(content.match(/\/\/ 🛍️ Award Points on Order Creation[\s\S]*?\/\/ 🎁 Loyalty Points on Order Creation[\s\S]*?exports\.onOrderCreated = onDocumentCreated\("orders\/\{orderId\}", async \(event\) => \{[\s\S]*?\}\);\n/));
