import express from "express";
import cors from "cors";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { handleTelemetryIngest, handleConsentRecord, handleAdminPerformanceMetrics } from "./dist/lib/telemetry-server.js";
import { getExportableAudienceCohort } from "./dist/lib/google-ads-sync.js";
import { createMedixlyCheckoutSession, handleMedixlyWebhookEvent } from "./backend/medixly-stripe-handler.js";
import { adminDb, FieldValue } from "./dist/lib/firebase-admin.js";
import { STRIPE_PRODUCTS, getStripePriceId } from "./js/stripe-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Cross-Origin Isolation headers for SharedArrayBuffer and AudioWorklet support
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
});

app.use(express.json({
  limit: "64kb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Explicit ads.txt route for Google AdSense crawler verification
app.get('/ads.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'ads.txt'));
});

// Explicit sitemap.xml route for search engine & AdSense indexing
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Explicit robots.txt route
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// First-Party Telemetry & Consent Pipeline Endpoints
app.post("/api/v1/telemetry", handleTelemetryIngest);
app.post("/api/v1/consent", handleConsentRecord);
app.get("/api/v1/admin/performance", handleAdminPerformanceMetrics);
app.get("/api/v1/audiences/:segment", async (req, res) => {
  try {
    const cohort = await getExportableAudienceCohort(req.params.segment);
    if (req.query.format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.send(cohort.csv);
    } else {
      res.json(cohort);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to parse cookies
function parseCookies(request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });
    return list;
}

// Middleware to serve HTML files and strip ads for premium users
app.use(async (req, res, next) => {
  let reqPath = req.path;
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/dts') reqPath = '/dts.html';
  if (reqPath === '/store') reqPath = '/store.html';

  // Medixly Membership & Pricing routes
  if (reqPath === '/medixly' || reqPath === '/medixly/') {
    if (req.query && (req.query.player === 'true' || req.query.stream === 'true')) {
      reqPath = '/medixly.html';
    } else {
      reqPath = '/medixly-pricing.html';
    }
  }
  if (reqPath === '/medixly/pricing' || reqPath === '/medixly-pricing' || reqPath === '/pricing') {
    reqPath = '/medixly-pricing.html';
  }
  if (reqPath === '/medixly/player' || reqPath === '/medixly/stream' || reqPath === '/medixly/app') {
    reqPath = '/medixly.html';
  }
  if (reqPath === '/medixly/hits') {
    reqPath = '/medixly-hits.html';
  }
  if (reqPath === '/medixly/artists') {
    reqPath = '/medixly-artists.html';
  }

  // Internal Ad Screen-Recording Preview Scene routes
  if (reqPath === '/ad-preview' || reqPath === '/ad-preview/') {
    reqPath = '/ad-preview.html';
  }
  if (reqPath === '/ad-preview-1' || reqPath === '/ad-preview-1/') {
    reqPath = '/ad-preview-1.html';
  }
  if (reqPath === '/ad-preview-2' || reqPath === '/ad-preview-2/') {
    reqPath = '/ad-preview-2.html';
  }
  if (reqPath === '/ad-preview-3' || reqPath === '/ad-preview-3/') {
    reqPath = '/ad-preview-3.html';
  }
  if (reqPath === '/ad-preview-4' || reqPath === '/ad-preview-4/') {
    reqPath = '/ad-preview-4.html';
  }
  if (reqPath === '/ad-preview-5' || reqPath === '/ad-preview-5/') {
    reqPath = '/ad-preview-5.html';
  }
  if (reqPath === '/ad-preview-6' || reqPath === '/ad-preview-6/') {
    reqPath = '/ad-preview-6.html';
  }
  if (reqPath === '/ad-preview-7' || reqPath === '/ad-preview-7/') {
    reqPath = '/ad-preview-7.html';
  }
  if (reqPath === '/ad-preview-8' || reqPath === '/ad-preview-8/') {
    reqPath = '/ad-preview-8.html';
  }
  if (reqPath === '/ad-preview-9' || reqPath === '/ad-preview-9/') {
    reqPath = '/ad-preview-9.html';
  }
  if (reqPath === '/ad-preview-showcase' || reqPath === '/ad-preview-showcase/' || reqPath === '/ad-preview-10' || reqPath === '/ad-preview-10/') {
    reqPath = '/ad-preview.html';
  }
  
  if (reqPath.endsWith('.html')) {
    try {
      // Security: prevent directory traversal
      const normalizedPath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(__dirname, normalizedPath);
      let html = await fs.readFile(filePath, 'utf8');
      
      const cookies = parseCookies(req);
      const isPremium = cookies['tier'] === 'premium';
      
      if (isPremium) {
        // Strip Google AdSense script tags
        html = html.replace(/<script[^>]*adsbygoogle[^>]*><\/script>/gi, '');
        // Strip custom ad slot blocks defined by comments
        html = html.replace(/<!-- AD_SLOT_START -->[\s\S]*?<!-- AD_SLOT_END -->/g, '');
        // Strip ad containers class (safe greedy regex matching)
        html = html.replace(/<div[^>]*class="[^"]*ad-container[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
      }
      
      res.send(html);
      return;
    } catch (err) {
      // If file not found or other error, fallback to express.static
      return next();
    }
  }
  next();
});

// Serve static files from the root directory to fix absolute paths in HTML files
app.use(express.static(__dirname));

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("WARNING: STRIPE_SECRET_KEY environment variable is missing.");
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(stripeSecretKey);

app.post(["/create-checkout-session", "/api/create-checkout-session"], async (req, res) => {
  const { plan, project, billingCycle, mode, successUrl, cancelUrl, email, uid, cart, orderDetails } = req.body || {};
  const origin = req.headers.origin || (req.headers.host ? `${req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}` : 'https://realunstoppable.store');
  const isLive = Boolean(stripeSecretKey && stripeSecretKey.startsWith("sk_live_"));

  // Check if this is a shop cart order
  const isShopOrder = Boolean(cart && typeof cart === "object" && Object.keys(cart).length > 0);

  // 1. Shop Cart Checkout (Merchandise / Physical Gear)
  if (isShopOrder) {
    try {
      const lineItems = [];
      for (const [productId, quantity] of Object.entries(cart)) {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        const mappedPriceId = getStripePriceId(productId, isLive);

        if (mappedPriceId) {
          lineItems.push({
            price: mappedPriceId,
            quantity: qty,
          });
        } else {
          // Fallback to price_data
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: productId,
                images: ["https://realunstoppable.store/images/UnstoppableHoodieModel300x300.png"],
              },
              unit_amount: 2000,
            },
            quantity: qty,
          });
        }
      }

      // Frictionless: Apple Pay, Google Pay, Link, and Cards enabled automatically
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: (email || orderDetails?.email) && (email || orderDetails?.email).includes("@") ? (email || orderDetails?.email) : undefined,
        line_items: lineItems,
        allow_promotion_codes: true,
        success_url: successUrl || `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${origin}/cart.html?canceled=true`,
        metadata: {
          uid: uid || "guest",
          orderType: "shop",
          project: project || "unstoppable",
          cart: JSON.stringify(cart),
          orderDetails: JSON.stringify(orderDetails || {}),
        },
      });

      return res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error("Shop checkout session error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. Medixly Membership Dynamic Promotion Checkout
  if (project === "medixly" || (plan && (plan.toLowerCase() === "premium" || plan.toLowerCase() === "ultra") && project !== "dreamstimeskip")) {
    try {
      const result = await createMedixlyCheckoutSession({
        plan,
        billingCycle,
        mode,
        uid,
        email,
        successUrl,
        cancelUrl,
        origin,
        stripeClient: stripe
      });
      return res.json({ url: result.url, sessionId: result.sessionId, lockedPrice: result.lockedPrice });
    } catch (err) {
      console.error("Medixly checkout error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. Dreams TimeSkip Memberships (Premium / Ultimate)
  if (project === "dreamstimeskip") {
    try {
      const normPlan = (plan || "premium").toLowerCase();
      const priceId = normPlan === "ultimate"
        ? getStripePriceId('dts-membership-ultimate', isLive)
        : getStripePriceId('dts-membership-premium', isLive);

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email && email.includes("@") ? email : undefined,
        client_reference_id: uid && uid !== "unknown" && uid !== "guest" ? uid : undefined,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: successUrl || `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}&plan=${normPlan}`,
        cancel_url: cancelUrl || `${origin}/cart.html?canceled=true`,
        metadata: {
          uid: uid || "unknown",
          planName: normPlan === "ultimate" ? "Ultimate" : "Premium",
          project: "dreamstimeskip",
        },
      });

      return res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error("DTS checkout session error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // 4. Default / Generic Subscriptions
  try {
    const priceId =
      plan === "Business Pro"
        ? (isLive ? "price_1UJifEBmfNp1AIykML2Y8VLE" : "price_1THHbVBp2C5GdKaKvCVoMf1X")
        : (isLive ? "price_1UJifGBmfNp1AIykFdVlMS1x" : "price_1THHYPBp2C5GdKaKxNpqndNE");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email && email.includes("@") ? email : undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl || `${origin}?success=true`,
      cancel_url: cancelUrl || `${origin}?canceled=true`,
      metadata: {
        uid: uid || "unknown",
        planName: plan || "Pro",
        project: project || "ezmanage",
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comprehensive Stripe Webhook Handler (Shop orders, Medixly, DTS Memberships)
app.post(["/stripe-webhook", "/api/stripe-webhook"], async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret && sig && req.rawBody) {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const eventType = event.type;
    const session = event.data?.object;
    const metadata = session?.metadata || {};

    // 1. If Medixly event, let Medixly handler process it
    if (metadata.project === "medixly") {
      const result = await handleMedixlyWebhookEvent({
        event,
        adminDb: typeof adminDb !== "undefined" ? adminDb : null,
        FieldValue: typeof FieldValue !== "undefined" ? FieldValue : null,
        stripeClient: stripe
      });
      return res.json({ received: true, ...result });
    }

    // 2. Shop Order Processing
    if (eventType === "checkout.session.completed" && (metadata.orderType === "shop" || metadata.cart)) {
      let cart = {};
      let orderDetails = {};
      if (metadata.cart) {
        try { cart = JSON.parse(metadata.cart); } catch (_) {}
      }
      if (metadata.orderDetails) {
        try { orderDetails = JSON.parse(metadata.orderDetails); } catch (_) {}
      }
      const orderId = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const total = session.amount_total ? session.amount_total / 100 : (orderDetails.total || 0);

      const fullOrder = {
        orderId,
        userId: metadata.uid || "guest",
        userEmail: session.customer_details?.email || session.customer_email || orderDetails.email || "",
        items: cart,
        status: "Paid",
        total: total,
        shippingInfo: orderDetails.shippingInfo || session.shipping_details || {},
        paymentStatus: "Paid via Stripe Checkout (" + (session.payment_intent || session.id) + ")",
        stripeSessionId: session.id,
        appliedPromo: orderDetails.appliedPromo || "",
        earnedPoints: Math.floor(total * 10),
        sourceSite: metadata.project || "unstoppable",
      };

      if (typeof adminDb !== "undefined" && adminDb) {
        const orderDocRef = adminDb.collection("orders").doc(`${metadata.uid || "guest"}_${Date.now()}`);
        await orderDocRef.set({
          ...fullOrder,
          orderDate: FieldValue ? FieldValue.serverTimestamp() : new Date(),
        });

        // Update product stock / ordered counts
        for (const [productId, quantity] of Object.entries(cart)) {
          const qty = parseInt(quantity, 10) || 1;
          const statRef = adminDb.collection("product_stats").doc(productId);
          await statRef.set({
            orderedCount: FieldValue ? FieldValue.increment(qty) : qty,
            lastUpdated: FieldValue ? FieldValue.serverTimestamp() : new Date(),
          }, { merge: true });
        }
      }

      console.log(`✓ Webhook recorded shop order ${orderId} ($${total.toFixed(2)})`);
      return res.json({ received: true, orderId });
    }

    // 3. Dreams TimeSkip Membership Processing
    if (eventType === "checkout.session.completed" && metadata.project === "dreamstimeskip") {
      const uid = metadata.uid;
      const planName = metadata.planName || "Premium";
      if (typeof adminDb !== "undefined" && adminDb && uid && uid !== "unknown" && uid !== "guest") {
        await adminDb.collection("users").doc(uid).set({
          membershipLevel: planName,
          plan: planName,
          subscription: {
            status: "active",
            customerId: session.customer || null,
            subscriptionId: session.subscription || null,
          }
        }, { merge: true });
      }
      return res.json({ received: true, project: "dreamstimeskip" });
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});