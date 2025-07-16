import React from 'react';
import { PlaylistInfo } from '../types';
import { ExternalLink } from 'lucide-react';

interface PlaylistHeaderProps {
  playlistInfo: PlaylistInfo;
  unavailableCount?: number;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ 
  playlistInfo, 
  unavailableCount = 0 
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl animate-fade-in">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${playlistInfo.thumbnail})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 text-white">
        {/* Main Content Flex Container */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <img
              src={playlistInfo.thumbnail}
              alt={playlistInfo.title}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl sm:rounded-2xl shadow-lg border-2 border-white/20 transition-transform duration-300 hover:scale-105 mx-auto sm:mx-0"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            {/* Title and External Link - MODIFIED FOR MOBILE WRAPPING */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2 flex-wrap"> {/* Added flex-wrap */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white line-clamp-2 sm:line-clamp-1 break-words"> {/* Added break-words */}
                {playlistInfo.title}
              </h1>
              {/* External Link Button - MODIFIED FOR SMALLER SIZE ON MOBILE */}
              <a
                href={`https://www.youtube.com/playlist?list=${playlistInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                // Smaller padding (p-1.5), smaller icon (w-3.5 h-3.5) for mobile
                // Use sm:p-2 sm:w-5 sm:h-5 to revert to original size on larger screens
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 touch-target flex-shrink-0 flex items-center justify-center"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> {/* Smaller icon for mobile */}
              </a>
            </div>
            
            {/* Channel Title */}
            <p className="text-white/80 mb-3 text-sm sm:text-base lg:text-lg">
              by {playlistInfo.channelTitle}
            </p>
            
            {/* Video Count and Unavailable Count */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-white/70">
              <span className="bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                {playlistInfo.videoCount} videos
              </span>
              {unavailableCount > 0 && (
                <span className="bg-red-500/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg animate-pulse">
                  {unavailableCount} unavailable
                </span>
              )}
            </div>
            
            {/* Description */}
            {playlistInfo.description && (
              <p className="mt-3 sm:mt-4 text-white/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                {playlistInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};1