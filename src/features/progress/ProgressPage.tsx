import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { format, subDays } from 'date-fns';
import { Card } from '../../components/ui/Card';
import { StatusBanner } from '../../components/ui/StatusBanner';
import { db } from '../../lib/firebase';
import { useAuth } from '../auth/AuthProvider';
import { completionsPath, prayerDaysPath, quranEntriesPath } from '../data/paths';
import type { DailyCompletion, PrayerDay, QuranEntry } from '../data/schema';
import { listRoutines } from '../routines/routineRepository';
import { ConsistencyChart } from './ConsistencyChart';
import { InsightList } from './InsightList';
import { summarizePeriod, type DailyAggregate } from './analytics';
import './progress.css';

export function ProgressPage() {
  const { user } = useAuth();
  const [days, setDays] = useState<DailyAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const earliest = format(subDays(new Date(), 13), 'yyyy-MM-dd');
    Promise.all([
      listRoutines(user.uid),
      getDocs(query(collection(db, completionsPath(user.uid)), where('dateKey', '>=', earliest), orderBy('dateKey'))),
      getDocs(query(collection(db, prayerDaysPath(user.uid)), where('dateKey', '>=', earliest), orderBy('dateKey'))),
      getDocs(query(collection(db, quranEntriesPath(user.uid)), where('dateKey', '>=', earliest), orderBy('dateKey'))),
    ]).then(([goals, completionSnap, prayerSnap, quranSnap]) => {
      if (!active) return;
      const completions = new Map(completionSnap.docs.map(docSnap => { const value = docSnap.data() as DailyCompletion; return [value.dateKey, value]; }));
      const prayers = new Map(prayerSnap.docs.map(docSnap => { const value = docSnap.data() as PrayerDay; return [value.dateKey, value]; }));
      const quran = new Map<string, number>();
      quranSnap.docs.forEach(docSnap => { const value = docSnap.data() as QuranEntry; quran.set(value.dateKey, (quran.get(value.dateKey) ?? 0) + (value.minutes ?? 0)); });
      const next = Array.from({ length: 14 }, (_, index) => {
        const date = subDays(new Date(), 13 - index);
        const dateKey = format(date, 'yyyy-MM-dd');
        const scheduledGoals = goals.filter(goal => goal.enabled && goal.scheduleDays.includes(date.getDay()));
        const completion = completions.get(dateKey);
        const completed = scheduledGoals.filter(goal => completion?.completedGoalIds.includes(goal.id)).length;
        const prayerDay = prayers.get(dateKey);
        return { dateKey, scheduled: scheduledGoals.length, completed, prayers: prayerDay ? Object.values(prayerDay.completed).filter(Boolean).length : 0, quranMinutes: quran.get(dateKey) ?? 0 };
      });
      setDays(next);
    }).catch(cause => active && setError(cause instanceof Error ? cause.message : 'Could not load progress.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user]);

  const summary = summarizePeriod(days);
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">Last 14 days</span><h1>Progress</h1><p>Factual trends from the actions you chose to record. This is not a measure of spiritual rank.</p></div></div>{error && <StatusBanner tone="danger">{error}</StatusBanner>}{loading ? <p role="status">Loading progress…</p> : <><div className="progress-stats"><Card><span className="eyebrow">Routine</span><strong>{summary.consistency}%</strong><p className="muted">weighted consistency</p></Card><Card><span className="eyebrow">Salah</span><strong>{summary.prayers}</strong><p className="muted">manual completions</p></Card><Card><span className="eyebrow">Qur’an</span><strong>{summary.quranMinutes} min</strong><p className="muted">logged activity</p></Card></div><div className="grid-2 progress-lower"><Card><h2>Consistency trend</h2><ConsistencyChart days={days}/></Card><Card><h2>What the data says</h2><InsightList days={days}/></Card></div></>}</main>;
}
