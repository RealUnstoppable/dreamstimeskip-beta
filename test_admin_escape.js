function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
console.log("Array payload:");
console.log(`<div>${escapeHTML(["<script>alert(1)</script>"])}</div>`);

function fixedEscapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = str.toString();
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
console.log("Fixed payload:");
console.log(`<div>${fixedEscapeHTML(["<script>alert(1)</script>"])}</div>`);
