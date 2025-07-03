import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(event);
      
      // Only show prompt if user has interacted with the app significantly
      setTimeout(() => {
        const dismissed = localStorage.getItem('install-prompt-dismissed');
        const lastShown = localStorage.getItem('install-prompt-last-shown');
        const now = Date.now();
        
        // Show prompt only if never dismissed permanently and it's been more than 30 days since last shown
        if (!dismissed || (lastShown && now - parseInt(lastShown) > 30 * 24 * 60 * 60 * 1000)) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds of usage
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('install-prompt-dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        localStorage.setItem('install-prompt-dismissed', 'true');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('install-prompt-dismissed', 'true');
        localStorage.setItem('install-prompt-last-shown', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-last-shown', Date.now().toString());
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt || !showPrompt) {
    return null;
  }

  return (
    <div className={`install-prompt ${showPrompt ? 'show' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-2xl">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">Install MissingTube</h3>
          <p className="text-white/80 text-sm">Add to your home screen for quick access and offline features</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 text-white/80 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};