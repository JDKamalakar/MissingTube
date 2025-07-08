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
  const SHRINK_THRESHOLD = 80; // When navbar starts shrinking
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

        // Logic for hiding/showing navbar ONLY on mobile when scrolling further down/up
        if (!isDesktop) {
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
      animation: '-rotate-[30deg]' // Animation from second code
    },
    {
      icon: Key,
      label: 'API Key',
      onClick: () => setShowApiKeyModal(true),
      animation: '-rotate-[30deg]' // Animation from second code
    },
    {
      icon: Download,
      label: 'Download',
      onClick: () => setShowBackupModal(true),
      animation: 'animate-bounce-short-slow' // Animation from second code
    },
    {
      icon: GitCompare,
      label: 'Compare',
      onClick: () => setShowComparisonModal(true),
      animation: 'rotate-[360deg]' // Animation from second code
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => setShowAboutModal(true),
      animation: 'rotate-[360deg]' // Animation from second code
    }
  ];

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      {/* Navbar structure and positioning from second code, with mobile hiding logic */}
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out
                      ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
        {/* Main container: layout and padding from second code, with mobile adaptations */}
        <div className={`container mx-auto px-4 sm:pl-8 max-w-7xl flex transition-all duration-300 ease-in-out
                              ${isScrolled
                                ? 'py-3 flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4 sm:pr-24' // Desktop Scrolled: flex-row, justify-center, items-center, gap, pr-24 (from second code)
                                : 'py-4 flex-col items-center sm:pr-8'}`}> {/* Desktop Unscrolled: flex-col (default), items-center, pr-8 (from second code) */}

          {/* Logo & Site Name Block: styling from second code, with mobile menu button from original */}
          <div className={`flex items-center gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                                ${isScrolled
                                  ? 'rounded-2xl sm:w-auto sm:flex-shrink-0 justify-center' // On scroll: ensure content is centered, prevent shrinking
                                  : 'rounded-2xl sm:rounded-t-2xl sm:rounded-b-none border-l border-r border-t justify-center'}`}> {/* Mobile: rounded-2xl. Desktop: rounded-t-2xl, rounded-b-none */}
            
            <div className="flex items-center justify-between w-full gap-3 sm:gap-4"> {/* Added justify-between and w-full for mobile button alignment */}
              {/* MissingTube Logo with glassmorphism background */}
              <div className="flex items-center gap-3 sm:gap-4"> {/* Group logo and site name */}
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

              {/* Mobile Menu Button (retained and pushed to right) */}
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
          </div>

          {/* Desktop Navigation Items: styling and animations from second code, adjusted button size */}
          <div className={`hidden sm:flex flex-wrap justify-center p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                                ${isScrolled
                                  ? 'rounded-2xl sm:w-auto sm:flex-grow sm:justify-center' // On scroll: grow to fill space, then center its contents
                                  : 'rounded-b-2xl rounded-t-none border-l border-r border-b'}`}> {/* Default: full width, center contents */}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 active:scale-95 state-layer h-10 overflow-hidden touch-target
                    ${isScrolled ? 'hover:scale-[1.05]' : 'hover:scale-[1.08]'}`} // Conditional hover scale
                >
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
                  {/* Icon animation from second code, icon size from our previous iterations */}
                  <Icon className={`relative z-10 w-4 h-4 transition-all duration-500 group-hover:${item.animation} group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} /> {/* Restored w-4 h-4 as per second code */}
                  {/* Text size from second code, ensuring no black text on hover */}
                  <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Menu (retained) */}
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

      {/* Mobile Menu Backdrop (retained) */}
      {showMobileMenu && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Modals (retained) */}
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