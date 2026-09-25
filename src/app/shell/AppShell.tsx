import { Outlet } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { BottomNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';
import { DemoControls } from './DemoControls';
import { AppTopBar } from './AppTopBar';

export function AppShell() {
  return (
    <div className="app-frame">
      <DemoControls />
      <InstallBanner />
      <AppTopBar />
      <div className="app-content"><Outlet /></div>
      <BottomNav />
    </div>
  );
}
