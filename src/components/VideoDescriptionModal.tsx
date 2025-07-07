import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { FileText, ExternalLink, Clock, Hash, AlertTriangle, X } from 'lucide-react';
import { YouTubeService } from '../services/youtube';
import { getApiKey } from '../utils/storage';
import { decryptApiKey } from '../utils/youtube';

interface VideoDescriptionModalProps {
  video: Video;
  onClose: () => void;
}

interface VideoDetails {
  description: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  channelTitle: string;
}

export const VideoDescriptionModal: React.FC<VideoDescriptionModalProps> = ({ video, onClose }) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const fetchVideoDetails = async () => {
      try {
        const storedApiKey = getApiKey();
        if (!storedApiKey) {
          setError('API key not configured');
          setIsLoading(false);
          return;
        }

        const apiKey = decryptApiKey(storedApiKey);
        const youtubeService = new YouTubeService(apiKey);
        const details = await youtubeService.fetchVideoDetails(video.videoId);

        if (details) {
          setVideoDetails(details);
        } else {
          setError('Failed to fetch video details');
        }
      } catch (err) {
        setError('Error loading video details');
        console.error('Error fetching video details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [video.videoId, onClose]);

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 !z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with strong blur and transparency */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in !z-[9998]"
        onClick={onClose}
      />

      {/* Main Modal Container with blur, transparency, depth, and rounded corners */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-2xl animate-modal-enter elevation-3 max-h-[85vh] flex flex-col !z-[9999]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with blur and depth */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            {/* Header Icon Container with depth, blur, and hover animation */}
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <FileText className="w-6 h-6 text-on-secondary-container" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Video Details</h2>
          </div>
          {/* Close Button with depth, blur, and hover animation */}
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        {/* Content area - hides scrollbar until needed */}
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar-hide">
          <div className="space-y-6">
            {/* Video Header Card - added hover:scale */}
            <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08]">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-24 object-cover rounded-xl flex-shrink-0 shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/320x180/e5e7eb/9ca3af?text=Unavailable';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-on-surface mb-2 leading-tight">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-3">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {video.index}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </div>
                  {video.unavailable && (
                    <div className="flex items-center gap-1 text-error">
                      <AlertTriangle className="w-4 h-4" />
                      Unavailable
                    </div>
                  )}
                </div>
                {/* Watch on YouTube Chip - now with transparent background like others, and rounded-xl */}
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/30 dark:hover:bg-gray-700/30 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-gray-300/30 dark:border-gray-700/30"
                >
                  <ExternalLink className="w-4 h-4 text-primary" /> {/* Changed icon color to primary */}
                  Watch on YouTube
                </a>
              </div>
            </div>

            {/* Loading State Card - increased hover:scale */}
            {isLoading && (
              <div className="flex items-center justify-center py-12 p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant">Loading video details...</p>
                </div>
              </div>
            )}

            {/* Error State Card - increased hover:scale */}
            {error && (
              <div className="p-4 bg-error-container/20 backdrop-blur-lg text-on-error-container rounded-2xl border border-error/30 shadow-sm transition-all duration-300 hover:scale-[1.08]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Unable to load details</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Video Details Sections */}
            {videoDetails && (
              <div className="space-y-4">
                {/* Stats Grid - Each stat as a translucent, animated card with increased hover:scale */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08] hover:shadow-lg">
                    <div className="text-2xl font-bold text-on-surface mb-1">
                      {formatNumber(videoDetails.viewCount)}
                    </div>
                    <div className="text-sm text-on-surface-variant">Views</div>
                  </div>
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08] hover:shadow-lg">
                    <div className="text-2xl font-bold text-on-surface mb-1">
                      {formatNumber(videoDetails.likeCount)}
                    </div>
                    <div className="text-sm text-on-surface-variant">Likes</div>
                  </div>
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08] hover:shadow-lg">
                    <div className="text-sm font-medium text-on-surface mb-1">
                      {videoDetails.channelTitle}
                    </div>
                    <div className="text-xs text-on-surface-variant">Channel</div>
                  </div>
                  <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.08] hover:shadow-lg">
                    <div className="text-sm font-medium text-on-surface mb-1">
                      {formatDate(videoDetails.publishedAt)}
                    </div>
                    <div className="text-xs text-on-surface-variant">Published</div>
                  </div>
                </div>

                {/* Description Card - increased hover:scale */}
                <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-300/30 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-on-surface-variant" />
                    <h4 className="font-medium text-on-surface">Description</h4>
                  </div>
                  <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {videoDetails.description || 'No description available.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};