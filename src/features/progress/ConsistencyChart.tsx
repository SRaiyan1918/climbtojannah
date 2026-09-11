import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailyAggregate } from './analytics';
import { dailyConsistency } from './analytics';

export function ConsistencyChart({ days }: { days: DailyAggregate[] }) {
  const data = days.map(day => ({ date: day.dateKey.slice(5), consistency: dailyConsistency(day) }));
  const average = data.length ? Math.round(data.reduce((sum, day) => sum + day.consistency, 0) / data.length) : 0;
  return <div><div className="chart-frame" aria-hidden="true"><ResponsiveContainer width="100%" height={240}><LineChart data={data}><XAxis dataKey="date"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="consistency" stroke="currentColor" strokeWidth={2}/></LineChart></ResponsiveContainer></div><p className="muted">Daily routine consistency shown for {days.length} days. Simple daily average: {average}%.</p></div>;
}
