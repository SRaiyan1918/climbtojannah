import type { RoutineGoal } from '../data/schema';
export function goalForToday(goal: RoutineGoal, dayIndex: number) { return goal.enabled && goal.scheduleDays.includes(dayIndex); }
export function orderedGoals(goals: RoutineGoal[]) { return [...goals].sort((a,b) => a.order - b.order); }
export function moveGoal(goals: RoutineGoal[], id: string, direction: -1 | 1) {
  const ordered = orderedGoals(goals); const from = ordered.findIndex(g => g.id === id); const to = from + direction;
  if (from < 0 || to < 0 || to >= ordered.length) return ordered;
  [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
  return ordered.map((goal, order) => ({ ...goal, order, updatedAt: new Date().toISOString() }));
}
