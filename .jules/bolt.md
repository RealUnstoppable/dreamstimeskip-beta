## 2024-05-30 - O(1) map lookups for static collections
**Learning:** Using `Array.find()` for ID lookups in static large arrays like `librarySongs` (over 1000 items) scales poorly in frequently called functions like `getSongById`.
**Action:** Replace `Array.find()` with a lazy-initialized `Map` or pre-computed lookup object. A lazy `Map` ensures it's only created if needed, providing O(1) lookup performance from O(N).
