## 2024-04-29 - requestAnimationFrame State Management Bug
**Learning:** When throttling events like `mousemove` with `requestAnimationFrame` using an `isTicking` flag and `latestEvent` state, ensure that the early return (e.g. `if (!latestEvent) return;`) also resets the `isTicking` flag (`isTicking = false;`). Otherwise, if the event state is cleared (like in a `mouseleave` handler) before the animation frame executes, the ticking state gets permanently locked, disabling the handler. It is also good practice to reset the ticking state in the `mouseleave` handler directly.
**Action:** Always verify that early returns inside throttled or debounced callbacks properly clean up or reset tracking flags to avoid permanently locking the event listener state.

## 2024-05-01 - Concurrent API Calls
**Learning:** Replaced sequential awaits in loops with Promise.all() for concurrent execution in Cloud Functions. This significantly speeds up operations involving multiple external API calls or database updates.
**Action:** Always prefer batching or Promise.all() for iterative async operations to minimize function execution time and avoid premature termination.

## 2024-05-02 - O(N) Array Looks in Loops
**Learning:** Found O(N) `Array.prototype.find()` calls inside rendering and calculation loops (e.g., `.map()` and `.reduce()`) for the cart and checkout logic. This can cause O(N*M) performance bottlenecks where N is the cart size and M is the product catalog size.
**Action:** Pre-compute a `Map` or dictionary (O(1) lookup) of the target array objects before the loop to reduce time complexity to O(N+M).
