import React, { useEffect } from 'react';
import { Video } from '../types';
import { X, Info, Clock, ExternalLink, Hash, Copy, Check } from 'lucide-react';
import UnavailableImage from '../assets/Unavailable.png';
import { getVideoUrl } from '../utils/youtube';
import { format } from 'date-fns';

interface VideoDescriptionModalProps {
  video: Video;
  onClose: () => void;
}

export const VideoDescriptionModal: React.FC<VideoDescriptionModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent scrolling on body when modal is open

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scrolling on body when modal is closed
    };
  }, [onClose]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with more transparency (bg-black/10) and blur */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container with updated styles and responsiveness */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-3xl animate-modal-enter elevation-3 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Title & Button Div with updated styles */}
        <div className="flex items-center justify-between p-4 sm:p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-on-surface line-clamp-1 flex-1">
              Video Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-4 sm:space-y-6">
            {/* Thumbnail and Title */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-sm">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full sm:w-40 h-auto sm:h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = UnavailableImage;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-on-surface line-clamp-2 text-base sm:text-lg">
                  {video.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Hash className="w-3 h-3 text-on-surface-variant" /> {video.index}
                  </span>
                  {' • '}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-on-surface-variant" /> {video.duration}
                  </span>
                </p>
                {video.publishedAt && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    Published: {format(new Date(video.publishedAt), 'MMM dd, yyyy')}
                  </p>
                )}
                {video.unavailable && (
                  <p className="text-xs text-error mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" /> Video Unavailable
                  </p>
                )}
                <p className="text-sm text-on-surface-variant mt-2">
                  Channel: {video.channelTitle || 'Unknown Channel'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-sm">
              <h4 className="text-base font-medium text-on-surface mb-2">Description:</h4>
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                {video.description || 'No description available.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getVideoUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-2xl text-sm font-medium hover:bg-primary/90 transition-all duration-225 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-4 h-4" /> Open on YouTube
              </a>
              <button
                onClick={() => handleCopy(getVideoUrl(video.videoId))}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary-container text-on-secondary-container rounded-2xl text-sm font-medium hover:bg-secondary-container/90 transition-all duration-225 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};