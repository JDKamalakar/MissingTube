import React, { useEffect } from 'react';
import { Video } from '../types';
import { X, Search, Archive, Twitter } from 'lucide-react';
import BraveIconUrl from '../assets/icons8-brave-web-browser.svg';
import RedditLogo from '../assets/reddit-logo.png';
import UnavailableImage from '../assets/Unavailable.png';

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
      name: 'Internet Archive',
      icon: Archive,
      url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${video.videoId}`,
      color: 'internetArchiveLightBlue',
      description: 'Search archived versions of this video'
    },
    {
      name: 'Brave Search',
      icon: 'image',
      imageUrl: BraveIconUrl,
      url: `https://search.brave.com/search?q=${encodeURIComponent(video.title)}`,
      color: 'braveOrange',
      description: 'Search for this video on Brave'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/search?q=${encodeURIComponent(video.title)}`,
      color: 'twitterBlue',
      description: 'Search for this video on Twitter'
    },
    {
      name: 'Reddit',
      icon: 'image',
      imageUrl: RedditLogo,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(video.title)}`,
      color: 'redditOrange',
      description: 'Search for this video on Reddit'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      internetArchiveLightBlue: 'bg-[#5D6B8C] text-white',
      braveOrange: 'bg-[#FB542B] text-white',
      twitterBlue: 'bg-[#1DA1F2] text-white',
      redditOrange: 'bg-[#FF4500] text-white',
    };
    return colorMap[color as keyof typeof colorMap] || '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* [MODIFIED] Backdrop styles from Code 2 */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* [MODIFIED] Main modal container styles from Code 2 */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-3xl animate-modal-enter elevation-3 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* [MODIFIED] Header styles from Code 2 */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Search Actions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-sm">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-15 object-cover rounded-xl flex-shrink-0 shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = UnavailableImage;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-on-surface line-clamp-2 text-base">
                  {video.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  #{video.index} • {video.duration}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-on-surface-variant">Search on:</h4>
              <div className="grid grid-cols-1 gap-4">
                {searchActions.map((action, index) => {
                  const IconComponent = action.icon !== 'image' ? action.icon : null;
                  const colorClasses = getColorClasses(action.color);

                  return (
                    <a
                      key={index}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex items-center gap-4 w-full p-4 rounded-2xl font-medium transition-all duration-300 ease-out cursor-pointer border border-white/30 dark:border-white/20
                                shadow-sm hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] z-0 hover:z-10`}
                    >
                      <div className={`absolute inset-0 rounded-2xl ${colorClasses}`} />

                      <div className="relative flex items-center gap-4 w-full z-10">
                        <div
                          className="p-3 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-md transition-all duration-700 ease-in-out
                            group-hover:scale-[1.08] group-hover:shadow-lg group-active:scale-95 group-hover:rotate-[360deg] flex-shrink-0 flex items-center justify-center"
                        >
                          {IconComponent ? (
                            <IconComponent className="w-5 h-5 text-white" />
                          ) : (
                            <img
                              src={action.imageUrl}
                              alt={action.name}
                              className="w-5 h-5 object-contain"
                            />
                          )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-base relative z-10 text-white">{action.name}</div>
                          <div className="text-sm opacity-90 line-clamp-1 relative z-10 text-white">{action.description}</div>
                        </div>
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