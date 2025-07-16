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
  const [ignoreNextScrollClose, setIgnoreNextScrollClose] = useState(false); // NEW STATE

  const [isScrolled, setIsScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Define scroll thresholds
  const SHRINK_THRESHOLD = 80;
  const HIDE_THRESHOLD = 300;

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
        const isDesktop = window.innerWidth >= 640;

        if (currentScrollY > SHRINK_THRESHOLD) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }

        if (!isDesktop) {
          // Rule 1: Hide navbar if scrolling down significantly past HIDE_THRESHOLD
          if (currentScrollY > lastScrollY.current && currentScrollY > HIDE_THRESHOLD) {
            setIsNavbarHidden(true);
            // If navbar hides, forcefully close the menu
            if (showMobileMenu) {
              setShowMobileMenu(false);
              setIgnoreNextScrollClose(false); // Reset the flag
            }
          } 
          // Rule 2: Show navbar if scrolling up OR at the very top (scrollY 0)
          else if (currentScrollY < lastScrollY.current || currentScrollY <= 0) {
            setIsNavbarHidden(false);
          }

          // **MODIFIED MENU CLOSING LOGIC**
          // Only close mobile menu if it's open AND user scrolls significantly DOWN
          // AND we are NOT ignoring this scroll event for closing.
          if (showMobileMenu && currentScrollY > lastScrollY.current && currentScrollY > SHRINK_THRESHOLD) {
              if (ignoreNextScrollClose) {
                  setIgnoreNextScrollClose(false); // Consume the flag
              } else {
                  setShowMobileMenu(false);
              }
          }

        } else {
          // Desktop behavior: Navbar always visible, close mobile menu if resized to desktop
          setIsNavbarHidden(false); 
          if (showMobileMenu) {
            setShowMobileMenu(false);
            setIgnoreNextScrollClose(false); // Reset the flag
          }
        }
        
        lastScrollY.current = currentScrollY;
      } else {
        // Reset states if content is not scrollable (e.g., short page)
        setIsScrolled(false);
        setIsNavbarHidden(false);
        if (showMobileMenu) {
          setShowMobileMenu(false);
          setIgnoreNextScrollClose(false); // Reset the flag
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll, showMobileMenu, ignoreNextScrollClose]); // Add ignoreNextScrollClose to dependencies

  // MODIFIED onClick handler for the mobile menu button
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => {
      if (!prev) { // If menu is about to open
        setIgnoreNextScrollClose(true); // Set flag to ignore immediate scroll close
      }
      return !prev;
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
    setIgnoreNextScrollClose(false); // Reset flag when menu is closed manually
  }, []);

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

  return (
    <>
      {/* MODIFIED: Add a transform to the mobile menu to offset navbar's transform */}
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out
                      ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
        <div className={`container mx-auto px-4 sm:pl-8 max-w-7xl flex transition-all duration-300 ease-in-out
                                ${isScrolled
                                  ? 'py-3 flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4 sm:pr-24' 
                                  : 'py-4 flex-col items-center sm:pr-8'}`}>

          <div className={`flex items-center gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                                ${isScrolled
                                  ? 'rounded-2xl sm:w-auto sm:flex-shrink-0 justify-center'
                                  : 'rounded-2xl sm:rounded-t-2xl sm:rounded-b-none border-l border-r border-t justify-center'}`}>
            
            <div className="flex items-center w-full gap-3 sm:gap-4 sm:justify-center">
              {/* MissingTube Logo with glassmorphism background */}
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
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

              {/* Mobile Menu Button - onClick uses the new toggleMobileMenu */}
              <button
                onClick={toggleMobileMenu} // Use the new toggle function
                className="ml-auto sm:hidden group relative flex items-center justify-center w-12 h-10 transition-all duration-300 hover:scale-110 active:scale-95 z-50" 
                aria-label="Toggle mobile menu"
              >
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg transition-all duration-225 overflow-hidden">
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center rounded-2xl"></div>
                </div>

                <Menu 
                    className={`relative z-10 w-5 h-5 transition-all duration-500 
                                ${showMobileMenu ? 'opacity-0 rotate-[360deg] scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
                />
                
                <X 
                    className={`absolute z-10 w-5 h-5 transition-all duration-500 text-red-500 
                                ${showMobileMenu ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-[360deg] scale-0'}`} 
                />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <div className={`hidden sm:flex flex-wrap justify-center p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                                ${isScrolled
                                  ? 'rounded-2xl sm:w-auto sm:flex-grow sm:justify-center' 
                                  : 'rounded-b-2xl rounded-t-none border-l border-r border-b'}`}> 
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 active:scale-95 state-layer h-10 overflow-hidden touch-target
                    ${isScrolled ? 'hover:scale-[1.05]' : 'hover:scale-[1.08]'}`} 
                >
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center rounded-2xl"></div>
                  <Icon className={`relative z-10 w-4 h-4 transition-all duration-500 group-hover:${item.animation} group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} /> 
                  <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Dropdown - MODIFIED POSITIONING */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          ${isNavbarHidden ? 'transform translate-y-[-100%]' : 'transform translate-y-0'} `}
          // The above line is key for fixing position when navbar is hidden
          // Adding a new className for easier targeting if needed: `mobile-menu-dropdown`
          // We removed `sticky top-0` from this section as it's already handled by the main nav
          // And removed the `absolute` positioning, assuming it's flowing naturally within the nav.
          // If this menu needs to be absolutely positioned relative to the viewport, it should be outside the <nav>
          // or its `top` should be calculated dynamically.
          // For now, let's keep it flowing within the `nav` and use transform to offset.
          >
          <div className="px-4 pb-4">
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 p-2 space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => {
                        item.onClick();
                        closeMobileMenu();
                      }}
                      className="group relative flex items-center gap-4 w-full px-4 py-3 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 state-layer overflow-hidden mobile-button h-11"
                    >
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center rounded-lg"></div>
                      <Icon className={`relative z-10 w-5 h-5 transition-all duration-500 group-hover:${item.animation} group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} />
                      <span className="relative z-10 transition-all duration-300 group-hover:font-semibold mobile-text-base">
                        {item.label}
                      </span>
                    </button>
                    {/* Separator */}
                    {index < navItems.length - 1 && (
                      <div className="-mx-2 w-auto my-1 border-t border-white/30 dark:border-white/20"></div>
                    )}
                  </React.Fragment>
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