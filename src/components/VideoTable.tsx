import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, AlertTriangle, Search, FileText, Clock, Play } from 'lucide-react';
import { Video, FilterMode } from '../types';
import { getVideoUrl } from '../utils/youtube';
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
      // Convert duration to seconds for sorting
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
      <div className="bg-surface/95 blur-light rounded-3xl shadow-lg border border-outline-variant overflow-hidden elevation-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container/95 blur-light">
              <tr>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none relative ${
                    sortField === 'index' ? 'bg-primary-container/20' : ''
                  }`}
                  onClick={() => handleSort('index')}
                >
                  {/* Bigger pin dot indicator positioned on top border */}
                  {sortField === 'index' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    #
                    {getSortIcon('index')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  Thumbnail
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none relative ${
                    sortField === 'title' ? 'bg-primary-container/20' : ''
                  }`}
                  onClick={() => handleSort('title')}
                >
                  {/* Bigger pin dot indicator positioned on top border */}
                  {sortField === 'title' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Title
                    {getSortIcon('title')}
                  </div>
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none relative ${
                    sortField === 'channel' ? 'bg-primary-container/20' : ''
                  }`}
                  onClick={() => handleSort('channel')}
                >
                  {/* Bigger pin dot indicator positioned on top border */}
                  {sortField === 'channel' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Channel
                    {getSortIcon('channel')}
                  </div>
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-all duration-225 select-none relative ${
                    sortField === 'duration' ? 'bg-primary-container/20' : ''
                  }`}
                  onClick={() => handleSort('duration')}
                >
                  {/* Bigger pin dot indicator positioned on top border */}
                  {sortField === 'duration' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                  )}
                  <div className="flex items-center gap-2">
                    Duration
                    {getSortIcon('duration')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {sortedVideos.map((video, index) => (
                <tr
                  key={video.id}
                  className={`hover:bg-surface-container-low transition-all duration-225 ${
                    video.unavailable ? 'opacity-60' : ''
                  } ${index % 2 === 0 ? 'bg-surface/95' : 'bg-surface-container-lowest/95'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-container text-on-primary-container rounded-lg text-sm font-medium border border-outline-variant shadow-sm">
                      {video.index}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Container for thumbnail and play overlay - scales on hover */}
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-225 shadow-md hover:shadow-lg">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleVideoClick(video.videoId)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Set a placeholder image only if it's not already set
                          if (target.src !== './src/assets/Unavailable.png') {
                              target.src = './src/assets/Unavailable.png';
                          }
                        }}
                      />
                      {/* Play overlay - correctly covers the scaled thumbnail */}
                      <div
                        className="absolute inset-0 bg-scrim/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-lg"
                        onClick={() => handleVideoClick(video.videoId)}
                      >
                        <div className="bg-surface/20 backdrop-blur-sm rounded-2xl p-3 hover:scale-110 transition-transform duration-225">
                          <Play className="w-6 h-6 text-on-primary fill-on-primary" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface max-w-xs">
                    <div className="flex items-center gap-3">
                      {/* Error mark positioned between thumbnail and title */}
                      {video.unavailable && (
                        <div className="flex-shrink-0 bg-error text-on-error rounded-full p-1.5 shadow-md animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`cursor-pointer hover:text-primary transition-colors duration-225 line-clamp-2 font-medium flex-1 ${
                          video.unavailable ? 'text-on-surface-variant' : ''
                        }`}
                        onClick={(e) => handleShowDescription(video, e)}
                        title={video.title}
                      >
                        {video.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-on-surface-variant">
                      {video.channelTitle || 'Unknown Channel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Unavailable duration now follows same design and color as other durations */}
                    <span className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit bg-surface-container text-on-surface`}>
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVideoClick(video.videoId)}
                        className="p-2 text-primary hover:bg-primary-container rounded-lg transition-all duration-225 hover:scale-110 active:scale-95"
                        title="Open video"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleSearchActions(video, e)}
                        className="p-2 text-secondary hover:bg-secondary-container rounded-lg transition-all duration-225 hover:scale-110 active:scale-95"
                        title="Search actions"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleShowDescription(video, e)}
                        className="p-2 text-tertiary hover:bg-tertiary-container rounded-lg transition-all duration-225 hover:scale-110 active:scale-95"
                        title="View description"
                      >
                        <FileText className="w-4 h-4" />
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
};