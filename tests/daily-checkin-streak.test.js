import {
    getLocalDateString,
    getCalendarDayDiff,
    calculateStreakFromDates,
    getUserCheckinData
} from '../js/account.js';

describe('Daily Check-in Streak Tracking & Synchronization', () => {

    describe('getLocalDateString', () => {
        test('formats local date correctly for evening and morning times without UTC drift', () => {
            const eveningDate = new Date(2026, 9, 14, 20, 18, 49); // Oct 14, 8:18 PM local
            expect(getLocalDateString(eveningDate)).toBe('2026-10-14');

            const morningDate = new Date(2026, 9, 15, 0, 31, 22); // Oct 15, 12:31 AM local
            expect(getLocalDateString(morningDate)).toBe('2026-10-15');
        });

        test('handles string dates and Firestore Timestamp objects', () => {
            expect(getLocalDateString('2026-10-14')).toBe('2026-10-14');

            const mockTimestamp = {
                toDate: () => new Date(2026, 9, 14, 20, 18, 49)
            };
            expect(getLocalDateString(mockTimestamp)).toBe('2026-10-14');
        });
    });

    describe('getCalendarDayDiff', () => {
        test('accurately calculates calendar day differences', () => {
            expect(getCalendarDayDiff('2026-10-15', '2026-10-15')).toBe(0);
            expect(getCalendarDayDiff('2026-10-15', '2026-10-14')).toBe(1);
            expect(getCalendarDayDiff('2026-10-15', '2026-10-13')).toBe(2);
            expect(getCalendarDayDiff('2026-10-15', '2026-10-01')).toBe(14);
        });

        test('handles ISO strings seamlessly', () => {
            expect(getCalendarDayDiff('2026-10-15T04:31:22.000Z', '2026-10-14T20:18:49.000Z')).toBe(1);
        });
    });

    describe('calculateStreakFromDates', () => {
        test('reconstructs consecutive 2-day streak from 10/14 and 10/15 check-ins', () => {
            const claimDates = ['2026-10-14', '2026-10-15'];
            const result = calculateStreakFromDates(claimDates, '2026-10-15');
            expect(result.streak).toBe(2);
            expect(result.lastClaimDate).toBe('2026-10-15');
        });

        test('recognizes active streak of 1 when user claimed yesterday and has not claimed today', () => {
            const claimDates = ['2026-10-14'];
            const result = calculateStreakFromDates(claimDates, '2026-10-15');
            expect(result.streak).toBe(1);
            expect(result.lastClaimDate).toBe('2026-10-14');
        });

        test('resets streak to 0 if user missed yesterday', () => {
            const claimDates = ['2026-10-13']; // Missed 10/14
            const result = calculateStreakFromDates(claimDates, '2026-10-15');
            expect(result.streak).toBe(0);
            expect(result.lastClaimDate).toBe('2026-10-13');
        });

        test('correctly counts multi-day streaks', () => {
            const claimDates = ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15'];
            const result = calculateStreakFromDates(claimDates, '2026-10-15');
            expect(result.streak).toBe(6);
        });
    });

    describe('getUserCheckinData', () => {
        const mockUser = { uid: 'test_uid_123' };

        beforeEach(() => {
            localStorage.clear();
        });

        test('initializes default data when no cache or Firestore profile exists', () => {
            const data = getUserCheckinData(mockUser, null);
            expect(data.streak).toBe(0);
            expect(data.claimedDays).toEqual([]);
        });

        test('loads and prioritizes Firestore dailyCheckin data', () => {
            const todayStr = getLocalDateString(new Date());
            const mockFirestoreProfile = {
                dailyCheckin: {
                    streak: 3,
                    lastClaimDate: todayStr,
                    claimedDays: [1, 2, 3],
                    totalClaimed: 3
                }
            };
            const data = getUserCheckinData(mockUser, mockFirestoreProfile);
            expect(data.streak).toBe(3);
            expect(data.claimedDays).toEqual([1, 2, 3]);
            expect(data.lastClaimDate).toBe(todayStr);
        });

        test('reconciles streak from loyalty transactions when user claimed yesterday and today', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const today = new Date();

            const mockTxs = [
                {
                    description: 'Daily Check-in Day 1: 10x Iron Ingots 🎁',
                    createdAt: yesterday
                },
                {
                    description: 'Daily Check-in Day 1: 10x Iron Ingots 🎁',
                    createdAt: today
                }
            ];

            // Even if local storage or profile had streak: 1 from duplicate Day 1 claim
            const mockProfile = {
                dailyCheckin: {
                    streak: 1,
                    lastClaimDate: getLocalDateString(today),
                    claimedDays: [1]
                }
            };

            const data = getUserCheckinData(mockUser, mockProfile, mockTxs);
            expect(data.streak).toBe(2);
            expect(data.claimedDays).toEqual([1, 2]);
            expect(data.lastClaimDate).toBe(getLocalDateString(today));
        });
    });
});
