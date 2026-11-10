
## 2024-05-24 - [Path Traversal in Static Server]
**Vulnerability:** Found a path traversal vulnerability in `server.js` where user input `req.path` was being normalized with `path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '')`, which could be bypassed using URL encoded traversal sequences like `%2e%2e/%2e%2e`.
**Learning:** `path.normalize` and custom regex replacements are insufficient for preventing path traversal because they do not decode URL-encoded characters. Furthermore, when `reqPath` starts with a slash, `path.resolve` ignores the base directory and resolves it as an absolute path on the filesystem.
**Prevention:** Always use `decodeURIComponent()` on the raw request path, verify there are no null bytes (`\0`), convert the path to be relative (e.g. remove leading slashes or prepend `.`) before resolving with `path.resolve(__dirname, relativePath)`, and finally use `.startsWith(__dirname + path.sep)` to enforce strict directory boundaries.
