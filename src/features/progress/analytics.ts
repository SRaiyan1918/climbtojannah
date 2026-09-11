export interface DailyAggregate { dateKey: string; scheduled: number; completed: number; prayers: number; quranMinutes: number; }
export interface PeriodSummary { trackedDays: number; routineScheduled: number; routineCompleted: number; consistency: number; prayers: number; quranMinutes: number; }

export function dailyConsistency(day: DailyAggregate) {
  return day.scheduled === 0 ? 0 : Math.round((day.completed / day.scheduled) * 100);
}

export function summarizePeriod(days: DailyAggregate[]): PeriodSummary {
  if (days.length === 0) return { trackedDays: 0, routineScheduled: 0, routineCompleted: 0, consistency: 0, prayers: 0, quranMinutes: 0 };
  const totals = days.reduce((sum, day) => ({ routineScheduled: sum.routineScheduled + day.scheduled, routineCompleted: sum.routineCompleted + day.completed, prayers: sum.prayers + day.prayers, quranMinutes: sum.quranMinutes + day.quranMinutes }), { routineScheduled: 0, routineCompleted: 0, prayers: 0, quranMinutes: 0 });
  return { trackedDays: days.length, ...totals, consistency: totals.routineScheduled === 0 ? 0 : Math.round((totals.routineCompleted / totals.routineScheduled) * 100) };
}

export function strongestDay(days: DailyAggregate[]) {
  return days.filter(day => day.scheduled > 0).sort((a,b) => dailyConsistency(b) - dailyConsistency(a))[0] ?? null;
}
