import React, { useState, useEffect } from 'react';

import { Download, Smartphone } from 'lucide-react';

import { InstallPopup } from './InstallPopup';



interface BeforeInstallPromptEvent extends Event {

  prompt(): Promise<void>;

  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;

}



export const InstallPrompt: React.FC = () => {

  const [showInstallButton, setShowInstallButton] = useState(false);

  const [showInstallPopup, setShowInstallPopup] = useState(false);

  const [isInstalled, setIsInstalled] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);



  useEffect(() => {

    // Check if app is already installed

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



    // Check if user has permanently dismissed the popup

    const isDismissed = localStorage.getItem('pwa-popup-dismissed') === 'true';



    if (!checkInstalled() && !isDismissed) {

      // Check for install prompt availability

      const checkInstallAvailable = () => {

        if ((window as any).installPromptEvent) {

          setShowInstallButton(true);

          return true;

        }

        return false;

      };



      checkInstallAvailable();



      // Listen for beforeinstallprompt event

      const handleBeforeInstallPrompt = (e: Event) => {

        e.preventDefault();

        (window as any).installPromptEvent = e;

        setShowInstallButton(true);

      };



      // Listen for app installed event

      const handleAppInstalled = () => {

        setIsInstalled(true);

        setShowInstallButton(false);

        localStorage.setItem('pwa-installed', 'true');

      };



      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      window.addEventListener('appinstalled', handleAppInstalled);



      return () => {

        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.removeEventListener('appinstalled', handleAppInstalled);

      };

    }

  }, []);



  // Handle scroll detection for positioning

  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 20);

    };



    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  // Don't show if already installed or no install available

  if (isInstalled || !showInstallButton) {

    return null;

  }



  return (

    <>

      <div

        className={`fixed z-50 transition-all duration-300 ease-in-out ${

          isScrolled

            ? 'top-4 right-20' // Position next to theme toggle when scrolled

            : 'top-6 right-20' // Position next to theme toggle when not scrolled

        }`}

      >

        <button

          onClick={() => setShowInstallPopup(true)}

          className="p-3 rounded-2xl bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-110 group shadow-xl"

          aria-label="Install app"

          title="Install MissingTube as an app"

        >

          <div className="relative w-6 h-6 flex items-center justify-center">

            <Smartphone

              className="transition-all duration-500 ease-out text-blue-500 dark:text-blue-400 group-hover:scale-110 group-hover:animate-pulse"

              size={24}

            />

          </div>

        </button>

      </div>



      {showInstallPopup && (

        <InstallPopup onClose={() => setShowInstallPopup(false)} />

      )}

    </>

  );

};