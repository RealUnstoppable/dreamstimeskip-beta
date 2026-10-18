## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-05-18 - [Optimizing Massive Array Lookups in Static Data]
**Learning:** Using `Array.find()` inside heavily accessed utility functions (like `getSongById`) on massive static datasets (29,000+ items) creates unnecessary CPU overhead during runtime operations. Since the dataset is static and bounded, transforming it into a hash map lookup (`Map`) at module initialization time is safe and guarantees O(1) performance without risk of state desync.
**Action:** When working with massive static dictionary data in JavaScript, pre-compute a `Map` or object lookup table during module load instead of relying on array iteration methods during hot paths.
