## 2024-05-18 - [Fix Stored XSS in Admin Dashboard]
**Vulnerability:** The admin dashboard (`admin.html`) was directly injecting user-provided data (names, emails, feature requests) into the DOM using `innerHTML` without sanitization. This allowed for Stored XSS if a user submitted malicious payload in their input.
**Learning:** In vanilla HTML/JS applications, avoid directly interpolating untrusted data into `innerHTML`.
**Prevention:** Always use an `escapeHTML` utility to sanitize untrusted user input before rendering it in the DOM, or rely on `textContent` or `innerText` instead.
