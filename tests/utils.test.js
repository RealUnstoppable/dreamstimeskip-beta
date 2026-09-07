import { formatDate } from '../js/utils.js';

describe('formatDate', () => {
    it('returns "N/A" if timestamp is falsy', () => {
        expect(formatDate(null)).toBe('N/A');
        expect(formatDate(undefined)).toBe('N/A');
        expect(formatDate('')).toBe('N/A');
    });

    it('formats a standard date correctly', () => {
        // Use a fixed date to avoid timezone/locale flakiness, or check if toLocaleDateString is used
        const date = new Date('2023-10-15T12:00:00Z');
        const formatted = formatDate(date);

        expect(formatted).toContain(date.toLocaleDateString());
        expect(formatted).toContain(date.toLocaleTimeString());
        expect(formatted).toBe(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
    });

    it('formats a standard timestamp (number) correctly', () => {
        const timestamp = new Date('2023-10-15T12:00:00Z').getTime();
        const formatted = formatDate(timestamp);
        const date = new Date(timestamp);

        expect(formatted).toBe(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
    });

    it('formats a firestore-like Timestamp correctly (has toDate method)', () => {
        const mockDate = new Date('2023-10-15T12:00:00Z');
        const mockTimestamp = {
            toDate: () => mockDate
        };

        const formatted = formatDate(mockTimestamp);
        expect(formatted).toBe(mockDate.toLocaleDateString() + ' ' + mockDate.toLocaleTimeString());
    });
});
