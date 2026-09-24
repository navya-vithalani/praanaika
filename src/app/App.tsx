import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { useSessionStore } from '../store/sessionStore';

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/about" element={<PlaceholderScreen title="About Praanaika" eyebrow="Body, Environment, Baseline" />} />
      <Route element={<ProfileGuard />}>
        <Route element={<AppShell />}>
          <Route path="/talk" element={<PlaceholderScreen title="Talk" eyebrow="Your day, in your words" />} />
          <Route path="/gem" element={<PlaceholderScreen title="Gem" eyebrow="Wearable signals" />} />
          <Route path="/today" element={<PlaceholderScreen title="Today" eyebrow="Your baseline, gently noticed" featured />} />
          <Route path="/hub" element={<PlaceholderScreen title="Hub" eyebrow="The room around you" />} />
          <Route path="/you" element={<PlaceholderScreen title="You" eyebrow="Your profile and privacy" />} />
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
