import React, { useEffect } from 'react';
import { Video } from '../types';
import { Search, Archive, Twitter, MessageSquare, X } from 'lucide-react';

interface SearchActionsModalProps {
  video: Video;
  onClose: () => void;
}

export const SearchActionsModal: React.FC<SearchActionsModalProps> = ({ video, onClose }) => {
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

  const searchActions = [
    {
      name: 'Wayback Machine',
      icon: Archive,
      url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${video.videoId}`,
      color: 'primary',
      description: 'Search archived versions of this video'
    },
    {
      name: 'Brave Search',
      icon: Search,
      url: `https://search.brave.com/search?q=${encodeURIComponent(video.title)}`,
      color: 'warning',
      description: 'Search for this video on Brave'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/search?q=${encodeURIComponent(video.title)}`,
      color: 'secondary',
      description: 'Search for this video on Twitter'
    },
    {
      name: 'Reddit',
      icon: MessageSquare,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(video.title)}`,
      color: 'error',
      description: 'Search for this video on Reddit'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary text-on-primary hover:bg-primary/90',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      tertiary: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90',
      error: 'bg-error text-on-error hover:bg-error/90',
      warning: 'bg-warning text-on-warning hover:bg-warning/90',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop with navbar-like blur */}
      <div 
        className="fixed inset-0 bg-scrim/60 blur-subtle transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal with navbar-like transparency - Properly centered */}
      <div 
        className="relative bg-surface/90 blur-light rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md animate-modal-enter elevation-3 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        style={{ 
          position: 'relative',
          zIndex: 10000,
          margin: 'auto'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-container rounded-2xl">
              <Search className="w-6 h-6 text-on-secondary-container" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Search Actions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-2xl transition-all duration-225 hover:scale-110 active:scale-95 text-on-surface-variant hover:text-on-surface"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-4">
            {/* Video Info */}
            <div className="flex items-start gap-3 p-4 bg-surface-container rounded-2xl">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = './src/assets/Unavailable.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-on-surface line-clamp-2 text-sm">
                  {video.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  #{video.index} • {video.duration}
                </p>
              </div>
            </div>

            {/* Search Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-on-surface-variant">Search on:</h4>
              <div className="grid grid-cols-1 gap-3">
                {searchActions.map((action, index) => {
                  const Icon = action.icon;
                  const colorClasses = getColorClasses(action.color);
                  
                  return (
                    <a
                      key={index}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 w-full p-4 ${colorClasses} rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-decoration-none cursor-pointer`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm">{action.name}</div>
                        <div className="text-xs opacity-90 line-clamp-1">{action.description}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};