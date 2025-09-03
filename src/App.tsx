import React, { useState, useCallback, useEffect } from 'react';
import { Video, PlaylistInfo, ViewMode, FilterMode } from './types';
import { YouTubeService } from './services/youtube';
import { decryptApiKey } from './utils/youtube';
import { getApiKey, savePlaylists, getPlaylists, saveViewMode, getViewMode, saveFilterMode, getFilterMode } from './utils/storage';
import { usePlaylistStats } from './hooks/usePlaylistStats';
import testData from './assets/test_test.json'; 

import { Navbar } from './components/Navbar';
import { PlaylistFetcher } from './components/PlaylistFetcher';
import { PlaylistHeader } from './components/PlaylistHeader';
import { StatsPanel } from './components/StatsPanel';
import { ViewToggle } from './components/ViewToggle';
import { VideoGrid } from './components/VideoGrid';
import { VideoTable } from './components/VideoTable';
import { FilterControls } from './components/FilterControls';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { InstallPrompt } from './components/InstallPrompt';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => getViewMode());
  const [filterMode, setFilterMode] = useState<FilterMode>(() => getFilterMode());
  const [lastPlaylistId, setLastPlaylistId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stats = usePlaylistStats(videos);

  // ... (all handler functions like handleApiKeyChange, handleFetchPlaylist, etc. remain the same)

  const handleViewModeChange = (newViewMode: ViewMode) => {
    if (newViewMode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(newViewMode);
      saveViewMode(newViewMode);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleFilterModeChange = (newFilterMode: FilterMode) => {
    setFilterMode(newFilterMode);
    saveFilterMode(newFilterMode);
  };
  
  // ... (useEffect hook remains the same)

  const unavailableCount = videos.filter(v => v.unavailable).length;
  const showViewToggle = videos.length > 0;
  const showFilterControls = unavailableCount > 0 && videos.length > 0;

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <div className="relative z-10">
          <Navbar 
            onApiKeyChange={handleApiKeyChange}
            onRestoreComplete={handleRestoreComplete}
            onPlaylistSelect={handlePlaylistSelect}
            currentVideos={videos}
            currentPlaylistInfo={playlistInfo}
          />
          
          <ThemeToggle /> 
          <InstallPrompt />

          <div className="container mx-auto px-6 md:px-16 py-12 max-w-7xl">
            <div className="mb-12">
              <PlaylistFetcher onFetch={handleFetchPlaylist} isLoading={isLoading} />
            </div>

            {(playlistInfo || isLoading) && (
              <>
                {/* ... (PlaylistHeader and StatsPanel sections remain the same) */}

                {/* [FIX] Simplified and robust layout for the filter/view controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  {showFilterControls && (
                      <div className="w-full sm:w-auto animate-slide-in-left">
                          <FilterControls
                              filterMode={filterMode}
                              onFilterChange={handleFilterModeChange}
                              unavailableCount={unavailableCount}
                              totalCount={videos.length}
                          />
                      </div>
                  )}

                  {/* This single ViewToggle is pushed to the right on desktop via sm:ml-auto */}
                  {showViewToggle && (
                      <div className="w-full sm:w-auto sm:ml-auto animate-slide-in-right">
                          <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
                      </div>
                  )}
                </div>

                {/* ... (VideoGrid/VideoTable display section remains the same) */}
              </>
            )}

            {/* ... (Rest of the JSX for loading/empty states remains the same) */}
          </div>

          <ConfirmationModal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmRefetch}
            title="Refetch Playlist?"
            message="This playlist was already analyzed. Refetching will use additional API quota. Do you want to continue?"
            confirmText="Yes, Refetch"
            cancelText="Cancel"
            type="warning"
          />

          <ScrollToTop />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;