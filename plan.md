1.  **DRY Sweep:** Use `run_in_bash_session` with a custom Node.js script to remove `fetchCollectionData` from `js/firebase.js` and `js/utils/db-utils.js`, and update any associated imports to point to `js/utils.js`.
2.  **State Management Optimization:** Refactor `renderOrders` in `js/account.js` by introducing a `currentOrdersCache` to store stringified query results and skip unnecessary DOM updates.
3.  **Root Tests:** Run `pnpm install && pnpm test` in the root directory to verify there are no test regressions.
4.  **Functions Tests:** Run `cd functions && pnpm install && pnpm test` to verify Cloud Functions tests pass.
5.  Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
