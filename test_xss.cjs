function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = str.toString();
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let payload = [{toString: () => "<script>alert(1)</script>"}];
console.log("Output:", escapeHTML(payload));

payload = ["<script>alert(1)</script>"];
console.log("Output2:", escapeHTML(payload));
