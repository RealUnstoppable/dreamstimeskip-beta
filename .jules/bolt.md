## 2026-10-13 - O(1) Hash Map Optimization for Static Data Arrays
**Learning:** When dealing with large, static arrays (like the ~23k items in `librarySongs`), using `Array.find()` or `Array.findIndex()` introduces significant O(N) CPU overhead on the main thread during frequent runtime operations.
**Action:** Always pre-compute and export Hash Maps (`Map(id -> object)` and `Map(id -> index)`) during module initialization for large static data to ensure O(1) access times without sacrificing readability.
