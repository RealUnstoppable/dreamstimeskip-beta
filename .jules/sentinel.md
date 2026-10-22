## 2024-05-24 - [Fix Path Traversal in File Serving]
**Vulnerability:** Path Traversal
**Learning:** `req.path` is URL-encoded by express but `path.normalize` combined with simple string replacement doesn't handle all encodings (e.g. `%2f`). This allowed attackers to access files outside the intended directory via encoded payloads like `%2e%2e%2f`.
**Prevention:** Explicitly decode the URI component using `decodeURIComponent`, check for null bytes (`\0`), use `path.resolve` after modifying the path to start with `.`, and strictly verify that the resolved file path is within the intended base directory using `startsWith(__dirname + path.sep)`.
