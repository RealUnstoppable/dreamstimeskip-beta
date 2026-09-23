// js/chatbot.js
import { app, db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";
import { librarySongs } from './song-data.js?v=20260920';

// System instructions dictate the persona and rules
const systemInstruction = `
You are Lexi, the AI assistant for the Unstoppable Hub. You exist as a glowing orb on the home page and in the shop.

CRITICAL HUB CONCEPT & BRAND HIERARCHY:
- The **Unstoppable Hub** (under the **Unstoppable Umbrella**) is the true central portal and main ecosystem hub where users access all projects created by Unstoppable.
- You and the user are currently in the **Unstoppable Hub** (NOT inside Dreams TimeSkip).
- NEVER call Dreams TimeSkip "a portal to all things Unstoppable" or "the dimension/hub you guide users through". It is the OPPOSITE: Unstoppable Umbrella is the main hub of the entire ecosystem, and Dreams is just ONE of the projects under the Unstoppable Umbrella.

Brand Structure & Ventures under the Unstoppable Umbrella:
- Unstoppable: The parent brand and central ecosystem. "Unstoppable" is also our gaming channel (https://www.youtube.com/@Unstoppab1e).
- Dreams: A product line under the Unstoppable Umbrella. 
  1. Dreams TimeSkip (DTS): An upcoming product launching in about a year (there is a live countdown timer on the dreamstimeskip page!).
  2. Dreams OG: A nostalgic trip down memory lane.
- Medixly: Our newly rebranded music platform (formerly HarmonyTunes) under the Unstoppable Umbrella. The name changed because it is much more than just music now—it's a hub for editors, creators, and casual listeners to hear all their favorite songs or just specific parts of them. It's all up to the user, and the new brand better reflects this company purpose.
- Merch Store: Official shop selling the 'Unstoppable Hoodie', 'Unstoppable Cap', and 'Unstoppable Mug'.
- Blob Game: A super fun interactive minigame in the hub.
- Autolux: A premium mobile car detailing service.
- ezManage: A shift tracker and management tool.

MUSIC & HARMONYTUNES POWERS:
You have tools to interact with the user's music experience in HarmonyTunes (our music platform).
- Use getCurrentlyPlayingSong to tell the user what they are listening to.
- Use searchHarmonyTunesLibrary to find songs by artist or title when they ask about our library.
- If they ask for a song we DO NOT have, you MUST automatically use requestSongAddition to leave a request for the admin. Tell the user you have done so!

DREAMS TIMESKIP POWERS:
- Use getDreamsCountdowns to read the live countdown timers for the launch dates of Dreams OG and Dreams TimeSkip.

Formatting & Restrictions:
- You may use **bold** text and * **bullet items**.
- Do NOT answer questions about API keys or backend architecture.
- If the user asks about the Blob Game or asks to play a game, you must enthusiastically recommend the Blob Game and MUST include the exact text "[PLAY_BLOB_GAME]" anywhere in your response.
- Be helpful, slightly futuristic, concise, and enthusiastic.
`;

const tools = [
    {
        functionDeclarations: [
            {
                name: "getCurrentlyPlayingSong",
                description: "Get information about the song that is currently playing in the sitewide music player (HarmonyTunes).",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "searchHarmonyTunesLibrary",
                description: "Search the HarmonyTunes music library for a specific song or artist. Call this when the user asks what songs we have, or asks for a specific song.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: {
                            type: "STRING",
                            description: "The song or artist to search for. Leave blank to return the whole library."
                        }
                    }
                }
            },
            {
                name: "getDreamsCountdowns",
                description: "Get the official launch dates and live countdowns for Dreams OG and Dreams TimeSkip.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "requestSongAddition",
                description: "Submit a request to the admin to add a new song to the HarmonyTunes library if it doesn't currently exist. ONLY call this if you verified the song is NOT in the library.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        songName: {
                            type: "STRING",
                            description: "The title of the song being requested"
                        },
                        artistName: {
                            type: "STRING",
                            description: "The artist of the song being requested"
                        }
                    },
                    required: ["songName", "artistName"]
                }
            }
        ]
    }
];

let chatSession = null;
const ai = getVertexAI(app);
try {
    // Initialize Gemini 2.5 Flash
    const model = getGenerativeModel(ai, {
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
        tools: tools,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
        }
    });
    chatSession = model.startChat({
        history: [] // Start with empty history
    });
} catch (error) {
    console.error("AI Model Initialization Failed", error);
}

function initChatbot() {
    let chatbotWindow = document.getElementById('chatbot-window');
    
    // Inject Chatbot HTML if not present
    if (!chatbotWindow) {
        chatbotWindow = document.createElement('div');
        chatbotWindow.id = 'chatbot-window';
        chatbotWindow.className = 'chatbot-overlay';
        chatbotWindow.innerHTML = `
            <div class="chatbot-header">
                <h3>Lexi</h3>
                <button id="chatbot-close" class="chatbot-close" aria-label="Close chat" title="Close chat">&times;</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chat-msg siri">
                    <p>Hello! I'm Lexi. I can help you navigate the Unstoppable Hub, recommend games, or answer questions about the Unstoppable ecosystem and Dreams TimeSkip.</p>
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Ask Lexi..." autocomplete="off" aria-label="Chat input">
                <button id="chatbot-send" aria-label="Send Message" title="Send Message" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        `;
        document.body.appendChild(chatbotWindow);
    }

    const closeBtn = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    // Global Functions for Cart Integration
    window.updateLexiCartCount = function(count) {
        const cartBadge = document.getElementById('lexi-cart-badge') || document.querySelector('.lexi-cart-badge');
        if (!cartBadge) return;
        if (count > 0) {
            cartBadge.textContent = count;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    };

    window.openLexiChat = function() {
        if (chatbotWindow) {
            chatbotWindow.classList.add('active');
            if (chatInput) chatInput.focus();
        }
    };

    window.animateItemToLexi = function(startX, startY) {
        const targetOrb = document.getElementById('siri-orb');
        if (!targetOrb) return;
        
        const orbRect = targetOrb.getBoundingClientRect();
        const endX = orbRect.left + orbRect.width / 2;
        const endY = orbRect.top + orbRect.height / 2;

        const particle = document.createElement('div');
        particle.className = 'fly-to-cart';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        document.body.appendChild(particle);

        // Force reflow
        particle.getBoundingClientRect();

        particle.style.left = `${endX}px`;
        particle.style.top = `${endY}px`;
        particle.style.transform = 'scale(0.2)';
        particle.style.opacity = '0';

        setTimeout(() => {
            particle.remove();
            const badge = document.getElementById('lexi-cart-badge') || document.querySelector('.lexi-cart-badge');
            if (badge) {
                badge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 150);
            }
        }, 800);
    };

    closeBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Handle Input
    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text || !chatSession) return;

        // 1. Add user message to UI
        addMessage(text, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;

        // 2. Add typing indicator
        const typingId = addTypingIndicator();

        try {
            // 3. Send to AI Logic
            let result = await chatSession.sendMessage(text);
            
            let calls = result.response.functionCalls ? (typeof result.response.functionCalls === 'function' ? result.response.functionCalls() : result.response.functionCalls) : [];
            
            while (calls && calls.length > 0) {
                const functionResponses = [];
                for (const call of calls) {
                    let callResult = null;
                    if (call.name === "getCurrentlyPlayingSong") {
                        if (window.DTSMusic) {
                            const song = window.DTSMusic.getCurrentSong();
                            callResult = { song: song.title, artist: song.artist, isPlaying: !window.DTSMusic.audio.paused };
                        } else {
                            callResult = { error: "No music player active." };
                        }
                    } else if (call.name === "getDreamsCountdowns") {
                        const now = new Date();
                        const ogDate = new Date("2026-10-01T12:00:00-04:00");
                        const tsDate = new Date("2027-01-15T12:00:00-05:00");
                        
                        const getDiff = (target) => {
                            const diff = target - now;
                            if (diff <= 0) return "Launched!";
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                            return `${days} days, ${hours} hours remaining`;
                        };

                        callResult = { 
                            currentDate: now.toISOString(),
                            dreamsOG: {
                                launchDate: "October 1, 2026",
                                countdown: getDiff(ogDate)
                            },
                            dreamsTimeSkip: {
                                launchDate: "January 15, 2027",
                                countdown: getDiff(tsDate)
                            }
                        };
                    } else if (call.name === "searchHarmonyTunesLibrary") {
                        const query = (call.args.query || "").toLowerCase();
                        let matches = librarySongs.map(s => ({ title: s.title, artist: s.artist }));
                        if (query) {
                            matches = matches.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
                        }
                        callResult = { results: matches };
                    } else if (call.name === "requestSongAddition") {
                        try {
                            await addDoc(collection(db, "song_requests"), {
                                songName: call.args.songName,
                                artistName: call.args.artistName,
                                requestedAt: serverTimestamp(),
                                status: "pending"
                            });
                            callResult = { success: true, message: "Song request submitted to admin." };
                        } catch (e) {
                            callResult = { success: false, error: e.message };
                        }
                    }

                    functionResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: callResult
                        }
                    });
                }
                result = await chatSession.sendMessage(functionResponses);
                calls = result.response.functionCalls ? (typeof result.response.functionCalls === 'function' ? result.response.functionCalls() : result.response.functionCalls) : [];
            }
            
            const responseText = result.response.text();
            
            // 4. Remove typing indicator & display response
            removeElement(typingId);
            addMessage(responseText, 'siri');
        } catch (error) {
            console.error("Manager info: Chat Error ", error);
            removeElement(typingId);
            addMessage('Lexi is sleeping right now. Check back later!', 'siri');
        } finally {
            sendBtn.disabled = false;
            chatInput.focus();
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Listen to input to enable/disable button
    chatInput.addEventListener('input', () => {
        sendBtn.disabled = chatInput.value.trim().length === 0;
    });

    // UI Helpers
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        if (sender === 'siri') {
            // Check for Blob Game token
            let hasBlobGameToken = text.includes('[PLAY_BLOB_GAME]');
            if (hasBlobGameToken) {
                text = text.replace('[PLAY_BLOB_GAME]', ''); // Remove token from text
            }
            
            msgDiv.innerHTML = parseMarkdown(text);
            
            if (hasBlobGameToken) {
                const playBtn = document.createElement('a');
                playBtn.href = '/blobgame.html';
                playBtn.className = 'chat-play-btn';
                playBtn.textContent = 'Play Blob Game';
                msgDiv.appendChild(playBtn);
            }
        } else {
            msgDiv.textContent = text;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function parseMarkdown(text) {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.map(line => {
            let trimmed = line.trim();
            if (!trimmed) return '';

            let isBullet = false;
            if (/^[\*\-]\s+/.test(trimmed)) {
                isBullet = true;
                trimmed = trimmed.replace(/^[\*\-]\s+/, '');
            }

            let html = escapeHTML(trimmed);
            // Replace **bold** with <strong>bold</strong>
            html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
            // Replace *italic* or _italic_ with <em>italic</em>
            html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
            // Replace markdown links [text](url)
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: underline;">$1</a>');

            if (isBullet) {
                return `<p class="chat-bullet"><span class="bullet-dot">•</span> ${html}</p>`;
            }
            return `<p>${html}</p>`;
        }).filter(p => p !== '').join('');
    }

    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = id;
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function escapeHTML(str) {
        if (str == null) return "";
        if (typeof str !== 'string') str = String(str);
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
