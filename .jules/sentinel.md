## 2025-02-14 - Fix Path Traversal in server.js HTML Serving
**Vulnerability:** Path traversal vulnerability in HTML file serving logic due to improper URL decoding and path resolution.
**Learning:** `path.normalize(reqPath)` is insufficient to prevent path traversal because it does not handle URL-encoded sequences (e.g., `%2e%2e%2f` for `../`) effectively in Express `req.path`. Furthermore, regex replacements are error-prone.
**Prevention:** Always use `decodeURIComponent(req.path)`, check for null bytes, resolve paths using `path.resolve()` with a stripped leading slash (or relative path), and strictly verify directory boundaries using `filePath.startsWith(__dirname + path.sep)`.
