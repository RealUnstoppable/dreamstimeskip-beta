// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';

// --- PRODUCT DATA (Could be moved to Firestore later) ---
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

// ⚡ Bolt: Pre-computed Map for O(1) product lookups, avoiding O(N^2) nested loops when rendering carts
export const productMap = new Map(products.map(p => [p.id, p]));

// --- STATE MANAGEMENT ---
export let cart = {}; // { productId: quantity, ... }
export let wishlist = []; // array of productIds
let currentUser = null;

// --- DOM ELEMENTS ---
const productGrid = document.getElementById('product-grid');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartItemCountEl = document.getElementById('cart-item-count');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const navCtaContainer = document.getElementById('nav-cta-container');
const hamburger = document.querySelector('.hamburger'); // <-- ADDED for mobile nav
const navLinks = document.querySelector('.nav-links');   // <-- ADDED for mobile nav


// --- RENDER FUNCTIONS ---
export function renderProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => {
        const isWishlisted = wishlist.includes(product.id);
        const heartIcon = isWishlisted ? '&#9829;' : '&#9825;';
        const activeClass = isWishlisted ? 'active' : '';

        return `
        <div class="product-card">
            <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle wishlist">${heartIcon}</button>
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderCart() {
    if (Object.keys(cart).length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (checkoutBtn) checkoutBtn.title = "Your cart is empty";
    } else {
        if (cartItemsContainer) cartItemsContainer.innerHTML = Object.entries(cart).map(([productId, quantity]) => {
            // ⚡ Bolt: O(1) lookup replaces O(N) products.find()
            const product = productMap.get(productId);
            if (!product) return ''; // Should not happen
            return `
                <div class="cart-item">
                    <img src="${product.imageUrl}" alt="${product.name}" class="cart-item-img" loading="lazy">
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${quantity}" min="1" data-id="${productId}" class="item-quantity-input">
                        <button class="remove-item-btn" data-id="${productId}" aria-label="Remove item">&#128465;</button>
                    </div>
                </div>
            `;
        }).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
        if (checkoutBtn) checkoutBtn.title = "";
    }
    updateCartSummary();
}

function updateCartSummary() {
    const { itemCount, totalPrice } = calculateCartSummary(cart, products);

    if (cartItemCountEl) cartItemCountEl.textContent = itemCount;
    if (cartTotalPriceEl) cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- CART LOGIC ---
export async function handleAddToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    try {
        await saveCart();
        renderCart();
    } catch (error) {
        console.error('Failed to add to cart:', error);
    }
}

export async function handleUpdateQuantity(productId, quantity) {
    if (quantity <= 0) {
        await handleRemoveFromCart(productId);
    } else {
        cart[productId] = parseInt(quantity, 10);
        await saveCart();
        renderCart();
    }
}

async function handleRemoveFromCart(productId) {
    delete cart[productId];
    await saveCart();
    renderCart();
}

export async function toggleWishlist(productId) {
    if (!currentUser) {
        alert("Please sign in to add items to your wishlist.");
        window.location.href = "sign in beta.html";
        return;
    }

    const isWishlisted = wishlist.includes(productId);
    const userRef = doc(db, 'users', currentUser.uid);

    try {
        if (isWishlisted) {
            await updateDoc(userRef, { wishlist: arrayRemove(productId) });
            wishlist = wishlist.filter(id => id !== productId);
        } else {
            await updateDoc(userRef, { wishlist: arrayUnion(productId) });
            wishlist.push(productId);
        }
        renderProducts(); // Re-render to update heart icons
    } catch (error) {
        console.error("Error updating wishlist:", error);
        alert("Failed to update wishlist. Please try again.");
    }
}

// --- FIREBASE & LOCALSTORAGE INTEGRATION ---
async function saveCart() {
    if (currentUser) {
        try {
            const userCartRef = doc(db, 'carts', currentUser.uid);
            await setDoc(userCartRef, { items: cart });
        } catch (error) {
            console.error("Error saving cart to Firestore in saveCart:", error);
        }
    } else {
        // **MODIFIED**: Save cart to localStorage for logged-out users
        localStorage.setItem('localCart', JSON.stringify(cart));
    }
}

// --- AUTHENTICATION & UI UPDATES ---
function updateUserNav(user) {
    if (user) {
        navCtaContainer.innerHTML = `<a href="account.html" class="cta-button nav-cta">My Account</a>`;
    } else {
        navCtaContainer.innerHTML = `<a href="sign in beta.html" class="cta-button nav-cta">Sign In</a>`;
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // **ADDED**: Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Product grid listeners
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.id;
            handleAddToCart(productId);
        }
        if (e.target.classList.contains('wishlist-btn')) {
            const productId = e.target.dataset.id;
            toggleWishlist(productId);
        }
    });

    // Cart modal listeners
    cartButton.addEventListener('click', () => cartModal.style.display = 'block');
    closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Cart item action listeners
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const productId = e.target.dataset.id;
            handleRemoveFromCart(productId);
        }
    });
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-quantity-input')) {
            const productId = e.target.dataset.id;
            const quantity = parseInt(e.target.value, 10);
            handleUpdateQuantity(productId, quantity);
        }
    });
    
    checkoutBtn.addEventListener('click', () => {
        // Updated to point to the new checkout.html page
        window.location.href = 'checkout.html';
    });
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();

    // **MODIFIED**: Reworked auth state change to handle local cart
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        const localCartData = localStorage.getItem('localCart');
        const localCart = localCartData ? JSON.parse(localCartData) : {};

        if (user) {
            // User is signed in

            // Fetch wishlist
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                wishlist = userData.wishlist || [];
                renderProducts(); // Re-render once we have wishlist state
            }

            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};

            // Merge local and firestore carts
            const mergedCart = { ...firestoreCart };
            for (const [productId, quantity] of Object.entries(localCart)) {
                mergedCart[productId] = (mergedCart[productId] || 0) + quantity;
            }
            
            cart = mergedCart;
            await saveCart(); // Save merged cart to Firestore
            localStorage.removeItem('localCart'); // Clear local cart after merging
        } else {
            // User is signed out, load from localStorage
            cart = localCart;
            wishlist = [];
            renderProducts();
        }

        updateUserNav(user);
        renderCart(); // Render the final cart state
    });
});