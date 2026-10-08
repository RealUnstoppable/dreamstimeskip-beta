## 2024-05-24 - O(N) Array Scans in Library Lookups
**Learning:** Found O(N) `Array.find()` lookups inside `getSongById()` in `js/song-data.js` which iterates over 23k+ items. Similar O(N) array scans with `findIndex` occurred on play actions in `js/medixly*.js`.
**Action:** Replaced O(N) array scans with pre-computed O(1) Maps/Dictionaries for lookups and index retrieval.
