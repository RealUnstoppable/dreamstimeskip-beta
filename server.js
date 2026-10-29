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
  const { plan, project, billingCycle, mode, successUrl, cancelUrl, email, uid } = req.body || {};

  // Medixly Membership Dynamic Promotion Checkout
  if (project === "medixly" || (plan && (plan.toLowerCase() === "premium" || plan.toLowerCase() === "ultra") && project !== "dreamstimeskip")) {
    try {
      const origin = req.headers.origin || (req.headers.host ? `${req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}` : 'https://realunstoppable.store');
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

  try {
    const priceId =
      plan === "Business Pro"
        ? ""   // 🔴 from Stripe dashboard
        : "price_individual_id";

    const origin = req.headers.origin || (req.headers.host ? `${req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}` : 'https://realunstoppable.store');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure Stripe Webhook Handler for Medixly Memberships
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
    const result = await handleMedixlyWebhookEvent({
      event,
      adminDb: typeof adminDb !== "undefined" ? adminDb : null,
      FieldValue: typeof FieldValue !== "undefined" ? FieldValue : null,
      stripeClient: stripe
    });
    return res.json({ received: true, ...result });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});