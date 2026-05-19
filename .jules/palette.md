## 2024-05-24 - Form Accessibility and Async Loading States
**Learning:** Found a recurring pattern of missing `for` attributes on form labels (even though they wrapped inputs visually correctly, explicit `for` bindings are better for screen readers and clicking), and multiple async form submissions (e.g. login, profile update) lacking a disabled loading state, which left the user wondering if their click registered. Adding tooltips to permanently disabled inputs (like emails) is a helpful small touch too.
**Action:** Always check form labels for explicit `for` attributes tying them to `id`s, ensure async operations disable the submit button and provide feedback text (e.g. "Processing..."), and explain disabled input fields via `title` or similar attributes.

## 2026-05-03 - Audio Player Accessibility
**Learning:** Icon-only controls for music players (like volume sliders, play/pause, shuffle, and repeat buttons) often lack text equivalents, rendering them invisible or confusing to screen readers.
**Action:** Always add explicit `aria-label` attributes to icon-only buttons and input sliders that do not have visible text labels associated with them via `for` attributes.

## 2024-06-25 - Form Labels and Hidden Accessibility Patterns
**Learning:** Found multiple form `<label>` elements missing the `for` attribute required to associate them with inputs. Additionally, some inputs completely lacked labels, relying entirely on placeholders. Placeholders are not an accessible alternative to labels for screen readers.
**Action:** When adding missing labels to UI components that were designed without visible text labels, use visually hidden labels (styled with `clip: rect(0 0 0 0)` etc.) to ensure screen reader support without breaking the existing visual design system or layout. Always verify `for` attributes exist on all `<label>` tags.

## 2026-05-19 - Theme Settings Loading State
**Learning:** Forms that save user preferences (like theme or layout changes) to the cloud often forget async loading states because the visual feedback (e.g. a color flip) makes devs assume it's fast enough. However, network delays can cause duplicate submits and confusing UX if the button doesn't respond.
**Action:** Even for forms that seem like "instant" preferences, ensure async operations disable the submit button and provide feedback text.
