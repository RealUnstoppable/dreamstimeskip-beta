export const products = [
    {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        originalPrice: 80.99,
        salePrice: 60.74,
        description: 'Heavyweight 400 GSM black fleece hoodie with embroidered brand crest and double-lined hood.',
        imageUrl: '/images/UnstoppableHoodieModel300x300.png',
        extraImages: [
            '/images/UnstoppableHoodieModel300x300.png',
            '/images/unstoppable-logo.png',
            '/images/Unstoppable Collection Logo.png'
        ],
        category: 'apparel',
        sourceSite: 'unstoppable',
        active: true
    },
    {
        id: 'dts-model-tee',
        name: 'DTS Model Tee',
        price: 24.99,
        originalPrice: 33.74,
        salePrice: 25.30,
        description: '100% combed ring-spun cotton tee with screenprinted Dreams TimeSkip character graphics.',
        imageUrl: '/images/dreams-lobby.jpg',
        extraImages: [
            '/images/dreams-lobby.jpg',
            '/images/dreams-timeskip.png',
            '/images/dreams-12-days-to-release.png'
        ],
        category: 'apparel',
        sourceSite: 'dreamstimeskip',
        active: true
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Cap',
        price: 24.99,
        originalPrice: 33.74,
        salePrice: 25.30,
        description: 'Low-profile 6-panel unstructured black cotton cap with embroidered soundwave emblem and adjustable brass strap.',
        imageUrl: '/images/medixly-logo.png',
        extraImages: [
            '/images/medixly-logo.png',
            '/images/harmony-tunes-card.jpg'
        ],
        category: 'accessories',
        sourceSite: 'harmonytunes',
        active: true
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        originalPrice: 26.99,
        salePrice: 20.24,
        description: 'Micro-weave gaming desk mat with precision anti-fray stitched borders and non-slip rubber backing.',
        imageUrl: '/images/MugAllBrands300x300.png',
        extraImages: [
            '/images/MugAllBrands300x300.png',
            '/images/un-logo.png',
            '/images/unstoppable-logo.png'
        ],
        category: 'accessories',
        sourceSite: 'unstoppable',
        active: true
    },
    {
        id: 'dts-ceramic-mug',
        name: 'Unstoppable Ceramic Mug',
        price: 14.99,
        originalPrice: 20.24,
        salePrice: 15.18,
        description: '11oz matte black ceramic coffee mug with heat-set brand insignia. Dishwasher safe.',
        imageUrl: '/images/MugAllBrands300x300.png',
        extraImages: [
            '/images/MugAllBrands300x300.png',
            '/images/un-logo-1.png',
            '/images/Unstoppable Collection Logo.png'
        ],
        category: 'accessories',
        sourceSite: 'dreamstimeskip',
        active: true
    },
    {
        id: 'harmonytunes-vinyl',
        name: 'HarmonyTunes Vinyl LP',
        price: 34.99,
        originalPrice: 47.24,
        salePrice: 35.43,
        description: "180g heavyweight collector's vinyl pressed on black wax with full-color gatefold artwork.",
        imageUrl: '/images/legacy_cover.jpg',
        extraImages: [
            '/images/legacy_cover.jpg',
            '/images/astrophage_cover.jpg',
            '/images/blow_cover.jpg'
        ],
        category: 'music',
        sourceSite: 'harmonytunes',
        active: true
    },
    {
        id: 'isabel-larosa-poster',
        name: "Isabel LaRosa Art Print",
        price: 19.99,
        originalPrice: 26.99,
        salePrice: 20.24,
        description: "Official 18x24 archival exhibition print on 300 GSM metallic pearl paper.",
        imageUrl: '/images/isabel_larosa_cover.jpg',
        extraImages: [
            '/images/isabel_larosa_cover.jpg',
            '/images/summer_bummer_rhy_rhy.jpg'
        ],
        category: 'art',
        sourceSite: 'harmonytunes',
        active: true
    },
    {
        id: 'un250-heritage-tee',
        name: 'UN 250 Heritage Special Tee',
        price: 29.99,
        originalPrice: 40.49,
        salePrice: 30.36,
        description: 'Heavyweight vintage-wash cotton tee with woven USA flag emblem and distressed hem tag.',
        imageUrl: '/images/un250-flag.png',
        extraImages: [
            '/images/un250-flag.png',
            '/images/unstoppable-logo.png',
            '/images/un-logo.png'
        ],
        category: 'apparel',
        sourceSite: 'unstoppable',
        active: true
    }
];

export function getProductPricing(product) {
    if (!product) return { originalPrice: 0, salePrice: 0, discountPercent: 25 };
    const originalPrice = product.originalPrice ?? Number((product.price * 1.35).toFixed(2));
    const salePrice = product.salePrice ?? Number((originalPrice * 0.75).toFixed(2));
    return { originalPrice, salePrice, discountPercent: 25 };
}

export const productMap = new Map(products.map(p => [p.id, p]));

/**
 * Dynamically register or update a product from Firestore into the global catalog
 */
export function registerDynamicProduct(product) {
    if (!product || !product.id) return null;
    const price = Number(product.price) || 0;
    const origPrice = product.originalPrice != null ? Number(product.originalPrice) : Number((price * 1.35).toFixed(2));
    const sPrice = product.salePrice != null ? Number(product.salePrice) : Number(price);

    const normalized = {
        ...product,
        id: String(product.id),
        name: product.name || 'Product',
        price: price,
        originalPrice: origPrice,
        salePrice: sPrice,
        description: product.description || '',
        imageUrl: product.imageUrl || product.image || '/images/UnstoppableHoodieModel300x300.png',
        extraImages: Array.isArray(product.extraImages) ? product.extraImages : (product.imageUrl ? [product.imageUrl] : []),
        category: product.category || 'general',
        sourceSite: product.sourceSite || 'unstoppable',
        active: product.active !== false
    };

    productMap.set(normalized.id, normalized);
    const existingIndex = products.findIndex(p => p.id === normalized.id);
    if (existingIndex >= 0) {
        products[existingIndex] = { ...products[existingIndex], ...normalized };
    } else {
        products.push(normalized);
    }
    return normalized;
}

/**
 * Bulk registers dynamic products from Firestore into catalog
 */
export function setDynamicProducts(newProducts) {
    if (!Array.isArray(newProducts) || newProducts.length === 0) return;
    newProducts.forEach(p => registerDynamicProduct(p));
}

