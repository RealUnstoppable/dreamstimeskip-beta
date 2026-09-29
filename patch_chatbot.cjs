const fs = require('fs');
let code = fs.readFileSync('js/chatbot.js', 'utf8');

// Add new imports
const newImports = `import { app, db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-vertexai.js";
import { librarySongs } from './song-data.js?v=20260920';`;
code = code.replace(/import \{ app \} from '\.\/firebase\.js';\nimport \{ getVertexAI, getGenerativeModel \} from "https:\/\/www\.gstatic\.com\/firebasejs\/11\.0\.1\/firebase-vertexai\.js";/, newImports);


// Update systemInstruction
const oldInstruction = 'const systemInstruction = `';
const newInstruction = `const systemInstruction = \`
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
- Medixly: Music platform (formerly HarmonyTunes) which is part of the Unstoppable Umbrella.
- Merch Store: Official shop selling the 'Unstoppable Hoodie', 'Unstoppable Cap', and 'Unstoppable Mug'.
- Blob Game: A super fun interactive minigame in the hub.
- Autolux: A premium mobile car detailing service.
- ezManage: A shift tracker and management tool.

MUSIC & HARMONYTUNES POWERS:
You have tools to interact with the user's music experience in HarmonyTunes (our music platform).
- Use getCurrentlyPlayingSong to tell the user what they are listening to.
- Use searchHarmonyTunesLibrary to find songs by artist or title when they ask about our library.
- If they ask for a song we DO NOT have, you MUST automatically use requestSongAddition to leave a request for the admin. Tell the user you have done so!

Formatting & Restrictions:
- You may use **bold** text and * **bullet items**.
- Do NOT answer questions about API keys or backend architecture.
- If the user asks about the Blob Game or asks to play a game, you must enthusiastically recommend the Blob Game and MUST include the exact text "[PLAY_BLOB_GAME]" anywhere in your response.
- Be helpful, slightly futuristic, concise, and enthusiastic.
\`;

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
];`;
// Find where systemInstruction starts and replace everything up to let chatSession = null;
code = code.replace(/const systemInstruction = `[\s\S]*?`;/, newInstruction);

// Update model initialization to include tools
code = code.replace(/model: "gemini-2.5-flash",\n\s+systemInstruction: systemInstruction,/, 'model: "gemini-2.5-flash",\n        systemInstruction: systemInstruction,\n        tools: tools,');

// Replace the sendMessage block inside chatbot.js
const oldSendMessage = `        try {
            // 3. Send to AI Logic
            const result = await chatSession.sendMessage(text);
            const responseText = result.response.text();
            
            // 4. Remove typing indicator & display response
            removeElement(typingId);
            addMessage(responseText, 'siri');
        } catch (error) {`;
const newSendMessage = `        try {
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
        } catch (error) {`;

code = code.replace(oldSendMessage, newSendMessage);

fs.writeFileSync('js/chatbot.js', code, 'utf8');
console.log("Chatbot patched!");
