import { useState } from 'react';
import { FlaskConical, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useSessionStore } from '../../store/sessionStore';

export function DemoControls() {
  const mode = useSessionStore((state) => state.mode);
  const demoDay = useSessionStore((state) => state.demoDay);
  const setDemoDay = useSessionStore((state) => state.setDemoDay);
  const resetProfile = useSessionStore((state) => state.resetProfile);
  const [open, setOpen] = useState(false);
  if (mode !== 'demo') return null;
  return <><button className="demo-banner demo-banner--button" onClick={() => setOpen(true)}><FlaskConical size={15} /><span>Demo profile · synthetic data</span><SlidersHorizontal size={15} /></button>{open && <div className="demo-sheet-backdrop" role="presentation" onClick={() => setOpen(false)}><section className="demo-sheet" role="dialog" aria-modal="true" aria-labelledby="demo-controls-title" onClick={(event) => event.stopPropagation()}><div className="section-heading"><div><p className="eyebrow">Demo controls</p><h2 id="demo-controls-title">Move through Meera’s 56 days</h2></div><button className="icon-button" aria-label="Close demo controls" onClick={() => setOpen(false)}><X size={18} /></button></div><label className="demo-slider-label">Day {demoDay} of 56<input type="range" min="1" max="56" value={demoDay} onChange={(event) => setDemoDay(Number(event.target.value))} /></label><div className="demo-day-buttons"><button onClick={() => setDemoDay(9)}>Day 9</button><button onClick={() => setDemoDay(24)}>Day 24</button><button onClick={() => setDemoDay(56)}>Day 56</button></div><p className="note">Insights appear when their synthetic evidence becomes available. The profile remains clearly labelled as synthetic.</p><Button className="full-button" onClick={resetProfile}>Exit demo</Button></section></div>}</>;
}
