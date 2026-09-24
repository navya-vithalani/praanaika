import { useEffect, useState } from 'react';
import { ArrowRight, Download, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrandMark } from '../../components/brand/BrandMark';
import { Mascot } from '../../components/mascot/Mascot';
import { Button } from '../../components/ui/Button';
import { MASCOT_NAME, TAGLINE } from '../../config/copy';
import { useSessionStore } from '../../store/sessionStore';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function installHelpText() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return 'Tap Share, then Add to Home Screen.';
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (window.location.protocol !== 'https:' && !isLocal) return 'This phone URL is HTTP. Installation requires the deployed HTTPS URL.';
  return 'Open your browser menu and choose Install app or Add to Home Screen.';
}

export function WelcomeScreen() {
  const navigate = useNavigate();
  const setMode = useSessionStore((state) => state.setMode);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(() => !isStandalone());
  const [installHelp, setInstallHelp] = useState(false);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShowInstall(false);
  }

  function chooseMode(mode: 'demo' | 'own') {
    setMode(mode);
    navigate('/today', { replace: true });
  }

  return (
    <main className="welcome-page">
      <div className="welcome-page__wash" aria-hidden="true" />
      <section className="welcome-content" aria-labelledby="welcome-title">
        <BrandMark />
        <div className="welcome-hero">
          <div className="welcome-hero__copy">
            <p className="eyebrow">{TAGLINE}</p>
            <h1 id="welcome-title">A gentler way to notice your day.</h1>
            <p className="welcome-lede">{MASCOT_NAME} brings your body, environment, and routine into one personal view.</p>
          </div>
          <Mascot mood="curious" size={132} />
        </div>

        {showInstall && (
          <section className="install-card" aria-label="Install Praanaika">
            <div className="install-card__icon"><Download size={20} aria-hidden="true" /></div>
            <div>
              <h2>Add Praanaika to your home screen</h2>
              <p>{installHelp ? installHelpText() : 'It keeps your view close and ready, even when you are offline.'}</p>
            </div>
            <Button onClick={installApp}>Install app</Button>
            <button className="text-button" onClick={() => setShowInstall(false)}>Continue in browser</button>
          </section>
        )}

        <section className="welcome-choice" aria-label="Choose a profile">
          <p className="welcome-choice__label">Choose how to begin</p>
          <button className="choice-card choice-card--primary" onClick={() => chooseMode('demo')}>
            <span className="choice-card__icon"><Sparkles size={20} aria-hidden="true" /></span>
            <span><strong>Explore the demo profile</strong><small>See how Praanaika connects the dots with synthetic data.</small></span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
          <button className="choice-card" onClick={() => chooseMode('own')}>
            <span className="choice-card__icon"><span className="choice-card__ring" /></span>
            <span><strong>Set up my own profile</strong><small>Start with an empty, private space on this device.</small></span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </section>

        <button className="about-link" onClick={() => navigate('/about')}>
          <Info size={17} aria-hidden="true" /> What is Praanaika?
        </button>
        <p className="welcome-footnote">Your data stays on this device. You can delete it anytime.</p>
      </section>
    </main>
  );
}
