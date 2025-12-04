import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

let deferredPrompt: Event | null = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  console.log('PWA: Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  window.installPromptEvent = e;
});

window.addEventListener('appinstalled', () => {
  console.log('PWA: App installed successfully');
  deferredPrompt = null;
  window.installPromptEvent = null;

  if (window.showInstallationSuccess) {
    window.showInstallationSuccess();
  }
});

window.triggerInstall = async () => {
  if (deferredPrompt || window.installPromptEvent) {
    const promptEvent = (deferredPrompt || window.installPromptEvent) as any;
    if (promptEvent.prompt) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(`PWA: User response: ${outcome}`);
      deferredPrompt = null;
      window.installPromptEvent = null;
    }
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          console.log('PWA: Service Worker registered:', registration.scope);
        });
      })
      .catch((error) => {
        console.error('PWA: Failed to get service worker registrations:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
