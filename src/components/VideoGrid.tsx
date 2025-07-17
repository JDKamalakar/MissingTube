import React, { useState } from 'react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import UnavailableImage from '../assets/Unavailable.png';
import { Play, Clock, AlertTriangle, Search, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { SearchActionsModal } from './SearchActionsModal';
import { VideoDescriptionModal } from './VideoDescriptionModal';

interface VideoGridProps {
  videos: Video[];
  filterMode?: FilterMode;
}

type SortField = 'index' | 'title' | 'duration' | 'channel';
type SortDirection = 'asc' | 'desc';

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, filterMode = 'all' }) => {
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [showSearchActions, setShowSearchActions] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);
  const [sortField, setSortField] = useState<SortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredVideos = videos.filter(video => {
    switch (filterMode) {
      case 'available':
        return !video.unavailable;
      case 'unavailable':
        return video.unavailable;
      default:
        return true;
    }
  });

  const handleSort = (field: SortField) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }, 150);
  };

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    let aValue: any = a[sortField === 'channel' ? 'channelTitle' : sortField];
    let bValue: any = b[sortField === 'channel' ? 'channelTitle' : sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'index') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (sortField === 'duration') {
      const parseTime = (time: string) => {
        if (time === 'Unavailable') return 0;
        const parts = time.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
      };
      aValue = parseTime(aValue);
      bValue = parseTime(bValue);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-6 h-6 opacity-50 text-gray-900 dark:text-white" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-6 h-6 text-white dark:text-gray-900" /> :
      <ArrowDown className="w-6 h-6 text-white dark:text-gray-900" />;
  };

  const handleVideoClick = (videoId: string) => {
    window.open(getVideoUrl(videoId), '_blank');
  };

  const handleSearchActions = (video: Video, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVideo(video);
    setShowSearchActions(true);
  };

  const handleShowDescription = (video: Video, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVideo(video);
    setShowDescription(true);
  };

  return (
    <>
      {/* Mobile-Optimized Sort Controls */}
      <div className="flex flex-col gap-4 mb-6 p-4 bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-3xl border border-white/30 dark:border-white/20 elevation-2">
        <span className="mobile-text-sm font-medium text-gray-900 dark:text-white">Sort by:</span>
        <div className="grid grid-cols-2 sm:flex gap-2">
          {[
            { field: 'index' as SortField, label: 'Index' },
            { field: 'title' as SortField, label: 'Title' },
            { field: 'duration' as SortField, label: 'Duration' },
            { field: 'channel' as SortField, label: 'Channel' },
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              // MODIFIED: Active sort button is now rounded-full (pill shape)
              className={`flex items-center justify-center gap-2 px-4 py-3 h-16 mobile-text-base font-medium transition-all duration-225 hover:scale-105 active:scale-95 touch-target mobile-button ${
                sortField === field
                  ? 'bg-primary text-white rounded-full shadow-md' // CHANGED: rounded-full for active state
                  : 'bg-white/30 dark:bg-black/30 backdrop-blur-lg text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-black/40 rounded-3xl border border-white/30 dark:border-white/20'
              }`}
            >
              <span className="inline-block text-base">{label}</span>
              {getSortIcon(field)}
            </button>
          ))}
        </div>
      </div>

      <div 
        data-filter-container
        className={`mobile-grid transition-all duration-300 ${
          isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {sortedVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-3xl overflow-hidden shadow-xl border border-white/30 dark:border-white/20 hover:shadow-2xl transition-all duration-300 group elevation-2 hover:elevation-4 flex flex-col"
          >
            {/* Thumbnail Container with Mobile-Optimized Padding */}
            <div className="relative p-3 sm:p-4 pb-2">
              <div className="relative bg-white/20 dark:bg-black/20 rounded-2xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 sm:h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => handleVideoClick(video.videoId)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = UnavailableImage;
                  }}
                />
                
                {/* Play overlay */}
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-2xl"
                  onClick={() => handleVideoClick(video.videoId)}
                >
                  <div className="bg-white/30 backdrop-blur-medium rounded-2xl p-3 sm:p-4 hover:scale-110 transition-transform duration-225 border border-white/30">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
                  </div>
                </div>

                {/* Duration badge - Mobile Optimized */}
                <div className="flex items-center absolute bottom-2 right-2 gap-1 bg-white/20 text-white backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 elevation-2 px-2 py-1 sm:px-3 sm:py-2 mobile-text-xs sm:text-sm">
                  <Clock className="w-3 h-3" />
                  <span style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>{video.duration}</span>
                </div>

                {/* Index number - Mobile Optimized */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/20 text-white backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 elevation-2 px-2 py-1 sm:px-3 sm:py-2 mobile-text-xs sm:text-xs">
                  <span style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>#{video.index}</span>
                </div>
              </div>
            </div>

            {/* Content - Mobile Optimized */}
            <div className="p-3 sm:p-4 pt-2 flex-1 flex flex-col mobile-gap">
              <h3
                className={`font-medium line-clamp-2 mobile-text-sm cursor-pointer hover:text-primary transition-colors duration-225 mb-2 flex-1 ${
                  video.unavailable ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                }`}
                onClick={(e) => handleShowDescription(video, e)}
                title={video.title}
              >
                {video.title}
              </h3>
              
              {/* Channel name - Mobile Optimized */}
              <p className="mobile-text-xs text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-1">
                {video.channelTitle || 'Unknown Channel'}
              </p>

              {/* Action buttons - Mobile Optimized */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={(e) => handleSearchActions(video, e)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-2 sm:px-3 bg-blue-500/80 backdrop-blur-lg rounded-2xl mobile-text-xs sm:text-xs font-medium hover:bg-blue-600/90 transition-all duration-225 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md touch-target group" // Changed to a more vibrant blue
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-[360deg] transition-transform duration-500" />
                  <span className="mobile-hidden sm:inline text-white">Search</span>
                </button>
                <button
                  onClick={() => handleVideoClick(video.videoId)}
                  className="flex items-center justify-center p-2 sm:p-3 bg-purple-500/80 backdrop-blur-lg rounded-2xl hover:bg-purple-600/90 transition-all duration-225 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md touch-target group" // Changed to a more vibrant purple
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:animate-bounce duration-2s" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showSearchActions && selectedVideo && (
        <SearchActionsModal
          video={selectedVideo}
          onClose={() => {
            setShowSearchActions(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {showDescription && selectedVideo && (
        <VideoDescriptionModal
          video={selectedVideo}
          onClose={() => {
            setShowDescription(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </>
  );
};1