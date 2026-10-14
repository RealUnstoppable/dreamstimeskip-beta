import { jest } from '@jest/globals';
import { replyToTicket } from '../js/ticket-service.js';
import { updateDoc, doc, serverTimestamp } from './__mocks__/firebase-firestore.js';

describe('ticket-service.js replyToTicket', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        delete global.fetch;
    });

    it('throws an error if ticketId or adminReply is missing', async () => {
        await expect(replyToTicket('', 'reply text')).rejects.toThrow('Ticket ID and reply content are required.');
        await expect(replyToTicket('ticket123', '')).rejects.toThrow('Ticket ID and reply content are required.');
    });

    it('successfully updates ticket via updateDoc directly in Firestore without calling fetch', async () => {
        updateDoc.mockResolvedValueOnce(undefined);

        const result = await replyToTicket('ticket123', 'Thank you for reaching out.', 'answered');

        expect(result).toEqual({ success: true });
        expect(doc).toHaveBeenCalledWith(expect.anything(), 'support_tickets', 'ticket123');
        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                adminReply: 'Thank you for reaching out.',
                status: 'answered',
                updatedAt: 'MOCK_SERVER_TIMESTAMP'
            })
        );
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('falls back to adminAction fetch if direct Firestore updateDoc fails', async () => {
        updateDoc.mockRejectedValueOnce(new Error('Permission denied'));
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'OK'
        });

        // Mock auth token retrieval
        const { auth } = await import('./__mocks__/auth.js');
        auth.currentUser.getIdToken = jest.fn().mockResolvedValueOnce('mock-token');

        const result = await replyToTicket('ticket123', 'Fallback reply', 'answered');

        expect(result).toEqual({ success: true });
        expect(updateDoc).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(
            'https://us-central1-dts-hub-website.cloudfunctions.net/adminAction',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer mock-token'
                }),
                body: JSON.stringify({
                    action: 'update',
                    collection: 'support_tickets',
                    docId: 'ticket123',
                    data: {
                        adminReply: 'Fallback reply',
                        status: 'answered',
                        updatedAt: 'SERVER_TIMESTAMP'
                    }
                })
            })
        );
    });

    it('throws the original Firestore error if both updateDoc and fetch fallback fail', async () => {
        updateDoc.mockRejectedValueOnce(new Error('Permission denied'));
        global.fetch.mockRejectedValueOnce(new Error('Load failed'));

        const { auth } = await import('./__mocks__/auth.js');
        auth.currentUser.getIdToken = jest.fn().mockResolvedValueOnce('mock-token');

        await expect(replyToTicket('ticket123', 'Fallback reply', 'answered')).rejects.toThrow('Permission denied');
    });
});
