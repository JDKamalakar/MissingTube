import React, { useState } from 'react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import { Play, Clock, AlertTriangle, Search, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />;
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
      {/* Sort Controls */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-300/30 dark:border-gray-700/30 elevation-2">
        <span className="text-sm font-medium text-on-surface-variant">Sort by:</span>
        <div className="flex gap-2">
          {[
            { field: 'index' as SortField, label: 'Index' },
            { field: 'title' as SortField, label: 'Title' },
            { field: 'duration' as SortField, label: 'Duration' },
            { field: 'channel' as SortField, label: 'Channel' },
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-225 hover:scale-105 active:scale-95 ${
                sortField === field
                  ? 'bg-primary-container text-on-primary-container rounded-lg'
                  : 'bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg text-on-surface hover:bg-white/30 dark:hover:bg-gray-800/30 rounded-2xl'
              }`}
            >
              {label}
              {getSortIcon(field)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-gray-300/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 group elevation-2 hover:elevation-4 flex flex-col"
          >
            {/* Thumbnail Container with Padding */}
            <div className="relative p-4 pb-2">
              <div className="relative bg-surface-container-highest rounded-2xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => handleVideoClick(video.videoId)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = './src/assets/Unavailable.png';
                  }}
                />
                
                {/* Play overlay */}
                <div
                  className="absolute inset-0 bg-scrim/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-2xl"
                  onClick={() => handleVideoClick(video.videoId)}
                >
                  <div className="bg-surface/20 blur-medium rounded-2xl p-4 hover:scale-110 transition-transform duration-225">
                    <Play className="w-8 h-8 text-on-primary fill-on-primary" />
                  </div>
                </div>

                {/* Duration badge with blur effect */}
                <div className="absolute bottom-2 right-2 bg-scrim/20 blur-medium text-on-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 border border-outline-variant/20">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>

                {/* Unavailable badge */}
                {video.unavailable && (
                  <div className="absolute top-2 left-2 bg-error text-on-error text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 animate-pulse blur-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Unavailable
                  </div>
                )}

                {/* Index number with blur effect */}
                <div className="absolute top-2 right-2 bg-scrim/20 blur-medium text-on-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 border border-outline-variant/20">
                  #{video.index}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 pt-2 flex-1 flex flex-col">
              <h3
                className={`font-medium line-clamp-2 text-sm cursor-pointer hover:text-primary transition-colors duration-225 mb-2 flex-1 ${
                  video.unavailable ? 'text-on-surface-variant' : 'text-on-surface'
                }`}
                onClick={(e) => handleShowDescription(video, e)}
                title={video.title}
              >
                {video.title}
              </h3>
              
              {/* Channel name */}
              <p className="text-xs text-on-surface-variant mb-4 line-clamp-1">
                {video.channelTitle || 'Unknown Channel'}
              </p>

              {/* Action buttons - anchored at bottom */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={(e) => handleSearchActions(video, e)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-medium hover:bg-secondary-container/90 transition-all duration-225 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Search className="w-3 h-3" />
                  Search
                </button>
                <button
                  onClick={() => handleVideoClick(video.videoId)}
                  className="flex items-center justify-center p-2.5 bg-primary-container text-on-primary-container rounded-lg hover:bg-primary-container/90 transition-all duration-225 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                >
                  <ExternalLink className="w-3 h-3" />
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
};