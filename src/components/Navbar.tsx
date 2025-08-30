import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Key, History, Info, Download, GitCompare, Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { BackupManager } from './BackupManager';
import { HistoryPanel } from './HistoryPanel';
import { AboutModal } from './AboutModal';
import { ComparisonModal } from './ComparisonModal';
import { useTheme } from './ThemeProvider';

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
  const { theme, setTheme } = useTheme();
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
        setIsScrolled(currentScrollY > SHRINK_THRESHOLD);
        if (!isDesktop) {
          if (currentScrollY > HIDE_THRESHOLD && currentScrollY > lastScrollY.current) {
            setIsNavbarHidden(true);
            if (showMobileMenu) setShowMobileMenu(false);
          } else if (currentScrollY < lastScrollY.current || currentScrollY <= SHRINK_THRESHOLD) {
            setIsNavbarHidden(false);
          }
          if (showMobileMenu && currentScrollY !== lastScrollY.current) {
            setShowMobileMenu(false);
          }
        } else {
          setIsNavbarHidden(false); 
          if (showMobileMenu) setShowMobileMenu(false);
        }
        lastScrollY.current = currentScrollY;
      } else {
        setIsScrolled(false);
        setIsNavbarHidden(false);
        if (showMobileMenu) setShowMobileMenu(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll, showMobileMenu]);

  const navItems = [
    { icon: History, label: 'History', onClick: () => setShowHistoryPanel(true) },
    { icon: Key, label: 'API Key', onClick: () => setShowApiKeyModal(true) },
    { icon: Download, label: 'Download', onClick: () => setShowBackupModal(true) },
    { icon: GitCompare, label: 'Compare', onClick: () => setShowComparisonModal(true) },
    { icon: Info, label: 'About', onClick: () => setShowAboutModal(true) }
  ];

  // [MODIFIED] Added labels and colors for the new theme UI
  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, color: 'text-yellow-500' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, color: 'text-blue-400' },
    { value: 'system' as const, label: 'System', icon: Monitor, color: 'text-slate-500 dark:text-slate-400' },
  ];

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  return (
    <>
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
        <div className={`container mx-auto px-3 sm:pl-8 max-w-7xl flex transition-all duration-300 ease-in-out mobile-container-padding ${isScrolled ? 'py-3 flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4' : 'py-3 sm:py-4 flex-col items-center'}`}>
          <div className={`flex items-center gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20 ${isScrolled ? 'rounded-2xl sm:w-auto sm:flex-shrink-0' : 'rounded-2xl sm:rounded-t-2xl sm:rounded-b-none'}`}>
            <div className="flex items-center w-full gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg transition-all duration-225 hover:scale-110 active:scale-95">
                  <img src="/assets/Icon_Light_NB.png" alt="MissingTube Logo" className="w-5 h-5 sm:w-8 sm:h-8 object-contain dark:hidden" />
                  <img src="/assets/Icon_Dark_NB.png" alt="MissingTube Logo" className="w-5 h-5 sm:w-8 sm:h-8 object-contain hidden dark:block" />
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">MissingTube</h1>
              </div>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="ml-auto sm:hidden group relative flex items-center justify-center w-10 h-8 transition-all duration-300 hover:scale-110 active:scale-95 z-50" aria-label="Toggle mobile menu">
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/30 dark:border-white/20 shadow-lg"></div>
                <Menu className={`relative z-10 w-4 h-4 transition-all duration-500 ${showMobileMenu ? 'opacity-0 rotate-[360deg] scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`absolute z-10 w-4 h-4 transition-all duration-500 text-red-500 ${showMobileMenu ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-[360deg] scale-0'}`} />
              </button>
            </div>
          </div>

          <div className={`hidden sm:flex flex-wrap justify-center p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20 ${isScrolled ? 'rounded-2xl sm:w-auto sm:flex-grow' : 'rounded-b-2xl rounded-t-none'}`}>
            {navItems.map((item, index) => (
              <button key={index} onClick={item.onClick} className={`group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 active:scale-95 h-10 ${isScrolled ? 'hover:scale-[1.05]' : 'hover:scale-[1.08]'}`}>
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all origin-center rounded-2xl"></div>
                <item.icon className={`relative z-10 w-4 h-4 transition-all duration-500 group-hover:scale-[1.1] group-hover:stroke-[2.5px]`} />
                <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4">
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 p-2 space-y-1">
              {navItems.map((item, index) => (
                <button key={index} onClick={() => { item.onClick(); closeMobileMenu(); }} className="group relative flex items-center gap-4 w-full px-4 py-3 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 h-11">
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-opacity origin-center rounded-lg"></div>
                  <item.icon className="relative z-10 w-5 h-5 transition-all duration-500 group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                  <span className="relative z-10 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                </button>
              ))}
              {/* [MODIFIED] New theme toggle UI for mobile menu */}
              <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-2 mt-2">
                <div className="space-y-1">
                  {themeOptions.map(option => {
                      const isActive = theme === option.value;
                      return (
                          <button
                              key={option.value}
                              onClick={() => setTheme(option.value)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                      ? 'bg-primary/80 text-white shadow-md'
                                      : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'
                              }`}
                          >
                              <option.icon className={`w-5 h-5 transition-transform duration-300 ${option.color} ${
                                  isActive ? 'scale-110 rotate-6' : 'scale-100'
                              }`} />
                              <span>{option.label}</span>
                          </button>
                      )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showMobileMenu && (<div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in" onClick={closeMobileMenu} />)}

      {showApiKeyModal && (<ApiKeyModal onClose={() => setShowApiKeyModal(false)} onApiKeyChange={onApiKeyChange} />)}
      {showBackupModal && (<BackupManager onClose={() => setShowBackupModal(false)} currentVideos={currentVideos} currentPlaylistInfo={currentPlaylistInfo} />)}
      {showHistoryPanel && (<HistoryPanel onClose={() => setShowHistoryPanel(false)} onPlaylistSelect={onPlaylistSelect} />)}
      {showAboutModal && (<AboutModal onClose={() => setShowAboutModal(false)} />)}
      {showComparisonModal && (<ComparisonModal onClose={() => setShowComparisonModal(false)} currentVideos={currentVideos} currentPlaylistInfo={currentPlaylistInfo} />)}
    </>
  );
};