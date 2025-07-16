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
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-300/30 dark:border-gray-700/30 elevation-2 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-primary-container rounded-2xl">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-on-primary-container" />
          </div>
          <div>
            <h2 className="mobile-text-lg sm:text-xl font-semibold text-on-surface">Analyze Playlist</h2>
            <p className="text-on-surface-variant mobile-text-sm">Enter a YouTube playlist URL to get started</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube playlist URL or ID"
            // MODIFIED: Ensure consistent vertical padding and height
            className="w-full px-4 sm:px-6 py-4 h-12 rounded-2xl border border-outline-variant bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-225 text-on-surface placeholder:text-on-surface-variant mobile-text-base touch-target"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          // MODIFIED: Ensure consistent vertical padding and height
          className="w-full py-4 h-12 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mobile-button touch-target mobile-text-base"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Analyze Playlist</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};