export const products = [
    {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        originalPrice: 80.99,
        salePrice: 60.74,
        description: 'Premium black hoodie with the Unstoppable logo. Built for comfort and style.',
        imageUrl: '/images/UnstoppableHoodieModel300x300.png',
        extraImages: [
            '/images/UnstoppableHoodieModel300x300.png',
            '/images/unstoppable-logo.png',
            '/images/Unstoppable Collection Logo.png'
        ]
    },
    {
        id: 'dts-model-tee',
        name: 'DTS Model Tee',
        price: 24.99,
        originalPrice: 33.74,
        salePrice: 25.30,
        description: 'Iconic tee featuring the official Dreams TimeSkip character art.',
        imageUrl: '/images/dreams-lobby.jpg',
        extraImages: [
            '/images/dreams-lobby.jpg',
            '/images/dreams-timeskip.png',
            '/images/dreams-12-days-to-release.png'
        ]
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Cap',
        price: 24.99,
        originalPrice: 33.74,
        salePrice: 25.30,
        description: 'Dark cap with the HarmonyTunes logo. Perfect for music lovers.',
        imageUrl: '/images/medixly-logo.png',
        extraImages: [
            '/images/medixly-logo.png',
            '/images/harmony-tunes-card.jpg'
        ]
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        originalPrice: 26.99,
        salePrice: 20.24,
        description: 'High-performance mousepad for gaming precision and speed.',
        imageUrl: '/images/MugAllBrands300x300.png',
        extraImages: [
            '/images/MugAllBrands300x300.png',
            '/images/un-logo.png',
            '/images/unstoppable-logo.png'
        ]
    },
    {
        id: 'dts-ceramic-mug',
        name: 'Unstoppable Ceramic Mug',
        price: 14.99,
        originalPrice: 20.24,
        salePrice: 15.18,
        description: 'Matte black ceramic coffee mug featuring all official brand emblems.',
        imageUrl: '/images/MugAllBrands300x300.png',
        extraImages: [
            '/images/MugAllBrands300x300.png',
            '/images/un-logo-1.png',
            '/images/Unstoppable Collection Logo.png'
        ]
    },
    {
        id: 'harmonytunes-vinyl',
        name: 'HarmonyTunes Vinyl LP',
        price: 34.99,
        originalPrice: 47.24,
        salePrice: 35.43,
        description: 'Limited edition 180g heavyweight vinyl featuring the top viral chart hits.',
        imageUrl: '/images/legacy_cover.jpg',
        extraImages: [
            '/images/legacy_cover.jpg',
            '/images/astrophage_cover.jpg',
            '/images/blow_cover.jpg'
        ]
    },
    {
        id: 'isabel-larosa-poster',
        name: "Isabel LaRosa Art Print",
        price: 19.99,
        originalPrice: 26.99,
        salePrice: 20.24,
        description: "Official 18x24 archival metallic print for 'Don't Make Them Like Me'.",
        imageUrl: '/images/isabel_larosa_cover.jpg',
        extraImages: [
            '/images/isabel_larosa_cover.jpg',
            '/images/summer_bummer_rhy_rhy.jpg'
        ]
    },
    {
        id: 'un250-heritage-tee',
        name: 'UN 250 Heritage Special Tee',
        price: 29.99,
        originalPrice: 40.49,
        salePrice: 30.36,
        description: 'Commemorative 250 celebration tee with woven USA flag emblem.',
        imageUrl: '/images/un250-flag.png',
        extraImages: [
            '/images/un250-flag.png',
            '/images/unstoppable-logo.png',
            '/images/un-logo.png'
        ]
    }
];

export function getProductPricing(product) {
    if (!product) return { originalPrice: 0, salePrice: 0, discountPercent: 25 };
    const originalPrice = product.originalPrice ?? Number((product.price * 1.35).toFixed(2));
    const salePrice = product.salePrice ?? Number((originalPrice * 0.75).toFixed(2));
    return { originalPrice, salePrice, discountPercent: 25 };
}

export const productMap = new Map(products.map(p => [p.id, p]));

