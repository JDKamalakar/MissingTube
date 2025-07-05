import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { InstallPopup } from './InstallPopup'; // Make sure the path is correct

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes('android-app://') ||
          localStorage.getItem('pwa-installed') === 'true') {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    const isDismissedPermanently = localStorage.getItem('pwa-popup-dismissed') === 'true';

    if (checkInstalled() || isDismissedPermanently) {
      console.log('InstallPrompt: App already installed or permanently dismissed. Not showing prompt.');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      (window as any).installPromptEvent = event;
      setDeferredPrompt(event);
      setShowInstallPopup(true);
      console.log('InstallPrompt: beforeinstallprompt fired, showing custom popup.');
    };

    const handleAppInstalled = () => {
      console.log('InstallPrompt: App was successfully installed.');
      setIsInstalled(true);
      setShowInstallPopup(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
      (window as any).installPromptEvent = null;

      // Show the success message popup
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (!checkInstalled() && !isDismissedPermanently && (window as any).installPromptEvent) {
      setDeferredPrompt((window as any).installPromptEvent);
      setShowInstallPopup(true);
      console.log('InstallPrompt: Found existing prompt event on mount, showing popup.');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // If the app is already installed, render nothing from this component.
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Custom Install Popup */}
      {showInstallPopup && deferredPrompt && (
        <InstallPopup
          onClose={(outcome) => {
            setShowInstallPopup(false); // Hide the popup regardless of outcome
            if (outcome === 'dismissed' || outcome === 'dismissed-browser') {
              // If user explicitly dismissed from custom popup OR browser popup, mark as permanently dismissed
              localStorage.setItem('pwa-popup-dismissed', 'true');
              console.log('InstallPrompt: User dismissed popup (custom or browser). Permanently dismissed.');
            } else if (outcome === 'autoclose') {
              // If it auto-closed, do not mark as permanently dismissed,
              // as they might want to see it again later if the event re-fires.
              console.log('InstallPrompt: Popup auto-closed. Will show again if prompt re-fires.');
            }
          }}
          deferredPrompt={deferredPrompt}
        />
      )}

      {/* Success Popup - UI shown after successful installation */}
      {showSuccessPopup && (
        <div className="fixed bottom-6 left-6 right-6 z-[9999] flex justify-center">
          <div className="bg-green-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-400/30 animate-fade-in max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">PWA Installed!</div>
                <div className="text-sm opacity-90">MissingTube is now available as an app</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};