### Repo overview

This is a small static site (beta) that serves as the hub for the "Unstoppable / Dreams TimeSkip" projects. It is organized as plain HTML pages in the repo root, static assets under `css/`, `js/`, and `images/`, and lightweight client-side Firebase integration for auth and persistence.

Key entry points
- `index.html` — main hub / marketing page
- `sign in beta.html` — client-side Firebase auth form (sign in / sign up)
- `shop.html`, `checkout.html` — shop & checkout UI (cart stored in Firestore or localStorage)

Primary client-side modules
- `js/auth.js` — initializes Firebase, exports `auth`, `db`, and contains the global `onAuthStateChanged` handler that updates navigation and account links.
- `js/shop.js` — product data (in-memory array), cart UI, merges `localStorage` cart with Firestore carts on login, persists carts to Firestore for authenticated users.
- `js/checkout.js` — reads cart from Firestore, creates orders using Firestore transactions, updates `product_stats` and clears user cart.
- `js/theme-loader.js` — applies theme/accent via data attributes (`data-theme`, `data-accent`) and persists to Firestore for signed-in users or localStorage for guests.

Architecture notes for agents
- This is a client-first static site. There is no server code in this repo — expect all dynamic behavior to be implemented in the browser with Firebase as the backend.
- Firebase config lives in `js/auth.js` as placeholders. Replacements are expected during deployment or in a secrets file (not included here).
- Data flows: UI -> local state (JS) -> Firestore (for authenticated users). Checkout uses Firestore transactions to maintain consistency.

Conventions & patterns
- DOM-first scripting: modules attach listeners in `DOMContentLoaded` and manipulate the DOM directly (no framework). Follow the existing event delegation patterns (e.g., `productGrid.addEventListener('click', ...)`).
- Single responsibility files: each `js/*.js` handles one domain (auth, shop, checkout, theme). Keep additions scoped similarly.
- Storage: unauthenticated users store carts and theme prefs in `localStorage` (`localCart`, `userTheme`, `userAccent`) — code expects these exact keys.
- Styling: themes and accents are implemented via `data-theme`/`data-accent` on `document.body` and CSS variables in `css/style.css`.

Important files to reference when changing behavior
- `js/auth.js` — update Firebase config and any auth-related flows.
- `js/shop.js` — modify `products` array or change cart persistence/merge logic.
- `js/checkout.js` — follow the transaction pattern when creating orders (`runTransaction`) to avoid race conditions.
- `css/style.css` — theme variables and responsive breakpoints; theme changes should use `data-accent`/`data-theme` instead of editing CSS directly.

Examples (copyable snippets agents should prefer)
- Merge local cart into Firestore (pattern used in `shop.js`):
  const mergedCart = { ...firestoreCart };
  for (const [productId, quantity] of Object.entries(localCart)) {
      mergedCart[productId] = (mergedCart[productId] || 0) + quantity;
  }

- Atomic order creation (pattern used in `checkout.js`): use `runTransaction(db, async (transaction) => { ... })` and update `orders`, `product_stats`, and `carts` within the same transaction.

Quick debugging hints for agents
- Live preview: open any `.html` directly in a browser for quick UI checks. For Firebase flows, serve via a local static server (e.g., `python -m http.server 8000`) so module imports and absolute paths work.
- When editing auth flows, update `js/auth.js` firebaseConfig placeholders; don't commit real secrets. Prefer using environment-specific injection or a local `secrets` file handled out-of-band.
- Search for `// **MODIFIED**` comments — they indicate non-obvious changes or TODOs carried through the codebase.

What not to change without verification
- Do not change the `localStorage` keys (`localCart`, `userTheme`, `userAccent`) or Firestore collection names (`users`, `carts`, `orders`, `product_stats`) unless you update all callers.
- Avoid introducing large build tooling or frameworks — this repo is intentionally zero-build static assets.

If you need more context
- Read `index.html`, `sign in beta.html`, and `shop.html` to understand UI expectations.
- For theme and UX examples, inspect `css/style.css` and `js/theme-loader.js`.

If anything here is unclear or you want this refined for a specific agent (test runner, linter, scaffold), tell me which areas to expand.
