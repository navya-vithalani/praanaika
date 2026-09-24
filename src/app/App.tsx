import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { useSessionStore } from '../store/sessionStore';
import { GemScreen, HubScreen, TalkScreen, TodayScreen, YouScreen } from './screens/TabScreens';

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/about" element={<PlaceholderScreen title="About Praanaika" eyebrow="Body, Environment, Baseline" />} />
      <Route element={<ProfileGuard />}>
        <Route element={<AppShell />}>
          <Route path="/talk" element={<TalkScreen />} />
          <Route path="/gem" element={<GemScreen />} />
          <Route path="/today" element={<TodayScreen />} />
          <Route path="/hub" element={<HubScreen />} />
          <Route path="/you" element={<YouScreen />} />
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
