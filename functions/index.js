const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Fallback "placeholder" string to stop Firebase Analyzer from
// crashing during deployment
const stripeKey = process.env.STRIPE_SECRET || "sk_test_placeholder";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";
const stripe = require("stripe")(stripeKey);

// 🔹 Create Checkout Session
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split("Bearer ")[1];
    let uid;
    let email;

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      uid = decodedToken.uid;
      email = decodedToken.email;
    } catch (err) {
      console.error("Auth Error:", err);
      return res.status(401).send("Unauthorized");
    }

    const {plan, successUrl, cancelUrl} = req.body;

    // 🔴 Actual Price IDs from your Stripe Dashboard
    const priceId = plan === "Business Pro" ?
      "price_1THHbVBp2C5GdKaKvCVoMf1X" : "price_1THHYPBp2C5GdKaKxNpqndNE";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: customer_email,
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
      console.error("Checkout Error:", err);
      res.status(500).json({error: err.message});
    }
  });
});

// 🔐 STRIPE WEBHOOK (SECURE)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata.uid;
    const planName = session.metadata.planName || "Pro";

    if (uid && uid !== "unknown") {
      try {
        await admin.firestore().collection("users").doc(uid).set({
          plan: planName, // Updates the frontend to unlock pro features
          subscription: {
            status: "active",
            customerId: session.customer,
          },
        }, {merge: true});
      } catch (err) {
        console.error("Firestore Error in checkout.session.completed:", err);
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
    } catch (err) {
      console.error("Firestore Error in customer.subscription.deleted:", err);
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

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      const userDoc = await admin.firestore().collection("users")
          .doc(uid).get();
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
      console.error("Cancel Error:", err);
      res.status(500).json({error: err.message});
    }
  });
});
