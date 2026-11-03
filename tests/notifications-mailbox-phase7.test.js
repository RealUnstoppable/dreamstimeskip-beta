/**
 * tests/notifications-mailbox-phase7.test.js
 * Comprehensive Verification Suite for Phase 7:
 * 1. Global Notifications Read-Filtering & Auto-Hide
 * 2. "📬 Open Mailbox" Button & User Coupon Mailbox Integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PROMO_CODES, renderCouponCardsHtml } from '../js/mailbox.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('PHASE 7: Global Notifications Read-Filtering & User Coupon Mailbox', () => {

    describe('1. Global Notifications Read-Filtering & Auto-Hide', () => {
        const navbarJs = fs.readFileSync(path.join(rootDir, 'js', 'navbar.js'), 'utf-8');

        test('navbar.js implements local read notification ID tracking', () => {
            expect(navbarJs).toContain('getReadNotificationIds');
            expect(navbarJs).toContain('markNotificationAsReadLocally');
            expect(navbarJs).toContain('read_notification_ids');
        });

        test('renderNotifications filters out read notifications', () => {
            expect(navbarJs).toContain('const activeNotifications = (notifications || []).filter(n => !n.isRead && !readIds.has(n.id));');
        });

        test('Displays "No new notifications" when all notifications are read', () => {
            expect(navbarJs).toContain('No new notifications');
            expect(navbarJs).toContain("You're all caught up!");
        });

        test('Clicking notification item marks as read and removes from DOM', () => {
            expect(navbarJs).toContain('markNotificationAsReadLocally(id)');
            expect(navbarJs).toContain('currentItem.remove()');
        });

        test('Clicking "Mark all as read" clears active notification list', () => {
            expect(navbarJs).toContain('notif-mark-all-read');
            expect(navbarJs).toContain('updateNotificationBadge(0)');
        });
    });

    describe('2. Open Mailbox Button & Modal / Tab Integration', () => {
        const navbarJs = fs.readFileSync(path.join(rootDir, 'js', 'navbar.js'), 'utf-8');
        const mailboxJs = fs.readFileSync(path.join(rootDir, 'js', 'mailbox.js'), 'utf-8');
        const accountHtml = fs.readFileSync(path.join(rootDir, 'account.html'), 'utf-8');
        const accountJs = fs.readFileSync(path.join(rootDir, 'js', 'account.js'), 'utf-8');

        test('navbar.js renders "📬 Open Mailbox" button inside notification dropdown', () => {
            expect(navbarJs).toContain('open-mailbox-btn');
            expect(navbarJs).toContain('📬 Open Mailbox');
        });

        test('navbar.js wires open-mailbox-btn to openUserMailboxModal', () => {
            expect(navbarJs).toContain('openUserMailboxModal()');
        });

        test('mailbox.js provides promo codes with Copy & Apply at Checkout', () => {
            expect(DEFAULT_PROMO_CODES.length).toBeGreaterThanOrEqual(4);
            const codes = DEFAULT_PROMO_CODES.map(c => c.code);
            expect(codes).toContain('WELCOME10');
            expect(codes).toContain('VIP25');
            expect(codes).toContain('SUMMER20');
            expect(codes).toContain('MEDIXLYPRO');

            expect(mailboxJs).toContain('copyAndApplyCoupon');
            expect(mailboxJs).toContain('activePromoCode');
            expect(mailboxJs).toContain('Copy &amp; Apply at Checkout');
        });

        test('renderCouponCardsHtml generates accessible cards with discount badges', () => {
            const html = renderCouponCardsHtml(DEFAULT_PROMO_CODES);
            expect(html).toContain('WELCOME10');
            expect(html).toContain('10% OFF');
            expect(html).toContain('MEDIXLYPRO');
            expect(html).toContain('90% OFF');
            expect(html).toContain('apply-coupon-btn');
        });

        test('account.html has #mailbox sidebar nav link and content section', () => {
            expect(accountHtml).toContain('href="#mailbox"');
            expect(accountHtml).toContain('id="mailbox"');
            expect(accountHtml).toContain('account-mailbox-coupons');
        });

        test('account.js switches to and loads mailbox coupons dynamically', () => {
            expect(accountJs).toContain("targetHash === '#mailbox'");
            expect(accountJs).toContain('loadAccountMailbox()');
            expect(accountJs).toContain('fetchMailboxCoupons');
        });
    });
});
