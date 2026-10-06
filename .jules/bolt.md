
## 2026-10-06 - O(1) Data Access for Large Static Data
**Learning:** Found multiple identical JavaScript files loading over 23,000 lines of JSON song data into memory as a standard array (`librarySongs`). Many common user interactions (like playing a song or viewing an artist) triggered O(N) array scans using `findIndex()` and `find()`. This is a clear bottleneck in client-side Javascript memory/processing.
**Action:** When injecting massive, static data arrays into a client-side environment, instantly initialize complementary hash-maps (e.g. `Map(id -> object)` and `Map(id -> index)`) to ensure all subsequent data-lookups are O(1) performance.
