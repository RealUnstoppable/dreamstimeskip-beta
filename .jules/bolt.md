## 2024-03-24 - Pre-compute huge array lookups for performance
**Learning:** O(N) array lookups (e.g. `librarySongs.find(s => s.id === id)` or `findIndex`) perform incredibly poorly when N is huge (e.g. ~11,000 songs here). This results in lag and delays since lookups are performed dynamically during user interactions (like playing a song or skipping).
**Action:** Always pre-compute and store O(1) Map lookups for static huge datasets like this library. Replaced `Array.find` with `Map.get(id)` and `Array.findIndex` with `Map.get(id)` mapped to its index for O(1) performance.
