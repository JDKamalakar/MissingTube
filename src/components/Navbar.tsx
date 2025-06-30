import React, { useState } from 'react';
import { Youtube, Key, History, Info, Download, Sun, Moon, Monitor, GitCompare } from 'lucide-react';
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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <>
      <nav className="bg-surface/90 backdrop-blur-xl border-b border-outline-variant sticky top-0 z-40 shadow-lg rounded-b-3xl">
        <div className="container mx-auto px-12 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-error-container rounded-2xl transition-all duration-225 hover:scale-110 hover:rotate-12 active:scale-95">
                <Youtube className="w-6 h-6 text-error" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                Playlist Analyzer
              </h1>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle - Same height as other buttons */}
              <div className="relative flex items-center bg-surface-container rounded-2xl p-1 shadow-md border border-outline-variant h-10">
                <div 
                  className={`absolute top-1 bottom-1 bg-primary-container rounded-2xl transition-all duration-300 ease-out shadow-sm ${
                    theme === 'light' 
                      ? 'left-1 w-[calc(33.333%-4px)]' 
                      : theme === 'dark'
                      ? 'left-[33.333%] w-[calc(33.333%-4px)]'
                      : 'left-[66.666%] w-[calc(33.333%-4px)]'
                  }`}
                />
                
                {themes.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`relative z-10 flex items-center gap-1 px-2 py-1.5 rounded-2xl font-medium transition-all duration-225 text-xs min-w-0 ${
                      theme === value
                        ? 'text-on-primary-container'
                        : 'text-on-surface hover:text-primary hover:bg-primary/8'
                    }`}
                    title={`Switch to ${label} theme`}
                  >
                    <Icon className={`w-3 h-3 transition-all duration-225 ${
                      theme === value ? 'scale-110' : 'hover:scale-110'
                    }`} />
                    <span className={`hidden sm:inline transition-all duration-225 ${
                      theme === value ? 'font-semibold' : ''
                    }`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowHistoryPanel(true)}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
              >
                <History className="w-4 h-4 transition-transform duration-225 hover:rotate-12" />
                <span className="hidden sm:inline">History</span>
              </button>

              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
              >
                <Key className="w-4 h-4 transition-transform duration-225 hover:rotate-12" />
                <span className="hidden sm:inline">API Key</span>
              </button>

              <button
                onClick={() => setShowBackupModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
              >
                <Download className="w-4 h-4 transition-transform duration-225 hover:scale-110" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={() => setShowComparisonModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
              >
                <GitCompare className="w-4 h-4 transition-transform duration-225 hover:scale-110" />
                <span className="hidden sm:inline">Compare</span>
              </button>

              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-2xl transition-all duration-225 hover:scale-105 active:scale-95 state-layer h-10"
              >
                <Info className="w-4 h-4 transition-transform duration-225 hover:scale-110" />
                <span className="hidden sm:inline">About</span>
              </button>
            </div>
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
        />
      )}
    </>
  );
};