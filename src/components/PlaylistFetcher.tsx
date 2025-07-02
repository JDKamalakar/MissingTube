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
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-300/30 dark:border-gray-700/30 elevation-2 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-container rounded-2xl">
            <Search className="w-6 h-6 text-on-primary-container" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-on-surface">Analyze Playlist</h2>
            <p className="text-on-surface-variant text-sm">Enter a YouTube playlist URL to get started</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube playlist URL or ID"
            className="w-full px-6 py-4 rounded-2xl border border-outline-variant bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-225 text-on-surface placeholder:text-on-surface-variant"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-4 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Analyze Playlist
            </>
          )}
        </button>
      </form>
    </div>
  );
};