// shop.js
import { auth, db } from './auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateCartSummary } from './cart-utils.js';
import { escapeHTML } from './utils.js';
import { addReview, getReviews, getProductAverageRating } from './review-service.js';

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

// Review Modal Elements
const detailsModal = document.getElementById('product-details-modal');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailsModalTitle = document.getElementById('details-modal-title');
const detailsModalImg = document.getElementById('details-modal-img');
const detailsModalName = document.getElementById('details-modal-name');
const detailsModalPrice = document.getElementById('details-modal-price');
const detailsModalDesc = document.getElementById('details-modal-desc');
const reviewsList = document.getElementById('reviews-list');
const reviewFormWrapper = document.getElementById('review-form-wrapper');
const reviewForm = document.getElementById('review-form');
const reviewLoginPrompt = document.getElementById('review-login-prompt');
const reviewProductIdInput = document.getElementById('review-product-id');
const reviewCommentInput = document.getElementById('review-comment');
const submitReviewBtn = document.getElementById('submit-review-btn');

// --- RENDER FUNCTIONS ---
async function renderProducts() {
    if (!productGrid) return;

    // Create an array of promises to fetch ratings concurrently
    const productPromises = products.map(async (product) => {
        const isWishlisted = wishlist.has(product.id);
        const heartIcon = isWishlisted ? '❤️' : '🤍';
        const activeClass = isWishlisted ? 'active' : '';

        // Fetch rating
        let ratingHtml = '';
        try {
            const { average, count } = await getProductAverageRating(product.id);
            if (count > 0) {
                ratingHtml = `
                    <div class="product-rating-summary" data-id="${product.id}" aria-label="View Reviews">
                        <span class="star-rating">★</span>
                        <span>${average} (${count} reviews)</span>
                    </div>
                `;
            } else {
                 ratingHtml = `
                    <div class="product-rating-summary" data-id="${product.id}" aria-label="Write a Review">
                        <span style="color: var(--text-secondary); font-size: 0.8rem;">No reviews yet</span>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Failed to load rating for", product.id, e);
        }

        return `
            <div class="product-card">
                <button class="wishlist-btn ${activeClass}" data-id="${product.id}" aria-label="Toggle Wishlist">
                    ${heartIcon}
                </button>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image" data-id="${product.id}" loading="lazy" style="cursor: pointer;">
                <div class="product-info">
                    <h3 class="product-title" data-id="${product.id}" style="cursor: pointer; margin-bottom: 0;">${product.name}</h3>
                    ${ratingHtml}
                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });

    const renderedProducts = await Promise.all(productPromises);
    productGrid.innerHTML = renderedProducts.join('');
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

// --- REVIEWS LOGIC ---
async function openProductDetails(productId) {
    const product = productMap.get(productId);
    if (!product) return;

    // Populate Modal Info
    if (detailsModalTitle) detailsModalTitle.textContent = product.name;
    if (detailsModalName) detailsModalName.textContent = product.name;
    if (detailsModalPrice) detailsModalPrice.textContent = `$${product.price.toFixed(2)}`;
    if (detailsModalDesc) detailsModalDesc.textContent = product.description;
    if (detailsModalImg) {
        detailsModalImg.src = product.imageUrl;
        detailsModalImg.alt = product.name;
    }
    if (reviewProductIdInput) reviewProductIdInput.value = productId;

    // Load Reviews
    if (reviewsList) {
        reviewsList.innerHTML = '<p style="color: var(--text-secondary);">Loading reviews...</p>';
        try {
            const reviews = await getReviews(productId);
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p style="color: var(--text-secondary);">No reviews yet. Be the first!</p>';
            } else {
                reviewsList.innerHTML = reviews.map(review => {
                    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                    const dateStr = review.createdAt instanceof Date ? review.createdAt.toLocaleDateString() : 'Just now';
                    return `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-author">${escapeHTML(review.username)}</span>
                                <span class="review-date">${dateStr}</span>
                            </div>
                            <div class="star-rating" style="margin-bottom: 0.5rem;">${stars}</div>
                            <p class="review-comment">${escapeHTML(review.comment)}</p>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            reviewsList.innerHTML = '<p style="color: var(--accent-red);">Failed to load reviews.</p>';
        }
    }

    // Toggle Form Visibility based on Auth
    if (currentUser) {
        if (reviewFormWrapper) reviewFormWrapper.style.display = 'block';
        if (reviewLoginPrompt) reviewLoginPrompt.style.display = 'none';
    } else {
        if (reviewFormWrapper) reviewFormWrapper.style.display = 'none';
        if (reviewLoginPrompt) reviewLoginPrompt.style.display = 'block';
    }

    // Show Modal
    if (detailsModal) detailsModal.style.display = 'flex'; // Use flex for centering overlay
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Product grid listeners
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-to-cart-btn');
            const wishlistBtn = e.target.closest('.wishlist-btn');
            const productClickable = e.target.closest('.product-image') || e.target.closest('.product-title') || e.target.closest('.product-rating-summary');

            if (addBtn) {
                const productId = addBtn.dataset.id;
                handleAddToCart(productId);
            } else if (wishlistBtn) {
                const productId = wishlistBtn.dataset.id;
                if (typeof toggleWishlist === 'function') toggleWishlist(productId);
            } else if (productClickable) {
                const productId = productClickable.dataset.id;
                if (productId) {
                    openProductDetails(productId);
                }
            }
        });
    }

    // Reviews Modal Listeners
    if (closeDetailsBtn && detailsModal) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsModal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!submitReviewBtn) return;

            const originalText = submitReviewBtn.textContent;
            submitReviewBtn.disabled = true;
            submitReviewBtn.textContent = 'Submitting...';

            const productId = reviewProductIdInput.value;
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const comment = reviewCommentInput.value;

            if (!ratingInput) {
                alert("Please select a rating.");
                submitReviewBtn.disabled = false;
                submitReviewBtn.textContent = originalText;
                return;
            }

            const rating = parseInt(ratingInput.value, 10);

            try {
                await addReview(productId, rating, comment);
                reviewForm.reset();
                await openProductDetails(productId); // Reload reviews

                // Re-render product grid to update average star rating
                renderProducts();
            } catch (error) {
                alert(`Error submitting review: ${error.message}`);
            } finally {
                submitReviewBtn.disabled = false;
                submitReviewBtn.textContent = originalText;
            }
        });
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