import { describe, expect, test } from 'vitest';
import { dailyConsistency, summarizePeriod } from './analytics';

describe('progress analytics', () => {
  test('handles zero data', () => {
    expect(summarizePeriod([])).toEqual({ trackedDays: 0, routineScheduled: 0, routineCompleted: 0, consistency: 0, prayers: 0, quranMinutes: 0 });
  });
  test('summarizes routine, salah and Quran activity', () => {
    const days = [
      { dateKey: '2026-09-10', scheduled: 4, completed: 3, prayers: 5, quranMinutes: 20 },
      { dateKey: '2026-09-11', scheduled: 2, completed: 1, prayers: 4, quranMinutes: 10 },
    ];
    expect(summarizePeriod(days)).toMatchObject({ trackedDays: 2, routineScheduled: 6, routineCompleted: 4, consistency: 67, prayers: 9, quranMinutes: 30 });
    expect(dailyConsistency(days[0])).toBe(75);
  });
});
