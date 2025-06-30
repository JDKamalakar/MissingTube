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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with navbar-like blur */}
      <div 
        className="fixed inset-0 bg-scrim/60 blur-subtle transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal with navbar-like transparency */}
      <div 
        className="relative bg-surface/90 blur-light rounded-2xl shadow-2xl border border-outline-variant w-full max-w-2xl animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-tertiary-container rounded-2xl">
              <FileText className="w-6 h-6 text-on-tertiary-container" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Video Details</h2>
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
          <div className="space-y-6">
            {/* Video Header */}
            <div className="flex items-start gap-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-24 object-cover rounded-xl flex-shrink-0 shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = './src/assets/Unavailable.png';
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
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-all duration-225 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </a>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant">Loading video details...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Unable to load details</span>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Video Details */}
            {videoDetails && (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-on-surface mb-1">
                      {formatNumber(videoDetails.viewCount)}
                    </div>
                    <div className="text-sm text-on-surface-variant">Views</div>
                  </div>
                  <div className="bg-surface-container rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-on-surface mb-1">
                      {formatNumber(videoDetails.likeCount)}
                    </div>
                    <div className="text-sm text-on-surface-variant">Likes</div>
                  </div>
                  <div className="bg-surface-container rounded-2xl p-4 text-center">
                    <div className="text-sm font-medium text-on-surface mb-1">
                      {videoDetails.channelTitle}
                    </div>
                    <div className="text-xs text-on-surface-variant">Channel</div>
                  </div>
                  <div className="bg-surface-container rounded-2xl p-4 text-center">
                    <div className="text-sm font-medium text-on-surface mb-1">
                      {formatDate(videoDetails.publishedAt)}
                    </div>
                    <div className="text-xs text-on-surface-variant">Published</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-surface-container rounded-2xl p-6">
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