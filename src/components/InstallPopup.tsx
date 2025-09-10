// src/components/pwaInstaller.tsx

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// IMPORTANT: This 'declare global' block ensures that BeforeInstallPromptEvent
// is recognized by TypeScript across your project, even though this file is a module.
// We are adding it here as per your request to avoid a separate global.d.ts file.
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  // Also augment WindowEventMap to ensure addEventListener types correctly
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installPromptShown = false; // To prevent showing the banner multiple times

/**
 * Checks if Service Workers are supported in the current environment.
 * @returns {boolean} True if Service Workers are supported and not in a known unsupported environment (like StackBlitz).
 */
function isServiceWorkerSupported(): boolean {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  const isStackBlitz =
    window.location.hostname.includes('stackblitz') ||
    window.location.hostname.includes('webcontainer') ||
    (window.location.hostname.includes('localhost') &&
      window.navigator.userAgent.includes('WebContainer'));
  return !isStackBlitz;
}

// Simple component to detect if it's likely a mobile device based on user agent
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false; // Server-side rendering check
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
};

// ===============================================
// React Component for PWA Install Prompt
// ===============================================

interface InstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ onInstall, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = isMobileDevice();

  // 1. State for the aurora animation
  const [auroraOffset, setAuroraOffset] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const autoDismissTimeout = setTimeout(() => {
      if (isVisible) {
        console.log('⏰ Auto-dismissing install prompt after 8 seconds');
        onDismiss();
      }
    }, 8000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(autoDismissTimeout);
    };
  }, [isVisible, onDismiss]);
  
  // 2. useEffect to update the aurora state, creating the animation
  useEffect(() => {
    const auroraInterval = setInterval(() => {
      setAuroraOffset(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(auroraInterval);
  }, []);


  return createPortal(
    <div
      className={`
        fixed top-[88px] right-4 z-[9999] font-sans max-w-xs
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      {/* Glow Effect */}
      <div
        className={`
          absolute inset-0 rounded-2xl -z-10
          transition-opacity duration-500 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          filter: 'blur(30px)',
          background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.5), rgba(66, 165, 245, 0.4), rgba(33, 150, 243, 0.5))',
          transform: 'translateY(10px) scale(0.95)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Popup Content */}
      <div
        id="install-banner-content"
        className={`
          relative p-5 rounded-2xl overflow-hidden
          bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 shadow-xl
        `}
      >
        {/* 3. New Aurora Background Animation */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `conic-gradient(from ${auroraOffset}deg at 50% 50%, 
                rgba(26, 115, 232, 0.5) 0deg,
                rgba(66, 165, 245, 0.4) 90deg,
                rgba(129, 212, 250, 0.5) 180deg,
                rgba(103, 58, 183, 0.4) 270deg,
                rgba(26, 115, 232, 0.5) 360deg)`,
              filter: 'blur(30px)',
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `conic-gradient(from ${-auroraOffset * 0.7}deg at 30% 70%, 
                rgba(129, 212, 250, 0.5) 0deg,
                rgba(103, 58, 183, 0.3) 120deg,
                rgba(66, 165, 245, 0.4) 240deg,
                rgba(129, 212, 250, 0.5) 360deg)`,
              filter: 'blur(40px)',
              transform: 'scale(1.8)',
            }}
          />
        </div>

        {/* Light Ripple Effect */}
        <div
          className={`
            absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full -z-10
            bg-gradient-to-r from-blue-200/40 via-blue-300/50 to-blue-400/40 dark:from-blue-400/20 dark:via-blue-500/30 dark:to-blue-600/20 blur-3xl
            animate-ripple pointer-events-none
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transition: 'opacity 500ms ease-out',
          }}
        />

        {/* Header Section: Icon and text content */}
        <div className="flex items-center gap-4 mb-3 relative">
          <div className="text-3xl drop-shadow-md">
            {isMobile ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-200"></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-200"></svg>
            )}
          </div>
          <div className="flex-1">
            <div className="font-bold mb-1 text-lg text-shadow-sm text-gray-900 dark:text-white leading-none">Install Portfolio App</div>
            <div className="text-sm opacity-90 leading-tight text-gray-800 dark:text-gray-200">Add to home screen for quick access and offline viewing</div>
          </div>
        </div>

        {/* Buttons Section: Install and Cancel (with X icon) */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onInstall}
            className="
              flex-1 py-3 px-5 rounded-lg cursor-pointer font-semibold text-sm group
              transition-all duration-300 ease-in-out
              shadow-md hover:shadow-lg active:scale-95 hover:scale-[1.08]
              text-white
              bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500/30
              hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50
              flex items-center justify-center gap-2
            "
          >
            <span className="group-hover:scale-110 transition-transform duration-200">⬇️</span>
            <span>Install</span>
          </button>
          <button
            onClick={onDismiss}
            className="
              flex-1 py-3 px-5 rounded-lg cursor-pointer font-semibold text-sm group
              transition-all duration-300 ease-in-out
              shadow-md hover:shadow-lg active:scale-95 hover:scale-[1.08]
              text-white
              bg-white/20 border border-white/30
              hover:bg-white/30 hover:shadow-white/25
              flex items-center justify-center gap-2
            "
          >
            <X className="w-5 h-5 text-red-700 transition-transform duration-200 group-hover:rotate-[360deg] shrink-0" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface ThankYouBannerProps {
  onDismiss: () => void;
}

const ThankYouBanner: React.FC<ThankYouBannerProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = isMobileDevice();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const autoDismissTimeout = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(autoDismissTimeout);
    };
  }, [onDismiss]);

  return createPortal(
    <div
      className={`
        fixed top-[88px] right-4 z-[9999] font-sans max-w-[280px]
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div
        className={`
          absolute inset-0 rounded-xl -z-10
          transition-opacity duration-500 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          filter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(26, 115, 232, 0.4), rgba(66, 165, 245, 0.3), rgba(33, 150, 243, 0.4))',
          transform: 'translateY(8px) scale(0.96)',
          pointerEvents: 'none',
        }}
      />

      <div
        id="thank-you-banner-content"
        className={`
          relative p-4 rounded-xl overflow-hidden
          bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 shadow-xl
        `}
      >
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              background: 'linear-gradient(135deg, #1A73E8 0%, #42A5F5 30%, #2196F3 60%, #1976D2 100%)',
              animation: 'gradientShift 6s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #E3F2FD 50%, transparent 100%)',
              animation: 'shimmer 3s linear infinite'
            }}
          />
        </div>

        <div
          className={`
            absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 rounded-full -z-10
            bg-gradient-to-r from-blue-200/40 via-blue-300/50 to-blue-400/40 blur-2xl
            animate-ripple pointer-events-none
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transition: 'opacity 500ms ease-out',
          }}
        />

        <div className="flex items-center gap-3">
          <div className="text-2xl drop-shadow-md">
            {isMobile ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone-check text-gray-900 dark:text-white"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/><path d="M12 18h.01"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop-check text-gray-900 dark:text-white"><path d="M11 20H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="M2 15h12"/><path d="m18 22 4-4"/></svg>
            )}
          </div>
          <div>
            <div className="font-semibold text-shadow-sm text-gray-900 dark:text-white">App Installed!</div>
            <div className="text-sm opacity-90 text-gray-800 dark:text-gray-200">Thanks for installing the portfolio app</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add CSS animations to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gradientShift {
      0%, 100% { 
        background-position: 0% 50%; 
        transform: scale(1) rotate(0deg);
      }
      25% { 
        background-position: 100% 50%; 
        transform: scale(1.05) rotate(1deg);
      }
      50% { 
        background-position: 200% 50%; 
        transform: scale(1) rotate(0deg);
      }
      75% { 
        background-position: 300% 50%; 
        transform: scale(1.05) rotate(-1deg);
      }
    }
    
    @keyframes slideAcross {
      0% { 
        transform: translateX(-100%) rotate(45deg); 
        opacity: 0;
      }
      50% { 
        opacity: 1; 
      }
      100% { 
        transform: translateX(200%) rotate(45deg); 
        opacity: 0;
      }
    }
    
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) scale(1); 
      }
      50% { 
        transform: translateY(-10px) scale(1.1); 
      }
    }
    
    @keyframes shimmer {
      0% { 
        transform: translateX(-100%); 
      }
      100% { 
        transform: translateX(100%); 
      }
    }
  `;
  
  if (!document.head.querySelector('style[data-pwa-animations]')) {
    style.setAttribute('data-pwa-animations', 'true');
    document.head.appendChild(style);
  }
}

// ===============================================
// Main PWA Installer Component
// ===============================================

const PWAInstaller: React.FC = () => {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showThankYouBanner, setShowThankYouBanner] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (isServiceWorkerSupported()) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered successfully:', registration);

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    if (confirm('🔄 New version available! Click OK to update.')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.warn(
              '⚠️ SW registration failed (this is expected in some environments):',
              registrationError.message
            );
          });
      });
    } else {
      console.log('ℹ️ Service Workers not supported in this environment - PWA features will be limited');
    }

    // 2. Before Install Prompt Listener
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('🚀 PWA install prompt triggered');
      e.preventDefault();
      deferredPrompt = e;
      if (!installPromptShown) { // Only show if not already shown/installed
        setTimeout(() => {
          setShowInstallBanner(true);
        }, 3000); // Show after 3 seconds
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. App Installed Listener
    const handleAppInstalled = () => {
      console.log('🎉 PWA was installed successfully');
      installPromptShown = true;
      setShowInstallBanner(false); // Hide install banner if it was open
      setTimeout(() => {
        setShowThankYouBanner(true);
      }, 1000);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. Debug Logging
    console.log('🔍 PWA Installation Criteria Check:');
    console.log('- Service Worker:', isServiceWorkerSupported() ? '✅' : '❌ (Not supported in this environment)');
    console.log('- HTTPS:', location.protocol === 'https:' || location.hostname === 'localhost' ? '✅' : '❌');
    console.log('- Manifest:', document.querySelector('link[rel="manifest"]') ? '✅' : '❌');

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleInstallClick = async () => {
    console.log('🎯 User clicked install button');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`👤 User response to install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      deferredPrompt = null;
    } else {
      console.log('⚠️ No deferred prompt available');
      alert(
        'To install this app:\n\n• Chrome: Click the install icon in the address bar\n• Safari: Tap Share → Add to Home Screen\n• Edge: Click the app icon in the address bar'
      );
    }
    setShowInstallBanner(false); // Hide the install banner
  };

  const handleDismissInstallBanner = () => {
    console.log('👋 User dismissed install prompt');
    setShowInstallBanner(false);
  };

  const handleDismissThankYouBanner = () => {
    setShowThankYouBanner(false);
  };

  return (
    <>
      {showInstallBanner && (
        <InstallBanner
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstallBanner}
        />
      )}
      {showThankYouBanner && (
        <ThankYouBanner
          onDismiss={handleDismissThankYouBanner}
        />
      )}
    </>
  );
};

export default PWAInstaller;