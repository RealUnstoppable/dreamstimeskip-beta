const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const stripe = Stripe("YOUR_STRIPE_SECRET_KEY");
const endpointSecret = "YOUR_WEBHOOK_SECRET";

// 🔹 Create Checkout Session
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  const { uid, plan } = req.body;

  const priceId =
    plan === "Business Pro"
      ? "price_business_id"
      : "price_individual_id";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: req.body.email,
      line_items: [{ price: priceId, quantity: 1 }],

      subscription_data: {
        trial_period_days: 7, // ✅ FREE TRIAL
      },

      success_url: "https://yourdomain.com?success=true",
      cancel_url: "https://yourdomain.com?canceled=true",

      metadata: { uid },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔐 STRIPE WEBHOOK (SECURE)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata.uid;

    await admin.firestore().collection("users").doc(uid).set({
      subscription: {
        status: "active",
        customerId: session.customer,
      },
    }, { merge: true });
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;

    const snapshot = await admin.firestore()
      .collection("users")
      .where("subscription.customerId", "==", sub.customer)
      .get();

    snapshot.forEach(doc => {
      doc.ref.update({
        "subscription.status": "canceled"
      });
    });
  }

  res.json({ received: true });
});


// 🔻 Cancel Subscription
exports.cancelSubscription = functions.https.onRequest(async (req, res) => {
  const { customerId } = req.body;

  try {
    const subs = await stripe.subscriptions.list({ customer: customerId });

    for (let sub of subs.data) {
      await stripe.subscriptions.del(sub.id);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});