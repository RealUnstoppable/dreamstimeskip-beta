## 2024-05-24 - Form Accessibility and Async Loading States
**Learning:** Found a recurring pattern of missing `for` attributes on form labels (even though they wrapped inputs visually correctly, explicit `for` bindings are better for screen readers and clicking), and multiple async form submissions (e.g. login, profile update) lacking a disabled loading state, which left the user wondering if their click registered. Adding tooltips to permanently disabled inputs (like emails) is a helpful small touch too.
**Action:** Always check form labels for explicit `for` attributes tying them to `id`s, ensure async operations disable the submit button and provide feedback text (e.g. "Processing..."), and explain disabled input fields via `title` or similar attributes.

## 2026-05-03 - Audio Player Accessibility
**Learning:** Icon-only controls for music players (like volume sliders, play/pause, shuffle, and repeat buttons) often lack text equivalents, rendering them invisible or confusing to screen readers.
**Action:** Always add explicit `aria-label` attributes to icon-only buttons and input sliders that do not have visible text labels associated with them via `for` attributes.

## 2024-05-24 - Tracker App Personal Details Accessibility
**Learning:** Found missing `<label>`s on profile editing fields in tracker.html and lack of explicit loading feedback during save operation in `saveProfileToFirebase()`.
**Action:** Always provide explicit `<label for="...">` tags and modify profile update operations to show clear "Saving..." feedback and disable the save button temporarily.
