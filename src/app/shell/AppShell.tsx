import { Outlet } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { BottomNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';

export function AppShell() {
  return (
    <div className="app-frame">
      <DemoBanner />
      <InstallBanner />
      <div className="app-content"><Outlet /></div>
      <BottomNav />
    </div>
  );
}
