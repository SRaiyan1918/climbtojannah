import type { DailyAggregate } from './analytics';
import { dailyConsistency, strongestDay, summarizePeriod } from './analytics';

export function InsightList({ days }: { days: DailyAggregate[] }) {
  const summary = summarizePeriod(days);
  const best = strongestDay(days);
  return <ul className="insight-list"><li>{summary.routineCompleted} of {summary.routineScheduled} scheduled routine items were completed in this window.</li><li>{summary.prayers} salah completions were manually recorded.</li><li>{summary.quranMinutes} Qur’an activity minutes were logged.</li>{best && <li>Highest routine-consistency day: {best.dateKey} at {dailyConsistency(best)}%.</li>}</ul>;
}
