export async function fetchCollectionData(db, getDocs, collection, collectionName, isMapWithId = true) {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map(d => isMapWithId ? { id: d.id, ...d.data() } : d.data());
    } catch (error) {
        console.error(`Error fetching ${collectionName} - Manager info:`, error.message);
        return [];
    }
}

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

export function mapCollectionData(querySnapshot, isMapWithId = true) {
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return isMapWithId ? { id: doc.id, ...data } : data;
    });
}

export function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
