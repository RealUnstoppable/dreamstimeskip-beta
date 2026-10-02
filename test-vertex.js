import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
import { firebaseConfig } from "./js/firebase.js"; // Wait, it's not exported. Let me just inline it.

const cfg = {
  apiKey: "AIzaSyBgrI9HwJPSc5b4pu2Egsv4DE7shNwptSw",
  projectId: "dts-hub-website",
  storageBucket: "dts-hub-website.firebasestorage.app",
};
const app = initializeApp(cfg);
const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

async function run() {
    try {
        const res = await model.generateContent("Say hello");
        console.log(res.response.text());
    } catch(e) {
        console.error("Vertex Error:", e);
    }
}
run();
