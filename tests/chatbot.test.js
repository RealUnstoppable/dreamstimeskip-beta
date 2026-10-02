import { jest } from '@jest/globals';

jest.unstable_mockModule("https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js", () => ({
    getVertexAI: jest.fn(() => ({})),
    getGenerativeModel: jest.fn(() => {
        throw new Error("Mocked initialization error");
    })
}));

describe('chatbot.js error handling', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        document.body.innerHTML = ''; // Reset DOM
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetModules();
    });

    it('should catch AI model initialization errors and log with Manager info prefix', async () => {
        // Import the module dynamically to trigger its execution after mocking
        await import('../js/chatbot.js');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Manager info: [AI Model Initialization Failed]",
            expect.any(Error)
        );
        expect(consoleErrorSpy.mock.calls[0][1].message).toBe("Mocked initialization error");
    });
});
