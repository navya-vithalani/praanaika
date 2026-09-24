import { Outlet } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { BottomNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';
import { DemoControls } from './DemoControls';

export function AppShell() {
  return (
    <div className="app-frame">
      <DemoControls />
      <InstallBanner />
      <div className="app-content"><Outlet /></div>
      <BottomNav />
    </div>
  );
}
