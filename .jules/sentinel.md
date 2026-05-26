## 2024-05-18 - [Fix Stored XSS in Admin Dashboard]
**Vulnerability:** The admin dashboard (`admin.html`) was directly injecting user-provided data (names, emails, feature requests) into the DOM using `innerHTML` without sanitization. This allowed for Stored XSS if a user submitted malicious payload in their input.
**Learning:** In vanilla HTML/JS applications, avoid directly interpolating untrusted data into `innerHTML`.
**Prevention:** Always use an `escapeHTML` utility to sanitize untrusted user input before rendering it in the DOM, or rely on `textContent` or `innerText` instead.

## 2024-05-18 - [Fix DOM-based XSS in Tracker]
**Vulnerability:** The tracker page (`tracker.html`) was directly injecting user-provided data (names, inputs, item names) into the DOM using `innerHTML` without sanitization within functions like `addDrawerItem` and `addInventoryItem`. This allowed for DOM-based XSS if malicious payload was loaded from local history/storage or user input.
**Learning:** In vanilla HTML/JS applications, avoid directly interpolating untrusted data via template literals into `innerHTML`.
**Prevention:** Always use an `escapeHTML` utility to sanitize untrusted user input before rendering it in the DOM, or rely on `textContent` or `innerText` instead.

## 2024-05-18 - [Fix Stored XSS in Admin Dashboard (Secondary)]
**Vulnerability:** The admin dashboard (`admin.html`) was directly injecting newsletter subscriber emails into the DOM using `innerHTML` without sanitization inside the `renderNewsletterTable` function. This allowed for Stored XSS.
**Learning:** All dynamically rendered data from a database requires sanitization before `innerHTML` insertion, even for simple fields like emails.
**Prevention:** Ensure `escapeHTML` is thoroughly applied to every user-generated string being rendered.

## 2024-05-18 - [Fix Critical IDOR in Cloud Function]
**Vulnerability:** The `cancelSubscription` cloud function accepted a `customerId` parameter without checking if it belonged to the currently authenticated user. This allowed any user to cancel another user's subscription if they could guess or obtain their `customerId`.
**Learning:** Always verify authorization (e.g., via `admin.auth().verifyIdToken()`) in HTTP Cloud Functions and ensure the user's action targets their own resources.
**Prevention:** Require an `Authorization: Bearer <token>` header on sensitive endpoints, retrieve the `uid`, look up the user's data from a trusted source (like Firestore), and use that data instead of the request body.

## 2024-05-18 - [Fix DOM-based XSS in Tracker (Attributes)]
**Vulnerability:** `tracker.html` was injecting `escapeHTML`-sanitized data directly into `onclick` attribute strings: `onclick="fn('${escapeHTML(id)}')"` (e.g., in `loadHistoryShift` and `applyCustomPreset`). Since HTML entities inside HTML attributes are decoded by the browser *before* evaluating the JavaScript, this allowed for DOM-based XSS. For example, the `&#039;` is decoded back to `'`, allowing a malicious payload to break out of the string context in the JavaScript handler.
**Learning:** `escapeHTML` is not sufficient to sanitize strings interpolated directly into inline JavaScript within HTML attributes.
**Prevention:** Use `data-` attributes and retrieve the value safely inside the handler using `this.getAttribute('data-id')`, or use standard event delegation.

## 2024-05-18 - [Fix Critical IDOR in Stripe Checkout Session Creation]
**Vulnerability:** The `createCheckoutSession` cloud function (`functions/index.js`) blindly trusted the `uid` and `email` properties provided in the POST request body. This allowed an attacker to create a Stripe checkout session with their own parameters but assigned to another user's `uid`. When the payment succeeded, the `stripeWebhook` would incorrectly upgrade the victim's account (or an attacker could manipulate the `uid` to upgrade their own account on someone else's dime).
**Learning:** Never trust client-provided IDs for sensitive operations. Always extract the user identity securely on the backend from an authenticated session or JWT.
**Prevention:** Implement `admin.auth().verifyIdToken(token)` inside the Cloud Function and extract the `uid` and `email` directly from the decoded token rather than trusting the `req.body`.

## 2024-05-18 - [Fix DOM-based XSS in Tracker Report Generation]
**Vulnerability:** The `generateReport` function in `tracker.html` was directly injecting user-provided state data (such as item names, values, and quantities from routines, drawers, and inventory) into the DOM via `innerHTML` string concatenation without sanitization. This allowed for DOM-based XSS if a user's malicious payload was rendered during report generation.
**Learning:** Even internal operations like "generating a report for printing" that read from a saved state require strict sanitization of all dynamic variables before concatenating them into HTML strings for insertion into the DOM.
**Prevention:** Always use an `escapeHTML` utility to sanitize untrusted user input before rendering it in the DOM, or rely on `textContent` or `innerText` instead.

## 2024-05-18 - [Fix DOM-based XSS in JS Components]
**Vulnerability:** Several vanilla JS components (`js/auth.js`, `js/shop.js`, `js/harmonytunes.js`) were directly injecting user data and static arrays into the DOM using `.innerHTML` without sanitization. For example, `userData.membershipLevel` loaded from Firebase was placed directly into a template literal in `js/auth.js`.
**Learning:** Always sanitize data retrieved from databases or provided by variables before injecting it into the DOM using `.innerHTML` in pure JavaScript code.
**Prevention:** Use a shared utility like `escapeHTML` and consistently wrap all interpolations within template literals that are assigned to `.innerHTML`.
