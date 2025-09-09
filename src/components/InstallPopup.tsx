// src/components/InstallPopup.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Download, X, Smartphone, Laptop, Star, Zap, Shield, Share, Check, Hourglass } from 'lucide-react';

// --- Type Definitions ---
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPopupProps {
  onClose?: (outcome?: 'accepted' | 'dismissed' | 'manual-close' | 'autoclose') => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

// --- Component ---
export const InstallPopup: React.FC<InstallPopupProps> = ({ onClose, deferredPrompt: initialDeferredPrompt }) => {
  const [currentDeferredPrompt, setCurrentDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(initialDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [showFlairs, setShowFlairs] = useState(true);

  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Browser/Device Detection ---
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isEdge = /Edg/.test(navigator.userAgent);
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const DeviceIcon = isMobileDevice ? Smartphone : Laptop;

  // --- Effects ---
  useEffect(() => {
    setCurrentDeferredPrompt(initialDeferredPrompt);
    setInstallAvailable(!!initialDeferredPrompt);

    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    checkInstalled();

    const handleAppInstalled = () => {
      console.log('🚀 PWA Popup: App was installed');
      setIsInstalled(true);
      setCurrentDeferredPrompt(null);
      setInstallAvailable(false);
      localStorage.setItem('pwa-installed', 'true');
      (window as any).installPromptEvent = null;
      onClose?.('accepted');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    autoCloseTimerRef.current = setTimeout(() => {
      if (!isInstalling && !isInstalled) {
        onClose?.('autoclose');
      }
    }, 10000);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [onClose, isInstalling, isInstalled, initialDeferredPrompt]);

  useEffect(() => {
    if (showFlairs) {
      const flairHideTimer = setTimeout(() => setShowFlairs(false), 15000);
      return () => clearTimeout(flairHideTimer);
    }
  }, [showFlairs]);

  // --- Handlers ---
  const handleInstallClick = async () => {
    if (!currentDeferredPrompt) return;

    setIsInstalling(true);
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);

    try {
      await currentDeferredPrompt.prompt();
      const { outcome } = await currentDeferredPrompt.userChoice;
      if (outcome !== 'accepted') onClose?.('dismissed');
      setCurrentDeferredPrompt(null);
      setInstallAvailable(false);
      (window as any).installPromptEvent = null;
    } catch (error) {
      console.error('Error during installation:', error);
      onClose?.('manual-close');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => onClose?.('manual-close');
  const handleDismissPermanently = () => {
    localStorage.setItem('pwa-popup-dismissed', 'true');
    onClose?.('dismissed');
  };

  // --- Render Logic ---
  if (isInstalled) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xl" onClick={handleClose} />
        <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3 p-8 text-center">
          <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-on-tertiary" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Already Installed!</h2>
          <p className="text-on-surface-variant mb-4">MissingTube is already installed on your device.</p>
          <button onClick={handleClose} className="w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95">
            Great!
          </button>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Zap, text: 'Lightning fast performance' },
    { icon: Shield, text: 'Works offline' },
    { icon: Star, text: 'Native app experience' }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xl" onClick={handleClose} />

      {/* --- Main Modal Card with Aurora Background --- */}
      <div className="relative backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3 overflow-hidden">
        {/* --- Aurora Background Effect --- */}
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.5),_transparent_80%)] [filter:blur(120px)] animate-aurora"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.5),_transparent_80%)] [filter:blur(120px)] animate-aurora [animation-delay:-6s]"></div>
        </div>

        {/* --- Decorative Flairs --- */}
        {showFlairs && (
          <>
            <div className="absolute -top-4 -left-4 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-70" />
            <div className="absolute top-1/4 -right-4 w-3 h-3 bg-green-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-1/3 -left-6 w-5 h-5 bg-yellow-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* --- Main Modal Content --- */}
        <div className="relative p-8 text-center">
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="w-full h-full bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl flex items-center justify-center transform rotate-12 transition-all duration-300 hover:scale-110 hover:rotate-[20deg] shadow-lg border border-white/30 dark:border-white/20">
              <img src="/assets/Icon_Light_NB.png" alt="App Icon" className="w-12 h-12 object-contain dark:hidden transform -rotate-12" />
              <img src="/assets/Icon_Dark_NB.png" alt="App Icon" className="w-12 h-12 object-contain hidden dark:block transform -rotate-12" />
            </div>
          </div>

          <div className="bg-white/10 dark:bg-black/10 rounded-2xl p-4 mb-6 border border-gray-300/30 dark:border-gray-700/30 transition-transform duration-200 hover:bg-white/20 hover:scale-[1.03]">
            <h2 className="text-2xl font-bold text-on-surface">Install MissingTube</h2>
            <p className="text-on-surface-variant text-sm">Get the full app experience on your device.</p>
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3 p-3 bg-white/10 dark:bg-black/10 rounded-2xl transition-all duration-200 hover:bg-white/20 hover:scale-[1.03]">
                <div className="p-2 bg-primary/20 rounded-xl"><feature.icon className="w-4 h-4 text-primary" /></div>
                <span className="text-on-surface text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* --- Conditional Action Buttons --- */}
          {isIOS && isSafari ? (
            // iOS Safari Instructions
            <div className="text-center">
              <div className="bg-warning-container/20 border border-warning/30 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2"><Share className="w-5 h-5 text-on-warning-container" /><span className="font-semibold text-on-warning-container">iOS Safari Instructions</span></div>
                <p className="text-sm text-on-warning-container">1. Tap the <strong>Share</strong> button<br/>2. Scroll down and select <strong>"Add to Home Screen"</strong></p>
              </div>
              <button onClick={handleClose} className="w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95">Got it!</button>
            </div>
          ) : installAvailable && currentDeferredPrompt ? (
            // Standard Install Button
            <div className="text-center space-y-2">
              <button onClick={handleInstallClick} disabled={isInstalling} className="relative w-full flex items-center justify-center gap-3 py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
                {isInstalling ? <><div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>Installing...</> : <><Download className="w-5 h-5" />Install App</>}
              </button>
              <div className="flex gap-2">
                <button onClick={handleClose} className="group flex-1 py-3 bg-white/10 dark:bg-black/10 text-on-surface rounded-2xl font-medium transition-all hover:scale-105 active:scale-95"><div className="flex items-center justify-center gap-2"><Hourglass className="w-5 h-5 text-on-surface/70" />Maybe Later</div></button>
                <button onClick={handleDismissPermanently} className="group flex-1 py-3 bg-white/10 dark:bg-black/10 text-red-500 rounded-2xl font-medium transition-all hover:scale-105 active:scale-95"><div className="flex items-center justify-center gap-2"><X className="w-5 h-5" />No Thanks</div></button>
              </div>
            </div>
          ) : (
            // Fallback for other browsers
            <div className="text-center">
              <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2"><DeviceIcon className="w-5 h-5 text-on-secondary-container" /><span className="font-semibold text-on-secondary-container">Manual Installation</span></div>
                <div className="text-sm text-on-secondary-container text-left space-y-2">
                  {isChrome && <p><strong>Chrome:</strong> Look for the install icon in the address bar.</p>}
                  {isEdge && <p><strong>Edge:</strong> Click "..." → Apps → Install this site as an app.</p>}
                  {!isChrome && !isEdge && <p>Look for an "Install" or "Add to Home Screen" option in your browser's menu.</p>}
                </div>
              </div>
              <button onClick={handleClose} className="w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95">Got it!</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPopup;