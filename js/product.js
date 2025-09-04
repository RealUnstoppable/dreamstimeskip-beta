// js/product.js
import { products, addToCart } from './shop.js';
import { db } from './auth.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = '/shop.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = '/shop.html';
        return;
    }

    const productDetailsContainer = document.getElementById('product-details-container');

    // New Feature: Fetch "items ordered" count from a (mocked) database collection
    let itemsOrdered = Math.floor(Math.random() * 500) + 50; // Mock data
    try {
        const productStatsRef = doc(db, "product_stats", productId);
        const docSnap = await getDoc(productStatsRef);
        if (docSnap.exists()) {
            itemsOrdered = docSnap.data().orderedCount || itemsOrdered;
        }
    } catch (e) {
        console.error("Could not fetch product stats, using mock data.", e);
    }


    productDetailsContainer.innerHTML = `
        <div class="product-image-container">
            <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info-container">
            <h1>${product.name}</h1>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <p class="items-ordered">${itemsOrdered} sold recently!</p>
            
            <form id="add-to-cart-form" class="add-to-cart-form">
                <input type="number" value="1" min="1" id="quantity-input">
                <button type="submit" class="cta-button">Add to Cart</button>
            </form>
        </div>
        <div class="product-reviews-container">
            <h2>Customer Reviews</h2>
            <div class="review">
                <p class="review-author">Alex R.</p>
                <div class="review-rating">★★★★☆</div>
                <p class="review-text">Great quality hoodie! Very comfortable and the logo looks amazing. Sizing is just right.</p>
            </div>
            <div class="review">
                <p class="review-author">Jessica P.</p>
                <div class="review-rating">★★★★★</div>
                <p class="review-text">Absolutely love this t-shirt. The design is fantastic and the material is soft. Became my new favorite shirt immediately.</p>
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const quantity = parseInt(document.getElementById('quantity-input').value, 10);
        addToCart(productId, quantity);
        alert(`${quantity} x ${product.name} added to your cart!`);
    });
});