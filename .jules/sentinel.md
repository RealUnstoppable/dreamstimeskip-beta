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
