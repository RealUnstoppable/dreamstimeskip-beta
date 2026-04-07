const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// FIX: We provide a fallback "placeholder" string. 
// This stops the Firebase Analyzer from crashing during deployment if it can't read the .env file yet.
const stripeKey = process.env.STRIPE_SECRET || "sk_test_placeholder";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";
const stripe = require("stripe")(stripeKey);

// 🔹 Create Checkout Session
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { uid, email, plan } = req.body;

    // 🔴 Replace these with the actual Price IDs from your Stripe Dashboard
    const priceId = plan === "Business Pro" ? "price_business_id" : "price_individual_id";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: { trial_period_days: 7 }, // ✅ FREE TRIAL
        
        // 🔴 Replace these with your actual deployed app URL
        success_url: "https://dreamstimeskip-beta.pages.dev/tracker.html?success=true", 
        cancel_url: "https://dreamstimeskip-beta.pages.dev/tracker.html?canceled=true",
        metadata: { uid: uid || "unknown" }
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Checkout Error:", err);
      res.status(500).json({ error: err.message });
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

    if (uid && uid !== "unknown") {
        await admin.firestore().collection("users").doc(uid).set({
        subscription: {
            status: "active",
            customerId: session.customer
        }
        }, { merge: true });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;

    const snapshot = await admin.firestore()
      .collection("users")
      .where("subscription.customerId", "==", sub.customer)
      .get();

    snapshot.forEach(doc => {
      doc.ref.update({ "subscription.status": "canceled" });
    });
  }

  res.json({ received: true });
});

// 🔻 Cancel Subscription Manually 
exports.cancelSubscription = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { customerId } = req.body;

    try {
      const subs = await stripe.subscriptions.list({ customer: customerId });
      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id); 
      }
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Cancel Error:", err);
      res.status(500).json({ error: err.message });
    }
  });
});