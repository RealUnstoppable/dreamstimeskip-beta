## $(date +%Y-%m-%d) - Fix Critical Path Traversal Vulnerability
**Vulnerability:** A static file server endpoint in `server.js` was vulnerable to path traversal. It attempted to normalize paths using a naive regex (`replace(/^(\.\.[\/\\])+/, '')`) on Express's `req.path`.
**Learning:** Naive regex replacements are insufficient for preventing path traversal as they can be easily bypassed (e.g., `/app/../../etc/passwd` bypassing `../` at the start). Also, `req.path` is URL-decoded by Express, but `decodeURIComponent` inside a `try-catch` adds defense-in-depth against double-encoded payloads.
**Prevention:** Always use `path.resolve(__dirname, relativePath)` combined with a strict boundary check `if (!filePath.startsWith(__dirname + path.sep))` to prevent path traversal in Node.js.
