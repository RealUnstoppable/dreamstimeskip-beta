## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## $(date +%Y-%m-%d) - Optimize getSongById Lookup
**Learning:** `librarySongs.find` acts as an O(N) array scan, which degrades performance across the app as the library grows, especially when called frequently during render or playback loops.
**Action:** Always pre-compute and cache massive static arrays in a `Map` structure for O(1) lookups. Ensure you only insert `if (!map.has(key))` to preserve `.find()`'s "first match wins" behavior.
