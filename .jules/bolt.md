## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2025-02-12 - Replacing Array.findIndex with Map lookup
**Learning:** When trying to resolve performance bottlenecks involving repeated lookup calls like `findIndex`, `Map` allows us to cache elements reducing complexity from `O(N)` to `O(1)`.
**Action:** Used `new Map` to cache objects with key values reducing execution time for repetitive index finding.
