/**
 * Stripe Product & Price Configuration
 * Authoritative mapping for all Unstoppable Store products and memberships.
 */

export const STRIPE_PRODUCTS = {
  'unstoppable-hoodie': {
    id: 'unstoppable-hoodie',
    name: 'Unstoppable Hoodie',
    price: 59.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5Udn3Ufpe3de',
      priceId: 'price_1UW1JXBmfNp1AIykVW0NRe5A'
    },
    test: {
      productId: 'prod_VWyc7qE58gyci7',
      priceId: 'price_1UVuf2Bp2C5GdKaKQIFlTxWS'
    }
  },
  'dts-model-tee': {
    id: 'dts-model-tee',
    name: 'DTS Model Tee',
    price: 24.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5UabGi31waB6',
      priceId: 'price_1UW1JaBmfNp1AIykrrtfOtPN'
    },
    test: {
      productId: 'prod_VWycGkQPm5bdbG',
      priceId: 'price_1UVuf8Bp2C5GdKaKbDbKL49h'
    }
  },
  'harmonytunes-shirt': {
    id: 'harmonytunes-shirt',
    name: 'HarmonyTunes Cap',
    price: 24.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5UUMcIccWFEG',
      priceId: 'price_1UW1JdBmfNp1AIykpYOfCE5c'
    },
    test: {
      productId: 'prod_VX5NjszOtgzL4V',
      priceId: 'price_1UW1FABp2C5GdKaKi3LT0P3i'
    }
  },
  'unstoppable-mousepad': {
    id: 'unstoppable-mousepad',
    name: 'Unstoppable Mousepad',
    price: 19.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5UpG4OuPpxmJ',
      priceId: 'price_1UW1JhBmfNp1AIykli2Bt3Mu'
    },
    test: {
      productId: 'prod_VX5Q1EQjrH2uEF',
      priceId: 'price_1UW1FBBp2C5GdKaKAV7XbGGN'
    }
  },
  'dts-ceramic-mug': {
    id: 'dts-ceramic-mug',
    name: 'Unstoppable Ceramic Mug',
    price: 14.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5UEUy1Uuivum',
      priceId: 'price_1UW1JmBmfNp1AIykLOO13VkG'
    },
    test: {
      productId: 'prod_VX5QsCMjdZLOSR',
      priceId: 'price_1UW1FDBp2C5GdKaKAHEQRyHd'
    }
  },
  'harmonytunes-vinyl': {
    id: 'harmonytunes-vinyl',
    name: 'HarmonyTunes Vinyl LP',
    price: 34.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5U3KlZqOa6AC',
      priceId: 'price_1UW1MuBmfNp1AIykS4enpssw'
    },
    test: {
      productId: 'prod_VX5QJHvtJm01Z6',
      priceId: 'price_1UW1FEBp2C5GdKaKuqKUX0Uf'
    }
  },
  'isabel-larosa-poster': {
    id: 'isabel-larosa-poster',
    name: 'Isabel LaRosa Art Print',
    price: 19.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5YviIpa3s1Ky',
      priceId: 'price_1UW1MyBmfNp1AIykaZj4zktC'
    },
    test: {
      productId: 'prod_VX5Q53Ws3Bylu4',
      priceId: 'price_1UW1FGBp2C5GdKaK1VCn8EKP'
    }
  },
  'un250-heritage-tee': {
    id: 'un250-heritage-tee',
    name: 'UN 250 Heritage Special Tee',
    price: 29.99,
    currency: 'usd',
    type: 'one_time',
    live: {
      productId: 'prod_VX5Yl2LvNZYbNu',
      priceId: 'price_1UW1N4BmfNp1AIykMgSpSTev'
    },
    test: {
      productId: 'prod_VX5Q6f7OTInbOq',
      priceId: 'price_1UW1FHBp2C5GdKaK9zrsWTyL'
    }
  },
  'dts-membership-premium': {
    id: 'dts-membership-premium',
    name: 'Dreams TimeSkip Premium Membership',
    price: 10.86,
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    live: {
      productId: 'prod_VX5Y7pMbi8CJQg',
      priceId: 'price_1UW1NBBmfNp1AIyk1eR6xFyQ'
    },
    test: {
      productId: 'prod_VX5R079fxhLHON',
      priceId: 'price_1UW1GaBp2C5GdKaKPXdGnGFq'
    }
  },
  'dts-membership-ultimate': {
    id: 'dts-membership-ultimate',
    name: 'Dreams TimeSkip Ultimate Membership',
    price: 14.13,
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    live: {
      productId: 'prod_VX5Yxl2chZIUj4',
      priceId: 'price_1UW1NEBmfNp1AIyknbvhS9fC'
    },
    test: {
      productId: 'prod_VX5RDbGFccbu2N',
      priceId: 'price_1UW1GcBp2C5GdKaKm5lG0dzc'
    }
  },
  'medixly-membership-premium': {
    id: 'medixly-membership-premium',
    name: 'Medixly Premium Membership',
    price: 1.00,
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    live: {
      productId: 'prod_VX5Yl4KgOUzMRS',
      priceId: 'price_1UW1NIBmfNp1AIykNrX2wMsy'
    },
    test: {
      productId: 'prod_VX5RQvSvb1OhYa',
      priceId: 'price_1UW1GdBp2C5GdKaKk6tNF74b'
    }
  },
  'medixly-membership-ultra': {
    id: 'medixly-membership-ultra',
    name: 'Medixly Ultra Membership',
    price: 1.00,
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    live: {
      productId: 'prod_VX5Y8mTLNnqgSq',
      priceId: 'price_1UW1NNBmfNp1AIyk5zIh9Srz'
    },
    test: {
      productId: 'prod_VX5RZftFvGoLCu',
      priceId: 'price_1UW1GeBp2C5GdKaK0RIeiioY'
    }
  }
};

export function getStripePriceId(productId, isLive = false) {
  const item = STRIPE_PRODUCTS[productId];
  if (!item) return null;
  return isLive ? item.live.priceId : item.test.priceId;
}

export function getStripeProductId(productId, isLive = false) {
  const item = STRIPE_PRODUCTS[productId];
  if (!item) return null;
  return isLive ? item.live.productId : item.test.productId;
}
