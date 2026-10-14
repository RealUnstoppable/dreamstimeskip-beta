const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    console.log("Navigating to realunstoppable.store/medixly ...");
    await page.goto('https://realunstoppable.store/medixly', { waitUntil: 'networkidle2' });

    console.log("Clicking play or a song...");
    // Let's try to click the first play button or song in the table
    try {
        await page.waitForSelector('.play-btn, .song-row', { timeout: 5000 });
        await page.evaluate(() => {
            const playBtn = document.querySelector('.play-btn');
            if (playBtn) playBtn.click();
            else {
                const songRow = document.querySelector('.song-row');
                if (songRow) songRow.click();
            }
        });
        console.log("Clicked play. Waiting 3 seconds for audio to start...");
        await new Promise(r => setTimeout(r, 3000));

        // Skip until it has 45 seconds left
        console.log("Seeking to 46 seconds before end...");
        await page.evaluate(() => {
            if (window.activeAudio && window.activeAudio.duration) {
                window.activeAudio.currentTime = window.activeAudio.duration - 46;
                console.log("Seeked to:", window.activeAudio.currentTime, "Duration:", window.activeAudio.duration);
            } else if (document.querySelector('audio')) {
                const audio = document.querySelector('audio');
                if (audio.duration) {
                    audio.currentTime = audio.duration - 46;
                    console.log("Seeked audio to:", audio.currentTime);
                } else {
                    console.log("Audio duration not available.");
                }
            } else {
                console.log("No active audio found");
            }
        });

        console.log("Waiting 10 seconds to watch the merge...");
        await new Promise(r => setTimeout(r, 10000));

        console.log("Checking active audio state...");
        const state = await page.evaluate(() => {
            if (window.activeAudio) {
                return {
                    currentTime: window.activeAudio.currentTime,
                    duration: window.activeAudio.duration,
                    paused: window.activeAudio.paused,
                    src: window.activeAudio.src,
                    isCrossfading: window.isCrossfading
                };
            }
            return null;
        });
        console.log("Active Audio State:", state);
        
        await new Promise(r => setTimeout(r, 10000));
        
        const finalState = await page.evaluate(() => {
            if (window.activeAudio) {
                return {
                    currentTime: window.activeAudio.currentTime,
                    duration: window.activeAudio.duration,
                    paused: window.activeAudio.paused,
                    src: window.activeAudio.src,
                    isCrossfading: window.isCrossfading
                };
            }
            return null;
        });
        console.log("Final Audio State:", finalState);

    } catch (e) {
        console.error("Error during interaction:", e);
    }
    
    await browser.close();
})();
