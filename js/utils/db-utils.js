import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from '../auth.js';

/**
 * Fetches all documents from a Firestore collection.
 *
 * @param {string} collectionName - The name of the collection to fetch.
 * @param {boolean} [includeId=true] - Whether to include the document ID in the returned objects.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data.
 */
export async function fetchCollectionData(collectionName, includeId = true) {
    // Deprecated: use fetchCollectionData from js/utils.js instead
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return includeId ? { id: doc.id, ...data } : data;
        });
    } catch (error) {
        console.error(`Manager info: [Error fetching collection ${collectionName}]`, error);
        return [];
    }
}
