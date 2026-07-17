// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML } from './utils.js';

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
        description: 'High-performance mousepad for gaming precision.',
        imageUrl: '/images/MugAllBrands300x300.png'
    }
];

// ⚡ Bolt: Pre-computed Map for O(1) product lookups, avoiding O(N^2) nested loops when rendering carts
export const productMap = new Map(products.map(p => [p.id, p]));

// --- STATE MANAGEMENT ---
export let cart = {}; // { productId: quantity, ... }
export let wishlist = new Set(); // { productId, ... }
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
async function renderProducts() {
    if (!productGrid) return;

    let statsMap = {};
    try {
        const statsSnap = await getDocs(collection(db, 'product_stats'));
        statsSnap.forEach(doc => {
            statsMap[doc.id] = doc.data();
        });
    } catch (error) {
        console.error("Manager info: Error fetching product stats", error);
    }

    productGrid.innerHTML = products.map(product => {
        const isWishlisted = wishlist.has(product.id);
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';

        const stats = statsMap[product.id];
        const ratingDisplay = stats && stats.reviewCount > 0
            ? `★ ${stats.averageRating.toFixed(1)} (${stats.reviewCount})`
            : 'No reviews';

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating" style="color: #fbbf24; font-size: 0.9em; margin-bottom: 5px;">${ratingDisplay}</div>
                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div style="display: flex; gap: 10px;">
                            <button class="view-reviews-btn" style="background-color: #4b5563; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background-color 0.2s;" data-id="${product.id}">Reviews</button>
                            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCart() {
    if (!cartItemsContainer || !checkoutBtn) return;
    if (Object.keys(cart).length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = Object.entries(cart).map(([productId, quantity]) => {
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
        }
        if (checkoutBtn) checkoutBtn.disabled = false;
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
        console.error('Failed to add to cart - Manager info:', error.message);
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

// --- FIREBASE & LOCALSTORAGE INTEGRATION ---
let saveCartTimeout = null;
let saveWishlistTimeout = null;
let pendingResolves = [];

async function saveWishlist() {
    if (!currentUser) return;

    return new Promise((resolve, reject) => {
        if (saveWishlistTimeout) clearTimeout(saveWishlistTimeout);

        saveWishlistTimeout = setTimeout(async () => {
            try {
                const userWishlistRef = doc(db, 'wishlists', currentUser.uid);
                await setDoc(userWishlistRef, { items: Array.from(wishlist) });
                resolve();
            } catch (error) {
                console.error("Error saving wishlist to Firestore:", error);
                reject(error);
            }
        }, 500);
    });
}

async function saveCart() {
    updateCartSummary(); // Update UI immediately for responsiveness

    // Clear existing timeout if there is one
    // Debounce the Firestore write
    if (saveCartTimeout) {
        clearTimeout(saveCartTimeout);
    }

    // Always update local cache immediately
    if (!currentUser) {
        localStorage.setItem('localCart', JSON.stringify(cart));
    } else {
        // Debounce Firestore writes for authenticated users
        saveCartTimeout = setTimeout(async () => {
    saveCartTimeout = setTimeout(async () => {
        if (currentUser) {
            try {
                const userCartRef = doc(db, 'carts', currentUser.uid);
                await setDoc(userCartRef, { items: cart });
            } catch (error) {
                console.error("Error saving cart to Firestore:", error);
            }
        }, 500); // 500ms debounce
        } else {
            // Save cart to localStorage for logged-out users
            localStorage.setItem('localCart', JSON.stringify(cart));
        }
    }, 500); // Wait 500ms before committing to backend
    if (saveCartTimeout) {
        clearTimeout(saveCartTimeout);
    }

    return new Promise((resolve) => {
        pendingResolves.push(resolve);
        saveCartTimeout = setTimeout(async () => {
            if (currentUser) {
                try {
                    const userCartRef = doc(db, 'carts', currentUser.uid);
                    await setDoc(userCartRef, { items: cart });
                } catch (error) {
                    console.error("Error saving cart to Firestore:", error);
                }
            } else {
                // **MODIFIED**: Save cart to localStorage for logged-out users
                localStorage.setItem('localCart', JSON.stringify(cart));
            }
            // Resolve all promises that were waiting for this debounce cycle
            const resolves = pendingResolves;
            pendingResolves = [];
            resolves.forEach(r => r());
        }, 500); // 500ms debounce
    });
}

// --- AUTHENTICATION & UI UPDATES ---
function updateUserNav(user) {
    if (!navCtaContainer) return;
    if (user) {
        navCtaContainer.innerHTML = `<a href="account.html" class="cta-button nav-cta">My Account</a>`;
    } else {
        navCtaContainer.innerHTML = `<a href="sign in beta.html" class="cta-button nav-cta">Sign In</a>`;
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Product grid listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.dataset.id;
                handleAddToCart(productId);
            }
        });
    }
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.id;
            handleAddToCart(productId);
        } else if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
            const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
            const productId = btn.dataset.id;
            toggleWishlist(productId);
        }
    });

    // Cart modal listeners
    if (cartButton && cartModal && closeCartBtn) {
        cartButton.addEventListener('click', () => cartModal.style.display = 'block');
        closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Cart item action listeners
    if (cartItemsContainer) {
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
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Updated to point to the new checkout.html page
            window.location.href = 'checkout.html';
        });
    }
}


// --- INITIALIZATION ---
renderProducts();
setupEventListeners();

// **MODIFIED**: Reworked auth state change to handle local cart
onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        const localCartData = localStorage.getItem('localCart');
        const localCart = localCartData ? JSON.parse(localCartData) : {};

        if (user) {
            // User is signed in

            // Load Wishlist
            try {
                const userWishlistRef = doc(db, 'wishlists', user.uid);
                const wishlistSnap = await getDoc(userWishlistRef);
                if (wishlistSnap.exists() && wishlistSnap.data().items) {
                    wishlist = new Set(wishlistSnap.data().items);
                } else {
                    wishlist = new Set();
                }
            } catch (error) {
                console.error("Error loading wishlist:", error);
            }

            const userCartRef = doc(db, 'carts', user.uid);
            const docSnap = await getDoc(userCartRef);
            const firestoreCart = docSnap.exists() ? docSnap.data().items : {};

            // Merge local and firestore carts
            const mergedCart = { ...firestoreCart };
            let hasLocalItems = false;
            for (const [productId, quantity] of Object.entries(localCart)) {
                mergedCart[productId] = (mergedCart[productId] || 0) + quantity;
                hasLocalItems = true;
            }
            
            cart = mergedCart;
            // Only trigger backend write if we actually merged local items into it
            if (hasLocalItems) {
                await saveCart();
                localStorage.removeItem('localCart'); // Clear local cart after merging
            }
        } else {
            // User is signed out, load from localStorage
            cart = localCart;
        }

        updateUserNav(user);
        renderCart(); // Render the final cart state
    });// --- REVIEWS LOGIC ---
const reviewsModal = document.getElementById('reviews-modal');
const closeReviewsBtn = document.getElementById('close-reviews-btn');
const reviewsListContainer = document.getElementById('reviews-list-container');
const reviewSubmitForm = document.getElementById('review-submit-form');
const reviewProductIdInput = document.getElementById('review-product-id');
const reviewAuthMessage = document.getElementById('review-auth-message');

async function openReviewsModal(productId) {
    if (!reviewsModal) return;
    reviewProductIdInput.value = productId;
    reviewsListContainer.innerHTML = '<p>Loading reviews...</p>';
    reviewsModal.style.display = 'block';

    if (!currentUser) {
        reviewSubmitForm.querySelector('button[type="submit"]').style.display = 'none';
        reviewAuthMessage.style.display = 'block';
    } else {
        reviewSubmitForm.querySelector('button[type="submit"]').style.display = 'block';
        reviewAuthMessage.style.display = 'none';
    }

    try {
        const q = query(collection(db, 'product_reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            reviewsListContainer.innerHTML = '<p>No reviews yet. Be the first!</p>';
            return;
        }

        reviewsListContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Just now';
            reviewsListContainer.innerHTML += `
                <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong>${escapeHTML(data.authorName || 'Anonymous')}</strong>
                        <span style="color: #fbbf24;">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.9em; color: var(--text-secondary);">${escapeHTML(data.text)}</p>
                    <small style="color: #666;">${date}</small>
                </div>
            `;
        });
    } catch (error) {
        console.error("Manager info: Error loading reviews", error);
        reviewsListContainer.innerHTML = '<p>Error loading reviews.</p>';
    }
}

if (reviewSubmitForm) {
    reviewSubmitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const productId = reviewProductIdInput.value;
        const rating = parseInt(document.getElementById('review-rating').value, 10);
        const text = document.getElementById('review-text').value;
        const submitBtn = reviewSubmitForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            await addDoc(collection(db, 'product_reviews'), {
                productId,
                userId: currentUser.uid,
                authorName: (currentUser.email ? currentUser.email.split("@")[0] : "Anonymous"), // Safe fallback
                rating,
                text,
                createdAt: new Date().toISOString()
            });
            reviewSubmitForm.reset();
            await openReviewsModal(productId); // Reload reviews
            await renderProducts(); // Refresh stats on grid
        } catch (error) {
            console.error("Manager info: Error submitting review", error);
            alert('Error submitting review.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

if (closeReviewsBtn) {
    closeReviewsBtn.addEventListener('click', () => reviewsModal.style.display = 'none');
}
window.addEventListener('click', (e) => {
    if (e.target === reviewsModal) reviewsModal.style.display = 'none';
});

// Add event delegation for the new "Reviews" button
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-reviews-btn')) {
                const productId = e.target.dataset.id;
                openReviewsModal(productId);
            }
        });
    }
});
