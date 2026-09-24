import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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

export function InstallBanner() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(() => !isStandalone());
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  async function install() {
    if (!prompt) {
      setHelp(true);
      return;
    }
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="install-banner" aria-label="Install Praanaika">
      <div className="install-banner__icon"><Download size={18} aria-hidden="true" /></div>
      <div className="install-banner__copy">
        <strong>Make Praanaika an app</strong>
        <span>{help ? installHelpText() : 'Keep your personal view one tap away.'}</span>
      </div>
      <Button onClick={install}>Install app</Button>
      <button className="icon-button" aria-label="Dismiss install banner" onClick={() => setVisible(false)}><X size={17} aria-hidden="true" /></button>
    </aside>
  );
}
