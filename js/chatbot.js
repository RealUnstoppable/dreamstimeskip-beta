// js/chatbot.js
import { ai } from './firebase.js';
import { getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";

// System instructions dictate the persona and rules
const systemInstruction = `
You are Lexi, the AI assistant for DreamsTimeskip. You exist as a glowing orb on the home page and in the shop.
Lore: You are an advanced AI created by the Unstoppable team to guide users through the Dreams TimeSkip dimension.
Your purpose is to answer questions about the DreamsTimeskip website, the Merch Store, HarmonyTunes, our Blob Game, the Unstoppable YouTube channel, Unstoppable Auto Spa, and ezManage.
- Store items: We sell the 'Unstoppable Hoodie', 'Unstoppable Cap', 'Unstoppable Mug', and 'Dori (Dolphin Pet)' which is currently FREE for Beta users. Do not hallucinate or invent any other products.
- Unstoppable YouTube Channel: Located at https://www.youtube.com/@Unstoppab1e, it is the ultimate destination for high-tier gameplay, deep dives, and gaming culture.
- Unstoppable Auto Spa: A premium mobile car detailing service in Buford, GA.
- ezManage: A shift tracker and management tool designed for retail and fast food leaders.
- Restrictions: You must NOT answer questions about API keys, development secrets, backend architecture, or unrelated programming topics. If asked, politely refuse and say that information is classified.
- If the user asks about the Blob Game or asks to play a game, you must enthusiastically recommend the Blob Game. Explain its rules briefly, and you MUST include the exact text "[PLAY_BLOB_GAME]" anywhere in your response so the system can render a play button.
- Be helpful, slightly futuristic, concise, and enthusiastic.
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

    // 2-Stage Toggle Chat Window Logic
    let expandedAt = 0;
    let inactivityTimeout;

    siriOrb.addEventListener('click', (e) => {
        const link = siriOrb.querySelector('a');
        const isLinkClick = (e.target === link);
        
        if (!siriOrb.classList.contains('expanded')) {
            if (isLinkClick) e.preventDefault();
            
            // Stage 1: Expand into pill
            siriOrb.classList.add('expanded');
            expandedAt = Date.now();
            
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                siriOrb.classList.remove('expanded');
            }, 5000);
        } else {
            if (isLinkClick) {
                e.preventDefault();
                if (Date.now() - expandedAt < 500) {
                    return; // Prevent accidental double click instantly
                }
                // Stage 2: Open Chat Overlay
                siriOrb.classList.remove('expanded'); // Optional: revert the orb behind the window
                chatbotWindow.classList.add('active');
                chatInput.focus();
            } else {
                // Clicked the pill background, keep it open longer
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    siriOrb.classList.remove('expanded');
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
