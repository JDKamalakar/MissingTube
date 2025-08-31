import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);

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

  const navItems = useMemo(() => [
    { name: 'History', icon: History, label: 'History', action: () => setShowHistoryPanel(true), hoverAnim: 'group-hover:[transform:rotate(-360deg)]' },
    { name: 'API Key', icon: Key, label: 'API Key', action: () => setShowApiKeyModal(true), hoverAnim: 'group-hover:[transform:rotate(360deg)]' },
    { name: 'Download', icon: Download, label: 'Download', action: () => setShowBackupModal(true), hoverAnim: 'group-hover:animate-bounce' },
    { name: 'Compare', icon: GitCompare, label: 'Compare', action: () => setShowComparisonModal(true), hoverAnim: 'group-hover:[transform:rotate(-360deg)]' },
    { name: 'About', icon: Info, label: 'About', action: () => setShowAboutModal(true), hoverAnim: 'group-hover:[transform:rotate(360deg)]' }
  ], []);

  // --- MODIFICATION 1: Reordered the theme options array ---
  const themeOptions = [
    { value: 'system' as const, icon: Monitor, color: 'text-slate-500 dark:text-slate-400' },
    { value: 'light' as const, icon: Sun, color: 'text-yellow-500' },
    { value: 'dark' as const, icon: Moon, color: 'text-sky-400' },
  ];

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveNavItem(item.name);
    item.action();
  };
  
  const activeIndex = useMemo(() => navItems.findIndex(item => item.name === activeNavItem), [navItems, activeNavItem]);

  return (
    <>
      <nav className={`bg-white/30 dark:bg-black/40 backdrop-blur-xl border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out ${isNavbarHidden ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
        <div className={`container mx-auto px-3 sm:px-8 max-w-7xl flex transition-all duration-300 ease-in-out mobile-container-padding gap-0.5 ${isScrolled ? 'py-3 flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4' : 'py-3 sm:py-4 flex-col items-center'}`}>
          <div className={`flex items-center gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-xs w-full transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20 ${isScrolled ? 'rounded-2xl sm:w-auto sm:flex-shrink-0 sm:rounded-2xl' : 'rounded-2xl sm:rounded-t-2xl sm:rounded-b-none'}`}>
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 dark:bg-black/20 backdrop-blur-xs rounded-xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg transition-all duration-225 hover:scale-110 active:scale-95">
                  <img src="/assets/Icon_Light_NB.png" alt="MissingTube Logo" className="w-5 h-5 sm:w-8 sm:h-8 object-contain dark:hidden" />
                  <img src="/assets/Icon_Dark_NB.png" alt="MissingTube Logo" className="w-5 h-5 sm:w-8 sm:h-8 object-contain hidden dark:block" />
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">MissingTube</h1>
              </div>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="ml-auto sm:hidden group relative flex items-center justify-center w-8 h-8 transition-all duration-300 hover:scale-110 active:scale-95 z-50" aria-label="Toggle mobile menu">
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-xs rounded-xl border border-white/30 dark:border-white/20 shadow-lg"></div>
                <Menu className={`relative z-10 w-4 h-4 transition-all duration-500 ${showMobileMenu ? 'opacity-0 rotate-[360deg] scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`absolute z-10 w-4 h-4 transition-all duration-500 text-red-500 ${showMobileMenu ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-[360deg] scale-0'}`} />
              </button>
            </div>
          </div>

          <div className={`hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-xs p-1 shadow-xl border border-white/30 dark:border-white/20 transition-all duration-300 ease-in-out ${
              isScrolled ? 'rounded-2xl sm:w-auto sm:flex-grow sm:mr-[64px]' : 'w-full rounded-b-2xl sm:rounded-t-none'
          }`}>
            <div
              className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-xs rounded-[14px] transition-all duration-500 ease-out shadow-sm ${
                activeIndex !== -1 ? 'opacity-100' : 'opacity-0 scale-50'
              }`}
              style={{
                width: `calc(20% - 4px)`,
                left: `calc(${activeIndex * 20}% + 2px)`,
              }}
            />
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`group relative z-10 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl font-medium transition-all duration-225 flex-1 text-sm active:scale-95 ${
                  activeNavItem === item.name
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-white/10'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform duration-1000 ease-in-out ${
                    activeNavItem === item.name ? 'scale-110' : item.hoverAnim
                }`} />
                <span className={`transition-all duration-225 whitespace-nowrap hidden sm:inline ${
                    activeNavItem === item.name ? 'font-semibold' : 'group-hover:font-semibold'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 flex flex-col gap-0.5">
            {navItems.map((item, index) => {
              const cornerClass = index === 0
                ? 'rounded-t-2xl rounded-sm'
                : index === navItems.length - 1
                  ? 'rounded-b-2xl rounded-sm'
                  : 'rounded-sm';

              return (
                <button
                  key={item.label}
                  onClick={() => { item.action(); closeMobileMenu(); }}
                  className={`group relative flex items-center gap-4 w-full px-4 py-3 text-gray-900 dark:text-white transition-all duration-300 hover:scale-[1.02] active:scale-98 bg-white/30 dark:bg-black/30 backdrop-blur-xs border border-white/30 dark:border-white/20 ${cornerClass}`}
                >
                  <div className={`absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-opacity origin-center ${cornerClass}`}></div>
                  <item.icon className={`relative z-10 w-5 h-5 transition-transform duration-1000 ease-in-out ${item.hoverAnim}`} />
                  <span className="relative z-10 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                </button>
              );
            })}

            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-xs rounded-2xl border border-white/30 dark:border-white/20 p-2 mt-2">
              <div className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-xl p-0.5">
                {/* --- MODIFICATION 2: Updated the positioning logic for the sliding indicator --- */}
                <div className={`absolute top-0.5 bottom-0.5 bg-primary/80 backdrop-blur-xs rounded-lg transition-all duration-300 ease-out shadow-sm w-[calc(33.333%-2px)] ${
                    theme === 'system' ? 'left-0.5' :
                    theme === 'light' ? 'left-[33.333%]' :
                    'left-[66.666%]'
                  }`}
                />
                {themeOptions.map(option => {
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`group relative z-10 flex-1 flex justify-center items-center py-2 transition-transform duration-200 rounded-lg active:scale-95`}
                      aria-label={`Set ${option.value} theme`}
                    >
                      <option.icon className={`w-5 h-5 transition-all duration-500 ease-in-out ${option.color} ${
                          isActive
                            ? 'scale-110 rotate-[360deg]'
                            : 'group-hover:rotate-[360deg]'
                        }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showMobileMenu && (<div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-30 animate-fade-in" onClick={closeMobileMenu} />)}

      {showApiKeyModal && (<ApiKeyModal onClose={() => { setShowApiKeyModal(false); setActiveNavItem(null); }} onApiKeyChange={onApiKeyChange} />)}
      {showBackupModal && (<BackupManager onClose={() => { setShowBackupModal(false); setActiveNavItem(null); }} currentVideos={currentVideos} currentPlaylistInfo={currentPlaylistInfo} />)}
      {showHistoryPanel && (<HistoryPanel onClose={() => { setShowHistoryPanel(false); setActiveNavItem(null); }} onPlaylistSelect={onPlaylistSelect} />)}
      {showAboutModal && (<AboutModal onClose={() => { setShowAboutModal(false); setActiveNavItem(null); }} />)}
      {showComparisonModal && (<ComparisonModal onClose={() => { setShowComparisonModal(false); setActiveNavItem(null); }} currentVideos={currentVideos} currentPlaylistInfo={currentPlaylistInfo} />)}
    </>
  );
};