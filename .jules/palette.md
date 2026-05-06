## 2024-05-24 - Form Accessibility and Async Loading States
**Learning:** Found a recurring pattern of missing `for` attributes on form labels (even though they wrapped inputs visually correctly, explicit `for` bindings are better for screen readers and clicking), and multiple async form submissions (e.g. login, profile update) lacking a disabled loading state, which left the user wondering if their click registered. Adding tooltips to permanently disabled inputs (like emails) is a helpful small touch too.
**Action:** Always check form labels for explicit `for` attributes tying them to `id`s, ensure async operations disable the submit button and provide feedback text (e.g. "Processing..."), and explain disabled input fields via `title` or similar attributes.

## 2026-05-03 - Audio Player Accessibility
**Learning:** Icon-only controls for music players (like volume sliders, play/pause, shuffle, and repeat buttons) often lack text equivalents, rendering them invisible or confusing to screen readers.
**Action:** Always add explicit `aria-label` attributes to icon-only buttons and input sliders that do not have visible text labels associated with them via `for` attributes.

## 2024-05-24 - Missing ARIA labels on Icon-Only Buttons
**Learning:** Some older mobile menus and dashboard elements (like the admin layout hamburger and close buttons) in this app use purely icon-based text nodes (e.g., `☰` and `✕`) without an associated `aria-label`. This makes navigation completely inaccessible to screen reader users as they have no context for what the button does.
**Action:** When implementing new mobile layout toggles or reviewing existing ones, always ensure `aria-label` is present on purely icon-based or symbol-based interactive elements, such as `hamburger-btn`.
