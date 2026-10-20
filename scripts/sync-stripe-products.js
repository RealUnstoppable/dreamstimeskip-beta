#!/usr/bin/env node
/**
 * Unstoppable Store - Stripe & Firestore Catalog Sync Script
 * 
 * Synchronizes the Unstoppable Store catalog (merchandise + memberships)
 * to Stripe (Products & Prices) and Cloud Firestore (products & product_stats).
 * 
 * Usage:
 *   node scripts/sync-stripe-products.js
 *   node scripts/sync-stripe-products.js --dry-run
 *   node scripts/sync-stripe-products.js --force
 */

import Stripe from 'stripe';
import admin from 'firebase-admin';

const isDryRun = process.argv.includes('--dry-run');
const isForce = process.argv.includes('--force');

const STORE_CATALOG = [
  {
    id: 'unstoppable-hoodie',
    name: 'Unstoppable Hoodie',
    price: 59.99,
    originalPrice: 80.99,
    salePrice: 60.74,
    description: 'Heavyweight 400 GSM black fleece hoodie with embroidered brand crest and double-lined hood.',
    imageUrl: 'https://realunstoppable.store/images/UnstoppableHoodieModel300x300.png',
    extraImages: [
      'https://realunstoppable.store/images/UnstoppableHoodieModel300x300.png',
      'https://realunstoppable.store/images/unstoppable-logo.png',
      'https://realunstoppable.store/images/Unstoppable%20Collection%20Logo.png'
    ],
    category: 'apparel',
    sourceSite: 'unstoppable',
    type: 'one_time',
    stock: 150
  },
  {
    id: 'dts-model-tee',
    name: 'DTS Model Tee',
    price: 24.99,
    originalPrice: 33.74,
    salePrice: 25.30,
    description: '100% combed ring-spun cotton tee with screenprinted Dreams TimeSkip character graphics.',
    imageUrl: 'https://realunstoppable.store/images/dreams-lobby.jpg',
    extraImages: [
      'https://realunstoppable.store/images/dreams-lobby.jpg',
      'https://realunstoppable.store/images/dreams-timeskip.png',
      'https://realunstoppable.store/images/dreams-12-days-to-release.png'
    ],
    category: 'apparel',
    sourceSite: 'dreamstimeskip',
    type: 'one_time',
    stock: 200
  },
  {
    id: 'harmonytunes-shirt',
    name: 'HarmonyTunes Cap',
    price: 24.99,
    originalPrice: 33.74,
    salePrice: 25.30,
    description: 'Low-profile 6-panel unstructured black cotton cap with embroidered soundwave emblem and adjustable brass strap.',
    imageUrl: 'https://realunstoppable.store/images/medixly-logo.png',
    extraImages: [
      'https://realunstoppable.store/images/medixly-logo.png',
      'https://realunstoppable.store/images/harmony-tunes-card.jpg'
    ],
    category: 'accessories',
    sourceSite: 'harmonytunes',
    type: 'one_time',
    stock: 120
  },
  {
    id: 'unstoppable-mousepad',
    name: 'Unstoppable Mousepad',
    price: 19.99,
    originalPrice: 26.99,
    salePrice: 20.24,
    description: 'Micro-weave gaming desk mat with precision anti-fray stitched borders and non-slip rubber backing.',
    imageUrl: 'https://realunstoppable.store/images/MugAllBrands300x300.png',
    extraImages: [
      'https://realunstoppable.store/images/MugAllBrands300x300.png',
      'https://realunstoppable.store/images/un-logo.png',
      'https://realunstoppable.store/images/unstoppable-logo.png'
    ],
    category: 'accessories',
    sourceSite: 'unstoppable',
    type: 'one_time',
    stock: 180
  },
  {
    id: 'dts-ceramic-mug',
    name: 'Unstoppable Ceramic Mug',
    price: 14.99,
    originalPrice: 20.24,
    salePrice: 15.18,
    description: '11oz matte black ceramic coffee mug with heat-set brand insignia. Dishwasher safe.',
    imageUrl: 'https://realunstoppable.store/images/MugAllBrands300x300.png',
    extraImages: [
      'https://realunstoppable.store/images/MugAllBrands300x300.png',
      'https://realunstoppable.store/images/un-logo-1.png',
      'https://realunstoppable.store/images/Unstoppable%20Collection%20Logo.png'
    ],
    category: 'accessories',
    sourceSite: 'dreamstimeskip',
    type: 'one_time',
    stock: 250
  },
  {
    id: 'harmonytunes-vinyl',
    name: 'HarmonyTunes Vinyl LP',
    price: 34.99,
    originalPrice: 47.24,
    salePrice: 35.43,
    description: "180g heavyweight collector's vinyl pressed on black wax with full-color gatefold artwork.",
    imageUrl: 'https://realunstoppable.store/images/legacy_cover.jpg',
    extraImages: [
      'https://realunstoppable.store/images/legacy_cover.jpg',
      'https://realunstoppable.store/images/astrophage_cover.jpg',
      'https://realunstoppable.store/images/blow_cover.jpg'
    ],
    category: 'music',
    sourceSite: 'harmonytunes',
    type: 'one_time',
    stock: 90
  },
  {
    id: 'isabel-larosa-poster',
    name: 'Isabel LaRosa Art Print',
    price: 19.99,
    originalPrice: 26.99,
    salePrice: 20.24,
    description: 'Official 18x24 archival exhibition print on 300 GSM metallic pearl paper.',
    imageUrl: 'https://realunstoppable.store/images/isabel_larosa_cover.jpg',
    extraImages: [
      'https://realunstoppable.store/images/isabel_larosa_cover.jpg',
      'https://realunstoppable.store/images/summer_bummer_rhy_rhy.jpg'
    ],
    category: 'art',
    sourceSite: 'harmonytunes',
    type: 'one_time',
    stock: 100
  },
  {
    id: 'un250-heritage-tee',
    name: 'UN 250 Heritage Special Tee',
    price: 29.99,
    originalPrice: 40.49,
    salePrice: 30.36,
    description: 'Heavyweight vintage-wash cotton tee with woven USA flag emblem and distressed hem tag.',
    imageUrl: 'https://realunstoppable.store/images/un250-flag.png',
    extraImages: [
      'https://realunstoppable.store/images/un250-flag.png',
      'https://realunstoppable.store/images/unstoppable-logo.png',
      'https://realunstoppable.store/images/un-logo.png'
    ],
    category: 'apparel',
    sourceSite: 'unstoppable',
    type: 'one_time',
    stock: 250
  },
  {
    id: 'dts-membership-premium',
    name: 'Dreams TimeSkip Premium Membership',
    price: 10.86,
    originalPrice: 14.49,
    salePrice: 10.86,
    description: 'Full themes access, 25% merch store discount, exclusive badge, Discord roles & monthly loot boxes.',
    imageUrl: 'https://realunstoppable.store/images/dreams-favicon.png',
    category: 'membership',
    sourceSite: 'dreamstimeskip',
    type: 'recurring',
    interval: 'month'
  },
  {
    id: 'dts-membership-ultimate',
    name: 'Dreams TimeSkip Ultimate Membership',
    price: 14.13,
    originalPrice: 18.84,
    salePrice: 14.13,
    description: 'Completely ad-free experience, custom theme creator, supporter status & badge, 8 mystery boxes/month.',
    imageUrl: 'https://realunstoppable.store/images/dreams-timeskip.png',
    category: 'membership',
    sourceSite: 'dreamstimeskip',
    type: 'recurring',
    interval: 'month'
  }
];

async function initStripe() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
  if (!stripeKey) {
    console.log('⚠️  Notice: STRIPE_SECRET_KEY not found in environment.');
    console.log('   Running in offline catalog mode (Stripe API calls skipped).');
    return null;
  }
  return new Stripe(stripeKey);
}

function initFirebase() {
  try {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'dts-hub-website';
      admin.initializeApp({ projectId });
    }
    return admin.firestore();
  } catch (err) {
    console.log('⚠️  Notice: Firebase Admin initialization notice:', err.message);
    return null;
  }
}

async function syncCatalog() {
  console.log('====================================================');
  console.log('🚀 Unstoppable Store - Stripe & Firestore Sync Tool');
  console.log(`   Mode: ${isDryRun ? 'DRY-RUN (Simulated)' : 'LIVE SYNC'}`);
  console.log(`   Force Overwrite: ${isForce ? 'YES' : 'NO'}`);
  console.log('====================================================\n');

  const stripe = await initStripe();
  const db = initFirebase();

  const results = [];

  for (const item of STORE_CATALOG) {
    console.log(`📦 Processing: [${item.id}] "${item.name}" ($${item.price.toFixed(2)})`);

    let stripeProductId = null;
    let stripePriceId = null;

    if (stripe && !isDryRun) {
      try {
        // Search if product already exists in Stripe
        let existingProd = null;
        try {
          const search = await stripe.products.search({
            query: `metadata['productId']:'${item.id}'`
          });
          if (search.data && search.data.length > 0) {
            existingProd = search.data[0];
          }
        } catch (_) {
          // If search fails or not enabled, fallback to list lookup
          const list = await stripe.products.list({ limit: 100 });
          existingProd = list.data.find(p => p.metadata && p.metadata.productId === item.id);
        }

        if (!existingProd || isForce) {
          const productParams = {
            name: item.name,
            description: item.description,
            metadata: {
              productId: item.id,
              sourceSite: item.sourceSite,
              category: item.category,
              type: item.type
            }
          };
          if (item.imageUrl.startsWith('https://')) {
            productParams.images = [item.imageUrl];
          }

          if (existingProd && isForce) {
            const updated = await stripe.products.update(existingProd.id, productParams);
            stripeProductId = updated.id;
            console.log(`   ✓ Updated Stripe Product: ${stripeProductId}`);
          } else {
            const created = await stripe.products.create(productParams);
            stripeProductId = created.id;
            console.log(`   ✓ Created Stripe Product: ${stripeProductId}`);
          }

          // Create Price
          const priceParams = {
            product: stripeProductId,
            unit_amount: Math.round(item.price * 100),
            currency: 'usd',
            metadata: { productId: item.id }
          };
          if (item.type === 'recurring') {
            priceParams.recurring = { interval: item.interval || 'month' };
          }

          const createdPrice = await stripe.prices.create(priceParams);
          stripePriceId = createdPrice.id;
          console.log(`   ✓ Created Stripe Price: ${stripePriceId} (${item.type === 'recurring' ? 'Recurring Monthly' : 'One-Time'})`);
        } else {
          stripeProductId = existingProd.id;
          stripePriceId = existingProd.default_price || null;
          console.log(`   ℹ️  Existing Stripe Product found: ${stripeProductId}`);
        }
      } catch (stripeErr) {
        console.error(`   ❌ Stripe API error for ${item.id}:`, stripeErr.message);
      }
    } else if (isDryRun) {
      stripeProductId = `mock_prod_${item.id}`;
      stripePriceId = `mock_price_${item.id}`;
      console.log(`   [DRY-RUN] Would create Stripe Product & Price (${stripeProductId} / ${stripePriceId})`);
    }

    // Save to Firestore
    if (db && !isDryRun) {
      try {
        const prodRef = db.collection('products').doc(item.id);
        const existingDoc = await prodRef.get();

        const docData = {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          salePrice: item.salePrice,
          description: item.description,
          imageUrl: item.imageUrl,
          extraImages: item.extraImages || [],
          category: item.category,
          sourceSite: item.sourceSite,
          type: item.type,
          active: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (stripeProductId) docData.stripeProductId = stripeProductId;
        if (stripePriceId) docData.stripePriceId = stripePriceId;

        if (!existingDoc.exists) {
          docData.createdAt = admin.firestore.FieldValue.serverTimestamp();
        }

        await prodRef.set(docData, { merge: true });
        console.log(`   ✓ Synced to Firestore collection "products" doc [${item.id}]`);

        // Initialize product_stats if not present
        if (item.type === 'one_time') {
          const statsRef = db.collection('product_stats').doc(item.id);
          const statsDoc = await statsRef.get();
          if (!statsDoc.exists) {
            await statsRef.set({
              id: item.id,
              name: item.name,
              stock: item.stock || 100,
              orderedCount: 0,
              reservedCount: 0,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`   ✓ Initialized "product_stats" doc [${item.id}] with stock ${item.stock || 100}`);
          }
        }
      } catch (dbErr) {
        console.error(`   ❌ Firestore error for ${item.id}:`, dbErr.message);
      }
    } else if (isDryRun) {
      console.log(`   [DRY-RUN] Would write Firestore product & stats for [${item.id}]`);
    }

    results.push({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      sourceSite: item.sourceSite,
      type: item.type,
      stripeProductId,
      stripePriceId
    });
  }

  console.log('\n====================================================');
  console.log(`🎉 Sync Complete! Processed ${results.length} items.`);
  console.log('====================================================\n');
  console.table(results.map(r => ({
    ID: r.id,
    Name: r.name,
    Price: `$${r.price.toFixed(2)}`,
    Category: r.category,
    Site: r.sourceSite,
    Type: r.type,
    StripeProduct: r.stripeProductId || 'N/A',
    StripePrice: r.stripePriceId || 'N/A'
  })));
}

syncCatalog().catch(err => {
  console.error('Fatal sync failure:', err);
  process.exit(1);
});
