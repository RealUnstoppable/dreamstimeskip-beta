const functions = require("firebase-functions");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Fallback "placeholder" string to stop Firebase Analyzer from
// crashing during deployment
const stripeKey = process.env.STRIPE_SECRET || "sk_test_placeholder";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";
const stripe = require("stripe")(stripeKey);

// 🛡️ Shared Utils
function getUserDocRef(uid) {
  return admin.firestore().collection("users").doc(uid);
}

// 🛡️ Shared Auth Utility
async function authenticateRequest(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Auth Error - Manager info: [" + err.message + "]");
    res.status(401).send("Unauthorized");
    return null;
  }
}

// 🔹 Create Checkout Session
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res);
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
      console.error("Checkout Error - Manager info:", err.message);
      res.status(500).json({error: `Checkout Error. Manager info: [${err.message}]`});
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
        type: "ticket_reply"
      });
    } catch (error) {
      console.error("Error creating notification - Manager info: [" + error.message + "]");
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
        const snapshot = await reviewsRef.where("productId", "==", productId).get();
        let totalRating = 0;
        let count = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.rating) {
            totalRating += data.rating;
            count++;
          }
        });

        const averageRating = count > 0 ? totalRating / count : 0;

        await db.collection("product_stats").doc(productId).set({
          averageRating: averageRating,
          reviewCount: count,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return null;
      } catch (error) {
        console.error("Error aggregating ratings - Manager info:", error.message);
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
    console.error("Webhook Error - Manager info: [" + err.message + "]");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata.uid;
    const planName = session.metadata.planName || "Pro";

    if (uid && uid !== "unknown") {
      await getUserDocRef(uid).set({
        plan: planName, // Updates the frontend to unlock pro features
        subscription: {
          status: "active",
          customerId: session.customer,
        },
      }, {merge: true});
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
      console.error("Error processing customer.subscription.deleted - Manager info:", error.message);
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

    const decodedToken = await authenticateRequest(req, res);
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
      console.error("Cancel Error - Manager info: [" + err.message + "]");
      res.status(500).json({error: err.message});
    }
  });
});
// ⭐️ Update Product Stats on New Review
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

exports.onReviewCreated = onDocumentCreated("product_reviews/{reviewId}", async (event) => {
    const snap = event.data;
    const context = event;
    const newReview = snap.data();
    const productId = newReview.productId;
    const rating = newReview.rating;

    // Validate rating
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      console.error("Invalid rating:", rating);
      return null;
    }

    const productStatsRef = admin.firestore().collection("product_stats").doc(productId);

    return admin.firestore().runTransaction(async (transaction) => {
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
        averageRating: newAverageRating
      }, { merge: true });
    });
  });
