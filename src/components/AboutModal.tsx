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
      {/* Backdrop with navbar-like blur */}
      <div 
        className="fixed inset-0 bg-scrim/60 blur-subtle transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal with navbar-like transparency */}
      <div 
        className="relative bg-surface/90 blur-light rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-container rounded-2xl">
              <Info className="w-6 h-6 text-on-secondary-container" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">About</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-2xl transition-all duration-225 hover:scale-110 active:scale-95 text-on-surface-variant hover:text-on-surface"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-on-surface mb-3">
                YouTube Playlist Analyzer
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                A modern, feature-rich tool to analyze YouTube playlists with detailed statistics, 
                backup functionality, and beautiful design. Built with React, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-on-surface">Features:</h4>
              <ul className="text-sm text-on-surface-variant space-y-2">
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
                  Deleted video detection
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

            <div className="border-t border-outline-variant pt-6">
              <h4 className="font-medium text-on-surface mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-error animate-pulse" />
                Support Development
              </h4>
              
              <div className="space-y-3">
                <a
                  href="https://buymeacoffee.com/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-warning-container text-on-warning-container rounded-2xl font-medium hover:bg-warning-container/90 transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Coffee className="w-5 h-5 animate-bounce" />
                  Buy me a coffee
                </a>
                
                <div className="flex gap-3">
                  <a
                    href="https://github.com/developer/youtube-playlist-analyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container/70 backdrop-blur-sm text-on-surface rounded-2xl font-medium hover:bg-surface-container-high transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Github className="w-4 h-4 transition-transform duration-225 hover:rotate-12" />
                    GitHub
                  </a>
                  
                  <a
                    href="https://twitter.com/developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container/70 backdrop-blur-sm text-on-surface rounded-2xl font-medium hover:bg-surface-container-high transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Twitter className="w-4 h-4 transition-transform duration-225 hover:scale-110" />
                    Twitter
                  </a>
                  
                  <a
                    href="https://developer-portfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Globe className="w-4 h-4 transition-transform duration-225 hover:spin" />
                    Portfolio
                  </a>
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