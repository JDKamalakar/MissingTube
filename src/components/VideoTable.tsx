import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, AlertTriangle, Search, FileText, Clock, Play } from 'lucide-react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
import UnavailableImage from '../assets/Unavailable.png';
import { SearchActionsModal } from './SearchActionsModal';
import { VideoDescriptionModal } from './VideoDescriptionModal';


interface VideoTableProps {
  videos: Video[];
  filterMode?: FilterMode;
}

type SortField = 'index' | 'title' | 'duration' | 'channel';
type SortDirection = 'asc' | 'desc';

export const VideoTable: React.FC<VideoTableProps> = ({ videos, filterMode = 'all' }) => {
  const [sortField, setSortField] = useState<SortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showSearchActions, setShowSearchActions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
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
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ?
      <ArrowUp className="w-4 h-4 text-white dark:text-primary" /> :
      <ArrowDown className="w-4 h-4 text-white dark:text-primary" />;
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
      <div 
        data-filter-container
        className={`bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-3xl shadow-xl border border-white/30 dark:border-white/20 overflow-hidden elevation-2 transition-all duration-300 ${
          isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/30 dark:bg-black/40 backdrop-blur-heavy">
              <tr>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-225 select-none relative ${
                    sortField === 'index' ? 'bg-primary/20' : ''
                  }`}
                  onClick={() => handleSort('index')}
                >
                  {sortField === 'index' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    #
                    {getSortIcon('index')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Thumbnail
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-225 select-none relative ${
                    sortField === 'title' ? 'bg-primary/20' : ''
                  }`}
                  onClick={() => handleSort('title')}
                >
                  {sortField === 'title' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Title
                    {getSortIcon('title')}
                  </div>
                </th>
                <th className={`hidden sm:table-cell px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-225 select-none relative ${
                  sortField === 'channel' ? 'bg-primary/20' : ''
                }`}
                  onClick={() => handleSort('channel')}
                >
                  {sortField === 'channel' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Channel
                    {getSortIcon('channel')}
                  </div>
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-225 select-none relative ${
                    sortField === 'duration' ? 'bg-primary/20' : ''
                  }`}
                  onClick={() => handleSort('duration')}
                >
                  {sortField === 'duration' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Duration
                    {getSortIcon('duration')}
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {sortedVideos.map((video, index) => (
                <tr
                  key={video.id}
                  className={`hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-225 ${
                    video.unavailable ? 'opacity-60' : ''
                  } ${index % 2 === 0 ? 'bg-white/5 dark:bg-black/5' : 'bg-white/10 dark:bg-black/10'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex p-3 bg-primary/20 dark:bg-primary-800/20 text-white backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] items-center justify-center active:scale-95 hover:shadow-lg group">
                      {video.index}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-32 h-20 rounded-2xl overflow-hidden group shadow-lg hover:scale-[1.03] transition-transform duration-225"> {/* Applied shadow-lg here for elevation-3 effect on thumbnail and reduced hover scale to 1.03 for a subtle effect */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleVideoClick(video.videoId)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = UnavailableImage;
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-2xl"
                        onClick={() => handleVideoClick(video.videoId)}
                      >
                        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 hover:scale-110 transition-transform duration-225 border border-white/30">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                    <div className="flex items-center gap-3">
                      {video.unavailable && (
                        <div className="flex-shrink-0 bg-error text-white rounded-full p-1.5 shadow-md animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`cursor-pointer hover:text-primary transition-colors duration-225 line-clamp-2 font-medium flex-1 ${
                          video.unavailable ? 'text-gray-600 dark:text-gray-400' : ''
                        }`}
                        onClick={(e) => handleShowDescription(video, e)}
                        title={video.title}
                      >
                        {video.title}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {video.channelTitle || 'Unknown Channel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Applied shadow-lg for elevation-3 and hover:scale-[1.03] for subtle hover scale */}
                    <span className={`text-sm px-3 py-3 rounded-2xl flex items-center gap-2 w-fit bg-white/20 dark:bg-black/20 text-gray-900 dark:text-white border border-white/20 shadow-lg hover:scale-[1.03] transition-all duration-300`}>
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleVideoClick(video.videoId)}
                        // Applied shadow-lg for elevation-3 and hover:scale-[1.10] for hover scale
                        className="flex p-2 sm:p-3 bg-primary-container/20 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.10] items-center justify-center active:scale-95 group touch-target"
                        title="Open video"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-on-primary-container group-hover:animate-bounce duration-2s" /> 
                      </button>
                      <button
                        onClick={(e) => handleSearchActions(video, e)}
                        // Applied shadow-lg for elevation-3 and hover:scale-[1.10] for hover scale
                        className="flex p-2 sm:p-3 bg-secondary-container/20 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.10] items-center justify-center active:scale-95 group touch-target"
                        title="Search actions"
                      >
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-on-secondary-container group-hover:rotate-[360deg] transition-transform duration-500" /> 
                      </button>
                      <button
                        onClick={(e) => handleShowDescription(video, e)}
                        // Applied shadow-lg for elevation-3 and hover:scale-[1.10] for hover scale
                        className="hidden sm:flex p-2 sm:p-3 bg-tertiary-container/20 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.10] items-center justify-center active:scale-95 group touch-target"
                        title="View description"
                      >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-on-tertiary-container group-hover:rotate-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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