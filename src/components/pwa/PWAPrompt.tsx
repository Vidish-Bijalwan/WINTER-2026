import React, { useState, useEffect } from 'react';
import { useServiceWorker } from '../../hooks/useServiceWorker';
import './PWAPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isInstalled } = useServiceWorker();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isInstalled) return null;
  if (localStorage.getItem('pwa-prompt-dismissed')) return null;

  return (
    <div className="pwa-prompt">
      <div className="pwa-prompt-content">
        <h3>Install TopoForge</h3>
        <p>Install this app on your device for a better experience</p>
        <div className="pwa-prompt-actions">
          <button onClick={handleInstall} className="btn btn-primary">
            Install
          </button>
          <button onClick={handleDismiss} className="btn btn-secondary">
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt;
