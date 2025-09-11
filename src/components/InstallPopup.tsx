import React, { useState, useEffect, useRef } from 'react';
import { Download, X, Smartphone, Laptop, Star, Zap, Shield, Share, Check, Slash, Hourglass } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPopupProps {
  onClose?: (outcome?: 'accepted' | 'dismissed' | 'manual-close' | 'autoclose') => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export const InstallPopup: React.FC<InstallPopupProps> = ({ onClose, deferredPrompt: initialDeferredPrompt }) => {
  const [currentDeferredPrompt, setCurrentDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(initialDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [showFlairs, setShowFlairs] = useState(true);

  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isEdge = /Edg/.test(navigator.userAgent);

  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const DeviceIcon = isMobileDevice ? Smartphone : Laptop;

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
      console.log('🚀 PWA Popup: App was installed (from InstallPopup listener)');
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
        console.log('🚀 PWA Popup: Auto-closing after 10 seconds.');
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
      const flairHideTimer = setTimeout(() => {
        setShowFlairs(false);
      }, 15000);

      return () => clearTimeout(flairHideTimer);
    }
  }, [showFlairs]);

  const handleInstallClick = async () => {
    if (!currentDeferredPrompt) {
      console.log('🚀 PWA Popup: No deferred prompt available for installation action.');
      return;
    }

    setIsInstalling(true);
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    try {
      console.log('🚀 PWA Popup: Triggering native install prompt');
      await currentDeferredPrompt.prompt();
      const { outcome } = await currentDeferredPrompt.userChoice;

      console.log('🚀 PWA Popup: User choice:', outcome);

      if (outcome === 'accepted') {
        console.log('✅ PWA Popup: User accepted the native install prompt');
      } else {
        console.log('❌ PWA Popup: User dismissed the native install prompt');
        onClose?.('dismissed');
      }

      setCurrentDeferredPrompt(null);
      setInstallAvailable(false);
      (window as any).installPromptEvent = null;

    } catch (error) {
      console.error('❌ PWA Popup: Error during installation:', error);
      onClose?.('manual-close');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    onClose?.('manual-close');
  };

  const handleDismissPermanently = () => {
    localStorage.setItem('pwa-popup-dismissed', 'true');
    onClose?.('dismissed');
  };

  if (isInstalled) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xl transition-opacity duration-300 ease-out"
          onClick={handleClose}
        />
        <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3 p-8 text-center">
          <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-on-tertiary" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Already Installed!</h2>
          <p className="text-on-surface-variant mb-4">MissingTube is already installed on your device.</p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-inter">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-xl transition-opacity duration-300 ease-out"
        onClick={handleClose}
      />

      {/* Main container: STATIC positioner, NO animation class */}
      <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3 overflow-hidden">
        
        {/* Child 1: The STATIC Blue Glow */}
        <div
          className="absolute inset-0 rounded-3xl -z-10"
          style={{
            filter: 'blur(30px)',
            background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.5), rgba(66, 165, 245, 0.4), rgba(33, 150, 243, 0.5))',
            transform: 'translateY(10px) scale(0.95)',
            pointerEvents: 'none',
          }}
        />

        {/* Child 2: ANIMATING wrapper for all content. It's a sibling to the glow. */}
        {/* Replace 'animate-pulse' with any other animation class if you wish */}
        <div className="absolute inset-0 animate-pulse">
            {showFlairs && (
              <>
                <div className="absolute -top-4 -left-4 w-4 h-4 bg-yellow-300 rounded-full opacity-70" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.1s' }}></div>
                <div className="absolute top-1/4 -right-4 w-3 h-3 bg-green-300 rounded-full opacity-60" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-1/3 -left-6 w-5 h-5 bg-yellow-300 rounded-full opacity-80" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-4 right-1/4 w-4 h-4 bg-green-300 rounded-full opacity-75" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.7s' }}></div>
                <div className="absolute top-1/2 -right-8 w-3 h-3 bg-yellow-300 rounded-full opacity-65" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.9s' }}></div>
                <div className="absolute -top-6 right-1/3 w-4 h-4 bg-green-300 rounded-full opacity-60" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.1s' }}></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-300 rounded-full opacity-70" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.3s' }}></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-green-300 rounded-full opacity-60" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.5s' }}></div>
              </>
            )}

            <div className="relative p-8 text-center z-10">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl flex items-center justify-center transform rotate-12 transition-all duration-300 hover:scale-110 hover:rotate-[20deg] shadow-lg border border-white/30 dark:border-white/20">
                  <img
                    src="/assets/Icon_Light_NB.png"
                    alt="MissingTube"
                    className="w-12 h-12 object-contain dark:hidden transform -rotate-12"
                  />
                  <img
                    src="/assets/Icon_Dark_NB.png"
                    alt="MissingTube"
                    className="w-12 h-12 object-contain hidden dark:block transform -rotate-12"
                  />
                </div>
                {showFlairs && (
                  <>
                    <div className="absolute -top-4 left-1/4 w-3 h-3 bg-warning rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.1s' }}></div>
                    <div className="absolute top-1/4 -right-4 w-4 h-4 bg-tertiary rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-1/3 -left-4 w-2 h-2 bg-warning rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute -bottom-4 right-1/4 w-3 h-3 bg-tertiary rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.7s' }}></div>
                    <div className="absolute top-1/2 -right-6 w-2 h-2 bg-warning rounded-full animate-bounce opacity-65" style={{ animationDelay: '0.9s' }}></div>
                    <div className="absolute -top-2 right-1/3 w-2 h-2 bg-tertiary rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.1s' }}></div>
                  </>
                )}
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-gray-300/30 dark:border-gray-700/30 transition-transform duration-200 hover:bg-white/20 hover:scale-[1.03]">
                <h2 className="text-2xl font-bold text-on-surface mb-2">
                  Install MissingTube
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Get the full MissingTube experience with our Progressive Web App.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl transition-all duration-200 hover:bg-white/20 hover:scale-[1.03]"
                    >
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-on-surface text-sm font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {isIOS && isSafari ? (
                <div className="text-center">
                  <div className="bg-warning-container/20 border border-warning/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03]">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Share className="w-5 h-5 text-on-warning-container" />
                      <span className="font-semibold text-on-warning-container">iOS Safari Instructions</span>
                    </div>
                    <p className="text-sm text-on-warning-container">
                      1. Tap the <strong>Share</strong> button in Safari<br/>
                      2. Scroll down and select <strong>"Add to Home Screen"</strong><br/>
                      3. Tap <strong>"Add"</strong> to install
                    </p>
                  </div>
                  <button
                    onClick={handleDismissPermanently}
                    className="group w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-green-500 transition-transform duration-700 group-hover:rotate-[720deg]" />
                      Got it!
                    </div>
                  </button>
                </div>
              ) : installAvailable && currentDeferredPrompt ? (
                <div className="text-center">
                  <div className="bg-primary-container/20 border border-primary/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03] relative overflow-hidden">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-on-primary-container" />
                      <span className="font-semibold text-on-primary-container">Install & Get App</span>
                    </div>
                    <p className="text-sm text-on-primary-container mb-4">
                      Install MissingTube as a native app for the best experience.
                    </p>
                    <button
                      onClick={handleInstallClick}
                      disabled={isInstalling}
                      className="relative w-full flex items-center justify-center gap-3 py-4 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {isInstalling ? (
                        <>
                          <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                          Installing...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 animate-bounce-subtle" /> 
                          Install App
                        </>
                      )}
                    </button>
                    {showFlairs && (
                        <>
                          <div className="absolute -top-1 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.1s' }}></div>
                          <div className="absolute top-1/4 -right-1 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.3s' }}></div>
                          <div className="absolute bottom-1/2 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute -bottom-1 right-1/3 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-75" style={{ animationDelay: '0.7s' }}></div>
                          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-65" style={{ animationDelay: '0.9s' }}></div>
                        </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleClose}
                      className="group flex-1 py-3 bg-white/10 text-on-surface rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Hourglass className="w-5 h-5 text-on-surface/70 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110" />
                        Maybe Later
                      </div>
                    </button>
                    <button
                      onClick={handleDismissPermanently}
                      className="group flex-1 py-3 bg-white/10 text-red-500 rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-6 h-6 text-red-500 transition-transform duration-[2000ms] group-hover:rotate-[720deg]" />
                        No Thanks
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03]">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DeviceIcon className="w-5 h-5 text-on-secondary-container" />
                      <span className="font-semibold text-on-secondary-container">Manual Installation</span>
                    </div>
                    <div className="text-sm text-on-secondary-container text-left space-y-2">
                      {isChrome && (
                        <p><strong>Chrome:</strong> Look for the install icon in the address bar, or go to Settings → Install MissingTube</p>
                      )}
                      {isEdge && (
                        <p><strong>Edge:</strong> Click the "..." menu → Apps → Install this site as an app</p>
                      )}
                      {!isChrome && !isEdge && (
                        <p>Look for an install option in your browser's menu, or bookmark this page for quick access.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClose}
                      className="group flex-1 py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-green-500 transition-transform duration-2000ms group-hover:rotate-[720deg]" />
                        Got it!
                      </div>
                    </button>
                    <button
                      onClick={handleDismissPermanently}
                      className="group flex-1 py-3 bg-white/10 text-red-500 rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-6 h-6 text-red-500 transition-transform duration-[2000ms] group-hover:rotate-[720deg]" />
                        No Thanks
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPopup;