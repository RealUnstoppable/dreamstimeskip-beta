
## 2024-06-15 - Optimizing high-frequency timeupdate
**Learning:** High-frequency events like `timeupdate` running on `requestAnimationFrame` should not continuously parse the DOM (via `querySelectorAll` and `parseFloat`) as this causes unnecessary reflows and jank.
**Action:** When working with frequently updated elements like synced lyrics, always parse the DOM structures into a cached JS object array (with specific target element references and float timestamps) at initialization/render, then iterate that lightweight array on every update frame.
