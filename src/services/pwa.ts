import { registerSW } from 'virtual:pwa-register';

let updateServiceWorker: (() => Promise<void>) | null = null;

export function startPwaUpdates() {
  updateServiceWorker = registerSW({
    immediate: true,
    onRegisteredSW: (_swUrl, registration) => {
      if (!registration) return;
      void registration.update();
      window.setInterval(() => void registration.update(), 60_000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void registration.update();
      });
    },
    onNeedRefresh: () => {
      void updateServiceWorker?.();
    },
  });
}
