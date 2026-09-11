export function calculateDailyConsistency(scheduledGoalIds: string[], completedGoalIds: string[]) {
  if (scheduledGoalIds.length === 0) return 0;
  const completed = new Set(completedGoalIds);
  return Math.round((scheduledGoalIds.filter(id => completed.has(id)).length / scheduledGoalIds.length) * 100);
}
