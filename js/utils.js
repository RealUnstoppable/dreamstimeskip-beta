export function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = str.toString();
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Shared utility for fetching a Firebase collection
 * @param {object} getDocs - Firestore getDocs function
 * @param {object} collectionRef - Firestore collection reference
 * @param {boolean} mapWithId - Whether to map document IDs into the objects (default: true)
 */
export async function fetchCollectionData(getDocs, collectionRef, mapWithId = true) {
    try {
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map(d => {
            if (mapWithId) {
                return { id: d.id, ...d.data() };
            }
            return d.data();
        });
    } catch (e) {
        console.error(`Manager info: Error fetching collection ${collectionRef.id}:`, e.message);
        console.error(e);
        return [];
    }
}
