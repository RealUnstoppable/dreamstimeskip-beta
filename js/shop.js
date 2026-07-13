// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML } from './utils.js';
import { submitReview, getProductReviews, getAverageRating } from './review-service.js';

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

// Review DOM Elements
const reviewsModal = document.getElementById('reviews-modal');
const closeReviewsBtn = document.getElementById('close-reviews-btn');
const reviewsList = document.getElementById('reviews-list');
const reviewFormContainer = document.getElementById('review-form-container');
const reviewForm = document.getElementById('review-form');
const reviewStatusMessage = document.getElementById('review-status-message');
const submitReviewBtn = document.getElementById('submit-review-btn');
const reviewLoginPrompt = document.getElementById('review-login-prompt');
let currentReviewProductId = null;


// --- RENDER FUNCTIONS ---
function renderProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => {
        const isWishlisted = wishlist.has(product.id);
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating" id="rating-${product.id}">
                        <span class="star-display">★</span> Loading...
                    </div>
                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                    <button class="view-reviews-btn" data-id="${product.id}" style="width: 100%; margin-top: 10px; background: none; border: 1px solid var(--accent-blue); color: var(--accent-blue); padding: 8px; border-radius: 8px; cursor: pointer;">View Reviews</button>
                </div>
            </div>
        `;
    }).join('');

    // Fetch and update ratings asynchronously without blocking UI render
    updateAllProductRatings();
}

async function updateAllProductRatings() {
    for (const product of products) {
        updateProductRatingDisplay(product.id);
    }
}

async function updateProductRatingDisplay(productId) {
    const ratingEl = document.getElementById(`rating-${productId}`);
    if (ratingEl) {
        const ratingInfo = await getAverageRating(productId);
        ratingEl.innerHTML = `<span class="star-display">★</span> ${ratingInfo.average} (${ratingInfo.count} reviews)`;
    }
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
                // Save cart to localStorage for logged-out users
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
            } else if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                const productId = btn.dataset.id;
                toggleWishlist(productId);
            } else if (e.target.classList.contains('view-reviews-btn')) {
                const productId = e.target.dataset.id;
                openReviewsModal(productId);
            }
        });
    }

    // Reviews modal listeners
    if (reviewsModal && closeReviewsBtn) {
        closeReviewsBtn.addEventListener('click', () => reviewsModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === reviewsModal) {
                reviewsModal.style.display = 'none';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

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


// --- REVIEW LOGIC ---
async function openReviewsModal(productId) {
    if (!reviewsModal) return;

    currentReviewProductId = productId;
    const product = productMap.get(productId);
    document.getElementById('reviews-modal-title').textContent = `Reviews for ${product.name}`;

    reviewsModal.style.display = 'block';
    reviewsList.innerHTML = '<div style="text-align: center; padding: 20px;">Loading reviews...</div>';

    if (currentUser) {
        reviewFormContainer.style.display = 'block';
        reviewLoginPrompt.style.display = 'none';
    } else {
        reviewFormContainer.style.display = 'none';
        reviewLoginPrompt.style.display = 'block';
    }

    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="empty-cart-message">No reviews yet. Be the first to review!</p>';
    } else {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <strong>${escapeHTML(review.userEmail.split('@')[0])}</strong>
                    <span class="review-date">${review.createdAtDate}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p class="review-text">${escapeHTML(review.reviewText)}</p>
            </div>
        `).join('');
    }
}

// Make accessible to testing via window
window.openReviewsModal = openReviewsModal;


async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser || !currentReviewProductId) return;

    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('review-text').value;

    if (!ratingInput || !reviewText.trim()) {
        reviewStatusMessage.textContent = 'Please provide both a rating and a review.';
        reviewStatusMessage.style.color = 'red';
        return;
    }

    const rating = parseInt(ratingInput.value, 10);
    submitReviewBtn.disabled = true;
    submitReviewBtn.textContent = 'Submitting...';
    reviewStatusMessage.textContent = '';

    try {
        const result = await submitReview(currentReviewProductId, currentUser.uid, currentUser.email, rating, reviewText.trim());

        if (result.success) {
            reviewStatusMessage.textContent = 'Review submitted successfully!';
            reviewStatusMessage.style.color = 'green';
            reviewForm.reset();
            // Refresh reviews list
            await openReviewsModal(currentReviewProductId);
            // Refresh specific product rating without full re-render
            updateProductRatingDisplay(currentReviewProductId);
        } else {
            reviewStatusMessage.textContent = result.error || 'Failed to submit review.';
            reviewStatusMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Submit review error:', error);
        reviewStatusMessage.textContent = 'An error occurred. Please try again.';
        reviewStatusMessage.style.color = 'red';
    } finally {
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = 'Submit Review';
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
    });