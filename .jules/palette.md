## 2024-10-08 - Feature Request Character Counter
**Learning:** Adding a live character counter with color-coded warnings significantly improves UX for open-ended text inputs like textareas by providing immediate feedback on length constraints, reducing submission errors. Adding `aria-live="polite"` to the counter ensures screen reader users also receive this feedback without disruption.
**Action:** Always consider pairing `maxlength` attributes with visual and screen-reader-accessible character counters on textareas.
