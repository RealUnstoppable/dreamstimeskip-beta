1. **Explore Codebase**: Read through the codebase to identify areas matching the requested micro-UX improvements.
2. **Implement Fixes**: Use node scripts to modify the codebase to include the required fixes:
   - Add explicit `for` attributes to `<label>` elements matching their corresponding inputs.
   - Add descriptive `aria-label` attributes to icon-only buttons (`lexi-menu-btn`, `chatbot-send`).
   - Implement proper disabled states with loading text (`Processing...`, `Applying...`) and add a `title` tooltip for async operation buttons (e.g. auth forms, checkout promo, account updates).
   - Ensure the Siri Orb (`#siri-orb`) is fully keyboard accessible by giving it `role="button"`, `tabindex="0"`, and triggering its click event on 'Enter' and 'Space' keydown events.
3. **Verify Updates**: Run tests to verify the changes have successfully been applied.
4. **Pre-commit Checks**: Run tests and lint via `pre_commit_instructions` tool to verify codebase health.
5. **Submit PR**: Create PR with a title exactly following the Palette guidelines (`🎨 Palette: [UX improvement]`). Include What, Why, Before/After, and Accessibility in the description.
