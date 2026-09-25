import { Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GemScreen, HubScreen } from './TabScreens';
import { OwnDeviceGallery } from './OwnDeviceGallery';
import { useSessionStore } from '../../store/sessionStore';

function DesignFloatingPrompt({ kind }: { kind: 'gem' | 'hub' }) {
  const navigate = useNavigate();
  return <button className="icon-button" style={{ position: 'absolute', top: '16px', right: '64px', zIndex: 50, background: 'var(--color-primary)', color: 'var(--color-on-primary)', boxShadow: 'var(--shadow-sm)' }} aria-label={`Design your own ${kind}`} onClick={() => navigate(`/design/${kind}`)}><Palette size={19} /></button>;
}

export function GemRouteScreen() {
  const mode = useSessionStore((state) => state.mode);
  return mode === 'own' ? <OwnDeviceGallery kind="gem" /> : <div style={{ position: 'relative' }}><GemScreen /><DesignFloatingPrompt kind="gem" /></div>;
}

export function HubRouteScreen() {
  const mode = useSessionStore((state) => state.mode);
  return mode === 'own' ? <OwnDeviceGallery kind="hub" /> : <div style={{ position: 'relative' }}><HubScreen /><DesignFloatingPrompt kind="hub" /></div>;
}
