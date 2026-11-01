## 2023-11-23 - Path Traversal Vulnerability in Express Route
**Vulnerability:** Express custom routing using `req.path` and `path.normalize` without decoding or boundary checking allows path traversal vulnerabilities.
**Learning:** `req.path` in Express does not automatically decode URL-encoded slashes (`%2f`) or backslashes (`%5c`). Directly normalizing it allows attackers to bypass defenses using encoded path traversal segments like `/%2e%2e/%2e%2e/etc/passwd`.
**Prevention:** Always explicitly `decodeURIComponent(req.path)` inside a `try-catch`, reject null bytes, securely resolve the absolute path (`path.resolve(baseDir, '.' + decodedPath)`), and enforce directory boundaries (`startsWith(baseDir + path.sep)`).
