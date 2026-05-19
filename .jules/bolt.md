## 2024-04-29 - requestAnimationFrame State Management Bug
**Learning:** When throttling events like `mousemove` with `requestAnimationFrame` using an `isTicking` flag and `latestEvent` state, ensure that the early return (e.g. `if (!latestEvent) return;`) also resets the `isTicking` flag (`isTicking = false;`). Otherwise, if the event state is cleared (like in a `mouseleave` handler) before the animation frame executes, the ticking state gets permanently locked, disabling the handler. It is also good practice to reset the ticking state in the `mouseleave` handler directly.
**Action:** Always verify that early returns inside throttled or debounced callbacks properly clean up or reset tracking flags to avoid permanently locking the event listener state.

## 2024-05-01 - Concurrent API Calls
**Learning:** Replaced sequential awaits in loops with Promise.all() for concurrent execution in Cloud Functions. This significantly speeds up operations involving multiple external API calls or database updates.
**Action:** Always prefer batching or Promise.all() for iterative async operations to minimize function execution time and avoid premature termination.

## 2024-05-15 - Optimizing Array.find in Loops
**Learning:** Nested `Array.find()` calls inside loops (like `.map()` or `.reduce()`) over the same static array cause O(N^2) time complexity and create unnecessary performance bottlenecks, especially in list rendering and aggregations.
**Action:** Always pre-compute a `Map` of objects keyed by their identifier (e.g., `new Map(items.map(i => [i.id, i]))`) and replace O(N) `.find()` lookups inside loops with O(1) `.get()` lookups on the Map.

## 2024-05-18 - Optimizing Array.includes in Loops
**Learning:** Using `Array.includes()` inside a `.filter()` or `.map()` loop creates an O(N*M) time complexity, which can be a bottleneck when filtering large arrays against a list of identifiers.
**Action:** Convert the identifier list to a `Set` before the loop and replace O(M) `Array.includes()` with O(1) `Set.has()` to achieve O(N+M) complexity, which is significantly faster.

## 2024-05-20 - Throttling High-Frequency Audio Events
**Learning:** The \`timeupdate\` event on HTML5 audio/video elements can fire multiple times per second (typically 4-250ms intervals). Updating the DOM directly in this event handler blocks the main thread unnecessarily.
**Action:** Always throttle \`timeupdate\` (or similar high-frequency events like \`scroll\`) using \`requestAnimationFrame\` with a ticking flag to align DOM updates with the browser's render cycle, reducing layout thrashing and CPU usage.
