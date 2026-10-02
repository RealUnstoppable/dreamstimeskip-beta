// js/products.js

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
        imageUrl: 'images/DreamsTimeSkipModel300x300.jpg'
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Cap',
        price: 24.99,
        description: 'Dark cap with the HarmonyTunes logo. Perfect for music lovers.',
        imageUrl: 'images/HarmonyTunesModel300x300.png'
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        description: 'High-performance mousepad for gaming precision.',
        imageUrl: 'images/unstoppablemousepadmodel2-300x300.jpg'
    }
];

export const productMap = new Map(products.map(p => [p.id, p]));
