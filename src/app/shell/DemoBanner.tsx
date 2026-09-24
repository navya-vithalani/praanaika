import { FlaskConical } from 'lucide-react';
import { SYNTHETIC_BANNER } from '../../config/copy';
import { useSessionStore } from '../../store/sessionStore';

export function DemoBanner() {
  const mode = useSessionStore((state) => state.mode);
  if (mode !== 'demo') return null;

  return (
    <div className="demo-banner">
      <FlaskConical size={15} aria-hidden="true" />
      <span>{SYNTHETIC_BANNER}</span>
    </div>
  );
}
