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
  const [dynamicPy, setDynamicPy] = useState(4); // Initial desktop py-4 for unscrolled
  const lastScrollY = useRef(0);

  // Define scroll thresholds
  const SHRINK_THRESHOLD = 80; // When navbar starts shrinking / reaches minimum desktop height
  const HIDE_THRESHOLD = 300; // When navbar starts hiding on mobile (scroll further down)

  // Desktop unscrolled base padding
  const DESKTOP_UNSCROLLED_PY = 4; // Corresponds to py-4
  // Desktop scrolled minimum padding
  const DESKTOP_SCROLLED_PY = 3; // Corresponds to py-3

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

        // Desktop shrinking and single-line transition
        if (isDesktop) {
          if (currentScrollY <= SHRINK_THRESHOLD) {
            // Interpolate padding from DESKTOP_UNSCROLLED_PY to DESKTOP_SCROLLED_PY
            const progress = currentScrollY / SHRINK_THRESHOLD; // 0 to 1
            const newPy = DESKTOP_UNSCROLLED_PY - (DESKTOP_UNSCROLLED_PY - DESKTOP_SCROLLED_PY) * progress;
            setDynamicPy(Math.max(newPy, DESKTOP_SCROLLED_PY));
            setIsScrolled(false); // Only set true once it's fully shrunk
          } else {
            setDynamicPy(DESKTOP_SCROLLED_PY);
            setIsScrolled(true); // Navbar is fully shrunk and in single-line mode
          }
          setIsNavbarHidden(false); // Ensure it's never hidden on desktop
        } else {
          // Mobile specific shrinking
          if (currentScrollY > SHRINK_THRESHOLD) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          // Mobile specific hiding/showing
          if (currentScrollY > HIDE_THRESHOLD && currentScrollY > lastScrollY.current) {
            setIsNavbarHidden(true);
          } else if (currentScrollY < lastScrollY.current || currentScrollY < SHRINK_THRESHOLD) {
            setIsNavbarHidden(false);
          }
        }
        
        lastScrollY.current = currentScrollY;
      } else {
        setIsScrolled(false);
        setIsNavbarHidden(false);
        setDynamicPy(DESKTOP_UNSCROLLED_PY); // Reset padding if not scrollable
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll]); // Dependency array needs to be complete for accurate behavior

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
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl transition-all duration-300 ease-in-out safe-top rounded-b-3xl
                      ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
        {/* Main container for navbar content */}
        <div className={`container mx-auto px-4 max-w-7xl flex transition-all duration-300 ease-in-out
                             ${isScrolled // This is now primarily for mobile layout and desktop "fully shrunk" state
                               ? 'py-2 sm:py-[var(--dynamic-py)] flex-row justify-between items-center sm:pl-8 sm:pr-24 sm:gap-x-4 lg:gap-x-8' // Desktop: shrunk (uses dynamic var), row, justify-between, gap
                               : 'py-3 sm:py-[var(--dynamic-py)] flex-col items-center sm:flex-row sm:justify-center sm:gap-x-8 sm:px-8 sm:pr-8'}`} // Desktop Unscrolled: row, center content, gap between blocks
             style={{ '--dynamic-py': `${dynamicPy}rem` } as React.CSSProperties}> {/* Apply dynamic padding */}

          {/* Logo & Site Name Block */}
          <div className={`flex items-center justify-between gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                            ${isScrolled
                              ? 'rounded-2xl sm:w-auto sm:flex-shrink-0 justify-center' // Scrolled: auto width, shrink, center content
                              : 'rounded-2xl sm:rounded-t-2xl sm:rounded-b-none border-l border-r border-t justify-center w-full sm:w-auto'}`}> {/* Unscrolled: mobile full width, desktop auto width, center content */}
            
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
          <div className={`hidden sm:flex flex-wrap p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg gap-2 lg:gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                            ${isScrolled
                              ? 'rounded-2xl sm:w-auto sm:flex-grow justify-evenly' // Scrolled: auto width, grow, spread buttons
                              : 'rounded-b-2xl rounded-t-none border-l border-r border-b justify-evenly w-full sm:w-auto'}`}> {/* Unscrolled: mobile full width, desktop auto width, spread buttons */}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="group relative flex items-center gap-2 px-3 py-3 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-12 overflow-hidden touch-target"
                >
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
};