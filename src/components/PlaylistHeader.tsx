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
    <div className="relative overflow-hidden rounded-2xl shadow-xl animate-fade-in">
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
      <div className="relative z-10 p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={playlistInfo.thumbnail}
              alt={playlistInfo.title}
              className="w-32 h-32 object-cover rounded-2xl shadow-lg border-2 border-white/20 transition-transform duration-300 hover:scale-105"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white truncate">
                {playlistInfo.title}
              </h1>
              <a
                href={`https://www.youtube.com/playlist?list=${playlistInfo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-white/80 mb-3 text-lg">
              by {playlistInfo.channelTitle}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="bg-white/20 px-3 py-1.5 rounded-lg">
                {playlistInfo.videoCount} videos
              </span>
              {unavailableCount > 0 && (
                <span className="bg-red-500/80 px-3 py-1.5 rounded-lg animate-pulse">
                  {unavailableCount} unavailable
                </span>
              )}
            </div>
            
            {playlistInfo.description && (
              <p className="mt-4 text-white/80 text-sm line-clamp-2">
                {playlistInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};