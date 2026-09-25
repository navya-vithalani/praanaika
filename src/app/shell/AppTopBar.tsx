import { WifiOff } from 'lucide-react';
import { BrandMark } from '../../components/brand/BrandMark';

export function AppTopBar() {
  return <header className="app-topbar"><BrandMark /><span className="app-topbar__status"><span className="status-light" /> View</span><span className="app-topbar__offline"><WifiOff size={14} aria-hidden="true" /> Offline-ready</span></header>;
}
