## 2024-04-29 - requestAnimationFrame State Management Bug
**Learning:** When throttling events like `mousemove` with `requestAnimationFrame` using an `isTicking` flag and `latestEvent` state, ensure that the early return (e.g. `if (!latestEvent) return;`) also resets the `isTicking` flag (`isTicking = false;`). Otherwise, if the event state is cleared (like in a `mouseleave` handler) before the animation frame executes, the ticking state gets permanently locked, disabling the handler. It is also good practice to reset the ticking state in the `mouseleave` handler directly.
**Action:** Always verify that early returns inside throttled or debounced callbacks properly clean up or reset tracking flags to avoid permanently locking the event listener state.

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
