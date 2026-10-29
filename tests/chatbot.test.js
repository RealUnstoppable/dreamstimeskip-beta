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
        expect(countdowns.serverStatus.toLowerCase()).toContain("maintenance");
        expect(countdowns.serverStatus).toContain("Server is now working");
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

    it('Protocol 1: should correctly identify severed vs alive network state via isNetworkSevered', () => {
        const { isNetworkSevered } = chatbotModule;
        
        const originalOnLine = navigator.onLine;
        try {
            Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
            expect(isNetworkSevered()).toBe(true);

            Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
            expect(isNetworkSevered()).toBe(false);
        } finally {
            Object.defineProperty(navigator, 'onLine', { value: originalOnLine, configurable: true });
        }
    });

    it('Protocol 2: should never dump default capabilities list on ambiguous queries, but provide targeted clarification', () => {
        const { generateOfflineResponse } = chatbotModule;

        // Explicit capabilities query DOES return capabilities list
        const helpRes = generateOfflineResponse("what can you do?");
        expect(helpRes).toContain("Here is how I can assist you across our network");
        expect(helpRes).toContain("Page & Ecosystem Intelligence");
        expect(helpRes).toContain("Squishly Arcade");

        // Greeting DOES return greeting & capabilities
        const greetingRes = generateOfflineResponse("hello");
        expect(greetingRes).toContain("Here is how I can assist you across our network");

        // Ambiguous or complex queries do NOT dump raw capabilities list
        const ambiguousRes = generateOfflineResponse("how do I configure my router port forwarding?");
        expect(ambiguousRes).not.toContain("Here is how I can assist you across our network");
        expect(ambiguousRes).toContain("clarify what you'd like to do or check");
        expect(ambiguousRes).not.toContain("* Tell you about the page you're looking at");
    });

    it('Protocol 3: should report active song when asking "what am I listening to?" without queueing or playing new song', () => {
        const { generateOfflineResponse } = chatbotModule;

        // Mock window.DTSMusic
        const mockPlaySongById = jest.fn();
        window.DTSMusic = {
            getCurrentSong: () => ({ id: 'song-mock-1', title: 'Starboy', artist: 'The Weeknd' }),
            state: { isPlaying: true, currentTime: 75, duration: 230 },
            playSongById: mockPlaySongById
        };

        const resPlaying = generateOfflineResponse("what am I listening to?");
        expect(resPlaying).toContain("Starboy");
        expect(resPlaying).toContain("The Weeknd");
        expect(resPlaying).toContain("1:15 / 3:50");
        expect(resPlaying).toContain("currently listening to");
        expect(mockPlaySongById).not.toHaveBeenCalled();
        expect(resPlaying).not.toContain("[PLAY_SONG:");

        // Test paused state
        window.DTSMusic.state.isPlaying = false;
        const resPaused = generateOfflineResponse("what song is playing?");
        expect(resPaused).toContain("currently paused at 1:15 / 3:50");
        expect(mockPlaySongById).not.toHaveBeenCalled();

        delete window.DTSMusic;
    });

    it('Protocol 3: should report when no music is playing and not queue a song', () => {
        const { generateOfflineResponse } = chatbotModule;
        // Ensure no active track in DOM or DTSMusic
        delete window.DTSMusic;
        localStorage.removeItem('dts_music_state');

        const res = generateOfflineResponse("what am I listening to?");
        expect(res).toContain("No music is currently playing in Medixly");
        expect(res).not.toContain("[PLAY_SONG:");
    });

    it('Protocol 4: should track navigation paths and include them in user account snapshot', () => {
        const { recordNavigationPath, getNavigationPaths, getUserAccountSnapshot } = chatbotModule;

        recordNavigationPath('/shop.html');
        recordNavigationPath('/medixly.html');
        recordNavigationPath('/account.html');

        const paths = getNavigationPaths();
        expect(paths).toContain('/shop.html');
        expect(paths).toContain('/medixly.html');
        expect(paths).toContain('/account.html');

        const snapshot = getUserAccountSnapshot();
        expect(snapshot.recentPaths).toBeDefined();
        expect(Array.isArray(snapshot.recentPaths)).toBe(true);
        expect(snapshot.recentPaths).toContain('/account.html');
    });
});
