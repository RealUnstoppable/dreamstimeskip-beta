const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions/v1");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {AggregateField} = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Fallback "placeholder" string to stop Firebase Analyzer from
// crashing during deployment
const stripeKey = process.env.STRIPE_SECRET;
if (!stripeKey) {
  console.warn("Manager info: STRIPE_SECRET environment variable is missing.");
}
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
    console.error("Manager info: Auth Error:", err);
    res.status(401).send("Unauthorized");
    return null;
  }
}
const stripe = stripeKey ? require("stripe")(stripeKey) : null;

// 🛡️ Shared Utils
function getUserDocRef(uid) {
  return admin.firestore().collection("users").doc(uid);
}


// 🔹 Create Checkout Session

// 🛡️ Admin Action Proxy
exports.adminAction = onRequest((req, res) => {
  cors(req, res, async () => {
    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;


    try {
      const adminDoc = await getUserDocRef(decodedToken.uid).get();
      if (!adminDoc.exists || !adminDoc.data().isAdmin) {
        return res.status(403).send("Forbidden: Admins only");
      }

      if (JSON.stringify(req.body).length > 15000) {
        return res.status(413).send("Payload too large");
      }

      const {action, collection, docId, data} = req.body;
      if (!action || !collection || !docId) {
        return res.status(400).send("Missing required fields");
      }

      if (typeof docId !== "string" || typeof collection !== "string") {
        return res.status(400).send("Invalid parameter types");
      }

      // Allowed collections for admin actions via this endpoint
      const allowedCollections = ["users", "bookings", "quotes", "feature_requests", "support_tickets", "promo_codes", "products"];
      if (!allowedCollections.includes(collection)) {
        return res.status(400).send("Invalid collection");
      }

      const db = admin.firestore();

      // Special action: Sync or list products with Stripe & Firestore
      if (action === "sync_stripe_products" || action === "list_stripe_products") {
        const defaultStoreProducts = [
          { id: "unstoppable-hoodie", name: "Unstoppable Hoodie", price: 59.99, originalPrice: 80.99, salePrice: 60.74, description: "Heavyweight 400 GSM black fleece hoodie with embroidered brand crest and double-lined hood.", imageUrl: "/images/UnstoppableHoodieModel300x300.png", category: "apparel", sourceSite: "unstoppable" },
          { id: "dts-model-tee", name: "DTS Model Tee", price: 24.99, originalPrice: 33.74, salePrice: 25.30, description: "100% combed ring-spun cotton tee with screenprinted Dreams TimeSkip character graphics.", imageUrl: "/images/dreams-lobby.jpg", category: "apparel", sourceSite: "dreamstimeskip" },
          { id: "harmonytunes-shirt", name: "HarmonyTunes Cap", price: 24.99, originalPrice: 33.74, salePrice: 25.30, description: "Low-profile 6-panel unstructured black cotton cap with embroidered soundwave emblem and adjustable brass strap.", imageUrl: "/images/medixly-logo.png", category: "accessories", sourceSite: "harmonytunes" },
          { id: "unstoppable-mousepad", name: "Unstoppable Mousepad", price: 19.99, originalPrice: 26.99, salePrice: 20.24, description: "Micro-weave gaming desk mat with precision anti-fray stitched borders and non-slip rubber backing.", imageUrl: "/images/MugAllBrands300x300.png", category: "accessories", sourceSite: "unstoppable" },
          { id: "dts-ceramic-mug", name: "Unstoppable Ceramic Mug", price: 14.99, originalPrice: 20.24, salePrice: 15.18, description: "11oz matte black ceramic coffee mug with heat-set brand insignia. Dishwasher safe.", imageUrl: "/images/MugAllBrands300x300.png", category: "accessories", sourceSite: "dreamstimeskip" },
          { id: "harmonytunes-vinyl", name: "HarmonyTunes Vinyl LP", price: 34.99, originalPrice: 47.24, salePrice: 35.43, description: "180g heavyweight collector's vinyl pressed on black wax with full-color gatefold artwork.", imageUrl: "/images/legacy_cover.jpg", category: "music", sourceSite: "harmonytunes" },
          { id: "isabel-larosa-poster", name: "Isabel LaRosa Art Print", price: 19.99, originalPrice: 26.99, salePrice: 20.24, description: "Official 18x24 archival exhibition print on 300 GSM metallic pearl paper.", imageUrl: "/images/isabel_larosa_cover.jpg", category: "art", sourceSite: "harmonytunes" },
          { id: "un250-heritage-tee", name: "UN 250 Heritage Special Tee", price: 29.99, originalPrice: 40.49, salePrice: 30.36, description: "Heavyweight vintage-wash cotton tee with woven USA flag emblem and distressed hem tag.", imageUrl: "/images/un250-flag.png", category: "apparel", sourceSite: "unstoppable" },
          { id: "dts-membership-premium", name: "Dreams TimeSkip Premium Membership", price: 10.86, originalPrice: 14.49, salePrice: 10.86, description: "Full themes access, 25% merch store discount, exclusive badge, Discord roles & monthly loot boxes", category: "membership", sourceSite: "dreamstimeskip" },
          { id: "dts-membership-ultimate", name: "Dreams TimeSkip Ultimate Membership", price: 14.13, originalPrice: 18.84, salePrice: 14.13, description: "Ad-free experience, custom theme creator, supporter status & badge, 8 mystery boxes/month", category: "membership", sourceSite: "dreamstimeskip" },
        ];

        const syncedProducts = [];
        for (const item of defaultStoreProducts) {
          const pDoc = await db.collection("products").doc(item.id).get();
          if (!pDoc.exists) {
            let stripeProductId = null;
            let stripePriceId = null;
            if (stripe) {
              try {
                const sprod = await stripe.products.create({
                  name: item.name,
                  description: item.description,
                  metadata: { productId: item.id, sourceSite: item.sourceSite },
                });
                const sprice = await stripe.prices.create({
                  product: sprod.id,
                  unit_amount: Math.round(item.price * 100),
                  currency: "usd",
                });
                stripeProductId = sprod.id;
                stripePriceId = sprice.id;
              } catch (sErr) {
                console.warn("Notice: Stripe product sync notice: [" + sErr.message + "]");
              }
            }

            const pRecord = {
              ...item,
              active: true,
              stripeProductId,
              stripePriceId,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("products").doc(item.id).set(pRecord);
            syncedProducts.push({ id: item.id, ...pRecord });
          } else {
            syncedProducts.push({ id: item.id, ...pDoc.data() });
          }
        }
        return res.status(200).json({ success: true, count: syncedProducts.length, products: syncedProducts });
      }

      // Special action: Sync or list promo codes implemented from Stripe
      if (action === "sync_stripe_promo_codes" || action === "list_stripe_promo_codes") {
        const syncedCodes = [];
        if (stripe) {
          try {
            const stripePromos = await stripe.promotionCodes.list({
              limit: 100,
              expand: ["data.coupon"],
            });
            for (const item of stripePromos.data) {
              const code = (item.code || "").toUpperCase();
              const discount = item.coupon && item.coupon.percent_off ?
                item.coupon.percent_off :
                (item.coupon && item.coupon.amount_off ? item.coupon.amount_off / 100 : 0);
              const promoRecord = {
                discount,
                active: Boolean(item.active),
                source: "stripe",
                stripePromoId: item.id,
                stripeCouponId: item.coupon ? item.coupon.id : null,
                timesRedeemed: item.times_redeemed || 0,
                duration: item.coupon ? item.coupon.duration : "forever",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              };
              await db.collection("promo_codes").doc(code).set(promoRecord, {merge: true});
              syncedCodes.push({code, ...promoRecord});
            }
          } catch (stripeErr) {
            console.warn("Manager info: Stripe promotionCodes list notice: [" + stripeErr.message + "]");
          }
        }

        // Seed default implemented Stripe promo codes if not already present
        const defaultStripeCodes = [
          {code: "TEST10", discount: 10, active: true, source: "stripe", description: "Stripe Test Card Promo (10% Off)"},
          {code: "DTS10", discount: 10, active: true, source: "stripe", description: "Dreams TimeSkip Community Promo (10% Off)"},
          {code: "SUMMER20", discount: 20, active: true, source: "stripe", description: "Summer Seasonal Promo (20% Off)"},
          {code: "UNSTOPPABLE", discount: 15, active: true, source: "stripe", description: "Unstoppable Member Promo (15% Off)"},
        ];

        for (const def of defaultStripeCodes) {
          const docSnap = await db.collection("promo_codes").doc(def.code).get();
          if (!docSnap.exists) {
            const defData = {
              discount: def.discount,
              active: def.active,
              source: def.source,
              description: def.description,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("promo_codes").doc(def.code).set(defData);
            syncedCodes.push({code: def.code, ...defData});
          }
        }

        return res.status(200).json({success: true, count: syncedCodes.length, promoCodes: syncedCodes});
      }

      const docRef = db.collection(collection).doc(docId);

      if (action === "update") {
        if (typeof data !== "object" || data === null) {
          return res.status(400).send("Invalid update data");
        }
        if (data.createdAt === "SERVER_TIMESTAMP") {
          data.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        if (data.updatedAt === "SERVER_TIMESTAMP") {
          data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        }

        // If updating a promo code with Stripe integration
        if (collection === "promo_codes" && stripe && data.active !== undefined) {
          try {
            const existing = await docRef.get();
            const existingData = existing.exists ? existing.data() : {};
            if (existingData.stripePromoId) {
              await stripe.promotionCodes.update(existingData.stripePromoId, {active: data.active});
            }
          } catch (stripeErr) {
            console.warn("Notice: Stripe promo status update warning: [" + stripeErr.message + "]");
          }
        }

        await docRef.set(data, { merge: true });
      } else if (action === "create") {
        if (typeof data !== "object" || data === null) {
          return res.status(400).send("Invalid create data");
        }
        if (data.createdAt === 'SERVER_TIMESTAMP') {
          data.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }
        if (data.updatedAt === "SERVER_TIMESTAMP") {
          data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        }

        // If creating promo code and Stripe is configured, create coupon & promotion code in Stripe
        if (collection === "promo_codes" && stripe && data.source !== "firestore_only") {
          try {
            const coupon = await stripe.coupons.create({
              percent_off: Number(data.discount),
              duration: data.duration || "forever",
              name: `${data.discount}% Off (${docId})`,
            });
            const promo = await stripe.promotionCodes.create({
              coupon: coupon.id,
              code: docId,
            });
            data.stripeCouponId = coupon.id;
            data.stripePromoId = promo.id;
            data.source = "stripe";
          } catch (stripeErr) {
            console.warn("Notice: Stripe promo creation failed, saving to Firestore: [" + stripeErr.message + "]");
            if (!data.source) data.source = "stripe";
          }
        } else if (collection === "promo_codes" && !data.source) {
          data.source = "stripe";
        }

        await docRef.set(data);
      } else if (action === "delete") {
        if (collection === "promo_codes" && stripe) {
          try {
            const existing = await docRef.get();
            if (existing.exists && existing.data().stripeCouponId) {
              await stripe.coupons.del(existing.data().stripeCouponId);
            }
          } catch (stripeErr) {
            console.warn("Notice: Stripe coupon delete notice: [" + stripeErr.message + "]");
          }
        }
        await docRef.delete();
      } else {
        return res.status(400).send("Invalid action");
      }

      res.status(200).json({success: true});
    } catch (err) {
      console.error("Manager info: Admin Action Error: [" + err.message + "]");
      res.status(500).json({error: err.message});
    }
  });
});

// 📦 Create / Sync Product (Unstoppable Store Architecture)
exports.createProduct = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 1. Verify Secret API Key from other sites or admin token
    const apiKey = req.headers["x-unstoppable-api-key"];
    const configuredKey = process.env.STORE_API_KEY || "unstoppable-store-secret-2026";
    let isAuthorized = Boolean(apiKey && apiKey === configuredKey);

    if (!isAuthorized) {
      // Check Bearer token for admin authorization
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split("Bearer ")[1];
          const decoded = await admin.auth().verifyIdToken(token);
          const userDoc = await getUserDocRef(decoded.uid).get();
          if (userDoc.exists && userDoc.data().isAdmin) {
            isAuthorized = true;
          }
        } catch (_) {}
      }
    }

    if (!isAuthorized) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      id,
      name,
      price,
      originalPrice,
      salePrice,
      description,
      imageUrl,
      extraImages,
      category,
      sourceSite,
      active = true,
      stripePriceId,
      stripeProductId,
    } = req.body || {};

    if (!id || !name || price == null) {
      return res.status(400).json({ error: "Missing required fields (id, name, price)" });
    }

    try {
      const db = admin.firestore();
      const productRef = db.collection("products").doc(id);

      // Optional Stripe product sync if stripe is initialized and no priceId given
      let resolvedStripePriceId = stripePriceId || null;
      let resolvedStripeProductId = stripeProductId || null;

      if (stripe && !resolvedStripePriceId) {
        try {
          const stripeProd = await stripe.products.create({
            name: name,
            description: description || undefined,
            images: (imageUrl && imageUrl.startsWith("http")) ? [imageUrl] : undefined,
            metadata: { productId: id, sourceSite: sourceSite || "external" },
          });
          const stripePrice = await stripe.prices.create({
            product: stripeProd.id,
            unit_amount: Math.round(Number(price) * 100),
            currency: "usd",
          });
          resolvedStripeProductId = stripeProd.id;
          resolvedStripePriceId = stripePrice.id;
        } catch (sErr) {
          console.warn("Notice: Stripe product creation notice: [" + sErr.message + "]");
        }
      }

      const numPrice = Number(price);
      const productRecord = {
        id,
        name,
        price: numPrice,
        originalPrice: originalPrice != null ? Number(originalPrice) : Number((numPrice * 1.35).toFixed(2)),
        salePrice: salePrice != null ? Number(salePrice) : Number(price),
        description: description || "",
        imageUrl: imageUrl || "",
        extraImages: Array.isArray(extraImages) ? extraImages : (imageUrl ? [imageUrl] : []),
        category: category || "general",
        sourceSite: sourceSite || "external",
        active: active !== false,
        stripeProductId: resolvedStripeProductId,
        stripePriceId: resolvedStripePriceId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await productRef.set(productRecord, { merge: true });
      return res.status(200).json({ success: true, productId: id, product: productRecord });
    } catch (error) {
      console.error("Manager info: createProduct error: [" + error.message + "]");
      return res.status(500).json({ error: error.message });
    }
  });
});

exports.createCheckoutSession = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const {plan, project, cart, orderDetails, successUrl, cancelUrl} = req.body;

    // Check if this is a shop cart order
    const isShopOrder = Boolean(cart && typeof cart === "object" && Object.keys(cart).length > 0);

    // Determine Price ID based on project
    let priceId;
    if (project === "dreamstimeskip") {
      if (plan === "premium") {
        priceId = "price_NEW_DREAMSTIMESKIP_PREMIUM";
      } else if (plan === "ultimate") {
        priceId = "price_NEW_DREAMSTIMESKIP_ULTIMATE";
      } else {
        priceId = "price_NEW_DREAMSTIMESKIP_PREMIUM"; // fallback
      }
    } else {
      // Default to ezManage logic
      priceId = plan === "Business Pro" ?
        "price_1THHbVBp2C5GdKaKvCVoMf1X" : "price_1THHYPBp2C5GdKaKxNpqndNE";
    }

    try {
      if (!stripe) throw new Error("Stripe is not configured.");

      const isDts = project === "dreamstimeskip";
      const defaultSuccess = isDts ?
        "https://dreamstimeskip-beta.pages.dev/tracker?success=true" :
        "https://dreamstimeskip-beta.pages.dev/success";
      const defaultCancel = isDts ?
        "https://dreamstimeskip-beta.pages.dev/tracker?canceled=true" :
        "https://dreamstimeskip-beta.pages.dev/cancel";

      let sessionConfig;

      if (isShopOrder) {
        const db = admin.firestore();
        const lineItems = [];

        for (const [productId, quantity] of Object.entries(cart)) {
          const qty = Math.max(1, parseInt(quantity, 10) || 1);
          let productName = productId;
          let unitAmount = 2000;
          let images = [];

          try {
            const pDoc = await db.collection("products").doc(productId).get();
            if (pDoc.exists) {
              const pData = pDoc.data();
              productName = pData.name || productId;
              unitAmount = Math.round(Number(pData.price || 20) * 100);
              if (pData.imageUrl && pData.imageUrl.startsWith("http")) {
                images = [pData.imageUrl];
              }
            }
          } catch (_) {}

          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: productName,
                images: images.length > 0 ? images : undefined,
              },
              unit_amount: unitAmount,
            },
            quantity: qty,
          });
        }

        sessionConfig = {
          mode: "payment",
          payment_method_types: ["card"],
          customer_email: email,
          line_items: lineItems,
          allow_promotion_codes: true,
          success_url: successUrl || (defaultSuccess + "?session_id={CHECKOUT_SESSION_ID}"),
          cancel_url: cancelUrl || defaultCancel,
          metadata: {
            uid: uid || "unknown",
            orderType: "shop",
            project: project || "unstoppable",
            cart: JSON.stringify(cart),
            orderDetails: JSON.stringify(orderDetails || {}),
          },
        };
      } else if (project === "medixly") {
        const normTier = (plan || "premium").toLowerCase();
        const tierTitle = normTier === "ultra" ? "Ultra" : "Premium";
        const isYearly = req.body.billingCycle === "yearly";
        const isOneTime = req.body.mode === "payment";

        // Daily Escalation Logic: starts at $1.00 on Oct 28 2026, +$1.00 each day at midnight UTC
        const promoStart = new Date(process.env.MEDIXLY_PROMO_START_DATE || "2026-10-28T00:00:00Z");
        const now = new Date();
        const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const startUTC = Date.UTC(promoStart.getUTCFullYear(), promoStart.getUTCMonth(), promoStart.getUTCDate());
        const dayIndex = Math.max(0, Math.floor((nowUTC - startUTC) / (1000 * 60 * 60 * 24)));
        const cap = normTier === "ultra" ? 12.99 : 6.99;
        const dailyPrice = Math.min(cap, Math.round((1.00 + dayIndex * 1.00) * 100) / 100);
        const finalPrice = isYearly ? Math.round(dailyPrice * 10 * 100) / 100 : dailyPrice;
        const unitAmount = Math.round(finalPrice * 100);

        const defaultMdxSuccess = "https://realunstoppable.store/medixly-pricing.html?status=success&session_id={CHECKOUT_SESSION_ID}";
        const defaultMdxCancel = "https://realunstoppable.store/medixly-pricing.html?status=cancelled";

        sessionConfig = {
          mode: isOneTime ? "payment" : "subscription",
          payment_method_types: ["card"],
          customer_email: email || undefined,
          client_reference_id: uid && uid !== "unknown" ? uid : undefined,
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: `Medixly ${tierTitle} Membership (${isYearly ? "Yearly Lock" : "Monthly Lock"})`,
                description: `Locked promotional rate for Medixly ${tierTitle} - Lifetime Guarantee`,
                images: ["https://realunstoppable.store/images/medixly-logo.png"],
              },
              unit_amount: unitAmount,
              ...(!isOneTime ? { recurring: { interval: isYearly ? "year" : "month" } } : {})
            },
            quantity: 1,
          }],
          allow_promotion_codes: true,
          success_url: successUrl || defaultMdxSuccess,
          cancel_url: cancelUrl || defaultMdxCancel,
          metadata: {
            uid: uid || "unknown",
            email: email || "",
            project: "medixly",
            plan: normTier,
            tier: normTier,
            planName: `Medixly ${tierTitle}`,
            billingCycle: isYearly ? "yearly" : "monthly",
            lockedPrice: finalPrice.toString(),
            orderType: isOneTime ? "one_time_lock" : "subscription"
          }
        };
      } else {
        sessionConfig = {
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: email,
          line_items: [{price: priceId, quantity: 1}],
          subscription_data: {trial_period_days: 7}, // ✅ FREE TRIAL
          allow_promotion_codes: true, // ✅ Support promo codes implemented from Stripe

          // Use URLs passed from frontend, fallback to hardcoded if missing
          success_url: successUrl || defaultSuccess,
          cancel_url: cancelUrl || defaultCancel,
          metadata: {
            uid: uid || "unknown",
            planName: plan || "Pro",
            project: project || "ezmanage",
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.status(200).json({url: session.url});
    } catch (err) {
      console.error("Manager info: Checkout Error: [" + err.message + "]");
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
      console.error("Manager info: Error creating notification: [" + error.message + "]");
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
exports.stripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (!stripe) throw new Error("Stripe is not configured.");
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Manager info: Webhook Error: [" + err.message + "]");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Handle Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const uid = metadata.uid;
    const planName = metadata.planName || "Pro";
    const project = metadata.project || "ezmanage";
    const isShopOrder = metadata.orderType === "shop" || Boolean(metadata.cart);

    if (isShopOrder) {
      try {
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
          userId: uid || "guest",
          userEmail: session.customer_details?.email || session.customer_email || orderDetails.email || "",
          items: cart,
          orderDate: admin.firestore.FieldValue.serverTimestamp(),
          status: "Paid",
          total: total,
          shippingInfo: orderDetails.shippingInfo || session.shipping_details || {},
          paymentStatus: "Paid via Stripe Checkout (" + (session.payment_intent || session.id) + ")",
          stripeSessionId: session.id,
          appliedPromo: orderDetails.appliedPromo || "",
          earnedPoints: Math.floor(total * 10),
          sourceSite: metadata.project || "unstoppable",
        };

        const db = admin.firestore();
        await db.collection("orders").doc(`${uid || "guest"}_${Date.now()}`).set(fullOrder);

        // Update product ordered counts
        for (const [productId, quantity] of Object.entries(cart)) {
          const qty = parseInt(quantity, 10) || 1;
          const statRef = db.collection("product_stats").doc(productId);
          await statRef.set({
            orderedCount: admin.firestore.FieldValue.increment(qty),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }

        // If user is authenticated, award loyalty points & clear cart
        if (uid && uid !== "unknown" && uid !== "guest") {
          const userRef = getUserDocRef(uid);
          const earnedPts = Math.floor(total * 10);
          await userRef.set({
            pointsBalance: admin.firestore.FieldValue.increment(earnedPts),
            loyaltyPoints: admin.firestore.FieldValue.increment(earnedPts),
          }, { merge: true });

          await db.collection("carts").doc(uid).set({ items: {} });

          await db.collection("loyalty_transactions").add({
            userId: uid,
            description: `Order Purchase #${orderId} 🛍️`,
            points: earnedPts,
            type: "earned",
            orderId: orderId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Manager info: Error saving shop order from stripe webhook: [" + err.message + "]");
      }
    } else if (metadata.project === "medixly") {
      try {
        const tier = (metadata.tier || metadata.plan || "premium").toLowerCase();
        const tierTitle = tier === "ultra" ? "Ultra" : "Premium";
        const billingCycle = metadata.billingCycle || "monthly";
        const lockedPrice = parseFloat(metadata.lockedPrice || "1.00");
        const orderType = metadata.orderType || "subscription";
        let targetUid = uid;

        const customerEmail = session.customer_details?.email || session.customer_email || metadata.userEmail || "";
        const db = admin.firestore();

        if ((!targetUid || targetUid === "unknown" || targetUid === "guest") && customerEmail) {
          const userSnap = await db.collection("users").where("email", "==", customerEmail).limit(1).get();
          if (!userSnap.empty) {
            targetUid = userSnap.docs[0].id;
          }
        }

        const durationMs = billingCycle === "yearly" ? (365 * 24 * 60 * 60 * 1000) : (30 * 24 * 60 * 60 * 1000);
        const expiresAt = new Date(Date.now() + durationMs);

        const subscriptionRecord = {
          status: "active",
          tier: tier,
          plan: `Medixly ${tierTitle}`,
          planName: `Medixly ${tierTitle}`,
          billingCycle: billingCycle,
          lockedPrice: lockedPrice,
          currency: "usd",
          orderType: orderType,
          customerId: session.customer || null,
          subscriptionId: session.subscription || null,
          sessionId: session.id,
          paymentIntentId: session.payment_intent || null,
          paymentStatus: session.payment_status || "paid",
          startedAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: expiresAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (targetUid && targetUid !== "unknown" && targetUid !== "guest") {
          await getUserDocRef(targetUid).set({
            membershipLevel: tier,
            tier: tier,
            plan: `Medixly ${tierTitle}`,
            medixlySubscription: subscriptionRecord,
            subscription: {
              status: "active",
              customerId: session.customer || null,
              subscriptionId: session.subscription || null,
              tier: tier
            }
          }, { merge: true });

          await db.collection("notifications").add({
            userId: targetUid,
            title: `Medixly ${tierTitle} Activated! 🎶`,
            message: `Your promotional rate of $${lockedPrice.toFixed(2)} is locked in! Enjoy uninterrupted streaming.`,
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            link: "medixly.html",
            type: "membership_upgrade"
          });
        }

        await db.collection("membership_orders").doc(session.id).set({
          orderId: "MDX-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          project: "medixly",
          userId: targetUid || "guest",
          userEmail: customerEmail,
          tier: tier,
          billingCycle: billingCycle,
          lockedPrice: lockedPrice,
          totalAmount: session.amount_total ? session.amount_total / 100 : lockedPrice,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer || null,
          stripeSubscriptionId: session.subscription || null,
          status: "paid",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error("Manager info: Error saving Medixly order from stripe webhook: [" + err.message + "]");
      }
    } else if (uid && uid !== "unknown") {
      try {
        const updateData = {
          plan: planName, // Original ezManage field
          subscription: {
            status: "active",
            customerId: session.customer,
          },
        };

        if (project === "dreamstimeskip") {
          updateData.membershipLevel = planName; // Dreamstimeskip specific field
        }

        await getUserDocRef(uid).set(updateData, {merge: true});
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

      const updates = snapshot.docs.map((doc) => {
        return doc.ref.update({
          "plan": "free",
          "membershipLevel": "free", // Ensures dreamstimeskip also reverts
          "subscription.status": "canceled",
          "medixlySubscription.status": "canceled"
        });
      });
      await Promise.all(updates);
    } catch (error) {
      console.error("Manager info: Error processing customer.subscription.deleted: [" + error.message + "]");
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;

    try {
      const snapshot = await admin.firestore()
          .collection("users")
          .where("subscription.customerId", "==", sub.customer)
          .get();

      const isStillActive = sub.status === "active";
      const updates = snapshot.docs.map((doc) => {
        return doc.ref.update({
          ...(isStillActive ? {} : { "plan": "free", "membershipLevel": "free" }),
          "subscription.status": sub.status,
          "medixlySubscription.status": sub.status,
          "medixlySubscription.currentPeriodEnd": new Date(sub.current_period_end * 1000)
        });
      });
      await Promise.all(updates);
    } catch (error) {
      console.error("Manager info: Error processing customer.subscription.updated: [" + error.message + "]");
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;

    try {
      const snapshot = await admin.firestore()
          .collection("users")
          .where("subscription.customerId", "==", invoice.customer)
          .get();

      const updates = snapshot.docs.map((doc) => {
        return Promise.all([
          doc.ref.update({
            "medixlySubscription.status": "past_due",
            "subscription.status": "past_due"
          }),
          admin.firestore().collection("notifications").add({
            userId: doc.id,
            title: "Medixly Payment Issue ⚠️",
            message: "Your recent membership payment failed to process. Please update your payment method to keep your locked price.",
            isRead: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            link: "account.html",
            type: "payment_failed"
          })
        ]);
      });
      await Promise.all(updates);
    } catch (error) {
      console.error("Manager info: Error processing invoice.payment_failed: [" + error.message + "]");
    }
  }

  res.json({received: true});
});

// 🔻 Cancel Subscription Manually
exports.cancelSubscription = onRequest((req, res) => {
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

      if (!stripe) throw new Error("Stripe is not configured.");
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


// 🏆 Shared Utility: Get Points Update Data
function getPointsUpdateData(userDoc, rewardPoints, loyaltyPoints) {
  let currentRewardPoints = 0;
  let currentLoyaltyPoints = 0;

  if (userDoc.exists) {
    const data = userDoc.data();
    if (typeof data.pointsBalance === "number") currentRewardPoints = data.pointsBalance;
    if (typeof data.loyaltyPoints === "number") currentLoyaltyPoints = data.loyaltyPoints;
  }

  const updateData = {};
  if (rewardPoints > 0) updateData.pointsBalance = currentRewardPoints + rewardPoints;
  if (loyaltyPoints > 0) updateData.loyaltyPoints = currentLoyaltyPoints + loyaltyPoints;

  return updateData;
}

// ⭐️ Update Points on New Review
exports.onReviewCreated = onDocumentCreated("product_reviews/{reviewId}", async (event) => {
  const snap = event.data;
  const newReview = snap.data();
  const productId = newReview.productId;
  const rating = newReview.rating;
  const userId = newReview.userId;

  // Validate rating
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    console.error("Manager info: Invalid rating:", rating);
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
        const updateData = getPointsUpdateData(userDoc, pointsToAward, 0);
        transaction.set(userRef, updateData, {merge: true});

        transaction.set(transactionRef, {
          userId: userId,
          amount: pointsToAward,
          reason: "Product Review",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  } catch (error) {
    console.error("Manager info: Error updating product stats or awarding points [" + error.message + "]");
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
      const quantity = typeof item === "object" && item.quantity !== undefined ? item.quantity : item;
      loyaltyPointsEarned += (parseInt(quantity) || 0) * 10;
    }
  }

  if (rewardPointsToAward <= 0 && loyaltyPointsEarned <= 0) return null;

  const userRef = db.collection("users").doc(userId);

  try {
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const updateData = getPointsUpdateData(userDoc, rewardPointsToAward, loyaltyPointsEarned);

      if (rewardPointsToAward > 0) {
        const rewardTxRef = db.collection("reward_transactions").doc();
        transaction.set(rewardTxRef, {
          userId: userId,
          amount: rewardPointsToAward,
          reason: "Purchase Reward",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (loyaltyPointsEarned > 0) {
        const loyaltyTxRef = db.collection("loyalty_transactions").doc();
        transaction.set(loyaltyTxRef, {
          userId: userId,
          points: loyaltyPointsEarned,
          orderId: event.params.orderId,
          description: `Earned points from Order #${event.params.orderId.split("_")[1] || event.params.orderId}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const notificationRef = db.collection("notifications").doc();
      transaction.set(notificationRef, {
        userId: userId,
        title: "Points Earned!",
        message: `You earned ${rewardPointsToAward} Reward Points and ${loyaltyPointsEarned} Loyalty Points from your recent order.`,
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        link: "account.html#rewards",
        type: "reward",
      });

      if (Object.keys(updateData).length > 0) {
        transaction.set(userRef, updateData, {merge: true});
      }
    });
  } catch (error) {
    console.error("Manager info: Error updating order points: [" + error.message + "]");
    return null;
  }
});

exports.processOrderTransaction = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const decodedToken = await authenticateRequest(req, res, admin);
      if (!decodedToken) return;

      if (JSON.stringify(req.body).length > 15000) {
        return res.status(413).send("Payload too large");
      }

      const uid = decodedToken.uid;
      const {cart, orderDetails, pointsToRedeem = 0} = req.body;

      if (!cart || !orderDetails || typeof cart !== "object" || typeof orderDetails !== "object") {
        return res.status(400).send("Invalid or missing cart/orderDetails");
      }

      // Fix: Securely override userId with authenticated user's id
      orderDetails.userId = uid;
      // Do not accept timestamps from the client, assign server-side
      orderDetails.orderDate = admin.firestore.FieldValue.serverTimestamp();

      const db = admin.firestore();

      await db.runTransaction(async (transaction) => {
        const userRef = db.collection("users").doc(uid);
        const userDoc = await transaction.get(userRef);

        let currentPoints = 0;
        if (userDoc.exists) {
          currentPoints = userDoc.data().pointsBalance || 0;
        }

        if (pointsToRedeem > currentPoints) {
          throw new Error(`Not enough points. You have ${currentPoints} but tried to redeem ${pointsToRedeem}`);
        }

        const productIds = Object.keys(cart);
        const statRefs = productIds.map((id) => db.collection("product_stats").doc(id));
        const statDocs = await Promise.all(statRefs.map((ref) => transaction.get(ref)));

        const currentStats = {};
        statDocs.forEach((statDoc, index) => {
          const productId = productIds[index];
          currentStats[productId] = statDoc;
        });

        const newOrderRef = db.collection("orders").doc(`${uid}_${Date.now()}`);
        transaction.set(newOrderRef, orderDetails);

        for (const [productId, quantity] of Object.entries(cart)) {
          const productStatRef = db.collection("product_stats").doc(productId);
          const statDoc = currentStats[productId];

          if (!statDoc.exists) {
            transaction.set(productStatRef, {orderedCount: quantity});
          } else {
            const newCount = (statDoc.data().orderedCount || 0) + quantity;
            transaction.update(productStatRef, {orderedCount: newCount});
          }
        }

        const userCartRef = db.collection("carts").doc(uid);
        transaction.update(userCartRef, {items: {}});

        // Deduct points
        if (pointsToRedeem > 0) {
          transaction.update(userRef, {pointsBalance: currentPoints - pointsToRedeem});

          const rewardTxRef = db.collection("reward_transactions").doc();
          transaction.set(rewardTxRef, {
            userId: uid,
            points: -pointsToRedeem,
            reason: "Redeemed points at checkout",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            orderId: newOrderRef.id,
          });
        }
      });

      res.status(200).send({success: true});
    } catch (error) {
      console.error("Manager info: Error processing order transaction [" + error.message + "]");
      res.status(500).send("Internal Server Error");
    }
  });
});


// 📅 Daily Check-in Rewards
exports.claimDailyCheckIn = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    const uid = decodedToken.uid;
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const transactionRef = db.collection("reward_transactions").doc();

    try {
      return await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error("User not found");
        }

        const data = userDoc.data();
        let lastCheckIn = data.lastCheckIn;
        let streak = data.checkInStreak || 0;
        let points = data.pointsBalance || 0;

        const now = admin.firestore.Timestamp.now();
        const nowDate = now.toDate();
        // Use client local date if provided, otherwise UTC fallback YYYY-MM-DD
        const todayStr = (req.body && typeof req.body.clientDate === 'string' && req.body.clientDate.length === 10)
            ? req.body.clientDate
            : nowDate.toISOString().split('T')[0];

        let lastCheckInStr = "";
        let isConsecutive = false;

        if (data.lastClaimDate) {
            lastCheckInStr = data.lastClaimDate;
        } else if (lastCheckIn) {
            const lastDate = lastCheckIn.toDate();
            lastCheckInStr = lastDate.toISOString().split('T')[0];
        }

        if (lastCheckInStr) {
            if (todayStr === lastCheckInStr) {
                // Already checked in today
                return res.status(200).json({ success: true, message: "Already checked in today", currentStreak: streak });
            }

            // Check if it's consecutive (exactly 1 day diff)
            const parts1 = todayStr.split('-').map(Number);
            const parts2 = lastCheckInStr.split('-').map(Number);
            const utc1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
            const utc2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
            const diffDays = Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                isConsecutive = true;
            }
        }

        let newStreak = (req.body && typeof req.body.streak === 'number' && req.body.streak > 0)
            ? req.body.streak
            : (isConsecutive ? streak + 1 : 1);

        // Base reward
        let rewardPoints = 20;
        let isStreakBonus = false;

        // 7-day bonus
        if (newStreak > 0 && newStreak % 7 === 0) {
            rewardPoints += 50;
            isStreakBonus = true;
        }

        const newPoints = points + rewardPoints;

        const updatePayload = {
            pointsBalance: newPoints,
            lastCheckIn: now,
            lastClaimDate: todayStr,
            checkInStreak: newStreak
        };

        if (req.body && req.body.checkinData && typeof req.body.checkinData === 'object') {
            updatePayload.dailyCheckin = req.body.checkinData;
        }

        transaction.set(userRef, updatePayload, { merge: true });

        const reason = isStreakBonus ? "Daily Check-in (7-Day Bonus!)" : "Daily Check-in";

        transaction.set(transactionRef, {
            userId: uid,
            amount: rewardPoints,
            reason: reason,
            createdAt: now
        });

        res.status(200).json({ success: true, pointsEarned: rewardPoints, currentStreak: newStreak, totalPoints: newPoints });
      });
    } catch (error) {
      console.error("Manager info: Check-in Error: [" + error.message + "]");
      res.status(500).json({ error: error.message });
    }
  });
});

// 👍 Toggle Feature Upvote
exports.toggleFeatureUpvote = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    const uid = decodedToken.uid;
    const {requestId} = req.body;

    if (!requestId) {
      return res.status(400).send("Missing requestId");
    }

    const db = admin.firestore();
    const requestRef = db.collection("feature_requests").doc(requestId);
    const upvoteRef = requestRef.collection("upvotes").doc(uid);

    try {
      await db.runTransaction(async (transaction) => {
        const upvoteDoc = await transaction.get(upvoteRef);
        const requestDoc = await transaction.get(requestRef);

        if (!requestDoc.exists) {
          throw new Error("Feature request not found");
        }

        const currentUpvotes = requestDoc.data().upvotes || 0;

        if (upvoteDoc.exists) {
          // User already upvoted, remove it
          transaction.delete(upvoteRef);
          transaction.update(requestRef, {upvotes: currentUpvotes - 1});
        } else {
          // Add upvote
          transaction.set(upvoteRef, {createdAt: admin.firestore.FieldValue.serverTimestamp()});
          transaction.update(requestRef, {upvotes: currentUpvotes + 1});
        }
      });

      res.status(200).json({success: true});
    } catch (error) {
      console.error("Manager info: Toggle Upvote Error: [" + error.message + "]");
      res.status(500).json({error: error.message});
    }
  });
});



// 🎮 Minecraft Username Availability & Uniqueness Check
exports.checkMinecraftLink = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST" && req.method !== "GET") {
      return res.status(405).json({error: "Method Not Allowed"});
    }

    try {
      const username = (req.method === "POST" ? req.body && req.body.username : req.query && req.query.username) || "";
      const currentUid = (req.method === "POST" ? req.body && req.body.currentUid : req.query && req.query.currentUid) || null;

      const trimmed = (typeof username === "string" ? username : "").trim();
      if (!trimmed) {
        return res.status(400).json({available: false, error: "Username is required"});
      }

      const normalizedKey = trimmed.toLowerCase();
      const db = admin.firestore();

      // 1. Check primary registry: minecraft_links collection
      const linkDoc = await db.collection("minecraft_links").doc(normalizedKey).get();
      if (linkDoc.exists) {
        const linkData = linkDoc.data() || {};
        if (linkData.uid && linkData.uid !== currentUid) {
          return res.status(200).json({
            available: false,
            linkedToOther: true,
            ownerUid: linkData.uid,
            message: "This Minecraft username is already linked to a different account. If you think this is a mistake, contact us."
          });
        }
      }

      // 2. Check users collection for existing linked profile
      const userMatches = await db.collection("users")
        .where("minecraftUsername", "==", trimmed)
        .limit(2)
        .get();

      for (const uDoc of userMatches.docs) {
        if (uDoc.id !== currentUid) {
          return res.status(200).json({
            available: false,
            linkedToOther: true,
            ownerUid: uDoc.id,
            message: "This Minecraft username is already linked to a different account. If you think this is a mistake, contact us."
          });
        }
      }

      // 3. Check dts_waitlist collection
      const waitlistMatches = await db.collection("dts_waitlist")
        .where("minecraftUsername", "==", trimmed)
        .limit(2)
        .get();

      for (const wDoc of waitlistMatches.docs) {
        const wData = wDoc.data() || {};
        const ownerUid = wData.uid || wDoc.id;
        if (ownerUid !== currentUid) {
          return res.status(200).json({
            available: false,
            linkedToOther: true,
            ownerUid: ownerUid,
            message: "This Minecraft username is already linked to a different account. If you think this is a mistake, contact us."
          });
        }
      }

      return res.status(200).json({
        available: true,
        message: "Username is available."
      });
    } catch (error) {
      console.error("Manager info: Check Minecraft Link Error: [" + error.message + "]");
      return res.status(500).json({error: error.message});
    }
  });
});

// 🏆 Process Referral
exports.processReferral = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Endpoint requires authentication!');
    }

    const newUserId = context.auth.uid;
    const { referrerUid } = data;

    if (!referrerUid) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing referrerUid');
    }

    if (referrerUid === newUserId) {
        throw new functions.https.HttpsError('invalid-argument', 'Cannot refer yourself');
    }

    const db = admin.firestore();
    const referrerRef = db.collection("users").doc(referrerUid);
    const refereeRef = db.collection("users").doc(newUserId);

    try {
      await db.runTransaction(async (transaction) => {
        const referrerDoc = await transaction.get(referrerRef);
        const refereeDoc = await transaction.get(refereeRef);

        if (refereeDoc.exists && refereeDoc.data().referredBy) {
            throw new Error("User has already used a referral code");
        }

        if (!referrerDoc.exists) {
            // Referrer not found, safely ignore
            return;
        }

        if (!refereeDoc.exists) {
            throw new Error("Referee not found");
        }

        const referrerPoints = referrerDoc.data().loyaltyPoints || 0;
        const refereePoints = refereeDoc.data().loyaltyPoints || 0;

        const REFERRAL_BONUS = 50;

        // Update points
        transaction.update(referrerRef, { loyaltyPoints: referrerPoints + REFERRAL_BONUS });
        transaction.update(refereeRef, { loyaltyPoints: refereePoints + REFERRAL_BONUS, referredBy: referrerUid });

        // Record transactions
        const referrerTxRef = db.collection("loyalty_transactions").doc();
        transaction.set(referrerTxRef, {
            userId: referrerUid,
            amount: REFERRAL_BONUS,
            type: 'referral_bonus_given',
            description: 'Referral Bonus: You referred a new user!',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        const refereeTxRef = db.collection("loyalty_transactions").doc();
        transaction.set(refereeTxRef, {
            userId: newUserId,
            amount: REFERRAL_BONUS,
            type: 'referral_bonus_received',
            description: 'Referral Bonus: You used a referral code!',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Manager info: Process Referral Error: [" + error.message + "]");
      throw new functions.https.HttpsError('internal', error.message);
    }
});


// --- SONG PROCESSING BACKEND FUNCTION ---
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const os = require("os");
const path = require("path");

exports.processUploadedSong = onDocumentCreated("artist_tracks/{trackId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (!data.audioUrl) return;

    const trackId = event.params.trackId;
    console.log(`Processing audio for track: ${trackId}`);

    const tempFilePath = path.join(os.tmpdir(), `${trackId}.tmp`);

    try {
        // 1. Download the file
        const response = await fetch(data.audioUrl);
        if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
        
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(tempFilePath, Buffer.from(buffer));

        // 2. Process with ffmpeg to find inmixPoint
        // We use silencedetect filter: -af silencedetect=noise=-50dB:d=0.1
        const startOffset = await new Promise((resolve, reject) => {
            let detectedOffset = 0;
            ffmpeg(tempFilePath)
                .audioFilters('silencedetect=noise=-40dB:d=0.1')
                .format('null')
                .on('stderr', (line) => {
                    // ffmpeg outputs silencedetect results to stderr
                    const match = line.match(/silence_end: ([0-9.]+)/);
                    if (match && detectedOffset === 0) {
                        detectedOffset = parseFloat(match[1]);
                    }
                })
                .on('end', () => {
                    resolve(detectedOffset);
                })
                .on('error', (err) => {
                    console.error(`FFmpeg error for ${trackId}:`, err);
                    resolve(0); // fallback
                })
                .save('pipe:1'); // output to null
        });

        console.log(`Detected inmixPoint for ${trackId}: ${startOffset}`);

        // 3. Update the Firestore document
        await snap.ref.update({
            inmixPoint: startOffset || 0,
            processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`Successfully processed and updated ${trackId}`);
    } catch (err) {
        console.error(`Error processing track ${trackId}:`, err);
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
});
