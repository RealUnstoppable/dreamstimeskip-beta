import fs from 'fs';
import { execFileSync } from 'child_process';
import { STORE_CATALOG } from './sync-all-products.js';

const fbConfig = JSON.parse(fs.readFileSync(process.env.HOME + "/.config/configstore/firebase-tools.json", "utf8"));
const token = fbConfig.tokens.access_token;

// Read mappings
const liveMapping = JSON.parse(fs.readFileSync('./scripts/stripe-live-mapping.json', 'utf8'));
const testMapping = JSON.parse(fs.readFileSync('./scripts/stripe-product-mapping.json', 'utf8'));

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue;
    if (typeof val === 'string') {
      fields[key] = { stringValue: val };
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        fields[key] = { integerValue: String(val) };
      } else {
        fields[key] = { doubleValue: val };
      }
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map(v => ({ stringValue: String(v) }))
        }
      };
    }
  }
  return fields;
}

function firestoreSet(collection, docId, data) {
  const url = `https://firestore.googleapis.com/v1/projects/dts-hub-website/databases/(default)/documents/${collection}/${docId}`;
  const body = JSON.stringify({ fields: toFirestoreFields(data) });

  const out = execFileSync('curl', [
    '-s',
    '-X', 'PATCH',
    '-H', `Authorization: Bearer ${token}`,
    '-H', 'Content-Type: application/json',
    '-d', body,
    url
  ], { encoding: 'utf8' });

  const res = JSON.parse(out);
  if (res.error) {
    throw new Error(`Firestore Error [${collection}/${docId}]: ${res.error.message}`);
  }
  return res;
}

console.log("====================================================");
console.log("🔥 Syncing Products to Cloud Firestore...");
console.log("====================================================\n");

for (const item of STORE_CATALOG) {
  const live = liveMapping[item.id] || {};
  const test = testMapping[item.id] || {};

  const docData = {
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice || Number((item.price * 1.35).toFixed(2)),
    salePrice: item.salePrice || item.price,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    sourceSite: item.sourceSite,
    type: item.type,
    active: true,
    stripeProductId: live.stripeProductId || test.stripeProductId || null,
    stripePriceId: live.stripePriceId || test.stripePriceId || null,
    stripeLiveProductId: live.stripeProductId || null,
    stripeLivePriceId: live.stripePriceId || null,
    stripeTestProductId: test.stripeProductId || null,
    stripeTestPriceId: test.stripePriceId || null
  };

  firestoreSet('products', item.id, docData);
  console.log(`✓ Synced products/${item.id} -> ${item.name} ($${item.price.toFixed(2)})`);

  if (item.type === 'one_time') {
    firestoreSet('product_stats', item.id, {
      id: item.id,
      name: item.name,
      stock: item.stock || 150,
      orderedCount: 0,
      reservedCount: 0
    });
    console.log(`✓ Initialized product_stats/${item.id}`);
  }
}

console.log("\n🎉 All 12 Products & Stats Synced to Cloud Firestore Successfully!");
