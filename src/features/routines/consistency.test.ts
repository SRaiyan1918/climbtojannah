import { describe, expect, test } from 'vitest';
import { calculateDailyConsistency } from './consistency';

describe('calculateDailyConsistency', () => {
  test('uses completion percentage only', () => {
    expect(calculateDailyConsistency(['a','b','c','d'], ['a','c','d'])).toBe(75);
  });
  test('zero scheduled goals returns zero', () => {
    expect(calculateDailyConsistency([], [])).toBe(0);
  });
  test('ignores completed items that were not scheduled', () => {
    expect(calculateDailyConsistency(['a','b'], ['a','x'])).toBe(50);
  });
});
