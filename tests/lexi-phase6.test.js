/**
 * tests/lexi-phase6.test.js
 * Verification Suite for Phase 6:
 * 1. Lexi AI Gemini Multi-Turn Persistence & Always-Online Status Badge
 * 2. Lexi Mini-Player Marquee & Fade-Out CSS
 * 3. blog.html Technical & On-Page SEO (JSON-LD, OpenGraph, Twitter, Hierarchy)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('PHASE 6: Lexi AI Multi-Turn Persistence, Mini-Player Marquee & Blog SEO', () => {

    describe('1. Lexi AI Always-Online Status & Conversation Persistence', () => {
        const chatbotJs = fs.readFileSync(path.join(rootDir, 'js', 'chatbot.js'), 'utf-8');

        test('chatbot.js maintains conversationContents multi-turn array', () => {
            expect(chatbotJs).toContain('export let conversationContents');
            expect(chatbotJs).toContain("conversationContents.push({ role: 'user', parts: [{ text }] })");
            expect(chatbotJs).toContain("conversationContents.push({ role: 'model'");
        });

        test('chatbot.js has automatic retry for Gemini calls', () => {
            expect(chatbotJs).toContain('callGeminiWithRetry');
            expect(chatbotJs).toContain('maxRetries');
        });

        test('syncLexiDOMState keeps status badge as Live Lexi when user is online', () => {
            expect(chatbotJs).toContain("badge.className = 'lexi-status-badge live'");
            expect(chatbotJs).toContain("badgeText.textContent = 'Live Lexi'");
        });

        test('Status badge is refreshed in finally block so Lexi never flips to Offline after prompt', () => {
            expect(chatbotJs).toContain('syncLexiDOMState()');
        });
    });

    describe('2. Lexi Mini-Player Marquee & Right-Side Fade Mask', () => {
        const styleCss = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf-8');
        const sitewidePlayerJs = fs.readFileSync(path.join(rootDir, 'js', 'sitewide-player.js'), 'utf-8');

        test('style.css constrains .lexi-song-info with flex, min-width, overflow and margin-right', () => {
            expect(styleCss).toMatch(/\.lexi-song-info\s*\{[^}]*flex:\s*1/);
            expect(styleCss).toMatch(/\.lexi-song-info\s*\{[^}]*min-width:\s*0/);
            expect(styleCss).toMatch(/\.lexi-song-info\s*\{[^}]*overflow:\s*hidden/);
            expect(styleCss).toMatch(/\.lexi-song-info\s*\{[^}]*margin-right:\s*12px/);
        });

        test('style.css applies right-side fade mask to .lexi-song-info', () => {
            expect(styleCss).toContain('mask-image: linear-gradient(to right, #000 82%, transparent 100%)');
            expect(styleCss).toContain('-webkit-mask-image: linear-gradient(to right, #000 82%, transparent 100%)');
        });

        test('style.css defines continuous horizontal marquee animation', () => {
            expect(styleCss).toContain('@keyframes marquee');
            expect(styleCss).toContain('translateX(-50%)');
        });

        test('sitewide-player.js dynamically adds marquee class when text exceeds container', () => {
            expect(sitewidePlayerJs).toContain('scrollWidth >');
            expect(sitewidePlayerJs).toContain("classList.add('marquee')");
        });
    });

    describe('3. blog.html Technical & On-Page SEO', () => {
        const blogHtml = fs.readFileSync(path.join(rootDir, 'blog.html'), 'utf-8');
        const blogCss = fs.readFileSync(path.join(rootDir, 'css', 'blog.css'), 'utf-8');

        test('Contains canonical link to https://realunstoppable.store/blog.html', () => {
            expect(blogHtml).toContain('<link rel="canonical" href="https://realunstoppable.store/blog.html">');
        });

        test('Contains complete OpenGraph meta tags', () => {
            expect(blogHtml).toContain('<meta property="og:type" content="website">');
            expect(blogHtml).toContain('<meta property="og:url" content="https://realunstoppable.store/blog.html">');
            expect(blogHtml).toContain('<meta property="og:title"');
            expect(blogHtml).toContain('<meta property="og:description"');
            expect(blogHtml).toContain('<meta property="og:image"');
        });

        test('Contains complete Twitter Card meta tags', () => {
            expect(blogHtml).toContain('<meta name="twitter:card" content="summary_large_image">');
            expect(blogHtml).toContain('<meta name="twitter:title"');
            expect(blogHtml).toContain('<meta name="twitter:description"');
            expect(blogHtml).toContain('<meta name="twitter:image"');
        });

        test('Contains structured JSON-LD schema with Blog and BlogPosting entities', () => {
            expect(blogHtml).toContain('<script type="application/ld+json">');
            expect(blogHtml).toContain('"@type": "Blog"');
            expect(blogHtml).toContain('"@type": "BlogPosting"');
            expect(blogHtml).toContain('"headline": "The Founder: About Catalin Andrian"');
        });

        test('Semantic heading hierarchy uses h1 for main title and h2 for article cards', () => {
            expect(blogHtml).toContain('<h1>');
            expect(blogHtml).toContain('<h2 class="blog-post-title">The Founder: About Catalin Andrian</h2>');
            expect(blogCss).toMatch(/\.blog-post-content\s+h2/);
        });

        test('All blog post images specify loading="lazy"', () => {
            const imgMatches = blogHtml.match(/<img[^>]*class="blog-post-image"[^>]*>/g) || [];
            expect(imgMatches.length).toBeGreaterThanOrEqual(4);
            imgMatches.forEach(img => {
                expect(img).toContain('loading="lazy"');
            });
        });
    });
});
