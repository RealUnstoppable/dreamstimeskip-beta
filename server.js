import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("CRITICAL: STRIPE_SECRET_KEY is not set. Exiting securely.");
  process.exit(1);
}
const stripe = new Stripe(stripeSecretKey); // 🔴 replace

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