## 2024-05-24 - Form Accessibility and Async Loading States
**Learning:** Found a recurring pattern of missing `for` attributes on form labels (even though they wrapped inputs visually correctly, explicit `for` bindings are better for screen readers and clicking), and multiple async form submissions (e.g. login, profile update) lacking a disabled loading state, which left the user wondering if their click registered. Adding tooltips to permanently disabled inputs (like emails) is a helpful small touch too.
**Action:** Always check form labels for explicit `for` attributes tying them to `id`s, ensure async operations disable the submit button and provide feedback text (e.g. "Processing..."), and explain disabled input fields via `title` or similar attributes.

## 2026-05-03 - Audio Player Accessibility
**Learning:** Icon-only controls for music players (like volume sliders, play/pause, shuffle, and repeat buttons) often lack text equivalents, rendering them invisible or confusing to screen readers.
**Action:** Always add explicit `aria-label` attributes to icon-only buttons and input sliders that do not have visible text labels associated with them via `for` attributes.

## 2026-05-23 - Async Form Submission Loading States
**Learning:** Found an async form submission (`auth-form` in `js/auth.js`) where the submit button was disabled during the request, but its text was not updated. Without changing the text to explicitly indicate loading (e.g., "Processing..."), users might mistake the disabled button for a generic UI error or think the form is inactive.
**Action:** Always update the `textContent` of submit buttons for async operations to provide explicit visual feedback, and ensure the original text is restored in `finally` or all error paths.
