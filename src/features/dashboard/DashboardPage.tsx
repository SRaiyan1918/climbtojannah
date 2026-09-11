import { BookOpen, CheckCircle2, MoonStar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatusBanner } from '../../components/ui/StatusBanner';
import { useAuth } from '../auth/AuthProvider';
import { MotivationCard } from './MotivationCard';
import { useDashboardSummary } from './useDashboardSummary';
import './dashboard.css';

export function DashboardPage() {
  const { user } = useAuth();
  const { summary, loading, error } = useDashboardSummary();
  const firstName = user?.displayName?.trim().split(/\s+/)[0];
  return <main className="page">
    <div className="page-heading"><div><span className="eyebrow">Today</span><h1>{firstName ? `Assalamu alaikum, ${firstName}` : 'Assalamu alaikum'}</h1><p>A calm view of the actions you chose to track.</p></div><div className="score-orb" aria-label={`Consistency score ${summary.consistency} percent`}><strong>{summary.consistency}%</strong><span>consistency</span></div></div>
    {error && <StatusBanner tone="danger">{error}</StatusBanner>}
    {loading ? <p role="status">Loading today’s summary…</p> : <div className="dashboard-stat-grid">
      <Card><Target size={20}/><span className="eyebrow">Routine</span><strong className="metric">{summary.completedGoals}/{summary.scheduledGoals}</strong><p className="muted">scheduled intentions completed</p></Card>
      <Card><MoonStar size={20}/><span className="eyebrow">Salah</span><strong className="metric">{summary.completedPrayers}/5</strong><p className="muted">manually marked today</p></Card>
      <Card><BookOpen size={20}/><span className="eyebrow">Qur’an</span><strong className="metric">{summary.quran.minutes} min</strong><p className="muted">{summary.quran.sessions} sessions · {summary.quran.pages} pages · {summary.quran.ayah} ayah</p></Card>
      <Card><CheckCircle2 size={20}/><span className="eyebrow">Focus</span><strong className="metric">One step</strong><p className="muted">Choose the next useful action, not the perfect day.</p></Card>
    </div>}
    <div className="grid-2 dashboard-lower"><MotivationCard consistency={summary.consistency}/><Card><span className="eyebrow">Quick actions</span><h2>Continue today</h2><div className="quick-links"><Link to="/routine">Open routine</Link><Link to="/salah">Mark salah</Link><Link to="/quran">Log Qur’an</Link><Link to="/journal">Write reflection</Link></div></Card></div>
  </main>;
}
