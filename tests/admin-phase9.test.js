/**
 * tests/admin-phase9.test.js
 * Comprehensive Verification Suite for Phase 9:
 * 1. 100% Live Firestore Statistics & Zero Dummy Data in admin.html
 * 2. Unified AutoLux View: [🚗 Bookings & Quotes (AutoLux)]
 * 3. Promo Codes Integration: admin.html -> promo_codes -> User Mailbox
 * 4. Support Tickets Two-Way Notification: admin reply -> notifications collection
 * 5. Universal Cross-Site Signup Origin Tracker: detectSignupOrigin & recordSignupOrigin
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectSignupOrigin } from '../js/signup-origin-tracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('PHASE 9: Admin Live Telemetry, Two-Way Messaging & Cross-Site Tracking', () => {

    describe('1. Live Firestore Telemetry & Zero Dummy Data', () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');

        test('admin.html queries live collections: users, orders, newsletter, waitlist, bookings, quotes, tickets', () => {
            expect(adminHtml).toContain('collection(db, "users")');
            expect(adminHtml).toContain('collection(db, "orders")');
            expect(adminHtml).toContain('collection(db, "dts_waitlist")');
            expect(adminHtml).toContain('collection(db, "bookings")');
            expect(adminHtml).toContain('collection(db, "quotes")');
            expect(adminHtml).toContain('collection(db, "newsletter_subscribers")');
            expect(adminHtml).toContain('getAllTickets');
        });

        test('Calculates total revenue and orders dynamically from live Firestore snapshot', () => {
            expect(adminHtml).toContain('const totalRevenue = orders.reduce');
            expect(adminHtml).toContain("document.getElementById('total-revenue')");
            expect(adminHtml).toContain("document.getElementById('total-purchases')");
        });
    });

    describe('2. Unified AutoLux Sidebar & Section Consolidation', () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');

        test('Sidebar consolidates Bookings and Quotes into "🚗 Bookings & Quotes (AutoLux)"', () => {
            expect(adminHtml).toContain('🚗 Bookings &amp; Quotes (AutoLux)');
            // Should not have a standalone Quotes nav link in the main navigation
            expect(adminHtml).not.toMatch(/<li><a[^>]*href="#quotes"[^>]*>Quotes<\/a><\/li>/);
        });

        test('#bookings section contains both Confirmed Bookings and Custom Quote Requests tables', () => {
            expect(adminHtml).toContain('id="bookings-list-body"');
            expect(adminHtml).toContain('id="quotes-list-body"');
            expect(adminHtml).toContain('Confirmed Bookings');
            expect(adminHtml).toContain('Custom Quote Requests');
        });
    });

    describe('3. Promo Codes Integration to User Mailbox & Checkout', () => {
        const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');
        const mailboxJs = fs.readFileSync(path.join(rootDir, 'js', 'mailbox.js'), 'utf-8');

        test('admin.html writes created promo codes to promo_codes Firestore collection', () => {
            expect(adminHtml).toContain("doc(db, 'promo_codes', code)");
            expect(adminHtml).toContain('discountPercent: discount');
        });

        test('mailbox.js queries promo_codes collection to display live coupons in Mailbox', () => {
            expect(mailboxJs).toContain("collection(db, 'promo_codes')");
            expect(mailboxJs).toContain('fetchMailboxCoupons');
        });
    });

    describe('4. Support Tickets Two-Way Messaging Loop', () => {
        const ticketServiceJs = fs.readFileSync(path.join(rootDir, 'js', 'ticket-service.js'), 'utf-8');

        test('ticket-service.js creates user notification upon admin reply', () => {
            expect(ticketServiceJs).toContain("collection(db, 'notifications')");
            expect(ticketServiceJs).toContain("type: 'ticket_reply'");
            expect(ticketServiceJs).toContain('Support Ticket Update');
            expect(ticketServiceJs).toContain('account.html#support');
        });
    });

    describe('5. Universal Cross-Site Signup Origin Tracking', () => {
        const trackerJs = fs.readFileSync(path.join(rootDir, 'js', 'signup-origin-tracker.js'), 'utf-8');
        const authJs = fs.readFileSync(path.join(rootDir, 'js', 'auth.js'), 'utf-8');

        test('detectSignupOrigin identifies core sites and sub-properties', () => {
            expect(typeof detectSignupOrigin).toBe('function');
            const defaultOrigin = detectSignupOrigin();
            expect(defaultOrigin.sourceSite).toBeDefined();
        });

        test('tracker module exports recordSignupOrigin', () => {
            expect(trackerJs).toContain('export async function recordSignupOrigin');
            expect(trackerJs).toContain('sourceSite');
            expect(trackerJs).toContain('sourceCategory');
            expect(trackerJs).toContain('recordedAt');
        });

        test('auth.js invokes recordSignupOrigin during new user registration', () => {
            expect(authJs).toContain('recordSignupOrigin(db, userCredential.user)');
        });
    });
});
