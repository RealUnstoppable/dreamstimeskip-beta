
## 2024-05-01 - Concurrent API Calls
**Learning:** Replaced sequential awaits in loops with Promise.all() for concurrent execution in Cloud Functions. This significantly speeds up operations involving multiple external API calls or database updates.
**Action:** Always prefer batching or Promise.all() for iterative async operations to minimize function execution time and avoid premature termination.

## 2024-05-15 - Optimizing Array.find in Loops
**Learning:** Nested `Array.find()` calls inside loops (like `.map()` or `.reduce()`) over the same static array cause O(N^2) time complexity and create unnecessary performance bottlenecks, especially in list rendering and aggregations.
**Action:** Always pre-compute a `Map` of objects keyed by their identifier (e.g., `new Map(items.map(i => [i.id, i]))`) and replace O(N) `.find()` lookups inside loops with O(1) `.get()` lookups on the Map.

## 2024-05-16 - Optimizing Array.includes in Filters
**Learning:** Using `Array.includes` inside a `.filter()` loop results in O(N^2) time complexity. For user favorites intersecting with a library, this becomes slow as either the library or the favorites list grows. Converting the filter target array into a `Set` before the loop improves the check to O(1), making the entire operation O(N).
**Action:** Always convert an array of primitives to a `Set` before checking membership in a loop.
## 2024-05-23 - Batching DOM Inserts with DocumentFragment
**Learning:** Appending elements directly to the DOM inside a loop (e.g., `container.appendChild(el)`) causes O(N) reflows and repaints, which is a significant performance anti-pattern during list rendering.
**Action:** Always construct elements and append them to a `DocumentFragment` first, then append the entire fragment to the container outside the loop to minimize reflows to O(1).
## 2024-05-24 - Throttling High-Frequency Media Events
**Learning:** High-frequency media events like `timeupdate` on HTMLAudioElement fire several times a second and trigger expensive DOM updates and string formatting synchronously. This causes main-thread blocking and frame drops.
**Action:** Always throttle high-frequency media events using `requestAnimationFrame` coupled with a state tracking flag (e.g., `isUpdatingProgress`) to decouple rapid event firing from expensive DOM updates.
## 2024-05-27 - Caching Shared Profile Data with sessionStorage
**Learning:** Multiple components (like the navbar, theme-loader, and account page) were independently executing redundant `getDoc` calls to fetch the same user profile data from Firestore upon authentication. This caused latency and unnecessary backend reads.
**Action:** Always cache frequently accessed user profile data in `sessionStorage` using a unified key format like `profile_${user.uid}`. UI-bound components should verify this cache before querying the database, which minimizes load times and optimizes read operations.
## 2024-11-20 - Concurrent Promise Failures
**Learning:** When fetching independent Firestore collections concurrently with `Promise.all()`, a single rejection (e.g., due to missing permissions for feature requests) will reject the entire Promise array, breaking the UI.
**Action:** Always attach individual `.catch(e => null)` handlers to each Promise within the array to ensure safe fallbacks and preserve error-handling behavior.
## 2024-11-20 - Optimizing Regex Compilation in Loops
**Learning:** Instantiating `new RegExp()` inside a loop over hundreds of DOM nodes causes severe performance degradation and GC thrashing during fast inputs. Unconditional assignments to `.innerHTML` and `.style.display` also trigger unnecessary style recalculations.
**Action:** Always extract regex compilation outside the loop, and wrap DOM assignments in conditional checks (e.g., `if (el.innerHTML !== newHTML)`) to minimize expensive repaints.
