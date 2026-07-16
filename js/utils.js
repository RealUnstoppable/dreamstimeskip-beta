export function mapCollectionData(querySnapshot, mapWithId = false) {
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(mapWithId ? { id: doc.id, ...doc.data() } : doc.data());
    });
    return data;
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
