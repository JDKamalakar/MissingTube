import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { extractPlaylistId } from '../utils/youtube';
import { saveLastPlaylistUrl, getLastPlaylistUrl } from '../utils/storage';

interface PlaylistFetcherProps {
  onFetch: (playlistId: string) => void;
  isLoading: boolean;
}

export const PlaylistFetcher: React.FC<PlaylistFetcherProps> = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const lastUrl = getLastPlaylistUrl();
    if (lastUrl) {
      setUrl(lastUrl);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const playlistId = extractPlaylistId(url);
    saveLastPlaylistUrl(url);
    onFetch(playlistId);
  };

  return (
    // MODIFIED: Increased hover:scale to the main div
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-3 sm:p-6 lg:p-8 shadow-xl border border-gray-300/30 dark:border-gray-700/30 elevation-2 animate-fade-in group hover:scale-[1.02] transition-transform duration-300 mobile-card-padding">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
          {/* MODIFIED: Added hover:scale to the icon's parent div */}
          <div className="p-2 sm:p-3 bg-primary-container rounded-xl sm:rounded-2xl transition-transform duration-225 hover:scale-[1.02] active:scale-[0.98] group">
            <Search className="w-4 h-4 sm:w-6 sm:h-6 text-on-primary-container transition-transform duration-1000 group-hover:[transform:rotate(-360deg)]" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-on-surface">Analyze Playlist</h2>
            <p className="text-on-surface-variant text-xs sm:text-sm">Enter a YouTube playlist URL to get started</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube playlist URL or ID"
            // MODIFIED: Changed hover:scale to match the button's scale
            className="w-full px-3 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-xl sm:rounded-2xl border border-outline-variant bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-225 text-on-surface placeholder:text-on-surface-variant text-sm sm:text-base touch-target hover:scale-[1.02]"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-2 sm:py-3 h-12 sm:h-16 bg-primary text-on-primary rounded-xl sm:rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 mobile-button touch-target text-sm sm:text-base mobile-button-compact group"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-1000 group-hover:[transform:rotate(360deg)]" />
              <span>Analyze Playlist</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};