import React, { useState } from 'react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import UnavailableImage from '../assets/Unavailable.png';
import { Play, Clock, AlertTriangle, Search, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SearchActionsModal } from './SearchActionsModal';
import { VideoDescriptionModal } from './VideoDescriptionModal';

interface TooltipProps {
  children: React.ReactElement;
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

const Tooltip: React.FC<TooltipProps> = ({ children, title, subtitle, className, align = 'center' }) => {
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }[align];

  return (
    <div className={`group/tooltip relative ${className}`}>
      {children}
      {/* Tooltip Container */}
      <div className={`absolute bottom-full -mb-4 w-max max-w-xs hidden group-hover/tooltip:flex group-focus/tooltip:flex flex-col ${alignClass} opacity-0 group-hover/tooltip:opacity-100 group-focus/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-50`}>
        <div className="bg-primary/30 dark:bg-black/30 text-white backdrop-blur-md rounded-xl shadow-2xl shadow-primary/30 px-4 py-2 text-left">
          <p className="font-semibold text-sm whitespace-pre-wrap">{title}</p>
          {subtitle && <p className="opacity-80 text-xs">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

interface VideoCardProps {
  video: Video;
  onVideoClick: (videoId: string) => void;
  onSearchClick: (video: Video, e: React.MouseEvent) => void;
  onDescriptionClick: (video: Video, e: React.MouseEvent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick, onSearchClick, onDescriptionClick }) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const handleTitleClick = (e: React.MouseEvent) => {
    setIsTitleHovered(true);
    setTimeout(() => {
      setIsTitleHovered(false);
    }, 3000); // MODIFICATION: Increased duration to 3 seconds

    onDescriptionClick(video, e);
  };

  return (
    <div
      className="bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-3xl shadow-xl border border-white/30 dark:border-white/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group elevation-2 hover:elevation-4 flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative p-4 pb-2">
        <div className="relative bg-white/20 dark:bg-black/20 rounded-2xl overflow-hidden">
          {/* MODIFICATION: Added rounded-2xl to the img tag to prevent corner glitch on hover */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300 rounded-2xl"
            onClick={() => onVideoClick(video.videoId)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = UnavailableImage;
            }}
          />
          
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-2xl"
            onClick={() => onVideoClick(video.videoId)}
          >
            <div className="bg-white/30 backdrop-blur-medium rounded-2xl p-4 hover:scale-110 transition-transform duration-225 border border-white/30">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* MODIFICATION: Increased z-index to z-50 to ensure visibility */}
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-11/12 max-w-xs flex flex-col items-center pointer-events-none z-50 transition-opacity duration-300 ${isTitleHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-primary/30 dark:bg-black/30 text-white backdrop-blur-md rounded-xl shadow-2xl shadow-primary/30 px-4 py-2 text-center w-full">
              <p className="font-semibold text-sm whitespace-pre-wrap line-clamp-2">{video.title}</p>
              <p className="opacity-80 text-xs">Tap For Description</p>
            </div>
          </div>

          <div className="flex items-center absolute bottom-2 right-2 gap-1 bg-white/20 dark:bg-black/40 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 elevation-2 px-3 py-3 text-sm">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>

          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/20 dark:bg-black/40 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 elevation-2 px-3 py-3 text-xs">
            #{video.index}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2 flex-1 flex flex-col">
        <h3
          onMouseEnter={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
          onClick={handleTitleClick}
          className={`font-medium line-clamp-2 text-sm cursor-pointer hover:text-white dark:hover:text-primary transition-colors duration-225 h-10 mb-2 ${
            video.unavailable ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          }`}
        >
          {video.title}
        </h3>
        
        <Tooltip title={video.channelTitle || 'Unknown Channel'} className="mb-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
            {video.channelTitle || 'Unknown Channel'}
          </p>
        </Tooltip>

        <div className="flex gap-2 mt-auto">
          <Tooltip title="Search Actions" className="flex-1">
            <button
              onClick={(e) => onSearchClick(video, e)}
              className="w-full h-full flex items-center justify-center gap-2 py-3 px-3 bg-secondary/60 text-white rounded-xl text-xs font-medium hover:bg-secondary/90 transition-all duration-225 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md group"
            >
              <Search className="w-3 h-3 transition-transform duration-1000 group-hover:[transform:rotate(-360deg)]" />
              Search
            </button>
          </Tooltip>
          <Tooltip title="Open in YouTube" align="end">
            <button
              onClick={() => onVideoClick(video.videoId)}
              className="h-full flex items-center justify-center p-3 bg-primary/40 text-white rounded-xl hover:bg-primary/90 transition-all duration-225 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md group"
            >
              <ExternalLink className="w-3 h-3 duration-1000 group-hover:animate-bounce" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

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
      setIsAnimating(false);
    }, 100);
  };

  const handleVideoClick = (videoId: string) => {
    window.open(getVideoUrl(videoId), '_blank');
  };

  const handleSearchClick = (video: Video, e: React.MouseEvent) => {
    setShowSearchActions(true);
  };

  const handleDescriptionClick = (video: Video, e: React.MouseEvent) => {
    setShowDescription(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVideos
          .sort((a, b) => {
            if (sortField === 'index') {
              return sortDirection === 'asc' ? a.index - b.index : b.index - a.index;
            }
            if (sortField === 'title') {
              return sortDirection === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
            }
            if (sortField === 'duration') {
              return sortDirection === 'asc'
                ? a.duration.localeCompare(b.duration)
                : b.duration.localeCompare(a.duration);
            }
            return 0;
          })
          .map((video) => (
            <VideoCard
              key={video.videoId}
              video={video}
              onVideoClick={handleVideoClick}
              onSearchClick={handleSearchClick}
              onDescriptionClick={handleDescriptionClick}
            />
          ))}
      </div>
    </div>
  );
};
