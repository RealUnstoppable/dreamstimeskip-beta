// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// --- PRODUCT DATA (Could be moved to Firestore later) ---
const products = [
    {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        description: 'Premium black hoodie with the Unstoppable logo. Built for comfort and style.',
        imageUrl: 'UnstoppableHoodieModel300x300.png'
    },
    {
        id: 'dts-model-tee',
        name: 'DTS Model Tee',
        price: 24.99,
        description: 'Iconic tee featuring the official Dreams TimeSkip character art.',
        imageUrl: 'DreamsTimeSkipModel300x300.jpg'
    },
    {
        id: 'harmonytunes-shirt',
        name: 'HarmonyTunes Shirt',
        price: 24.99,
        description: 'Vibrant shirt with the HarmonyTunes logo. Perfect for music lovers.',
        imageUrl: 'HarmonyTunesModel300x300.png'
    },
    {
        id: 'unstoppable-mousepad',
        name: 'Unstoppable Mousepad',
        price: 19.99,
        description: 'High-performance mousepad for gaming precision.',
        imageUrl: 'unstoppablemousepadmodel2-300x300.jpg'
    }
];

// --- STATE MANAGEMENT ---
let cart = {}; // { productId: quantity, ... }
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


// --- RENDER FUNCTIONS ---
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = Object.entries(cart).map(([productId, quantity]) => {
            const product = products.find(p => p.id === productId);
            if (!product) return ''; // Should not happen
            return `
                <div class="cart-item">
                    <img src="${product.imageUrl}" alt="${product.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${quantity}" min="1" data-id="${productId}" class="item-quantity-input">
                        <button class="remove-item-btn" data-id="${productId}">&#128465;</button>
                    </div>
                </div>
            `;
        }).join('');
        checkoutBtn.disabled = false;
    }
    updateCartSummary();
}

function updateCartSummary() {
    const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return sum + (product.price * quantity);
    }, 0);

    cartItemCountEl.textContent = itemCount;
    cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- CART LOGIC ---
async function handleAddToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    await saveCart();
    renderCart();
}

async function handleUpdateQuantity(productId, quantity) {
    if (quantity <= 0) {
        await handleRemoveFromCart(productId);
    } else {
        cart[productId] = quantity;
        await saveCart();
        renderCart();
    }
}

async function handleRemoveFromCart(productId) {
    delete cart[productId];
    await saveCart();
    renderCart();
}

// --- FIREBASE INTEGRATION ---
async function saveCart() {
    updateCartSummary(); // Update UI immediately for responsiveness
    if (currentUser) {
        try {
            const userCartRef = doc(db, 'carts', currentUser.uid);
            await setDoc(userCartRef, { items: cart });
        } catch (error) {
            console.error("Error saving cart to Firestore:", error);
        }
    }
}

async function loadCart() {
    if (currentUser) {
        const userCartRef = doc(db, 'carts', currentUser.uid);
        const docSnap = await getDoc(userCartRef);
        if (docSnap.exists()) {
            cart = docSnap.data().items || {};
        } else {
            cart = {};
        }
    } else {
        // For logged-out users, we could use localStorage, but for now we'll just reset.
        cart = {};
    }
    renderCart();
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
    // Product grid listeners
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.id;
            handleAddToCart(productId);
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
        if(!currentUser) {
            alert('Please sign in to proceed to checkout.');
            window.location.href = 'sign in beta.html';
        } else {
             alert('Checkout functionality is not yet implemented. Thank you for testing!');
        }
    });
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        updateUserNav(user);
        await loadCart();
    });
});