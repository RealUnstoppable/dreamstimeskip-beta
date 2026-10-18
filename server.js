import express from "express";
import cors from "cors";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { handleTelemetryIngest, handleConsentRecord, handleAdminPerformanceMetrics } from "./dist/lib/telemetry-server.js";
import { getExportableAudienceCohort } from "./dist/lib/google-ads-sync.js";

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

app.use(express.json({ limit: "64kb" }));

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

  try {
    reqPath = decodeURIComponent(reqPath);
  } catch (err) {
    return res.status(400).send('Bad Request');
  }

  if (reqPath.indexOf('\0') !== -1) {
    return res.status(400).send('Bad Request');
  }

  if (reqPath === '/') reqPath = '/index.html';
  
  if (reqPath.endsWith('.html')) {
    try {
      // Security: prevent directory traversal
      const filePath = path.resolve(__dirname, '.' + reqPath);

      if (!filePath.startsWith(__dirname + path.sep) && filePath !== __dirname) {
        return res.status(403).send('Forbidden');
      }

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

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});