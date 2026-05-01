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
