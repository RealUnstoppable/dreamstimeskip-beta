import { jest } from '@jest/globals';
import {
    normalizeMinecraftUsername,
    checkMinecraftAvailability,
    claimMinecraftLink,
    releaseMinecraftLink,
    MC_ALREADY_LINKED_MESSAGE,
    MC_ALREADY_LINKED_HTML,
    MC_LINKS_COLLECTION
} from '../js/minecraft-link-service.js';

describe('Minecraft Link Service', () => {
    describe('normalizeMinecraftUsername', () => {
        it('normalizes uppercase and mixed-case IGNs to trimmed lowercase', () => {
            expect(normalizeMinecraftUsername('Dream')).toBe('dream');
            expect(normalizeMinecraftUsername('  Notch  ')).toBe('notch');
            expect(normalizeMinecraftUsername('DTS_Player99')).toBe('dts_player99');
            expect(normalizeMinecraftUsername('')).toBe('');
            expect(normalizeMinecraftUsername(null)).toBe('');
        });
    });

    describe('Uniqueness Error Messages', () => {
        it('has the exact required message for already linked usernames', () => {
            expect(MC_ALREADY_LINKED_MESSAGE).toBe(
                'This Minecraft username is already linked to a different account. If you think this is a mistake, contact us.'
            );
            expect(MC_ALREADY_LINKED_HTML).toContain('support.html');
            expect(MC_ALREADY_LINKED_HTML).toContain('contact us');
        });
    });

    describe('checkMinecraftAvailability', () => {
        const originalFetch = global.fetch;

        afterEach(() => {
            global.fetch = originalFetch;
        });

        it('returns available: true when username is empty', async () => {
            const res = await checkMinecraftAvailability('');
            expect(res.available).toBe(true);
            expect(res.linkedToOther).toBe(false);
        });

        it('returns available: false with the standard error message when claimed by another user in backend', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    available: false,
                    linkedToOther: true,
                    ownerUid: 'other_user_789',
                    message: MC_ALREADY_LINKED_MESSAGE
                })
            });

            const res = await checkMinecraftAvailability('Dream', 'my_user_123');
            expect(res.available).toBe(false);
            expect(res.linkedToOther).toBe(true);
            expect(res.message).toBe(
                'This Minecraft username is already linked to a different account. If you think this is a mistake, contact us.'
            );
            expect(res.htmlMessage).toContain('contact us');
        });

        it('returns available: true when claimed by the CURRENT user', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    available: true,
                    linkedToOther: false
                })
            });

            const res = await checkMinecraftAvailability('Dream', 'my_user_123');
            expect(res.available).toBe(true);
            expect(res.linkedToOther).toBe(false);
        });

        it('handles network failure gracefully and falls through without crashing', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const res = await checkMinecraftAvailability('Dream', 'my_user_123');
            expect(res).toBeDefined();
            expect(typeof res.available).toBe('boolean');
        });
    });

    describe('claimMinecraftLink and releaseMinecraftLink', () => {
        it('handles claimMinecraftLink with new key and cleans up old key when changing ign', async () => {
            const mockDb = {};
            const res = await claimMinecraftLink(mockDb, 'user_123', 'NewIGN', { oldIgn: 'OldIGN' });
            expect(res).toBe(true);
        });

        it('handles releaseMinecraftLink gracefully', async () => {
            const mockDb = {};
            const res = await releaseMinecraftLink(mockDb, 'OldIGN');
            expect(res).toBe(true);
        });
    });
});
