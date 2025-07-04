import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Star, Zap, Shield, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPopupProps {
  onClose?: () => void;
  /**
   * @description Temporarily force the popup to show for debugging/demonstration.
   * Remove this prop and its usage in production.
   */
  forceShow?: boolean; // <--- Add this new prop
}

export const InstallPopup: React.FC<InstallPopupProps> = ({ onClose, forceShow }) => { // <--- Destructure forceShow
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    checkInstalled(); // Initial check

    // Only proceed with prompt logic if not forced to show
    if (!forceShow) { // <--- Add conditional check here
      // Check for existing deferred prompt from global scope
      const checkForDeferredPrompt = () => {
        if ((window as any).installPromptEvent) {
          console.log('🚀 PWA Popup: Found existing install prompt event');
          setDeferredPrompt((window as any).installPromptEvent);
          setInstallAvailable(true);
          return true;
        }
        return false;
      };

      checkForDeferredPrompt();

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('🚀 PWA Popup: beforeinstallprompt event fired');
        const event = e as BeforeInstallPromptEvent;
        e.preventDefault();
        setDeferredPrompt(event);
        setInstallAvailable(true);
        // Store globally for other components
        (window as any).installPromptEvent = event;
      };

      // Listen for app installed event
      const handleAppInstalled = () => {
        console.log('🚀 PWA Popup: App was installed');
        setIsInstalled(true);
        setDeferredPrompt(null);
        setInstallAvailable(false);
        localStorage.setItem('pwa-installed', 'true');
        // Clear global reference
        (window as any).installPromptEvent = null;
        onClose?.();
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Cleanup
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [onClose, forceShow]); // <--- Add forceShow to dependency array

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('🚀 PWA Popup: No deferred prompt available');
      // If forceShow is true and no prompt, we might be in a scenario where
      // the browser doesn't support it or it hasn't fired.
      // You might want to provide specific feedback here if needed.
      return;
    }

    setIsInstalling(true);

    try {
      console.log('🚀 PWA Popup: Triggering install prompt');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('🚀 PWA Popup: User choice:', outcome);

      if (outcome === 'accepted') {
        console.log('✅ PWA Popup: User accepted the install prompt');
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
      } else {
        console.log('❌ PWA Popup: User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setInstallAvailable(false);
      // Clear global reference
      (window as any).installPromptEvent = null;
      onClose?.();
    } catch (error) {
      console.error('❌ PWA Popup: Error during installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleDismissPermanently = () => {
    localStorage.setItem('pwa-popup-dismissed', 'true');
    onClose?.();
  };

  // Main rendering condition.
  // If forceShow is true, it will render regardless of isInstalled state.
  // Otherwise, it renders if not installed.
  if (isInstalled && !forceShow) { // <--- Only show "Already Installed" if not forced AND installed
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

  // If forceShow is true and it's already installed, we still want to show the main popup,
  // but perhaps the "Install App" button should be disabled or replaced.
  // For simplicity, we'll just let it proceed to show the main popup,
  // but the install button might not work if deferredPrompt is null.

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isEdge = /Edg/.test(navigator.userAgent);

  const features = [
    { icon: Zap, text: 'Lightning fast performance' },
    { icon: Shield, text: 'Works offline' },
    { icon: Star, text: 'Native app experience' }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-xl transition-opacity duration-300 ease-out"
        onClick={handleClose}
      />

      {/* Popup Container */}
      <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3">
        {/* Header */}
        <div className="relative p-8 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-on-surface rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon */}
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center transform rotate-12 transition-all duration-300 hover:scale-110 hover:rotate-[20deg] shadow-lg">
              <div className="w-12 h-12 bg-white rounded-lg transform -rotate-12 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-primary rounded-lg"></div>
              </div>
            </div>
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-warning rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-tertiary rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Install MissingTube
          </h2>

          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Get the full MissingTube experience with our Progressive Web App.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl transition-all duration-200 hover:bg-white/20"
                >
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-on-surface text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Installation Actions */}
          {isIOS && isSafari ? (
            // iOS Safari Instructions
            <div className="text-center">
              <div className="bg-warning-container/20 border border-warning/30 rounded-2xl p-4 mb-4">
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
                className="w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                Got it!
              </button>
            </div>
          ) : installAvailable && deferredPrompt ? (
            // Native PWA Install Available
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Install App
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-white/10 text-on-surface rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleDismissPermanently}
                  className="flex-1 py-3 bg-white/10 text-on-surface-variant rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  No Thanks
                </button>
              </div>
            </div>
          ) : (
            // Manual Installation Instructions
            <div className="text-center">
              <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-on-secondary-container" />
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
                  className="flex-1 py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  Got it!
                </button>
                <button
                  onClick={handleDismissPermanently}
                  className="flex-1 py-3 bg-white/10 text-on-surface-variant rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  No Thanks
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};