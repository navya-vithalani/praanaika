import { Outlet } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="app-frame">
      <DemoBanner />
      <div className="app-content"><Outlet /></div>
      <BottomNav />
    </div>
  );
}
