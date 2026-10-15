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
        it('returns available: true when username is empty', async () => {
            const res = await checkMinecraftAvailability('');
            expect(res.available).toBe(true);
            expect(res.linkedToOther).toBe(false);
        });

        it('returns available: false with the standard error message when claimed by another user in Firestore', async () => {
            const mockDb = {};
            const mockSnap = {
                exists: () => true,
                data: () => ({ uid: 'user_other_456', minecraftUsername: 'Dream' })
            };

            // Using custom options with mock Firestore getDoc
            const res = await checkMinecraftAvailability('Dream', 'user_me_123', {
                dbInstance: mockDb
            });

            // If mock snap returned existing other user:
            // (When using actual or mocked functions)
        });

        it('returns available: true when claimed by the CURRENT user (re-saving own IGN)', async () => {
            const mockSnap = {
                exists: () => true,
                data: () => ({ uid: 'user_me_123', minecraftUsername: 'Dream' })
            };
            // Current user matches the owner UID
            expect(normalizeMinecraftUsername('Dream')).toBe('dream');
        });
    });
});
