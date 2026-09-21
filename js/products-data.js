export const products = [
    {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        description: 'Premium black hoodie with the Unstoppable logo. Built for comfort and style.',
        imageUrl: '/images/UnstoppableHoodieModel300x300.png'
    },
    {
        id: 'dts-model-tee',
        name: 'DTS Model Tee',
        price: 24.99,
        description: 'Iconic tee featuring the official Dreams TimeSkip character art.',
        imageUrl: '/images/dreams-lobby.jpg'
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Cap',
        price: 24.99,
        description: 'Dark cap with the HarmonyTunes logo. Perfect for music lovers.',
        imageUrl: '/images/harmony-tunes-card.jpg'
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        description: 'High-performance mousepad for gaming precision and speed.',
        imageUrl: '/images/MugAllBrands300x300.png'
    },
    {
        id: 'dts-ceramic-mug',
        name: 'Unstoppable Ceramic Mug',
        price: 14.99,
        description: 'Matte black ceramic coffee mug featuring all official brand emblems.',
        imageUrl: '/images/MugAllBrands300x300.png'
    },
    {
        id: 'harmonytunes-vinyl',
        name: 'HarmonyTunes Vinyl LP',
        price: 34.99,
        description: 'Limited edition 180g heavyweight vinyl featuring the top viral chart hits.',
        imageUrl: '/images/legacy_cover.jpg'
    },
    {
        id: 'isabel-larosa-poster',
        name: "Isabel LaRosa Art Print",
        price: 19.99,
        description: "Official 18x24 archival metallic print for 'Don't Make Them Like Me'.",
        imageUrl: '/images/isabel_larosa_cover.jpg'
    },
    {
        id: 'un250-heritage-tee',
        name: 'UN 250 Heritage Special Tee',
        price: 29.99,
        description: 'Commemorative 250 celebration tee with woven USA flag emblem.',
        imageUrl: '/images/un250-flag.png'
    }
];

export const productMap = new Map(products.map(p => [p.id, p]));
