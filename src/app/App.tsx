import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { useSessionStore } from '../store/sessionStore';
import { TodayScreen, YouScreen } from './screens/TabScreens';
import { InteractiveTalkScreen } from './screens/InteractiveTalkScreen';
import { DesignScreen } from './screens/DesignScreen';
import { GemRouteScreen, HubRouteScreen } from './screens/DeviceRouteScreens';
import { OwnOnboardingScreen } from './screens/OwnOnboardingScreen';
import { DetailedTalkScreen } from './screens/DetailedTalkScreen';
import { WrappedScreen } from './screens/WrappedScreen';
import { AboutScreen } from './screens/AboutScreen';
import { OrderScreen } from './screens/OrderScreen';

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/onboarding" element={<OwnOnboardingScreen />} />
      <Route path="/about" element={<AboutScreen />} />
      <Route element={<ProfileGuard />}>
        <Route element={<AppShell />}>
          <Route path="/talk" element={<DetailedTalkScreen />} />
          <Route path="/gem" element={<GemRouteScreen />} />
          <Route path="/today" element={<TodayScreen />} />
          <Route path="/hub" element={<HubRouteScreen />} />
          <Route path="/you" element={<YouScreen />} />
          <Route path="/design/:kind" element={<DesignScreen />} />
          <Route path="/wrapped" element={<WrappedScreen />} />
          <Route path="/order" element={<OrderScreen />} />
          <Route path="*" element={<ModeGuard />} />
        </Route>
      </Route>
    </Routes>
  );
}

function ModeGuard() {
  const mode = useSessionStore((state) => state.mode);
  return <Navigate to={mode === 'none' ? '/welcome' : '/today'} replace />;
}

function ProfileGuard() {
  const mode = useSessionStore((state) => state.mode);
  return mode === 'none' ? <Navigate to="/welcome" replace /> : <Outlet />;
}
