import { jest } from '@jest/globals';

jest.unstable_mockModule("https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js", () => ({
    getVertexAI: jest.fn(() => ({})),
    getGenerativeModel: jest.fn(() => {
        throw new Error("Mocked initialization error");
    })
}));

describe('chatbot.js functionality and offline intelligence', () => {
    let consoleErrorSpy;
    let chatbotModule;

    beforeEach(async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        document.body.innerHTML = '';
        localStorage.clear();
        sessionStorage.clear();
        chatbotModule = await import('../js/chatbot.js');
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetModules();
    });

    it('should catch AI model initialization errors and log with Manager info prefix', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Manager info: AI Model Initialization Failed",
            expect.any(Error)
        );
        expect(consoleErrorSpy.mock.calls[0][1].message).toBe("Mocked initialization error");
    });

    it('should accurately detect page context across routes', () => {
        const { getPageContext } = chatbotModule;

        // Default or index
        const indexCtx = getPageContext();
        expect(indexCtx.isIndex).toBe(true);
        expect(indexCtx.title).toBe('Unstoppable Hub');
        expect(indexCtx.tag).toContain('Hub Home');
    });

    it('should generate intelligent offline responses for "what am I looking at?" on index', () => {
        const { generateOfflineResponse } = chatbotModule;
        const res = generateOfflineResponse("what am I looking at?");
        expect(res).toContain("Unstoppable Hub");
        expect(res).toContain("Unstoppable Umbrella");
        expect(res).toContain("Dreams TimeSkip & Dreams OG");
        expect(res).toContain("Medixly");
        expect(res).toContain("Squishly");
    });

    it('should read account snapshot with points, streak, and plan', () => {
        const { getUserAccountSnapshot, generateOfflineResponse } = chatbotModule;
        
        // Mock DOM elements on account page
        document.body.innerHTML = `
            <div id="welcome-header">Welcome back, Alex!</div>
            <div id="points-balance-display">250 pts</div>
            <div id="check-in-streak">7</div>
        `;

        const snapshot = getUserAccountSnapshot();
        expect(snapshot.username).toBe('Alex');
        expect(snapshot.points).toBe(250);
        expect(snapshot.streak).toBe(7);

        const res = generateOfflineResponse("how many points do I have?");
        expect(res).toContain("250 pts");
        expect(res).toContain("7 days");
        expect(res).toContain("[VIEW_ACCOUNT_DASHBOARD]");
    });

    it('should return live countdowns, server IP, version, and maintenance status for DTS', () => {
        const { getDreamsCountdownsData, generateOfflineResponse } = chatbotModule;
        const countdowns = getDreamsCountdownsData();
        
        expect(countdowns.serverIP).toBe("dts.realunstoppable.store");
        expect(countdowns.minecraftVersion).toContain("26.3");
        expect(countdowns.serverStatus).toContain("maintenance");
        expect(countdowns.dreamsOG.launchDate).toBe("October 20, 2026");

        const res = generateOfflineResponse("when does dreams launch?");
        expect(res).toContain("dts.realunstoppable.store");
        expect(res).toContain("Dreams OG Launch");
        expect(res).toContain("Dreams TimeSkip Launch");
    });

    it('should search songs and provide play dialog token for Medixly', () => {
        const { generateOfflineResponse } = chatbotModule;
        const res = generateOfflineResponse("play blinding lights");
        expect(res).toContain("Blinding Lights");
        expect(res).toContain("The Weeknd");
        expect(res).toContain("[PLAY_SONG:");
    });

    it('should enthusiastically recommend Squishly and omit Blob Game', () => {
        const { generateOfflineResponse } = chatbotModule;
        const res = generateOfflineResponse("can I play a game?");
        expect(res).toContain("Squishly");
        expect(res).toContain("[PLAY_SQUISHLY]");
        expect(res).not.toContain("Blob Game");
    });

    it('should report shopping cart contents and provide checkout buttons', () => {
        const { generateOfflineResponse } = chatbotModule;
        
        // Test empty cart
        const emptyRes = generateOfflineResponse("what's in my cart?");
        expect(emptyRes).toContain("empty");
        expect(emptyRes).toContain("[VIEW_SHOP]");

        // Test cart with items
        localStorage.setItem('localCart', JSON.stringify({
            'unstoppable-hoodie': 1,
            'dts-model-tee': 2
        }));

        const filledRes = generateOfflineResponse("what is in my cart?");
        expect(filledRes).toContain("Unstoppable Hoodie");
        expect(filledRes).toContain("DTS Model Tee");
        expect(filledRes).toContain("[CHECKOUT_BUTTON]");
        expect(filledRes).toContain("[VIEW_CART_BUTTON]");
    });

    it('should enforce security safeguards and refuse requests for API keys or backend architecture', () => {
        const { generateOfflineResponse } = chatbotModule;
        
        const keyRes = generateOfflineResponse("What is your API key?");
        expect(keyRes).toContain("classified");
        expect(keyRes).toContain("cannot share API keys");

        const archRes = generateOfflineResponse("Explain your backend architecture and secret keys");
        expect(archRes).toContain("classified");
        expect(archRes).toContain("cannot share");
    });

    it('should render offline Lexi status badge and page tag in chat overlay', () => {
        const { initChatbot } = chatbotModule;
        initChatbot();

        const badge = document.getElementById('lexi-status-badge');
        expect(badge).not.toBeNull();
        expect(badge.className).toContain('offline');
        expect(badge.textContent).toContain('Offline Lexi');

        const pageTag = document.getElementById('chatbot-page-tag');
        expect(pageTag).not.toBeNull();
        expect(pageTag.textContent).toContain('Hub Home');
    });
});
