const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ Sentinel: NEVER hardcode secrets. Always use environment variables for sensitive data.
// Initialize Stripe securely using process.env.STRIPE_SECRET_KEY
// Example execution: STRIPE_SECRET_KEY=sk_live_... node server.js
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || ""); // 🔴 Ensure STRIPE_SECRET_KEY is set in your environment

app.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  try {
    const priceId =
      plan === "Business Pro"
        ? ""   // 🔴 from Stripe dashboard
        : "price_individual_id";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000?success=true",
      cancel_url: "http://localhost:3000?canceled=true",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);