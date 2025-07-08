import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Key, History, Info, Download, GitCompare, Menu, X } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { BackupManager } from './BackupManager';
import { HistoryPanel } from './HistoryPanel';
import { AboutModal } from './AboutModal';
import { ComparisonModal } from './ComparisonModal';

interface NavbarProps {
  onApiKeyChange: (apiKey: string) => void;
  onRestoreComplete: () => void;
  onPlaylistSelect: (playlistId: string) => void;
  currentVideos?: any[];
  currentPlaylistInfo?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  onApiKeyChange,
  onRestoreComplete,
  onPlaylistSelect,
  currentVideos = [],
  currentPlaylistInfo = null
}) => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Define scroll thresholds
  const SHRINK_THRESHOLD = 80; // When navbar starts shrinking / reaches minimum desktop height
  const HIDE_THRESHOLD = 300; // When navbar starts hiding on mobile (scroll further down)

  useEffect(() => {
    const checkScrollability = () => {
      setCanScroll(document.documentElement.scrollHeight > (window.innerHeight + 50));
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);

    const observer = new MutationObserver(checkScrollability);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkScrollability);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (canScroll) {
        const currentScrollY = window.scrollY;
        const isDesktop = window.innerWidth >= 640; // sm breakpoint

        // Determine if scrolled for shrinking effect (applies to both desktop/mobile)
        if (currentScrollY > SHRINK_THRESHOLD) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }

        // Logic for hiding/showing navbar on mobile when scrolling further down/up
        if (!isDesktop) { // Apply only for mobile
          if (currentScrollY > HIDE_THRESHOLD && currentScrollY > lastScrollY.current) {
            setIsNavbarHidden(true);
          } else if (currentScrollY < lastScrollY.current || currentScrollY < SHRINK_THRESHOLD) {
            setIsNavbarHidden(false);
          }
        } else {
          setIsNavbarHidden(false); // Ensure it's never hidden on desktop
        }
        
        lastScrollY.current = currentScrollY;
      } else {
        setIsScrolled(false);
        setIsNavbarHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll]);

  const navItems = [
    {
      icon: History,
      label: 'History',
      onClick: () => setShowHistoryPanel(true),
      animation: '-rotate-[30deg]'
    },
    {
      icon: Key,
      label: 'API Key',
      onClick: () => setShowApiKeyModal(true),
      animation: '-rotate-[30deg]'
    },
    {
      icon: Download,
      label: 'Download',
      onClick: () => setShowBackupModal(true),
      animation: 'animate-bounce-short-slow'
    },
    {
      icon: GitCompare,
      label: 'Compare',
      onClick: () => setShowComparisonModal(true),
      animation: 'rotate-[360deg]'
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => setShowAboutModal(true),
      animation: 'rotate-[360deg]'
    }
  ];

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      {/* The main nav element defines its overall height and hiding/showing */}
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl transition-all duration-300 ease-in-out safe-top rounded-b-3xl
                      ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}
                      ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}> {/* py-2 for mobile scrolled, py-3 for mobile unscrolled */}
        
        {/* Inner container for actual content, manages its own layout */}
        <div className={`container mx-auto px-4 max-w-7xl flex h-full transition-all duration-300 ease-in-out
                             ${isScrolled
                               ? 'flex-col justify-center items-center sm:flex-row sm:justify-between sm:gap-x-2 sm:items-center sm:pl-8 sm:pr-8' // Mobile scrolled: justify-center for vertical middle. Desktop scrolled: smaller gap-x, also applied explicit pr-8 here
                               : 'flex-col items-center sm:items-center'}`}> 

          {/* Logo & Site Name Block */}
          <div className={`flex items-center justify-between w-full gap-4 backdrop-blur-lg transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20 px-4
                            ${isScrolled
                              ? 'py-1.5 bg-white/20 dark:bg-black/20 rounded-2xl sm:w-auto sm:flex-shrink-0 justify-center' 
                              : 'py-3 bg-white/30 dark:bg-black/30 rounded-2xl sm:rounded-t-2xl sm:rounded-b-none border-l border-r border-t justify-center w-full'}`}>
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* MissingTube Logo */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg transition-all duration-225 hover:scale-110 active:scale-95">
                  <img
                    src="/assets/Icon_Light_NB.png"
                    alt="MissingTube Logo"
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain dark:hidden transition-opacity duration-300"
                  />
                  <img
                    src="/assets/Icon_Dark_NB.png"
                    alt="MissingTube Logo"
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain hidden dark:block transition-opacity duration-300"
                  />
                </div>
              </div>
              
              {/* Site Name */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                MissingTube
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden group relative flex items-center justify-center w-10 h-10 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 state-layer overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/20"
              aria-label="Toggle mobile menu"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              {showMobileMenu ? (
                <X className="relative z-10 w-5 h-5 transition-all duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="relative z-10 w-5 h-5 transition-all duration-300 group-hover:scale-110" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Buttons Block */}
          <div className={`hidden sm:flex flex-wrap bg-white/30 dark:bg-black/30 backdrop-blur-lg gap-2 lg:gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                            ${isScrolled
                              ? 'rounded-2xl sm:w-auto justify-center px-3 py-1.5 mr-8' // Buttons shrink height (py-1.5) and have right margin (mr-8)
                              : 'rounded-b-2xl rounded-t-none border-l border-r border-b justify-evenly w-full p-3'}`}>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="group relative flex items-center gap-2 px-3 py-3 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 active:scale-95 state-layer h-12 overflow-hidden touch-target
                  ${isScrolled ? 'hover:scale-[1.05]' : 'hover:scale-[1.08]'}`}> {/* Conditional hover scale */}
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
                  <Icon className={`relative z-10 w-5 h-5 transition-all duration-500 group-hover:${item.animation} group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} />
                  <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold mobile-text-base">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pb-4">
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 p-2 space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      closeMobileMenu();
                    }}
                    className="group relative flex items-center gap-4 w-full px-4 py-3 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 state-layer overflow-hidden mobile-button"
                  >
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
                    <Icon className={`relative z-10 w-5 h-5 transition-all duration-500 group-hover:${item.animation} group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} />
                    <span className="relative z-10 transition-all duration-300 group-hover:font-semibold mobile-text-base">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Modals */}
      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onApiKeyChange={onApiKeyChange}
        />
      )}

      {showBackupModal && (
        <BackupManager
          onClose={() => setShowBackupModal(false)}
          currentVideos={currentVideos}
          currentPlaylistInfo={currentPlaylistInfo}
        />
      )}

      {showHistoryPanel && (
        <HistoryPanel
          onClose={() => setShowHistoryPanel(false)}
          onPlaylistSelect={onPlaylistSelect}
        />
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}

      {showComparisonModal && (
        <ComparisonModal
          onClose={() => setShowComparisonModal(false)}
          currentVideos={currentVideos}
          currentPlaylistInfo={currentPlaylistInfo}
        />
      )}
    </>
  );
};4