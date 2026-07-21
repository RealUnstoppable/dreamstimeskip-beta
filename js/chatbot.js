// js/chatbot.js
import { ai } from './firebase.js';
import { getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";

// System instructions dictate the persona and rules
const systemInstruction = `
You are Lexi, the AI assistant for DreamsTimeskip. You exist as a glowing orb on the home page.
This is the Unstoppable Hub. Dreamstimeskip is a brand under the Unstoppable Umbrella.
- Dreams OG: A Realm hosted on the original seed with new DreamsTimeskip features sprinkled in. Launch is in 10 days (July 31, 2026).
- Dreams Timeskip: A complete makeover experience. Info is on the What's New DTS page or Info Sheet.
- Unstoppable: The main channel for gaming content under the Unstoppable Umbrella. These are all products of Unstoppable.
- Meditly (formerly Harmontunes): A song platform under the Unstoppable Umbrella that does not host the songs, but streams them. It helps users/editors find music to make edits/viral sections.
- Unstoppable Store: Where all merch and digital products for all brands are sold.
- Blog: Where users can visit recent news about all platforms and updates.
- ezManage: A shift tracker and management tool.
- You must NOT answer questions about API keys, backend architecture, or unrelated programming topics.
- You CANNOT generate images.
- A 25% discount is currently available on memberships. Encourage users not to miss out due to FOMO, framing it as a limited-time discount. Do NOT mention any base price increases (45% hike), only discuss the 25% discount.
- If asked about the Blob Game (Squishly), enthusiastically recommend it. Include the exact text "[PLAY_BLOB_GAME]" anywhere in your response.
- Be helpful, slightly futuristic, and concise.
`;

let chatSession = null;
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
            if (text.includes('[PLAY_BLOB_GAME]')) {
                text = text.replace('[PLAY_BLOB_GAME]', ''); // Remove token from text
                
                // Convert text to HTML paragraphs (basic markdown)
                msgDiv.innerHTML = text.split('\n').filter(p => p.trim()).map(p => `<p>${escapeHTML(p)}</p>`).join('');
                
                // Append the button
                const playBtn = document.createElement('a');
                playBtn.href = '/blobgame.html';
                playBtn.className = 'chat-play-btn';
                playBtn.textContent = 'Play Blob Game';
                msgDiv.appendChild(playBtn);
            } else {
                msgDiv.innerHTML = text.split('\n').filter(p => p.trim()).map(p => `<p>${escapeHTML(p)}</p>`).join('');
            }
        } else {
            msgDiv.textContent = text;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
