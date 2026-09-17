import { db } from './auth.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy, getAggregateFromServer, average, count } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const REVIEWS_COLLECTION = 'product_reviews';

/**
 * Submits a new review for a product.
 * @param {string} productId - The ID of the product.
 * @param {string} userId - The ID of the user submitting the review.
 * @param {string} userEmail - The email of the user submitting the review.
 * @param {number} rating - The rating value between 1 and 5.
 * @param {string} reviewText - The review description.
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export async function submitReview(productId, userId, userEmail, rating, reviewText) {
    if (!productId || !userId || !userEmail) {
        return { success: false, error: 'Missing user or product details.' };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5.' };
    }

    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            productId,
            userId,
            userEmail,
            rating,
            reviewText,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches all reviews for a specific product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Array>}
 */
export async function getProductReviews(productId) {
    if (!productId) return [];

    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Optional: format the timestamp to date string
            createdAtDate: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleDateString() : 'Just now'
        }));
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        return [];
    }
}

/**
 * Calculates the average rating and count for a product based on its reviews using an aggregation query.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<{average: number, count: number}>}
 */
export async function getAverageRating(productId) {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('productId', '==', productId)
        );
        const snapshot = await getAggregateFromServer(q, {
            averageRating: average('rating'),
            totalReviews: count()
        });

        const data = snapshot.data();
        return {
            average: data.averageRating ? parseFloat(data.averageRating.toFixed(1)) : 0,
            count: data.totalReviews || 0
        };
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return { average: 0, count: 0 };
    }
}