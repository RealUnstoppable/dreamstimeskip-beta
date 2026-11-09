## 2024-11-09 - Accessible Icon Buttons in Medixly Editors
**Learning:** Found multiple icon-only transport buttons in the audio editor interface (`medixly-editors.html`) missing `aria-label` attributes. This is a common accessibility issue for media player controls that rely on symbols (like ⏮, ◀, ▶, ✕) which screen readers may misinterpret.
**Action:** Always ensure any button containing only visual icons or non-alphanumeric text symbols includes a descriptive `aria-label` to provide context for screen reader users.
