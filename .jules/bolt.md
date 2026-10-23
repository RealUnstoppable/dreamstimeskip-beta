## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-05-24 - [O(1) DOM Updates for Active State]
**Learning:** In functions that frequently update the visual state of a single active element within a large list (like `updateSongTableActiveState`), using `querySelectorAll('tr')` followed by a `forEach` loop over thousands of rows creates severe unnecessary main-thread blocking.
**Action:** Replaced the O(N) traversal loop with O(1) DOM updates by directly targeting the currently active row (`container.querySelector('.playing')`) to remove the class, and the newly active row (`container.querySelector('[data-id="..."]')`) to add it, completely bypassing the massive collection iteration.
