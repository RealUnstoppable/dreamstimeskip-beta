const functions = require("firebase-functions");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {AggregateField} = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Fallback "placeholder" string to stop Firebase Analyzer from
// crashing during deployment
const stripeKey = process.env.STRIPE_SECRET || "sk_test_placeholder";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_placeholder";

async function authenticateRequest(req, res, adminInstance = admin) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await adminInstance.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).send("Unauthorized");
    return null;
  }
}
const stripe = require("stripe")(stripeKey);

// 🛡️ Shared Utils
function getUserDocRef(uid) {
  return admin.firestore().collection("users").doc(uid);
}


// 🔹 Create Checkout Session

// 🛡️ Admin Action Proxy
exports.adminAction = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;


    try {
      const adminDoc = await getUserDocRef(decodedToken.uid).get();
      if (!adminDoc.exists || !adminDoc.data().isAdmin) {
        return res.status(403).send("Forbidden: Admins only");
      }

      const { action, collection, docId, data } = req.body;
      if (!action || !collection || !docId) {
        return res.status(400).send("Missing required fields");
      }

      // Allowed collections for admin actions via this endpoint
      const allowedCollections = ["users", "bookings", "quotes", "feature_requests", "support_tickets", "promo_codes"];
      if (!allowedCollections.includes(collection)) {
        return res.status(400).send("Invalid collection");
      }

      const db = admin.firestore();
      const docRef = db.collection(collection).doc(docId);

      if (action === "update") {
        if (typeof data !== "object" || data === null) {
          return res.status(400).send("Invalid update data");
        }
        if (data.createdAt === 'SERVER_TIMESTAMP') {
          data.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        if (data.updatedAt === 'SERVER_TIMESTAMP') {
          data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        }
        await docRef.set(data, { merge: true });
      } else if (action === "delete") {
        await docRef.delete();
      } else {
        return res.status(400).send("Invalid action");
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Admin Action Error: [" + err.message + "]");
      res.status(500).json({ error: err.message });
    }
  });
});

exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const {plan, successUrl, cancelUrl} = req.body;

    // 🔴 Actual Price IDs from your Stripe Dashboard
    const priceId = plan === "Business Pro" ?
      "price_1THHbVBp2C5GdKaKvCVoMf1X" : "price_1THHYPBp2C5GdKaKxNpqndNE";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{price: priceId, quantity: 1}],
        subscription_data: {trial_period_days: 7}, // ✅ FREE TRIAL

        // Use URLs passed from frontend, fallback to hardcoded if missing
        success_url: successUrl ||
          "https://dreamstimeskip-beta.pages.dev/tracker?success=true",
        cancel_url: cancelUrl || "https://dreamstimeskip-beta.pages.dev/tracker?canceled=true",
        metadata: {
          uid: uid || "unknown",
          planName: plan || "Pro",
        },
      });

      res.status(200).json({url: session.url});
    } catch (err) {
      console.error("Checkout Error: [" + err.message + "]");
      res.status(500).json({error: `Checkout Error. [${err.message}]`});
    }
  });
});

// 🔔 Notification on Support Ticket Update
exports.onSupportTicketUpdate = onDocumentUpdated("support_tickets/{ticketId}", async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();

  // Check if adminReply was newly added or changed
  if (afterData.adminReply && afterData.adminReply !== beforeData.adminReply) {
    try {
      const db = admin.firestore();
      await db.collection("notifications").add({
        userId: afterData.userId,
        title: "Support Ticket Reply",
        message: `An admin has replied to your ticket: "${afterData.subject}"`,
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        link: "account.html#support",
        type: "ticket_reply",
      });
    } catch (error) {
      console.error("Error creating notification: [" + error.message + "]");
    }
  }
});

// 📊 Aggregate Ratings on Review Write
exports.onReviewWrite = functions.firestore
    .document("reviews/{reviewId}")
    .onWrite(async (change, context) => {
      const reviewData = change.after.exists ? change.after.data() : change.before.data();
      const productId = reviewData.productId;

      if (!productId) {
        return null;
      }

      const db = admin.firestore();
      const reviewsRef = db.collection("reviews");

      try {
        const snapshot = await reviewsRef.where("productId", "==", productId).aggregate({
          count: AggregateField.count(),
          averageRating: AggregateField.average("rating"),
        }).get();

        const count = snapshot.data().count;
        const averageRating = snapshot.data().averageRating || 0;

        await db.collection("product_stats").doc(productId).set({
          averageRating: averageRating,
          reviewCount: count,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});

        return null;
      } catch (error) {
        console.error("Manager info: Error aggregating ratings: [" + error.message + "]");
        return null;
      }
    });

// 🔐 STRIPE WEBHOOK (SECURE)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Manager info: Webhook Error: [" + err.message + "]");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata.uid;
    const planName = session.metadata.planName || "Pro";

    if (uid && uid !== "unknown") {
      try {
        await getUserDocRef(uid).set({
          plan: planName, // Updates the frontend to unlock pro features
          subscription: {
            status: "active",
            customerId: session.customer,
          },
        }, {merge: true});
      } catch (error) {
        console.error("Manager info: Error processing checkout.session.completed: [" + error.message + "]");
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;

    try {
      const snapshot = await admin.firestore()
          .collection("users")
          .where("subscription.customerId", "==", sub.customer)
          .get();

      const updates = snapshot.docs.map((doc) =>
        doc.ref.update({
          "plan": "free",
          "subscription.status": "canceled",
        }),
      );
      await Promise.all(updates);
    } catch (error) {
      console.error("Manager info: Error processing customer.subscription.deleted: [" + error.message + "]");
    }
  }

  res.json({received: true});
});

// 🔻 Cancel Subscription Manually
exports.cancelSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    try {
      const uid = decodedToken.uid;

      const userDoc = await getUserDocRef(uid).get();
      if (!userDoc.exists) {
        return res.status(404).send("User not found");
      }

      const userData = userDoc.data();
      const customerId = userData.subscription ?
          userData.subscription.customerId : null;

      if (!customerId) {
        return res.status(400).send("No active subscription found");
      }

      const subs = await stripe.subscriptions.list({customer: customerId});
      const cancelPromises = subs.data.map((sub) =>
        stripe.subscriptions.cancel(sub.id),
      );
      await Promise.all(cancelPromises);
      res.status(200).json({success: true});
    } catch (err) {
      console.error("Manager info: Cancel Error: [" + err.message + "]");
      res.status(500).json({error: err.message});
    }
  });
});
// ⭐️ Update Product Stats on New Review
const {onDocumentCreated} = require("firebase-functions/v2/firestore");


// ⭐️ Update Points on New Review
exports.onReviewCreated = onDocumentCreated("product_reviews/{reviewId}", async (event) => {
  const snap = event.data;
  const newReview = snap.data();
  const productId = newReview.productId;
  const rating = newReview.rating;
  const userId = newReview.userId;

  // Validate rating
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    console.error("Invalid rating:", rating);
    return null;
  }

  const db = admin.firestore();
  const productStatsRef = db.collection("product_stats").doc(productId);
  const userRef = db.collection("users").doc(userId);
  const transactionRef = db.collection("reward_transactions").doc();

  try {
    return await db.runTransaction(async (transaction) => {
      // 1. Update Product Stats
      const statsDoc = await transaction.get(productStatsRef);
      let reviewCount = 0;
      let averageRating = 0;

      if (statsDoc.exists) {
        const data = statsDoc.data();
        reviewCount = data.reviewCount || 0;
        averageRating = data.averageRating || 0;
      }

      const newReviewCount = reviewCount + 1;
      const newAverageRating = ((averageRating * reviewCount) + rating) / newReviewCount;

      transaction.set(productStatsRef, {
        reviewCount: newReviewCount,
        averageRating: newAverageRating,
      }, {merge: true});

      // 2. Award Points
      if (userId) {
        const pointsToAward = 50;
        const userDoc = await transaction.get(userRef);
        let currentPoints = 0;
        if (userDoc.exists && typeof userDoc.data().pointsBalance === 'number') {
          currentPoints = userDoc.data().pointsBalance;
        }

        transaction.set(userRef, {
          pointsBalance: currentPoints + pointsToAward
        }, { merge: true });

        transaction.set(transactionRef, {
          userId: userId,
          amount: pointsToAward,
          reason: "Product Review",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  } catch (error) {
    console.error("Error updating product stats or awarding points - Manager info: [" + error.message + "]");
    return null;
  }
});

// 🛍️ Award Points and 🎁 Loyalty Points on Order Creation
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
          description: `Earned points from Order #${event.params.orderId.split('_')[1] || event.params.orderId}`,
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

exports.processOrderTransaction = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const decodedToken = await authenticateRequest(req, res, admin);
      if (!decodedToken) return;

      const uid = decodedToken.uid;
      const { cart, orderDetails, pointsToRedeem = 0 } = req.body;

      if (!cart || !orderDetails) {
        return res.status(400).send("Missing cart or orderDetails");
      }

      const db = admin.firestore();

      await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await transaction.get(userRef);

        let currentPoints = 0;
        if (userDoc.exists) {
          currentPoints = userDoc.data().pointsBalance || 0;
        }

        if (pointsToRedeem > currentPoints) {
          throw new Error(`Not enough points. You have ${currentPoints} but tried to redeem ${pointsToRedeem}`);
        }

        const productIds = Object.keys(cart);
        const statRefs = productIds.map(id => db.collection('product_stats').doc(id));
        const statDocs = await Promise.all(statRefs.map(ref => transaction.get(ref)));

        const currentStats = {};
        statDocs.forEach((statDoc, index) => {
          const productId = productIds[index];
          currentStats[productId] = statDoc;
        });

        const newOrderRef = db.collection('orders').doc(`${uid}_${Date.now()}`);
        transaction.set(newOrderRef, orderDetails);

        for (const [productId, quantity] of Object.entries(cart)) {
          const productStatRef = db.collection('product_stats').doc(productId);
          const statDoc = currentStats[productId];

          if (!statDoc.exists) {
            transaction.set(productStatRef, { orderedCount: quantity });
          } else {
            const newCount = (statDoc.data().orderedCount || 0) + quantity;
            transaction.update(productStatRef, { orderedCount: newCount });
          }
        }

        const userCartRef = db.collection('carts').doc(uid);
        transaction.update(userCartRef, { items: {} });

        // Deduct points
        if (pointsToRedeem > 0) {
          transaction.update(userRef, { pointsBalance: currentPoints - pointsToRedeem });
          
          const rewardTxRef = db.collection('reward_transactions').doc();
          transaction.set(rewardTxRef, {
            userId: uid,
            points: -pointsToRedeem,
            reason: 'Redeemed points at checkout',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            orderId: newOrderRef.id
          });
        }
      });

      res.status(200).send({ success: true });
    } catch (error) {
      console.error("Error processing order transaction - Manager info: [" + error.message + "]");
      res.status(500).send("Internal Server Error");
    }
  });
});
