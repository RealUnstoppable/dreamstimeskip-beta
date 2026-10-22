## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-10-22 - [O(1) Map Lookup for Large Static Arrays]
**Learning:** In client-side JS with large static arrays like `librarySongs` (which contains nearly 2000 items), repeated `Array.find()` lookups, especially inside loops or event handlers (e.g., fetching a song by id multiple times), can cause significant CPU overhead and stuttering.
**Action:** Initialized a pre-computed Hash Map (`songIdMap`) on file load to cache these elements by `id`, changing the lookup time from O(N) to O(1) in the `getSongById` utility. Benchmark showed reduction from ~55ms to ~0.7ms for 1000 lookups.
