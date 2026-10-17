## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-10-17 - [Array to Map index lookup optimization]
**Learning:** In highly static massive arrays (like `librarySongs`), using `Array.prototype.findIndex()` in critical performance paths (such as playing songs, managing queues) creates an O(N) bottleneck on every lookup, unnecessarily spending cycles.
**Action:** Always pre-compute a Hash Map (`Map(id -> index)`) on initialization for these types of immutable static arrays, allowing for an O(1) lookup latency (`librarySongsIdMap.get(id) ?? -1`).
