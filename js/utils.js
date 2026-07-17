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

export function mapCollectionData(querySnapshot) {
    const items = [];
    querySnapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
    });
    return items;
}
