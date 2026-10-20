
## 2024-10-20 - Fix Path Traversal Vulnerability in Express Static Middleware
**Vulnerability:** Path traversal existed in `server.js` where Express's `req.path` was used with regex to prevent traversal (`path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '')`). This was vulnerable to URL-encoded bypasses because `req.path` is not fully decoded, and regex boundary checks are inadequate for complex traversal attempts involving multiple encodings or nested traversals.
**Learning:** Naive path normalization and regex stripping are insufficient. Attackers can use `%2e%2e` (or deeper encodings) to bypass superficial dot-segment checks.
**Prevention:** Always explicitly `decodeURIComponent(req.path)`, explicitly check for and reject null bytes (`\0`), resolve to an absolute path using `path.resolve(baseDir, relativeReqPath)`, and enforce strict boundary boundaries ensuring `filePath.startsWith(baseDir + path.sep)`.
