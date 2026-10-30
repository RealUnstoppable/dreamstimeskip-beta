import { execFileSync } from 'child_process';
import { STORE_CATALOG } from './sync-all-products.js';

function stripeCli(args) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      attempts++;
      return execFileSync('/opt/homebrew/bin/stripe', args, { encoding: 'utf8' });
    } catch (e) {
      if (attempts >= 3) throw e;
      console.log(`Retry ${attempts} after notice: ${e.message.split('\n')[0]}`);
    }
  }
}

console.log("Checking live products in Stripe via CLI...");
const liveProdsRaw = stripeCli(['products', 'list', '--live', '--limit', '100']);
const liveProds = JSON.parse(liveProdsRaw).data || [];
console.log(`Found ${liveProds.length} existing live products.`);

const liveMapping = {};

for (const item of STORE_CATALOG) {
  let existing = liveProds.find(
    p => (p.metadata && p.metadata.productId === item.id) || p.name.toLowerCase() === item.name.toLowerCase()
  );

  let productId = existing ? existing.id : null;
  if (!existing) {
    console.log(`Creating live product for "${item.name}"...`);
    const createArgs = [
      'products', 'create', '--live',
      '--name', item.name,
      '--description', item.description,
      '-d', `metadata[productId]=${item.id}`,
      '-d', `metadata[sourceSite]=${item.sourceSite}`,
      '-d', `metadata[category]=${item.category}`,
      '-d', `metadata[type]=${item.type}`
    ];
    if (item.imageUrl && item.imageUrl.startsWith('https://')) {
      createArgs.push('-d', `images[]=${item.imageUrl}`);
    }
    const res = JSON.parse(stripeCli(createArgs));
    productId = res.id;
    console.log(`✓ Created Live Product: ${productId}`);
  } else {
    console.log(`✓ Existing Live Product: ${productId}`);
  }

  // Check prices
  const pricesRaw = stripeCli(['prices', 'list', '--live', '--product', productId, '--limit', '10']);
  const prices = JSON.parse(pricesRaw).data || [];
  const expectedCents = Math.round(item.price * 100);

  let matchedPrice = prices.find(pr => {
    const matchAmt = pr.unit_amount === expectedCents && pr.currency === 'usd';
    const matchType = item.type === 'recurring' ? (pr.recurring && pr.recurring.interval === (item.interval || 'month')) : !pr.recurring;
    return matchAmt && matchType;
  });

  let priceId = matchedPrice ? matchedPrice.id : null;
  if (!matchedPrice) {
    console.log(`Creating live price for "${item.name}" ($${item.price.toFixed(2)} USD)...`);
    const priceArgs = [
      'prices', 'create', '--live',
      '--product', productId,
      '--unit-amount', String(expectedCents),
      '--currency', 'usd',
      '-d', `metadata[productId]=${item.id}`
    ];
    if (item.type === 'recurring') {
      priceArgs.push('-d', `recurring[interval]=${item.interval || 'month'}`);
    }
    const res = JSON.parse(stripeCli(priceArgs));
    priceId = res.id;
    console.log(`✓ Created Live Price: ${priceId}`);

    // Set default price
    stripeCli(['products', 'update', productId, '--live', '-d', `default_price=${priceId}`]);
  } else {
    console.log(`✓ Existing Live Price: ${priceId}`);
  }

  liveMapping[item.id] = {
    id: item.id,
    name: item.name,
    price: item.price,
    stripeProductId: productId,
    stripePriceId: priceId
  };
}

console.log("\nLive sync complete!");
console.table(Object.values(liveMapping));
import('fs').then(fs => {
  fs.writeFileSync('./scripts/stripe-live-mapping.json', JSON.stringify(liveMapping, null, 2), 'utf8');
  console.log('Saved live mapping to ./scripts/stripe-live-mapping.json');
});
