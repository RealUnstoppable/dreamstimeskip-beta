const fs = require('fs');
let code = fs.readFileSync('js/chatbot.js', 'utf8');

// 1. Add to systemInstruction
const targetStr = `- Use searchHarmonyTunesLibrary to find songs by artist or title when they ask about our library.
- If they ask for a song we DO NOT have, you MUST automatically use requestSongAddition to leave a request for the admin. Tell the user you have done so!`;
const replaceStr = `- Use searchHarmonyTunesLibrary to find songs by artist or title when they ask about our library.
- If they ask for a song we DO NOT have, you MUST automatically use requestSongAddition to leave a request for the admin. Tell the user you have done so!

DREAMS TIMESKIP POWERS:
- Use getDreamsCountdowns to read the live countdown timers for the launch dates of Dreams OG and Dreams TimeSkip.`;
code = code.replace(targetStr, replaceStr);


// 2. Add to tools array
const oldTools = `            {
                name: "requestSongAddition",`;
const newTools = `            {
                name: "getDreamsCountdowns",
                description: "Get the official launch dates and live countdowns for Dreams OG and Dreams TimeSkip.",
                parameters: {
                    type: "OBJECT",
                    properties: {}
                }
            },
            {
                name: "requestSongAddition",`;
code = code.replace(oldTools, newTools);

// 3. Add to function loop
const oldLoop = `                    } else if (call.name === "searchHarmonyTunesLibrary") {`;
const newLoop = `                    } else if (call.name === "getDreamsCountdowns") {
                        const now = new Date();
                        const ogDate = new Date("2026-10-01T12:00:00-04:00");
                        const tsDate = new Date("2027-01-15T12:00:00-05:00");
                        
                        const getDiff = (target) => {
                            const diff = target - now;
                            if (diff <= 0) return "Launched!";
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                            return \`\${days} days, \${hours} hours remaining\`;
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
                    } else if (call.name === "searchHarmonyTunesLibrary") {`;
code = code.replace(oldLoop, newLoop);

fs.writeFileSync('js/chatbot.js', code, 'utf8');
console.log("Chatbot tool added successfully.");
