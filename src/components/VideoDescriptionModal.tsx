import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { FileText, ExternalLink, Clock, Hash, AlertTriangle, X, Eye, Heart } from 'lucide-react';
import { YouTubeService } from '../services/youtube';
import { getApiKey } from '../utils/storage';
import { decryptApiKey } from '../utils/youtube';
import UnavailableImage from '../assets/Unavailable.png';
import { format } from 'date-fns';

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
      if (video.unavailable) {
        setError('Video is unavailable, details cannot be fetched.');
        setIsLoading(false);
        return;
      }
      try {
        const storedApiKey = getApiKey();
        if (!storedApiKey) {
          setError('API key not configured.');
          setIsLoading(false);
          return;
        }

        const apiKey = decryptApiKey(storedApiKey);
        const youtubeService = new YouTubeService(apiKey);
        const details = await youtubeService.fetchVideoDetails(video.videoId);

        if (details) {
          setVideoDetails(details);
        } else {
          setError('Failed to fetch video details.');
        }
      } catch (err) {
        setError('An error occurred while loading video details.');
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
  }, [video.videoId, video.unavailable, onClose]);

  const formatNumber = (numStr: string) => {
    const number = parseInt(numStr, 10);
    if (isNaN(number)) return 'N/A';
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-2xl animate-modal-enter elevation-3 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
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

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-sm">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full sm:w-40 h-auto sm:h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = UnavailableImage; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-on-surface line-clamp-2 text-base sm:text-lg">
                  {video.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  <span className="inline-flex items-center gap-1"><Hash className="w-3 h-3" /> {video.index}</span> • 
                  <span className="inline-flex items-center gap-1 ml-2"><Clock className="w-3 h-3" /> {video.duration}</span>
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-white/30 dark:bg-black/30 backdrop-blur-lg text-on-surface rounded-xl text-xs font-medium transition-all duration-300 hover:bg-white/40 dark:hover:bg-black/40 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-white/30 dark:border-white/20"
                >
                  <ExternalLink className="w-3 h-3 text-primary" />
                  Watch on YouTube
                </a>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/20 shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant">Loading video details...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-error-container/30 backdrop-blur-lg text-on-error-container rounded-2xl border border-error/30 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Unable to load details</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {videoDetails && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Views', value: formatNumber(videoDetails.viewCount), icon: Eye },
                    { label: 'Likes', value: formatNumber(videoDetails.likeCount), icon: Heart },
                    { label: 'Channel', value: videoDetails.channelTitle, icon: null },
                    { label: 'Published', value: formatDate(videoDetails.publishedAt), icon: null },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl p-3 sm:p-4 text-center border border-white/30 dark:border-white/20 shadow-sm transition-all duration-300 hover:scale-105 active:scale-[0.98] hover:shadow-lg">
                      <div className="text-lg sm:text-2xl font-bold text-on-surface mb-1 line-clamp-1">{value}</div>
                      <div className="text-xs sm:text-sm text-on-surface-variant flex items-center justify-center gap-1">
                        {Icon && <Icon className="w-3 h-3" />} {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* [MODIFIED] Description Card - added active:scale-[0.98] */}
                <div className="bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/30 dark:border-white/20 shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg">
                  <h4 className="font-medium text-on-surface mb-2">Description</h4>
                  <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap max-h-48 sm:max-h-64 overflow-y-auto">
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