## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-10-14 - Replace O(N) Array.find() with O(1) Map.get() for large static datasets
**Learning:** Using `Array.find()` on large static datasets (like a list of 1800+ songs) creates an O(N) lookup bottleneck that executes frequently and synchronously, unnecessarily blocking the main thread during UI operations or lookups.
**Action:** When searching for an object by ID in large static arrays that are loaded into memory, pre-compute a `Map(id -> object)` immediately upon loading the data. This converts subsequent frequent lookups from O(N) to O(1) and significantly reduces synchronous blocking time.
