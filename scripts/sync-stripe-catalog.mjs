/**
 * Complete Stripe Product & Price Synchronization Script
 * Synchronizes all store products and memberships into Stripe.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

export const STORE_CATALOG = [
  {
    id: 'unstoppable-hoodie',
    name: 'Unstoppable Hoodie',
    price: 59.99,
    originalPrice: 80.99,
    salePrice: 60.74,
    description: 'Heavyweight 400 GSM black fleece hoodie with embroidered brand crest and double-lined hood.',
    imageUrl: 'https://realunstoppable.store/images/UnstoppableHoodieModel300x300.png',
    category: 'apparel',
    sourceSite: 'unstoppable',
    type: 'one_time'
  },
  {
    id: 'dts-model-tee',
    name: 'DTS Model Tee',
    price: 24.99,
    originalPrice: 33.74,
    salePrice: 25.30,
    description: '100% combed ring-spun cotton tee with screenprinted Dreams TimeSkip character graphics.',
    imageUrl: 'https://realunstoppable.store/images/dreams-lobby.jpg',
    category: 'apparel',
    sourceSite: 'dreamstimeskip',
    type: 'one_time'
  },
  {
    id: 'harmonytunes-shirt',
    name: 'HarmonyTunes Cap',
    price: 24.99,
    originalPrice: 33.74,
    salePrice: 25.30,
    description: 'Low-profile 6-panel unstructured black cotton cap with embroidered soundwave emblem and adjustable brass strap.',
    imageUrl: 'https://realunstoppable.store/images/medixly-logo.png',
    category: 'accessories',
    sourceSite: 'harmonytunes',
    type: 'one_time'
  },
  {
    id: 'unstoppable-mousepad',
    name: 'Unstoppable Mousepad',
    price: 19.99,
    originalPrice: 26.99,
    salePrice: 20.24,
    description: 'Micro-weave gaming desk mat with precision anti-fray stitched borders and non-slip rubber backing.',
    imageUrl: 'https://realunstoppable.store/images/MugAllBrands300x300.png',
    category: 'accessories',
    sourceSite: 'unstoppable',
    type: 'one_time'
  },
  {
    id: 'dts-ceramic-mug',
    name: 'Unstoppable Ceramic Mug',
    price: 14.99,
    originalPrice: 20.24,
    salePrice: 15.18,
    description: '11oz matte black ceramic coffee mug with heat-set brand insignia. Dishwasher safe.',
    imageUrl: 'https://realunstoppable.store/images/MugAllBrands300x300.png',
    category: 'accessories',
    sourceSite: 'dreamstimeskip',
    type: 'one_time'
  },
  {
    id: 'harmonytunes-vinyl',
    name: 'HarmonyTunes Vinyl LP',
    price: 34.99,
    originalPrice: 47.24,
    salePrice: 35.43,
    description: "180g heavyweight collector's vinyl pressed on black wax with full-color gatefold artwork.",
    imageUrl: 'https://realunstoppable.store/images/legacy_cover.jpg',
    category: 'music',
    sourceSite: 'harmonytunes',
    type: 'one_time'
  },
  {
    id: 'isabel-larosa-poster',
    name: 'Isabel LaRosa Art Print',
    price: 19.99,
    originalPrice: 26.99,
    salePrice: 20.24,
    description: 'Official 18x24 archival exhibition print on 300 GSM metallic pearl paper.',
    imageUrl: 'https://realunstoppable.store/images/isabel_larosa_cover.jpg',
    category: 'art',
    sourceSite: 'harmonytunes',
    type: 'one_time'
  },
  {
    id: 'un250-heritage-tee',
    name: 'UN 250 Heritage Special Tee',
    price: 29.99,
    originalPrice: 40.49,
    salePrice: 30.36,
    description: 'Heavyweight vintage-wash cotton tee with woven USA flag emblem and distressed hem tag.',
    imageUrl: 'https://realunstoppable.store/images/un250-flag.png',
    category: 'apparel',
    sourceSite: 'unstoppable',
    type: 'one_time'
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
  },
  {
    id: 'medixly-membership-premium',
    name: 'Medixly Premium Membership',
    price: 1.00,
    originalPrice: 9.99,
    salePrice: 1.00,
    capPrice: 6.99,
    description: 'Zero ads, unlimited skips, high-fidelity audio streaming, playlist sharing, and 10% merch store discount.',
    imageUrl: 'https://realunstoppable.store/images/medixly-logo.png',
    category: 'membership',
    sourceSite: 'medixly',
    type: 'recurring',
    interval: 'month'
  },
  {
    id: 'medixly-membership-ultra',
    name: 'Medixly Ultra Membership',
    price: 1.00,
    originalPrice: 19.99,
    salePrice: 1.00,
    capPrice: 12.99,
    description: 'Lossless Hi-Res FLAC audio, 25% merch store discount, unreleased track early-access, and Discord Ultra Producer badge.',
    imageUrl: 'https://realunstoppable.store/images/medixly-logo.png',
    category: 'membership',
    sourceSite: 'medixly',
    type: 'recurring',
    interval: 'month'
  }
];

async function stripeApi(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`
    }
  };
  if (body) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.body = new URLSearchParams(body).toString();
  }
  const res = await fetch(`https://api.stripe.com/v1${endpoint}`, options);
  const data = await res.json();
  if (data.error) {
    throw new Error(`Stripe API Error [${endpoint}]: ${data.error.message}`);
  }
  return data;
}

export async function syncStripeCatalog() {
  console.log("====================================================");
  console.log("🚀 Syncing All Store Products & Pricing to Stripe...");
  console.log("====================================================\n");

  const existingProductsRes = await stripeApi('/products?limit=100');
  const existingProducts = existingProductsRes.data || [];
  console.log(`Found ${existingProducts.length} existing products in Stripe.`);

  const mapping = {};

  for (const item of STORE_CATALOG) {
    console.log(`\n📦 Processing: [${item.id}] "${item.name}" ($${item.price.toFixed(2)})`);

    let existingProduct = existingProducts.find(
      p => (p.metadata && p.metadata.productId === item.id) || p.name.toLowerCase() === item.name.toLowerCase()
    );

    let productId = existingProduct ? existingProduct.id : null;

    if (!existingProduct) {
      console.log(`   Creating new Stripe Product for "${item.name}"...`);
      const productPayload = {
        name: item.name,
        description: item.description,
        'metadata[productId]': item.id,
        'metadata[category]': item.category,
        'metadata[sourceSite]': item.sourceSite,
        'metadata[type]': item.type
      };
      if (item.imageUrl && item.imageUrl.startsWith('https://')) {
        productPayload['images[0]'] = item.imageUrl;
      }

      const createdProd = await stripeApi('/products', 'POST', productPayload);
      productId = createdProd.id;
      console.log(`   ✓ Created Stripe Product: ${productId}`);
    } else {
      console.log(`   ✓ Existing Stripe Product: ${productId}`);
    }

    // Check if price exists for this product
    const pricesRes = await stripeApi(`/prices?product=${productId}&limit=10`);
    const existingPrices = pricesRes.data || [];
    const expectedCents = Math.round(item.price * 100);

    let matchedPrice = existingPrices.find(pr => {
      const amountMatches = pr.unit_amount === expectedCents && pr.currency === 'usd';
      const typeMatches = item.type === 'recurring' ? (pr.recurring && pr.recurring.interval === (item.interval || 'month')) : !pr.recurring;
      return amountMatches && typeMatches;
    });

    let priceId = matchedPrice ? matchedPrice.id : null;

    if (!priceId) {
      console.log(`   Creating new Stripe Price ($${item.price.toFixed(2)} USD)...`);
      const pricePayload = {
        product: productId,
        unit_amount: expectedCents,
        currency: 'usd',
        'metadata[productId]': item.id
      };
      if (item.type === 'recurring') {
        pricePayload['recurring[interval]'] = item.interval || 'month';
      }

      const createdPrice = await stripeApi('/prices', 'POST', pricePayload);
      priceId = createdPrice.id;
      console.log(`   ✓ Created Stripe Price: ${priceId}`);

      // Set as default price on product
      await stripeApi(`/products/${productId}`, 'POST', {
        default_price: priceId
      });
      console.log(`   ✓ Set ${priceId} as default_price on product`);
    } else {
      console.log(`   ✓ Existing Stripe Price: ${priceId}`);
    }

    mapping[item.id] = {
      id: item.id,
      name: item.name,
      price: item.price,
      currency: 'usd',
      type: item.type,
      interval: item.interval || null,
      stripeProductId: productId,
      stripePriceId: priceId,
      imageUrl: item.imageUrl,
      category: item.category,
      sourceSite: item.sourceSite
    };
  }

  console.log("\n====================================================");
  console.log("🎉 All Products & Pricing Successfully Synchronized!");
  console.log("====================================================\n");
  console.table(Object.values(mapping).map(m => ({
    ID: m.id,
    Name: m.name,
    Price: `$${m.price.toFixed(2)}`,
    Type: m.type,
    StripeProduct: m.stripeProductId,
    StripePrice: m.stripePriceId
  })));

  return mapping;
}

if (process.argv[1].endsWith('sync-stripe-catalog.mjs')) {
  syncStripeCatalog()
    .then(mapping => {
      import('fs/promises').then(fs => {
        fs.default.writeFile(
          './scripts/stripe-product-mapping.json',
          JSON.stringify(mapping, null, 2),
          'utf8'
        );
        console.log('Saved mapping to ./scripts/stripe-product-mapping.json');
      });
    })
    .catch(err => {
      console.error('Fatal error during sync:', err);
      process.exit(1);
    });
}
