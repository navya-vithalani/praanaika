import { ArrowRight, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GemScreen, HubScreen } from './TabScreens';

function DesignPrompt({ kind }: { kind: 'gem' | 'hub' }) {
  const navigate = useNavigate();
  return <section className="design-prompt"><div><Palette size={20} aria-hidden="true" /><div><strong>Design your own {kind === 'gem' ? 'Gem' : 'Hub'}</strong><small>Choose colours, shapes, and options.</small></div></div><button className="icon-button" aria-label={`Design your own ${kind}`} onClick={() => navigate(`/design/${kind}`)}><ArrowRight size={19} /></button></section>;
}

export function GemRouteScreen() {
  return <><GemScreen /><DesignPrompt kind="gem" /></>;
}

export function HubRouteScreen() {
  return <><HubScreen /><DesignPrompt kind="hub" /></>;
}
