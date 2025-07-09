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
      {/* MODIFIED: Consistent backdrop with bg-black/10 and backdrop-blur-xl */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* MODIFIED: Main Modal Container with consistent styling */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-2xl animate-modal-enter elevation-3
                   max-h-[85vh] overflow-y-auto custom-scrollbar" // Changed rounded-3xl to rounded-2xl, added elevation-3
        role="dialog"
        aria-modal="true"
      >
        {/* MODIFIED: Header with consistent styling */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm"> {/* Changed rounded-t-3xl to rounded-t-2xl, border-white/20 to border-gray-300/30, added shadow-sm */}
          <div className="flex items-center gap-3">
            {/* Modal Icon Container: Now with hover scale, shadow, and depth */}
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg"> {/* Consistent bg, border, and hover */}
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">About</h2> {/* Changed text-gray-900 dark:text-white to text-on-surface */}
          </div>
          {/* Close Button: Consistent styling, red X icon, spin and scale on hover */}
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group" // Consistent bg, border, and hover
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        {/* Content with consistent card styling */}
        <div className="p-8">
          <div className="space-y-6">

            {/* MissingTube Title and Description Card */}
            <div className="group relative text-center p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10"> {/* Consistent bg, border, rounded, and hover effects */}
              <h3 className="text-xl font-semibold text-on-surface mb-3"> {/* Consistent text color */}
                MissingTube
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed"> {/* Consistent text color */}
                A modern, feature-rich tool to analyze YouTube playlists and recover missing video titles.
                Built with React, TypeScript, and Tailwind CSS with Material Design 3.
              </p>
            </div>

            {/* Features Section Card */}
            <div className="group relative p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10"> {/* Consistent bg, border, rounded, and hover effects */}
              <h4 className="font-medium text-on-surface mb-3">Features:</h4> {/* Consistent text color */}
              <ul className="text-sm text-on-surface-variant space-y-2"> {/* Consistent text color */}
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
            <div className="relative border-t border-gray-300/30 dark:border-gray-700/30 pt-6 p-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] z-0 hover:z-10"> {/* Consistent bg, border, rounded, and hover effects */}
              <h4 className="font-medium text-on-surface mb-4 flex items-center gap-2"> {/* Consistent text color */}
                <Heart className="w-5 h-5 text-error animate-pulse" />
                Support Development
              </h4>

              <div className="space-y-3">
                <div className="w-full">
                  <a
                    href="https://buymeacoffee.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 sm:px-6 bg-warning text-white rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-warning/90 hover:scale-105 active:scale-95 group mobile-text-sm border border-warning/50" // Added border
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
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 hover:scale-105 active:scale-95 group border border-gray-300/30 dark:border-gray-700/30 mobile-text-sm" // Consistent bg, border, and hover
                  >
                    <Github className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg] flex-shrink-0" />
                    <span className="truncate">GitHub</span>
                  </a>

                  <a
                    href="https://twitter.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 hover:scale-105 active:scale-95 group border border-gray-300/30 dark:border-gray-700/30 mobile-text-sm" // Consistent bg, border, and hover
                  >
                    <Twitter className="w-4 h-4 transition-transform duration-225 group-hover:rotate-45 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </a>

                  <a
                    href="https://developer-portfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 bg-primary text-on-primary rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 group border border-primary/50 mobile-text-sm"
                  >
                    <Globe className="w-4 h-4 transition-transform duration-225 group-hover:animate-spin flex-shrink-0" />
                    <span className="truncate">Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-on-surface-variant"> {/* Consistent text color */}
              Made with ❤️ for the YouTube community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};