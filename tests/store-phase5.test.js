/**
 * tests/store-phase5.test.js
 * Comprehensive Verification Suite for Phase 5:
 * 1. Global Header Cleanup (Memberships removed, Cart text replaced with 🛒 icon + live badge)
 * 2. Featured Memberships (Medixly Premium $1.00 / 90% OFF & Ultra $1.00 / 95% OFF pinned at top)
 * 3. Title & Subtitle Left Alignment (shop.css)
 * 4. True Discount Mathematical Calculation (Math.round(((orig - sale) / orig) * 100) + '% OFF')
 * 5. Store Sorting & Detail Modal Discount Integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProductPricing } from '../js/products-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('PHASE 5: Store & Global Header Overhaul', () => {

    describe('1. Global Header Navigation Cleanup', () => {
        const navbarJs = fs.readFileSync(path.join(rootDir, 'js', 'navbar.js'), 'utf-8');

        test('Removes Memberships nav link from sitewide header navigation', () => {
            // Should not have a top nav link for memberships.html
            expect(navbarJs).not.toMatch(/<a[^>]*href="memberships\.html"[^>]*class="nav-link"[^>]*>Memberships<\/a>/i);
            expect(navbarJs).not.toMatch(/<li><a[^>]*href="memberships\.html"[^>]*>Memberships<\/a><\/li>/i);
        });

        test('Replaces text Cart with 🛒 cart icon in standard navigation bar', () => {
            expect(navbarJs).toContain('nav-cart-icon');
            expect(navbarJs).toContain('🛒');
            expect(navbarJs).toContain('nav-cart-badge');
        });
    });

    describe('2. Shop Layout & Title Alignment', () => {
        const shopCss = fs.readFileSync(path.join(rootDir, 'css', 'shop.css'), 'utf-8');
        const storeHtml = fs.readFileSync(path.join(rootDir, 'store.html'), 'utf-8');

        test('Left-aligns .shop-header, .shop-header h1, and .shop-header p in shop.css', () => {
            expect(shopCss).toMatch(/\.shop-header\s*\{[^}]*text-align:\s*left/);
            expect(shopCss).toMatch(/\.shop-header\s+h1\s*\{[^}]*text-align:\s*left/);
            expect(shopCss).toMatch(/\.shop-header\s+p\s*\{[^}]*text-align:\s*left/);
        });

        test('store.html features Medixly Premium and Ultra membership cards at the top', () => {
            expect(storeHtml).toContain('featured-memberships-spotlight');
            expect(storeHtml).toContain('Medixly Premium');
            expect(storeHtml).toContain('Medixly Ultra');
            expect(storeHtml).toContain('90% OFF');
            expect(storeHtml).toContain('95% OFF');
            expect(storeHtml).toContain('$1.00');
        });
    });

    describe('3. True Discount Percentage Math', () => {
        test('Calculates mathematically accurate discount for $9.99 -> $1.00 (90% OFF)', () => {
            const pricing = getProductPricing({
                price: 9.99,
                originalPrice: 9.99,
                salePrice: 1.00
            });
            expect(pricing.discount).toBe('90% OFF');
            expect(pricing.isOnSale).toBe(true);
            expect(pricing.salePrice).toBe(1.00);
        });

        test('Calculates mathematically accurate discount for $19.99 -> $1.00 (95% OFF)', () => {
            const pricing = getProductPricing({
                price: 19.99,
                originalPrice: 19.99,
                salePrice: 1.00
            });
            expect(pricing.discount).toBe('95% OFF');
            expect(pricing.isOnSale).toBe(true);
            expect(pricing.salePrice).toBe(1.00);
        });

        test('No discount badge if salePrice >= originalPrice', () => {
            const pricing = getProductPricing({
                price: 25.00,
                originalPrice: 25.00,
                salePrice: 25.00
            });
            expect(pricing.discount).toBeNull();
            expect(pricing.isOnSale).toBe(false);
        });

        test('ui-utils.js generates dynamic discount badge based on true math', () => {
            const uiUtilsJs = fs.readFileSync(path.join(rootDir, 'js', 'ui-utils.js'), 'utf-8');
            expect(uiUtilsJs).toContain('Math.round(((origPrice - currentSalePrice) / origPrice) * 100)');
        });
    });

    describe('4. Store Sort Controls & Detail Modal', () => {
        const storeHtml = fs.readFileSync(path.join(rootDir, 'store.html'), 'utf-8');
        const shopJs = fs.readFileSync(path.join(rootDir, 'js', 'shop.js'), 'utf-8');

        test('store.html has #shop-sort-select with required sorting options', () => {
            expect(storeHtml).toContain('id="shop-sort-select"');
            expect(storeHtml).toContain('value="featured"');
            expect(storeHtml).toContain('value="price-asc"');
            expect(storeHtml).toContain('value="price-desc"');
            expect(storeHtml).toContain('value="name-asc"');
            expect(storeHtml).toContain('value="rating"');
        });

        test('shop.js implements sorting logic in renderProducts', () => {
            expect(shopJs).toContain("const sortSelect = document.getElementById('shop-sort-select');");
            expect(shopJs).toContain("priceA - priceB");
            expect(shopJs).toContain("priceB - priceA");
            expect(shopJs).toContain("localeCompare");
        });

        test('shop.js recalculates discount in openReviewsModal for detail popup', () => {
            expect(shopJs).toContain('detail-discount-badge');
            expect(shopJs).toContain('Math.round(((origPrice - salePrice) / origPrice) * 100)');
        });
    });
});
