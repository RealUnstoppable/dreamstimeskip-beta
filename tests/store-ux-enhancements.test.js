import { generateProductCardHtml } from '../js/ui-utils.js';
import { products } from '../js/products-data.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Store UX Enhancements: Rating Trigger, Clean Descriptions, Expanded Add to Cart & Sale Badge', () => {
    const testProduct = {
        id: 'unstoppable-hoodie',
        name: 'Unstoppable Hoodie',
        price: 59.99,
        originalPrice: 80.99,
        salePrice: 60.74,
        description: 'Heavyweight 400 GSM black fleece hoodie.',
        imageUrl: '/images/UnstoppableHoodieModel300x300.png',
        category: 'apparel',
        sourceSite: 'unstoppable'
    };

    describe('1. Product Card Structure & Rating Star', () => {
        test('Renders star rating trigger between product title and description', () => {
            const html = generateProductCardHtml(testProduct, 'shop', 1, false, { averageRating: 0, reviewCount: 0 });
            
            // Check existence of title and rating trigger
            expect(html).toContain('product-title');
            expect(html).toContain('product-rating-trigger');
            expect(html).toContain('★');
            expect(html).toContain('5.0');

            // Verify order: title -> rating trigger -> description
            const titleIndex = html.indexOf('product-title');
            const ratingIndex = html.indexOf('product-rating-trigger');
            const descIndex = html.indexOf(testProduct.description);

            expect(titleIndex).toBeLessThan(ratingIndex);
            expect(ratingIndex).toBeLessThan(descIndex);
        });

        test('Removes "(No reviews)" text completely from the product card', () => {
            const htmlNoReviews = generateProductCardHtml(testProduct, 'shop', 1, false, { averageRating: 0, reviewCount: 0 });
            expect(htmlNoReviews).not.toContain('No reviews');
            expect(htmlNoReviews).not.toContain('(No reviews)');
        });

        test('Displays actual rating and review count when reviews exist', () => {
            const htmlWithReviews = generateProductCardHtml(testProduct, 'shop', 1, false, { averageRating: 4.8, reviewCount: 12 });
            expect(htmlWithReviews).toContain('4.8');
            expect(htmlWithReviews).toContain('(12)');
            expect(htmlWithReviews).not.toContain('No reviews');
        });

        test('Removes the separate Reviews button from the action buttons container', () => {
            const html = generateProductCardHtml(testProduct, 'shop');
            expect(html).not.toMatch(/<button[^>]*class="[^"]*reviews-btn[^"]*"/);
            expect(html).not.toMatch(/<button[^>]*class="[^"]*view-reviews-btn[^"]*"/);
            expect(html).not.toContain('>Reviews</button>');
        });
    });

    describe('2. Discount Tag & Add to Cart Screen Real Estate', () => {
        test('Moves discount badge (e.g. 25% OFF) to top-left above product image', () => {
            const html = generateProductCardHtml(testProduct, 'shop');
            
            expect(html).toContain('product-sale-tag');
            expect(html).toContain('25% OFF');

            // The sale tag must appear before the image
            const tagIndex = html.indexOf('product-sale-tag');
            const imgIndex = html.indexOf('product-image');
            expect(tagIndex).toBeLessThan(imgIndex);

            // Must NOT be inside the product-price-wrapper
            const priceWrapperMatch = html.match(/<div class="product-price-wrapper"[^>]*>([\s\S]*?)<\/div>/);
            expect(priceWrapperMatch).not.toBeNull();
            expect(priceWrapperMatch[1]).not.toContain('25% OFF');
            expect(priceWrapperMatch[1]).not.toContain('product-sale-tag');
        });

        test('Expands Add to Cart button and gives price ample room with reduced height', () => {
            const html = generateProductCardHtml(testProduct, 'shop');
            expect(html).toContain('add-to-cart-btn');
            expect(html).toContain('action-buttons-container');

            const shopCss = fs.readFileSync(path.join(rootDir, 'css', 'shop.css'), 'utf-8');
            expect(shopCss).toContain('.product-sale-tag');
            expect(shopCss).toContain('.product-rating-trigger');
            expect(shopCss).toMatch(/\.add-to-cart-btn\s*\{[^}]*padding:\s*8px\s+18px/);
            expect(shopCss).toMatch(/\.product-footer\s*\{[^}]*gap:\s*16px/);
        });

        test('Eliminates multiple prices and duplicate info, rendering only the single active price', () => {
            const html = generateProductCardHtml(testProduct, 'shop');
            expect(html).not.toContain('original-price');
            expect(html).toContain('product-price');
            expect(html).toContain('$60.74');

            // Verify only one price element is in the price wrapper
            const priceWrapperMatch = html.match(/<div class="product-price-wrapper"[^>]*>([\s\S]*?)<\/div>/);
            expect(priceWrapperMatch).not.toBeNull();
            expect(priceWrapperMatch[1]).not.toContain('original-price');
            expect(priceWrapperMatch[1].match(/\$/g).length).toBe(1);
        });
    });

    describe('3. Product Catalog Ordering', () => {
        test('Prioritizes flagship physical merchandise at the top of the collection', () => {
            expect(products[0].id).toBe('unstoppable-hoodie');
            expect(products[1].id).toBe('un250-heritage-tee');
            expect(products[2].id).toBe('dts-model-tee');

            // Physical merchandise should come before digital memberships
            const membershipIndex = products.findIndex(p => p.category === 'membership');
            const apparelIndices = products.filter(p => p.category === 'apparel').map(p => products.indexOf(p));

            apparelIndices.forEach(idx => {
                expect(idx).toBeLessThan(membershipIndex);
            });
        });
    });

    describe('4. Store HTML Featured Memberships Alignment', () => {
        test('Featured memberships have discount tags top-left and rating triggers without duplicate prices', () => {
            const storeHtml = fs.readFileSync(path.join(rootDir, 'store.html'), 'utf-8');
            expect(storeHtml).toContain('product-rating-trigger');
            expect(storeHtml).toMatch(/featured-membership-card[\s\S]*?product-sale-tag/);
            
            // Check featured membership cards do not show multiple/original prices
            const featuredSectionMatch = storeHtml.match(/<section class="featured-memberships-spotlight"[\s\S]*?<\/section>/);
            expect(featuredSectionMatch).not.toBeNull();
            expect(featuredSectionMatch[0]).not.toContain('original-price');
            expect(featuredSectionMatch[0]).not.toContain('$9.99');
            expect(featuredSectionMatch[0]).not.toContain('$19.99');
        });
    });
});
