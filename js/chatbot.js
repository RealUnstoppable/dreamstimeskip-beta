// js/chatbot.js
import { app } from './firebase.js';
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";

// System instructions dictate the persona and rules
const systemInstruction = `
You are Lexi, the AI assistant for the Unstoppable Hub. You exist as a glowing orb on the home page and in the shop.

CRITICAL HUB CONCEPT & BRAND HIERARCHY:
- The **Unstoppable Hub** (under the **Unstoppable Umbrella**) is the true central portal and main ecosystem hub where users access all projects created by Unstoppable.
- You and the user are currently in the **Unstoppable Hub** (NOT inside Dreams TimeSkip).
- NEVER call Dreams TimeSkip "a portal to all things Unstoppable" or "the dimension/hub you guide users through". It is the OPPOSITE: Unstoppable Umbrella is the main hub of the entire ecosystem, and Dreams is just ONE of the projects under the Unstoppable Umbrella.

Brand Structure & Ventures under the Unstoppable Umbrella:
- Unstoppable: The parent brand and central ecosystem. "Unstoppable" is also our gaming channel (https://www.youtube.com/@Unstoppab1e), which features high-tier gameplay, deep dives, and gaming culture.
- Dreams: A product line under the Unstoppable Umbrella. There are 2 distinct versions:
  1. Dreams TimeSkip (DTS): An upcoming product launching in about a year (there is a live countdown timer on the dreamstimeskip page!).
  2. Dreams OG: A nostalgic trip down memory lane highlighting our classic original Minecraft realms server history.
- Medixly: Music platform (formerly HarmonyTunes) which is part of the Unstoppable Umbrella.
- Merch Store: Official shop selling the 'Unstoppable Hoodie', 'Unstoppable Cap', and 'Unstoppable Mug'. Do NOT mention Dori or any dolphin pet. Do not hallucinate or invent any other products.
- Blob Game: A super fun interactive minigame in the hub.
- Autolux: A premium mobile car detailing service in Buford, GA (formerly Unstoppable Auto Spa).
- ezManage: A shift tracker and management tool designed for retail and fast food leaders.

Answering "What is DTS?" or "What is Dreams TimeSkip?":
- Correct any misconception: Explain that DTS refers to **Dreams TimeSkip**, which is a product of Unstoppable under the Unstoppable Umbrella—it is NOT the central hub itself.
- Clarify that you and the user are currently in the **Unstoppable Hub**, which serves as the main portal to all Unstoppable projects.
- Explain that Dreams TimeSkip is an upcoming project releasing in about a year (with a live countdown timer on the dreamstimeskip page).
- Contrast Dreams TimeSkip with Dreams OG (a trip down memory lane and the old Minecraft realms server).
- Mention that Unstoppable is the gaming channel under the Unstoppable Brand, and Medixly (formerly HarmonyTunes) is also part of the Unstoppable Umbrella alongside the Merch Store, Blob Game, Autolux (car detailing), and ezManage.

Formatting & Restrictions:
- You may use **bold** text and * **bullet items** in your formatting.
- You must NOT answer questions about API keys, development secrets, backend architecture, or unrelated programming topics. If asked, politely refuse and say that information is classified.
- If the user asks about the Blob Game or asks to play a game, you must enthusiastically recommend the Blob Game. Explain its rules briefly, and you MUST include the exact text "[PLAY_BLOB_GAME]" anywhere in your response so the system can render a play button.
- Be helpful, slightly futuristic, concise, and enthusiastic.
`;

let chatSession = null;
const ai = getVertexAI(app);
try {
    // Initialize Gemini 2.5 Flash
    const model = getGenerativeModel(ai, {
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
        }
    });
    chatSession = model.startChat({
        history: [] // Start with empty history
    });
} catch (error) {
    console.error("Manager info: [AI Model Initialization Failed]", error);
}

document.addEventListener('DOMContentLoaded', () => {
    const siriOrb = document.getElementById('siri-orb');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    if (!siriOrb || !chatbotWindow) return;

    // Inject Cart Glyph and Badge into Siri Orb
    const cartGlyph = document.createElement('span');
    cartGlyph.className = 'material-icons lexi-cart-glyph';
    cartGlyph.textContent = 'shopping_cart';
    siriOrb.appendChild(cartGlyph);

    const cartBadge = document.createElement('div');
    cartBadge.className = 'lexi-cart-badge hidden';
    cartBadge.id = 'lexi-cart-badge';
    cartBadge.textContent = '0';
    siriOrb.appendChild(cartBadge);

    // Global Functions for Cart Integration
    window.updateLexiCartCount = function(count) {
        if (!cartBadge) return;
        if (count > 0) {
            cartBadge.textContent = count;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    };

    window.animateItemToLexi = function(startX, startY) {
        if (!siriOrb) return;
        
        const orbRect = siriOrb.getBoundingClientRect();
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
            // Slight pop effect on the badge
            cartBadge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 150);
        }, 800);
    };

    // 2-Stage Toggle Chat Window Logic
    let expandedAt = 0;
    let inactivityTimeout;

    siriOrb.addEventListener('click', (e) => {
        const isCartClick = e.target.closest('#lexi-view-cart');
        const isAskClick = e.target.closest('#lexi-ask');
        
        if (!siriOrb.classList.contains('expanded')) {
            // Stage 1: Expand into pill
            siriOrb.classList.add('expanded');
            expandedAt = Date.now();
            
            // Render the options
            siriOrb.innerHTML = `
                <div class="lexi-pill-options">
                    <button id="lexi-view-cart" class="lexi-pill-btn"><span class="material-icons">shopping_cart</span> View Cart</button>
                    <button id="lexi-ask" class="lexi-pill-btn"><span class="material-icons">chat</span> Ask Lexi</button>
                </div>
            `;
            
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                siriOrb.classList.remove('expanded');
                siriOrb.innerHTML = ''; // reset to default orb look
            }, 5000);
        } else {
            if (isCartClick) {
                // Open the cart modal
                const cartModal = document.getElementById('cart-modal');
                if (cartModal) {
                    cartModal.style.display = 'block';
                } else {
                    window.location.href = '/checkout.html';
                }
                siriOrb.classList.remove('expanded');
                siriOrb.innerHTML = '';
            } else if (isAskClick) {
                if (Date.now() - expandedAt < 500) {
                    return; // Prevent accidental double click instantly
                }
                // Stage 2: Open Chat Overlay
                siriOrb.classList.remove('expanded');
                siriOrb.innerHTML = '';
                chatbotWindow.classList.add('active');
                chatInput.focus();
            } else {
                // Clicked elsewhere on the pill, keep it open longer
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    siriOrb.classList.remove('expanded');
                    siriOrb.innerHTML = '';
                }, 5000);
            }
        }
    });

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
            const result = await chatSession.sendMessage(text);
            const responseText = result.response.text();
            
            // 4. Remove typing indicator & display response
            removeElement(typingId);
            addMessage(responseText, 'siri');
        } catch (error) {
            console.error("Chat Error:", error);
            removeElement(typingId);
            addMessage(`I'm sorry, my neural link is experiencing interference: ${error.message || error}. Please try again later.`, 'siri');
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
});
