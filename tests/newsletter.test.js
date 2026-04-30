import { jest } from '@jest/globals';
import { setDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Load script once globally (as event listener binds to document)
document.body.innerHTML = `
  <form class="signup-form">
    <input type="email" value="test@example.com" />
    <button type="submit">Subscribe</button>
  </form>
`;
await import('../js/newsletter.js');

describe('Newsletter Submission', () => {
  let form;
  let emailInput;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();

    // Ensure fresh DOM while keeping global document intact
    document.body.innerHTML = `
      <form class="signup-form">
        <input type="email" value="test@example.com" />
        <button type="submit">Subscribe</button>
      </form>
    `;

    form = document.querySelector('.signup-form');
    emailInput = form.querySelector('input[type="email"]');

    // Mock alert and console.error
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  test('should handle successful submission', async () => {
    setDoc.mockResolvedValueOnce();

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Wait for async operations to complete
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith("You've successfully subscribed to the newsletter!");
    expect(emailInput.value).toBe('');
  });

  test('should handle submission error and show error alert', async () => {
    const error = new Error('Network Error');
    setDoc.mockRejectedValueOnce(error);

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Wait for async operations to complete
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);

    expect(console.error).toHaveBeenCalledWith("Error submitting email:", error);
    expect(window.alert).toHaveBeenCalledWith("There was an error subscribing. Please try again later.");
  });

  test('should not submit if email is empty', async () => {
    emailInput.value = '   ';

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Wait for async operations to complete
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);

    expect(setDoc).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });
});
