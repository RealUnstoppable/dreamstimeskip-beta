## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-05-25 - [O(1) Map Lookups for Massive Static Arrays]
**Learning:** Functions like `getSongById` are highly called in a music app (e.g., rendering playlists, player state updates). Using `Array.find()` multiple times per lookup on an array of 1800+ songs meant iterating up to 5400 times per call. This causes heavy main-thread blocking and frame drops.
**Action:** Initialized a pre-computed `Map` (Hash Map) linking IDs to song objects during module load. Refactored `getSongById` to use `songMap.get()`, reducing worst-case lookups from `O(3N)` to `O(1)`. Always prefer maps/dictionaries over array finding for hot-path lookups on large static datasets.
