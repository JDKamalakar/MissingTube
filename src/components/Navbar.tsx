import React, { useState, useCallback, useEffect } from 'react';
import { Key, History, Info, Download, GitCompare } from 'lucide-react';
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

  const [isScrolled, setIsScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  // Define a scroll threshold to prevent rapid flickering
  const SCROLL_THRESHOLD = 80; // Adjust this value as needed (e.g., 50, 100, etc.)

  useEffect(() => {
    const checkScrollability = () => {
      // Check if document height is greater than window height + a buffer
      // This helps determine if there's enough content to scroll at all
      setCanScroll(document.documentElement.scrollHeight > (window.innerHeight + 50));
    };

    // Initial check and re-check on window resize
    checkScrollability();
    window.addEventListener('resize', checkScrollability);

    // Observe DOM changes that might affect scrollability (e.g., content loading)
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
        if (window.scrollY > SCROLL_THRESHOLD) { // Use the defined threshold
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        // If not scrollable, always treat as not scrolled
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll]); // Re-run effect if canScroll changes

  return (
    <>
      <nav className="bg-white/30 dark:bg-black/40 backdrop-blur-heavy border-b border-white/30 dark:border-white/20 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out">
        <div className={`container mx-auto pl-8 max-w-7xl flex transition-all duration-300 ease-in-out
                          ${isScrolled
                            ? 'py-3 flex-col md:flex-row md:justify-center md:items-center md:gap-4 pr-24' // On scroll: flex-row for larger screens, justify-center for all content, increased right padding
                            : 'py-4 flex-col items-center pr-8'}`}> {/* Default: always flex-col and center items, base right padding */}

          {/* Logo & Site Name */}
          <div className={`flex items-center gap-4 p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                            ${isScrolled
                              ? 'rounded-2xl md:w-auto md:flex-shrink-0 justify-center' // On scroll: ensure content is centered, prevent shrinking
                              : 'rounded-t-2xl rounded-b-none border-l border-r border-t justify-center'}`}> {/* Default: center logo horizontally */}

            <div className="flex items-center gap-4">
              {/* MissingTube Logo with glassmorphism background */}
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-lg transition-all duration-225 hover:scale-110 active:scale-95">
                  <img
                    src="/assets/Icon_Light_NB.png"
                    alt="MissingTube Logo"
                    className="w-8 h-8 object-contain dark:hidden transition-opacity duration-300"
                  />
                  <img
                    src="/assets/Icon_Dark_NB.png"
                    alt="MissingTube Logo"
                    className="w-8 h-8 object-contain hidden dark:block transition-opacity duration-300"
                  />
                </div>
              </div>
              {/* Site Name */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                MissingTube
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className={`flex flex-wrap justify-center p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg w-full gap-6 transition-all duration-300 ease-in-out border border-white/30 dark:border-white/20
                            ${isScrolled
                              ? 'rounded-2xl md:w-auto md:flex-grow md:justify-center' // On scroll: grow to fill space, then center its contents
                              : 'rounded-b-2xl rounded-t-none border-l border-r border-b'}`}> {/* Default: full width, center contents */}

            <button
              onClick={() => setShowHistoryPanel(true)}
              className="group relative flex items-center gap-2 px-4 py-4 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              <History className="relative z-10 w-4 h-4 transition-all duration-500 group-hover:-rotate-[30deg] group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">History</span>
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              <Key className="relative z-10 w-4 h-4 transition-all duration-500 group-hover:-rotate-[30deg] group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">API Key</span>
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className="group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              <Download className="relative z-10 w-4 h-4 transition-all duration-500 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">Download</span>
            </button>

            <button
              onClick={() => setShowComparisonModal(true)}
              className="group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              <GitCompare className="relative z-10 w-4 h-4 transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">Compare</span>
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="group relative flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white rounded-2xl transition-all duration-300 hover:scale-[1.08] active:scale-95 state-layer h-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out scale-0 group-hover:scale-100 origin-center"></div>
              <Info className="relative z-10 w-4 h-4 transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:font-semibold">About</span>
            </button>
          </div>
        </div>
      </nav>

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