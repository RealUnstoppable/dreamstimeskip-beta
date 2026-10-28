## 2024-05-18 - [Path Traversal in Node.js Express Middleware]
**Vulnerability:** The code in `server.js` attempted to sanitize user-provided file paths for an HTML file server using `.replace(/^(\.\.[\/\\])+/, '')`, which failed to correctly mitigate directory traversals (e.g. `%2e%2e%2f` bypass or `/../` bypass).
**Learning:** Using regex for path traversal prevention is extremely brittle. Also, relying directly on Express's `req.path` without decoding the URI (e.g., `decodeURIComponent`) fails to catch URL-encoded attacks, especially since `req.path` leaves encoded slashes like `%2f` intact. Path checks can also be bypassed using string termination characters (null bytes).
**Prevention:**
1. Always wrap `decodeURIComponent(req.path)` in a try-catch to prevent crash loops.
2. Check for string terminating null-bytes (`\0`) and block them.
3. Prepend a dot (`.`) to the decoded path if it starts with `/` to ensure `path.resolve` treats it as relative, not absolute.
4. Use strict directory bounds checking with `path.resolve` and `filePath.startsWith(__dirname + path.sep)` to ensure the path doesn't escape the expected working directory.
