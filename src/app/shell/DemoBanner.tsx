import { FlaskConical } from 'lucide-react';
import { SYNTHETIC_BANNER } from '../../config/copy';

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <FlaskConical size={15} aria-hidden="true" />
      <span>{SYNTHETIC_BANNER}</span>
    </div>
  );
}
