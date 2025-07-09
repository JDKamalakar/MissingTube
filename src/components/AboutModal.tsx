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
      {/* Enhanced backdrop with better blur */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-heavy transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container with better contrast */}
      <div
        className="relative bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-3xl shadow-2xl border border-white/30 dark:border-white/20 w-full max-w-2xl animate-modal-enter elevation-3
                     max-h-[85vh] overflow-y-auto custom-scrollbar"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with better contrast */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/30 dark:bg-black/40 backdrop-blur-heavy z-10 rounded-t-3xl border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group border border-white/30 dark:border-white/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        {/* Content with better contrast */}
        <div className="p-8">
          <div className="space-y-6">

            {/* MissingTube Title and Description Card */}
            <div className="group relative text-center p-6 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-white/20 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                MissingTube
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                A modern, feature-rich tool to analyze YouTube playlists and recover missing video titles.
                Built with React, TypeScript, and Tailwind CSS with Material Design 3.
              </p>
            </div>

            {/* Features Section Card */}
            <div className="group relative p-6 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-white/20 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Features:</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
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
            <div className="relative border-t border-white/20 pt-6 p-6 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-3xl shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-error animate-pulse" />
                Support Development
              </h4>

              <div className="space-y-3">
                <div className="w-full">
                  <a
                    href="https://buymeacoffee.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 sm:px-6 bg-warning text-white rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-warning/90 hover:scale-105 active:scale-95 group mobile-text-sm"
                  >
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce group-hover:animate-super-fast-bounce" />
                    <span className="truncate">Buy me a coffee</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://github.com/developer/missingtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg text-gray-900 dark:text-white rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/40 hover:dark:bg-black/40 hover:scale-105 active:scale-95 group border border-white/30 dark:border-white/20 mobile-text-sm"
                  >
                    <Github className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg] flex-shrink-0" />
                    <span className="truncate">GitHub</span>
                  </a>

                  <a
                    href="https://twitter.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg text-gray-900 dark:text-white rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/40 hover:dark:bg-black/40 hover:scale-105 active:scale-95 group border border-white/30 dark:border-white/20 mobile-text-sm"
                  >
                    <Twitter className="w-4 h-4 transition-transform duration-225 group-hover:rotate-45 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </a>

                  <a
                    href="https://developer-portfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-primary text-white rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 group border border-primary/50 mobile-text-sm"
                  >
                    <Globe className="w-4 h-4 transition-transform duration-225 group-hover:animate-spin flex-shrink-0" />
                    <span className="truncate">Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-600 dark:text-gray-400">
              Made with ❤️ for the YouTube community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};1