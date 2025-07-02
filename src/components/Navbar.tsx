import React, { useState, useEffect } from 'react';
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

  // Effect to determine if scrolling is even possible with a buffer
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

  // Effect to handle scroll, only if canScroll is true
  useEffect(() => {
    const handleScroll = () => {
      if (canScroll) {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canScroll]);

  return (
    <>
      <nav className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border-b border-gray-300/30 dark:border-gray-700/30 sticky top-0 z-40 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out">
        <div className={`container mx-auto px-8 max-w-7xl flex transition-all duration-300 ease-in-out
                       ${isScrolled ? 'py-3 md:flex-row md:justify-between md:items-center md:gap-4' : 'py-4 flex-col items-center'}`}>

          {/* Logo & Site Name - Centered when not scrolled, left-aligned when scrolled */}
          <div className={`flex items-center gap-4 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg w-full transition-all duration-300 ease-in-out
                         ${isScrolled
                           ? 'rounded-xl border border-gray-300/30 dark:border-gray-700/30 md:w-auto md:flex-shrink-0 justify-start'
                           : 'rounded-t-xl rounded-b-none border-l border-r border-t border-gray-300/30 dark:border-gray-700/30 justify-center'}`}>
            
            {/* Group for Logo and Site Name */}
            <div className="flex items-center gap-4">
              {/* Hexagonal Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center transform rotate-45 transition-all duration-225 hover:scale-110 hover:rotate-[50deg] active:scale-95">
                  <div className="w-8 h-8 bg-on-primary rounded-sm transform -rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-on-primary rounded-sm"></div>
                  </div>
                </div>
              </div>
              {/* Site Name */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                MissingTube
              </h1>
            </div>
          </div>

          {/* Navigation Items (Buttons) - Centered when scrolled */}
          <div className={`flex flex-wrap justify-center p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg w-full gap-6 transition-all duration-300 ease-in-out
                         ${isScrolled
                           ? 'rounded-xl border border-gray-300/30 dark:border-gray-700/30 md:w-auto md:flex-shrink-0'
                           : 'rounded-b-xl rounded-t-none border-l border-r border-b border-gray-300/30 dark:border-gray-700/30'}`}>
            <button
              onClick={() => setShowHistoryPanel(true)}
              className="group flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
            >
              <History className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="group flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
            >
              <Key className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" />
              <span className="hidden sm:inline">API Key</span>
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className="group flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
            >
              <Download className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setShowComparisonModal(true)}
              className="group flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
            >
              <GitCompare className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="group flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
            >
              <Info className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
              <span className="hidden sm:inline">About</span>
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