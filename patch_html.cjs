const fs = require('fs');
let code = fs.readFileSync('harmonytunes.html', 'utf8');

const oldFsMixer = `<button class="control-button" id="fs-mixer-btn" title="Mixxer" aria-label="Toggle Mixer">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="5"></circle><path d="M5 14 C 5 5, 11 3, 12 8 C 13 3, 19 5, 19 14"></path><rect x="3" y="12" width="2" height="6" rx="1"></rect><rect x="19" y="12" width="2" height="6" rx="1"></rect></svg>
                        </button>`;
const newFsMixer = `<button class="control-button lexi-mixer-wrapper" id="fs-mixer-btn" title="Lexi Mixxer" aria-label="Toggle Lexi Mixer">
                             <div class="lexi-mixxer-blob"></div>
                        </button>`;

const oldMixer = `<button class="control-button" id="mixer-btn" title="Mixxer" aria-label="Toggle Mixer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="14" r="5"></circle>
                        <path d="M5 14 C 5 5, 11 3, 12 8 C 13 3, 19 5, 19 14"></path>
                        <rect x="3" y="12" width="2" height="6" rx="1"></rect>
                        <rect x="19" y="12" width="2" height="6" rx="1"></rect>
                    </svg>
                </button>`;
const newMixer = `<button class="control-button lexi-mixer-wrapper" id="mixer-btn" title="Lexi Mixxer" aria-label="Toggle Lexi Mixer">
                    <div class="lexi-mixxer-blob"></div>
                </button>`;

const oldMobMixer = `<button class="control-button" id="mob-mixer-btn" aria-label="Mixer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="5"></circle><path d="M5 14 C 5 5, 11 3, 12 8 C 13 3, 19 5, 19 14"></path><rect x="3" y="12" width="2" height="6" rx="1"></rect><rect x="19" y="12" width="2" height="6" rx="1"></rect></svg>
            <span style="font-size:10px;margin-top:3px;">Mixer</span>
        </button>`;
const newMobMixer = `<button class="control-button lexi-mixer-wrapper" id="mob-mixer-btn" aria-label="Lexi Mixer">
            <div class="lexi-mixxer-blob"></div>
            <span style="font-size:10px;margin-top:3px;">Lexi</span>
        </button>`;

code = code.replace(oldFsMixer, newFsMixer);
code = code.replace(oldMixer, newMixer);
code = code.replace(oldMobMixer, newMobMixer);

// Also add a container for the Lexi physics drag menu
if (!code.includes('lexi-drag-menu')) {
    code = code.replace('</body>', `
    <div id="lexi-drag-menu" class="lexi-drag-menu hidden">
        <button id="lexi-drag-cart" class="lexi-action-pill">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>Cart</span>
        </button>
        <button id="lexi-drag-chat" class="lexi-action-pill">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Chat</span>
        </button>
    </div>
    <!-- Script for chatbot logic since we need Lexi chat in harmonytunes -->
    <script type="module" src="/js/chatbot.js"></script>
    <!-- Script for Lexi drag physics -->
    <script type="module" src="/js/lexi-physics.js"></script>
</body>`);
}

fs.writeFileSync('harmonytunes.html', code, 'utf8');
console.log("HTML patched with Lexi mixxer blobs.");
