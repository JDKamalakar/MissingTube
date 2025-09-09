// src/components/AboutModal.tsx

import React, { useEffect } from 'react';
import { Heart, Coffee, Github, Globe, Twitter, X, Info } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* MODIFIED: Main modal container now uses a flex column layout. Scrolling properties have been removed. */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-sm sm:max-w-2xl animate-modal-enter elevation-3
                   max-h-[85vh] flex flex-col mobile-modal-full"
        role="dialog"
        aria-modal="true"
      >
        {/* MODIFIED: Header is now a static flex item. 'sticky' and 'z-10' are removed as they are no longer needed. */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-1000 group-hover:[transform:rotate(-360deg)]" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-on-surface">About</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-1000 group-hover:[transform:rotate(360deg)] group-hover:scale-110" />
          </button>
        </div>

        {/* MODIFIED: This content wrapper is now the scrollable container, using 'flex-grow' to fill available space. */}
        <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-grow">
          <div className="space-y-4 sm:space-y-6">

            {/* MissingTube Title and Description Card */}
            <div className="group relative text-center p-4 sm:p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h3 className="text-lg sm:text-xl font-semibold text-on-surface mb-2 sm:mb-3">
                MissingTube
              </h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                A modern, feature-rich tool to analyze YouTube playlists and recover missing video titles.
                Built with React, TypeScript, and Tailwind CSS with Material Design 3.
              </p>
            </div>

            {/* Features Section Card */}
            <div className="group relative p-4 sm:p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h4 className="font-medium text-on-surface mb-2 sm:mb-3 text-sm sm:text-base">Features:</h4>
              <ul className="text-xs sm:text-sm text-on-surface-variant space-y-1 sm:space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Comprehensive playlist analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Grid and table view modes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Multi-platform search actions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Video descriptions and details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Backup and restore functionality
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Missing video title recovery
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  File comparison and merging
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Modern responsive design
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Secure API key management
                </li>
              </ul>
            </div>

            {/* Support Development Section Card */}
            <div className="relative border-t border-gray-300/30 dark:border-gray-700/30 pt-4 sm:pt-6 p-4 sm:p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h4 className="font-medium text-on-surface mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Heart className="w-5 h-5 text-error animate-pulse" />
                Support Development
              </h4>

              <div className="space-y-2 sm:space-y-3">
                <div className="w-full">
                  <a
                    href="https://buymeacoffee.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 sm:gap-3 w-full py-2 sm:py-3 px-3 sm:px-6 bg-warning text-white rounded-xl sm:rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-warning/90 hover:scale-105 active:scale-95 group text-xs sm:text-sm border border-warning/50 mobile-button-compact"
                  >
                    <Coffee className="w-3 h-3 sm:w-5 sm:h-5 animate-bounce group-hover:animate-super-fast-bounce flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">Buy me a coffee</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="https://github.com/developer/missingtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface rounded-xl sm:rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 hover:scale-105 active:scale-95 group border border-gray-300/30 dark:border-gray-700/30 text-xs sm:text-sm mobile-button-compact"
                  >
                    <Github className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-[360deg] flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">GitHub</span>
                  </a>

                  <a
                    href="https://twitter.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface rounded-xl sm:rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 hover:scale-105 active:scale-95 group border border-gray-300/30 dark:border-gray-700/30 text-xs sm:text-sm mobile-button-compact"
                  >
                    <Twitter className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-225 group-hover:rotate-45 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">Twitter</span>
                  </a>

                  <a
                    href="https://developer-portfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 bg-primary text-on-primary rounded-xl sm:rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 group border border-primary/50 text-xs sm:text-sm mobile-button-compact"
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-225 group-hover:animate-spin flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm">Portfolio</span>
    _C_E_I_P_>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-on-surface-variant">
              Made with ❤️ for the YouTube community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};