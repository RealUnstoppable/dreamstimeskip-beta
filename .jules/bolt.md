## 2024-05-24 - [Micro-UX Event Delegation]
**Learning:** In highly interactive dynamic lists like Lyrics and Spotlight search, repeated event listeners can cause huge memory bloat. Furthermore, modifying DOM instances iteratively inside functions like `renderLyrics()` can create stale closure bugs.
**Action:** Applied Event Delegation using dataset checks (`dataset.delegated = "true"`) to attach single event listeners on parent containers and check `e.target.closest()`. The listener is attached globally (e.g., inside `initHarmonyTunes`) and reads dependencies like `activeAudio` dynamically at execution time, which decreases listener bloat and runs significantly faster without stale closure issues.

## 2024-05-24 - [O(1) Map Cache for Static Large Arrays]
**Learning:** In projects where there are giant arrays of data (`librarySongs` has ~30,000 lines), operations like `Array.find()` inside hot paths (e.g. `getSongById`) create major bottlenecks with O(N) lookup times.
**Action:** Replace `Array.find()` with pre-computed `Map` collections lazily tracking `array.length` (`_lastLibraryLength`) to gracefully handle dynamic mutations (`splice`/`unshift`). This guarantees an O(1) performance lookup while preventing bugs during array changes.
