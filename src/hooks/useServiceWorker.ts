import { useState, useEffect } from 'react';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true);

      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          setRegistration(reg);
          setIsInstalled(true);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  const updateServiceWorker = async () => {
    if (registration) {
      try {
        await registration.update();
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  };

  return {
    isSupported,
    isInstalled,
    registration,
    updateServiceWorker,
  };
};
