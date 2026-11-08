## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-05-24 - [O(1) Map Cache for Static Arrays]
**Learning:** In a codebase with massive arrays (e.g. librarySongs has 30k+ elements) that are frequently queried for specific items, `.find()` introduces significant O(N) performance overhead. Using an explicit size tracking `_lastLibraryLength` instead of `map.size` for lazy cache invalidation avoids issues where `map.size` gets out of sync with array length due to duplicate keys (IDs).
**Action:** Replaced O(N) array search with an O(1) Map cache, initializing it on the first call and only rebuilding if the tracked array length `_lastLibraryLength` changes, ensuring O(1) access times while mitigating map invalidation bugs.
