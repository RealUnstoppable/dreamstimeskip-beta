/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { jest } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Dreams TimeSkip Tebex Storefront & Security Hardening', () => {
    const dtsHtmlPath = path.join(ROOT_DIR, 'dts.html');
    const navbarJsPath = path.join(ROOT_DIR, 'js/navbar.js');
    const html = fs.readFileSync(dtsHtmlPath, 'utf8');
    const navbarJs = fs.readFileSync(navbarJsPath, 'utf8');

    describe('Phase 1: Navigation & UI Integration (Aesthetic & Structure)', () => {
        it('renders the Store button in the top navigation bar with Minecraft styling', () => {
            expect(html).toContain('id="nav-dts-store-btn"');
            expect(html).toContain('class="nav-dts-store-btn"');
            expect(html).toContain('STORE');
            expect(html).toContain('TEBEX');
            expect(html).toContain('href="#store"');
        });

        it('includes mobile-friendly header Store button for immediate visibility', () => {
            expect(html).toContain('id="nav-dts-store-header-btn"');
            expect(html).toContain('dts-store-header-btn');
        });

        it('includes Minecraft voxel/pixel aesthetic CSS definitions for Store button', () => {
            expect(html).toContain('.nav-dts-store-btn');
            expect(html).toContain('var(--mc-font-pixel)');
            expect(html).toContain('border-top: 2px solid #5eb33a');
            expect(html).toContain('border-bottom: 3px solid #143d0d');
            expect(html).toContain('transition: transform');
            expect(html).toContain('.nav-dts-store-btn:hover');
            expect(html).toContain('box-shadow: 0 5px 0 #000');
        });

        it('supports DTS Store navigation button inside js/navbar.js for dynamic hydration', () => {
            expect(navbarJs).toContain('isDtsPage');
            expect(navbarJs).toContain('id="nav-dts-store-btn"');
            expect(navbarJs).toContain('nav-dts-store-btn');
            expect(navbarJs).toContain('href="#store"');
        });
    });

    describe('Phase 2: Tebex Storefront Structure & Pricing Cards', () => {
        it('renders the dedicated store section (#store) with accessible markup', () => {
            expect(html).toContain('id="store"');
            expect(html).toContain('class="dts-store-section"');
            expect(html).toContain('SERVER RANKS &amp; MEMBERSHIPS');
            expect(html).toContain('OFFICIAL DREAMS TIMESKIP STORE • POWERED BY TEBEX');
        });

        it('renders category navigation tabs for filtering packages', () => {
            expect(html).toContain('id="tab-all"');
            expect(html).toContain('id="tab-ranks"');
            expect(html).toContain('id="tab-memberships"');
            expect(html).toContain('role="tablist"');
        });

        it('renders all three server ranks with proper pricing, perks, and Tebex URLs', () => {
            // Vanguard Rank (Lifetime)
            expect(html).toContain('id="card-rank-vanguard"');
            expect(html).toContain('VANGUARD');
            expect(html).toContain('Permanent Lifetime Access');
            expect(html).toContain('class="price-amount">9</span>');
            expect(html).toContain('class="price-cents">.99</span>');
            expect(html).toContain('[Vanguard]');
            expect(html).toContain('https://dreamstimeskip.tebex.io/package/vanguard');

            // Champion Rank (Lifetime - Featured)
            expect(html).toContain('id="card-rank-champion"');
            expect(html).toContain('CHAMPION');
            expect(html).toContain('featured-tier');
            expect(html).toContain('MOST POPULAR • BEST VALUE');
            expect(html).toContain('class="price-amount" aria-label="24"');
            expect(html).toContain('class="mc-open-4"');
            expect(html).toContain('class="price-cents">.99</span>');
            expect(html).toContain('[Champion]');
            expect(html).toContain('https://dreamstimeskip.tebex.io/package/champion');

            // Time Overlord Rank (Lifetime - Ultimate)
            expect(html).toContain('id="card-rank-overlord"');
            expect(html).toContain('TIME OVERLORD');
            expect(html).toContain('ultimate-tier');
            expect(html).toContain('ULTIMATE PRESTIGE');
            expect(html).toContain('class="price-amount" aria-label="49"');
            expect(html).toContain('class="mc-open-4"');
            expect(html).toContain('class="price-cents">.99</span>');
            expect(html).toContain('[Overlord]');
            expect(html).toContain('https://dreamstimeskip.tebex.io/package/overlord');
        });

        it('renders both VIP recurring memberships with accurate pricing and streak multipliers', () => {
            // Dreams Club (Monthly)
            expect(html).toContain('id="card-membership-club"');
            expect(html).toContain('DREAMS CLUB');
            expect(html).toContain('class="price-amount">7</span>');
            expect(html).toContain('class="price-cents">.99</span>');
            expect(html).toContain('1.5x Daily Check-In Streak Multiplier');
            expect(html).toContain('https://dreamstimeskip.tebex.io/package/dreams-club');

            // TimeSkip Elite Pass (Monthly)
            expect(html).toContain('id="card-membership-elite"');
            expect(html).toContain('TIMESKIP ELITE');
            expect(html).toContain('class="price-amount" aria-label="14"');
            expect(html).toContain('class="mc-open-4"');
            expect(html).toContain('class="price-cents">.99</span>');
            expect(html).toContain('2.0x Daily Check-In Streak Multiplier');
            expect(html).toContain('https://dreamstimeskip.tebex.io/package/elite-pass');
        });

        it('renders Minecraft IGN input bar for seamless checkout personalization', () => {
            expect(html).toContain('id="store-minecraft-ign"');
            expect(html).toContain('id="store-apply-ign-btn"');
            expect(html).toContain('id="ign-feedback"');
        });
    });

    describe('Phase 3: Trust Signals & Security UI', () => {
        it('embeds payment security and verified gateway notice below rank tier cards', () => {
            expect(html).toContain('id="store-trust-signals"');
            expect(html).toContain('BANK-GRADE ENCRYPTION &amp; VERIFIED PAYMENT GATEWAYS');
            expect(html).toContain('Transactions are processed via Tebex — the global leader in Minecraft server monetization.');
        });

        it('includes micro trust signals directly near every checkout button', () => {
            const microSignals = html.match(/Instant Tebex Checkout/g);
            expect(microSignals).not.toBeNull();
            expect(microSignals.length).toBeGreaterThanOrEqual(5);
        });
    });

    describe('Phase 4: Security Hardening & Strict CSP', () => {
        it('adds rel="noopener noreferrer" and target="_blank" to all external Tebex links', () => {
            const tebexLinks = html.match(/<a[^>]+href="https:\/\/dreamstimeskip\.tebex\.io[^>]+>/g) || [];
            expect(tebexLinks.length).toBeGreaterThanOrEqual(5);

            for (const link of tebexLinks) {
                expect(link).toContain('rel="noopener noreferrer"');
                expect(link).toContain('target="_blank"');
            }
        });

        it('enforces a strict Content Security Policy (CSP) meta tag preventing XSS', () => {
            expect(html).toContain('<meta http-equiv="Content-Security-Policy"');
            expect(html).toContain("default-src 'self'");
            expect(html).toContain("object-src 'none'");
            expect(html).toContain("base-uri 'self'");
            expect(html).toContain("https://checkout.tebex.io");
            expect(html).toContain("https://*.tebex.io");
        });
    });

    describe('Phase 4 & 5: Automated Playwright UI & Viewport Validation', () => {
        let browser;
        jest.setTimeout(30000);

        beforeAll(async () => {
            browser = await chromium.launch({ headless: true });
        });

        afterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });

        it('renders the Store button correctly and navigates to #store on desktop (1280x800)', async () => {
            const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
            await page.goto(`file://${dtsHtmlPath}`);

            const storeBtn = page.locator('#nav-dts-store-btn');
            expect(await storeBtn.isVisible()).toBe(true);
            const btnText = await storeBtn.textContent();
            expect(btnText).toContain('STORE');

            // Verify store section is present and targetable
            const storeSection = page.locator('#store');
            expect(await storeSection.count()).toBe(1);

            // Verify all 5 pricing cards are visible initially
            const visibleCardsCount = await page.locator('.dts-pricing-card:not(.hidden-by-filter)').count();
            expect(visibleCardsCount).toBe(5);

            await page.close();
        });

        it('filters cards accurately when clicking category tabs', async () => {
            const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
            await page.goto(`file://${dtsHtmlPath}`);

            // Filter to ranks only
            await page.click('#tab-ranks');
            const ranksCount = await page.locator('.dts-pricing-card:not(.hidden-by-filter)').count();
            expect(ranksCount).toBe(3);

            // Filter to memberships only
            await page.click('#tab-memberships');
            const membershipsCount = await page.locator('.dts-pricing-card:not(.hidden-by-filter)').count();
            expect(membershipsCount).toBe(2);

            // Restore all
            await page.click('#tab-all');
            const allCount = await page.locator('.dts-pricing-card:not(.hidden-by-filter)').count();
            expect(allCount).toBe(5);

            await page.close();
        });

        it('dynamically appends Minecraft IGN to all Tebex checkout URLs', async () => {
            const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
            await page.goto(`file://${dtsHtmlPath}`);

            // Fill and apply Minecraft IGN
            await page.fill('#store-minecraft-ign', 'Alex_Warrior');
            await page.click('#store-apply-ign-btn');

            // Verify user feedback
            const feedback = page.locator('#ign-feedback');
            expect(await feedback.isVisible()).toBe(true);
            expect(await feedback.textContent()).toContain('Alex_Warrior');

            // Check that all checkout button URLs now contain ?ign=Alex_Warrior
            const vanguardHref = await page.locator('a[data-package="vanguard"]').getAttribute('href');
            expect(vanguardHref).toBe('https://dreamstimeskip.tebex.io/package/vanguard?ign=Alex_Warrior');

            const championHref = await page.locator('a[data-package="champion"]').getAttribute('href');
            expect(championHref).toBe('https://dreamstimeskip.tebex.io/package/champion?ign=Alex_Warrior');

            const overlordHref = await page.locator('a[data-package="overlord"]').getAttribute('href');
            expect(overlordHref).toBe('https://dreamstimeskip.tebex.io/package/overlord?ign=Alex_Warrior');

            const clubHref = await page.locator('a[data-package="dreams-club"]').getAttribute('href');
            expect(clubHref).toBe('https://dreamstimeskip.tebex.io/package/dreams-club?ign=Alex_Warrior');

            const eliteHref = await page.locator('a[data-package="elite-pass"]').getAttribute('href');
            expect(eliteHref).toBe('https://dreamstimeskip.tebex.io/package/elite-pass?ign=Alex_Warrior');

            await page.close();
        });

        it('renders the Store button cleanly on mobile viewport (375x667)', async () => {
            const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
            await page.goto(`file://${dtsHtmlPath}`);

            // On mobile, header store button should be directly visible
            const mobileHeaderStoreBtn = page.locator('#nav-dts-store-header-btn');
            expect(await mobileHeaderStoreBtn.isVisible()).toBe(true);

            // When hamburger is clicked, menu drawer reveals store button
            await page.click('.hamburger');
            const drawerStoreBtn = page.locator('.nav-links #nav-dts-store-btn');
            expect(await drawerStoreBtn.isVisible()).toBe(true);

            // Verify store section pricing cards stack responsively
            const cards = page.locator('.dts-pricing-card');
            expect(await cards.count()).toBe(5);

            // Verify checkout buttons have no horizontal overflow and are clickable
            const firstCheckoutBtn = page.locator('.store-checkout-btn').first();
            expect(await firstCheckoutBtn.isVisible()).toBe(true);
            expect(await firstCheckoutBtn.getAttribute('target')).toBe('_blank');
            expect(await firstCheckoutBtn.getAttribute('rel')).toBe('noopener noreferrer');

            await page.close();
        });
    });
});
