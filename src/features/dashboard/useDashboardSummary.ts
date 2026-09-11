import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { toDateKey, weekdayIndex } from '../../lib/dates';
import { getDailyCompletion, listRoutines } from '../routines/routineRepository';
import { calculateDailyConsistency } from '../routines/consistency';
import { getPrayerDay } from '../salah/salahRepository';
import { listQuranEntries } from '../quran/quranRepository';
import { summarizeQuranDay } from '../quran/quranSummary';

export interface DashboardSummary {
  consistency: number;
  completedGoals: number;
  scheduledGoals: number;
  completedPrayers: number;
  quran: ReturnType<typeof summarizeQuranDay>;
}

const empty: DashboardSummary = { consistency: 0, completedGoals: 0, scheduledGoals: 0, completedPrayers: 0, quran: { sessions: 0, pages: 0, ayah: 0, minutes: 0 } };

export function useDashboardSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const dateKey = toDateKey();
    Promise.all([listRoutines(user.uid), getDailyCompletion(user.uid, dateKey), getPrayerDay(user.uid, dateKey), listQuranEntries(user.uid, dateKey)])
      .then(([goals, completion, prayerDay, quranEntries]) => {
        if (!active) return;
        const scheduled = goals.filter(goal => goal.enabled && goal.scheduleDays.includes(weekdayIndex()));
        const scheduledIds = scheduled.map(goal => goal.id);
        const completedGoals = scheduledIds.filter(id => completion.completedGoalIds.includes(id)).length;
        setSummary({
          consistency: calculateDailyConsistency(scheduledIds, completion.completedGoalIds),
          completedGoals,
          scheduledGoals: scheduled.length,
          completedPrayers: Object.values(prayerDay.completed).filter(Boolean).length,
          quran: summarizeQuranDay(quranEntries),
        });
      })
      .catch(cause => active && setError(cause instanceof Error ? cause.message : 'Could not load today’s summary.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user]);

  return { summary, loading, error };
}
