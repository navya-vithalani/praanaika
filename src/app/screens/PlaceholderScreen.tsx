import { Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Mascot } from '../../components/mascot/Mascot';
import { useSessionStore } from '../../store/sessionStore';

interface PlaceholderScreenProps {
  title: string;
  eyebrow: string;
  featured?: boolean;
}

export function PlaceholderScreen({ title, eyebrow, featured = false }: PlaceholderScreenProps) {
  const navigate = useNavigate();
  const resetProfile = useSessionStore((state) => state.resetProfile);

  function startOver() {
    resetProfile();
    navigate('/welcome', { replace: true });
  }

  return (
    <main className="screen">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {featured ? (
        <Card className="hero-card">
          <div className="hero-card__topline">
            <span className="source-dot" aria-hidden="true" />
            <span>Pran says</span>
            <span className="chip">Day 56</span>
          </div>
          <div className="hero-card__content">
            <Mascot mood="happy" size={92} />
            <div>
              <h2>I’m learning your usual rhythm.</h2>
              <p>Once the data layer is connected, this is where a short, traceable observation will live.</p>
            </div>
          </div>
          <p className="note">Observations about your patterns, never a diagnosis.</p>
        </Card>
      ) : (
        <Card className="empty-card">
          <Wind size={30} strokeWidth={1.5} aria-hidden="true" />
          <h2>This space is ready for step {title === 'You' ? '7' : '4'}.</h2>
          <p>The shell is in place. This tab will become useful as the next build slice lands.</p>
          {title === 'You' && <button className="text-button" onClick={startOver}>Start over from Welcome</button>}
        </Card>
      )}
    </main>
  );
}
