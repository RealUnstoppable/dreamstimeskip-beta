import { formatTime } from '../js/harmonytunes.js';

describe('formatTime', () => {
    it('formats times less than a minute with zero-padded seconds', () => {
        expect(formatTime(8)).toBe('0:08');
        expect(formatTime(59)).toBe('0:59');
        expect(formatTime(0)).toBe('0:00');
    });

    it('formats exactly one minute', () => {
        expect(formatTime(60)).toBe('1:00');
    });

    it('formats times greater than a minute correctly', () => {
        expect(formatTime(125)).toBe('2:05');
        expect(formatTime(600)).toBe('10:00');
        expect(formatTime(601)).toBe('10:01');
    });

    it('handles NaN by returning 0:00', () => {
        expect(formatTime(NaN)).toBe('0:00');
    });

    it('handles decimal values by rounding down', () => {
        expect(formatTime(125.9)).toBe('2:05');
    });
});
