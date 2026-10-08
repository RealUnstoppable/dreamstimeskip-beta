const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Catch console logs to diagnose issues
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    await page.goto('http://localhost:3000/medixly', { waitUntil: 'networkidle2' });
    
    // Assuming there's a play button or we can run JS to start a song
    await page.evaluate(() => {
        // play a song
        const playBtn = document.querySelector('.play-btn') || document.querySelector('#play-btn');
        if (playBtn) playBtn.click();
    });

    await page.waitForTimeout(2000);

    // Skip to 45 seconds left
    await page.evaluate(() => {
        const audio = window.activeAudio || document.querySelector('audio');
        if (audio && audio.duration) {
            audio.currentTime = audio.duration - 45;
        } else {
            console.log('No audio found or duration not set');
        }
    });

    await page.waitForTimeout(5000);
    
    console.log('Test completed.');
    await browser.close();
})();
