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
    // MODIFIED: Increased duration and added easing for the main container's animation
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl animate-fade-in group hover:scale-[1.02] transition-transform duration-500 ease-in-out">
      
      {/* MODIFIED: Background now scales slightly more than the card for a parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.05] transition-transform duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${playlistInfo.thumbnail})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-3 sm:p-6 lg:p-8 text-white mobile-card-padding">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6">
          
          {/* MODIFIED: Thumbnail animation is now synced to the parent group-hover */}
          <div className="flex-shrink-0 w-full sm:w-auto"> 
            <img
              src={playlistInfo.thumbnail}
              alt={playlistInfo.title}
              className="w-40 sm:w-48 aspect-video sm:w-32 sm:h-32 object-cover rounded-lg sm:rounded-2xl shadow-lg border-2 border-white/20 transition-transform duration-500 ease-in-out group-hover:scale-105 mx-auto sm:mx-0"
            />
          </div>
          
          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3 mb-2 flex-wrap">
              
              {/* MODIFIED: Removed redundant hover effect from title */}
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white line-clamp-2 sm:line-clamp-1 break-words">
                {playlistInfo.title}
              </h1>
              
              {/* MODIFIED: Synced animation to group-hover and added back the icon rotation */}
              <a
                href={`https://www.youtube.com/playlist?list=${playlistInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-1 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-md sm:rounded-lg transition-all duration-500 ease-in-out group-hover:scale-110 active:scale-95 touch-target flex-shrink-0 flex items-center justify-center"
              >
                <ExternalLink className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg]" /> 
              </a>
            </div>
            
            <p className="text-white/80 mb-2 sm:mb-3 text-xs sm:text-base lg:text-lg">
              by {playlistInfo.channelTitle}
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-4 text-xs sm:text-sm text-white/70">
              
              {/* MODIFIED: Synced animation and added a shadow for better rounded corner visibility */}
              <span className="bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-md">
                {playlistInfo.videoCount} videos
              </span>
              
              {unavailableCount > 0 && (
                <span className="bg-red-500/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg animate-pulse transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-md">
                  {unavailableCount} unavailable
                </span>
              )}
            </div>
            
            {playlistInfo.description && (
              <p className="mt-2 sm:mt-4 text-white/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                {playlistInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};