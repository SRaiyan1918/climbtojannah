import type { GoalCategory, RoutineGoal } from '../data/schema';

const allDays = [0,1,2,3,4,5,6];
const defaults: Array<[string, GoalCategory]> = [
  ['Fajr', 'deen'], ['Dhuhr', 'deen'], ['Asr', 'deen'], ['Maghrib', 'deen'], ['Isha', 'deen'],
  ['Qur’an reading', 'deen'], ['Morning / evening adhkar', 'deen'], ['Daily reflection', 'deen'],
];
export function createDefaultGoals(now = new Date()): RoutineGoal[] {
  const stamp = now.toISOString();
  return defaults.map(([title, category], order) => ({ id: `default-${order + 1}`, title, category, enabled: true, order, scheduleDays: allDays, createdAt: stamp, updatedAt: stamp }));
}
