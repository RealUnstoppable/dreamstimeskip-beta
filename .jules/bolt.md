## 2024-05-19 - Fast Lookups in large static arrays
**Learning:** Calling `findIndex()` over an array of 23k static elements inside inner loops (like rendering queues or UI state sync) creates a noticeable main-thread bottleneck.
**Action:** Replaced O(N) `findIndex` operations on `librarySongs` with an O(1) hash map lookup inside `song-data.js` via the new `getSongIndexById` utility.
