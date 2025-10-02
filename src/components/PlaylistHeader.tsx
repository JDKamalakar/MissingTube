import React from 'react';
import { PlaylistInfo } from '../types';
import { ExternalLink, ListVideo, VideoOff } from 'lucide-react';

interface PlaylistHeaderProps {
  playlistInfo: PlaylistInfo;
  unavailableCount?: number;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlistInfo,
  unavailableCount = 0
}) => {
  return (
    // FIX 1: Removed 'isolate' and 'transform-gpu'. Added 'will-change-transform' for smoother animation.
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl animate-fade-in group hover:scale-[1.02] transition-transform duration-500 ease-in-out will-change-transform">

      {/* FIX 2: Removed the independent 'group-hover:scale-[1.05]' animation. This is the key change to prevent rendering conflicts. */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${playlistInfo.thumbnail})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-3 sm:p-6 lg:p-8 text-white mobile-card-padding">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6">

          <div className="flex-shrink-0 w-full sm:w-auto">
            {/* FIX 3: Replaced 'transform-gpu' with 'will-change-transform'. */}
            <img
              src={playlistInfo.thumbnail}
              alt={playlistInfo.title}
              className="w-40 sm:w-48 aspect-video sm:w-32 sm:h-32 object-cover rounded-lg sm:rounded-2xl shadow-lg border-2 border-white/20 transition-transform duration-500 ease-in-out hover:scale-110 will-change-transform mx-auto sm:mx-0"
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            <div className="group/title flex items-center justify-center sm:justify-start gap-1 sm:gap-3 mb-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white line-clamp-2 sm:line-clamp-1 break-words">
                {playlistInfo.title}
              </h1>
              <a
                href={`https://www.youtube.com/playlist?list=${playlistInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-md sm:rounded-lg transition-all duration-500 ease-in-out group-hover/title:scale-110 active:scale-95 touch-target flex-shrink-0 flex items-center justify-center animate-wiggle"
              >
                <ExternalLink className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-500 ease-in-out group-hover/title:rotate-[360deg]" />
              </a>
            </div>

            <p className="text-white/80 mb-2 sm:mb-3 text-xs sm:text-base lg:text-lg">
              by {playlistInfo.channelTitle}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-4 text-xs sm:text-sm text-white/70">

              {/* FIX 4: Replaced 'transform-gpu' with 'will-change-transform'. */}
              <span className="flex items-center gap-1.5 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg will-change-transform">
                <ListVideo className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {playlistInfo.videoCount} videos
              </span>

              {unavailableCount > 0 && (
                <span className="flex items-center gap-1.5 sm:gap-2 bg-red-500/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg animate-pulse transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg will-change-transform">
                  <VideoOff className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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