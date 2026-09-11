import { Card } from '../../components/ui/Card';

export function MotivationCard({ consistency }: { consistency: number }) {
  const copy = consistency >= 80
    ? 'A strong day of follow-through. Protect the sincerity behind the routine.'
    : consistency >= 40
      ? 'Some intentions became action today. Keep the next step small and clear.'
      : 'A low score is only routine data, not a judgment of your faith or worth. Begin again with one sincere action.';
  return <Card className="motivation-card"><span className="eyebrow">Reflection</span><h2>Keep intention above numbers</h2><p>{copy}</p></Card>;
}
