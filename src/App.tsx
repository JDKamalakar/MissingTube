import React, { useState, useCallback } from 'react';
import { Video, PlaylistInfo, ViewMode, FilterMode } from './types';
import { YouTubeService } from './services/youtube';
import { decryptApiKey } from './utils/youtube';
import { getApiKey, savePlaylists, getPlaylists, saveViewMode, getViewMode, saveFilterMode, getFilterMode } from './utils/storage';
import { usePlaylistStats } from './hooks/usePlaylistStats';

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

function App() {
  const [apiKey, setApiKey] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => getViewMode()); // Load saved preference
  const [filterMode, setFilterMode] = useState<FilterMode>(() => getFilterMode()); // Load saved preference
  const [lastPlaylistId, setLastPlaylistId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stats = usePlaylistStats(videos);

  const handleApiKeyChange = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
  }, []);

  const handleFetchPlaylist = async (playlistId: string) => {
    if (!apiKey) {
      alert('Please configure your API key first');
      return;
    }

    // Check if it's the same playlist and ask for confirmation
    if (playlistId === lastPlaylistId && videos.length > 0) {
      setPendingPlaylistId(playlistId);
      setShowConfirmation(true);
      return;
    }

    await fetchPlaylistData(playlistId);
  };

  const fetchPlaylistData = async (playlistId: string) => {
    setIsLoading(true);
    
    // Clear old data immediately when starting new fetch
    setVideos([]);
    setPlaylistInfo(null);
    
    try {
      const youtubeService = new YouTubeService(apiKey);
      
      // Fetch playlist info
      const info = await youtubeService.fetchPlaylistInfo(playlistId);
      if (!info) {
        alert('Failed to fetch playlist information');
        return;
      }
      
      setPlaylistInfo(info);
      
      // Fetch videos
      const fetchedVideos = await youtubeService.fetchVideos(playlistId);
      setVideos(fetchedVideos);
      setLastPlaylistId(playlistId);
      
      // Save to storage with complete video data
      const storedPlaylists = getPlaylists();
      const existingIndex = storedPlaylists.findIndex(p => p.id === playlistId);
      
      const playlistData = {
        id: playlistId,
        title: info.title,
        thumbnail: info.thumbnail,
        lastAccessed: new Date().toISOString(),
        videoCount: fetchedVideos.length,
        videos: fetchedVideos, // Store complete video data for backup
      };
      
      if (existingIndex >= 0) {
        storedPlaylists[existingIndex] = playlistData;
      } else {
        storedPlaylists.push(playlistData);
      }
      
      savePlaylists(storedPlaylists);
      
      console.log('Playlist data fetched and stored:', {
        playlistId,
        title: info.title,
        videoCount: fetchedVideos.length,
        firstVideo: fetchedVideos[0]?.title,
        lastVideo: fetchedVideos[fetchedVideos.length - 1]?.title
      });
      
    } catch (error) {
      console.error('Error fetching playlist:', error);
      alert('Failed to fetch playlist. Please check your API key and playlist ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRefetch = () => {
    fetchPlaylistData(pendingPlaylistId);
    setPendingPlaylistId('');
  };

  const handleRestoreComplete = () => {
    window.location.reload();
  };

  const handlePlaylistSelect = (playlistId: string) => {
    handleFetchPlaylist(playlistId);
  };

  const handleViewModeChange = (newViewMode: ViewMode) => {
    if (newViewMode === viewMode) return;
    
    setIsTransitioning(true);
    
    // Start fade out animation
    setTimeout(() => {
      setViewMode(newViewMode);
      saveViewMode(newViewMode); // Save preference
      
      // Start fade in animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleFilterModeChange = (newFilterMode: FilterMode) => {
    setFilterMode(newFilterMode);
    saveFilterMode(newFilterMode); // Save preference
  };

  // Check if API key is stored on mount
  React.useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setApiKey(decryptApiKey(stored));
    }
  }, []);

  const unavailableCount = videos.filter(v => v.unavailable).length;
  const showViewToggle = unavailableCount > 0 && videos.length > 0;

  // Debug current state for navbar
  console.log('App state for navbar:', {
    hasVideos: videos.length > 0,
    hasPlaylistInfo: !!playlistInfo,
    videoCount: videos.length,
    playlistTitle: playlistInfo?.title
  });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-surface via-surface-container-lowest to-surface-container relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(var(--md-sys-color-primary) / 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgb(var(--md-sys-color-tertiary) / 0.1) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative z-10">
          <Navbar 
            onApiKeyChange={handleApiKeyChange}
            onRestoreComplete={handleRestoreComplete}
            onPlaylistSelect={handlePlaylistSelect}
            currentVideos={videos}
            currentPlaylistInfo={playlistInfo}
          />
          
          <div className="container mx-auto px-16 py-12 max-w-7xl">
            {/* Playlist Fetcher */}
            <div className="mb-12">
              <PlaylistFetcher onFetch={handleFetchPlaylist} isLoading={isLoading} />
            </div>

            {(playlistInfo || isLoading) && (
              <>
                {/* Playlist Header */}
                <div className="mb-12">
                  {isLoading ? (
                    <div className="bg-surface-container/95 blur-light rounded-2xl p-8 animate-pulse">
                      <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-surface-container-high rounded-2xl"></div>
                        <div className="flex-1">
                          <div className="h-8 bg-surface-container-high rounded-lg mb-4 w-3/4"></div>
                          <div className="h-4 bg-surface-container-high rounded-lg mb-2 w-1/2"></div>
                          <div className="h-4 bg-surface-container-high rounded-lg w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ) : playlistInfo && (
                    <PlaylistHeader 
                      playlistInfo={playlistInfo} 
                      unavailableCount={unavailableCount}
                    />
                  )}
                </div>

                {/* Stats Panel */}
                <div className="mb-12">
                  {isLoading ? (
                    <div className="bg-surface-container/95 blur-light rounded-2xl p-6 animate-pulse">
                      <div className="h-6 bg-surface-container-high rounded-lg mb-4 w-1/4"></div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-surface-container-high rounded-2xl p-4">
                            <div className="h-12 bg-surface-container-highest rounded-lg mb-2"></div>
                            <div className="h-6 bg-surface-container-highest rounded-lg mb-1"></div>
                            <div className="h-4 bg-surface-container-highest rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <StatsPanel stats={stats} />
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-4 animate-slide-in-left">
                    <FilterControls
                      filterMode={filterMode}
                      onFilterChange={handleFilterModeChange}
                      unavailableCount={unavailableCount}
                      totalCount={videos.length}
                    />
                  </div>
                  {showViewToggle && (
                    <div className="animate-slide-in-right">
                      <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
                    </div>
                  )}
                </div>

                {/* Videos Display with Smooth Transitions */}
                <div className="mb-12">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-surface-container/95 blur-light rounded-2xl p-4 animate-pulse">
                          <div className="h-48 bg-surface-container-high rounded-lg mb-4"></div>
                          <div className="h-4 bg-surface-container-high rounded-lg mb-2"></div>
                          <div className="h-3 bg-surface-container-high rounded-lg mb-4 w-2/3"></div>
                          <div className="flex gap-2">
                            <div className="flex-1 h-8 bg-surface-container-high rounded-lg"></div>
                            <div className="w-8 h-8 bg-surface-container-high rounded-lg"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : videos.length > 0 && (
                    <div className={`transition-all duration-300 ${
                      isTransitioning 
                        ? 'opacity-0 transform scale-95' 
                        : 'opacity-100 transform scale-100 animate-view-fade-in'
                    }`}>
                      {viewMode === 'grid' ? (
                        <VideoGrid videos={videos} filterMode={filterMode} />
                      ) : (
                        <VideoTable videos={videos} filterMode={filterMode} />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-on-surface-variant text-lg">Analyzing playlist...</p>
              </div>
            )}

            {/* Empty State */}
            {!playlistInfo && !isLoading && (
              <div className="text-center py-16">
                <div className="p-4 bg-surface-container rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Ready to analyze your playlist
                </h3>
                <p className="text-on-surface-variant">
                  Enter your playlist URL above to get started with detailed analysis
                </p>
              </div>
            )}
          </div>

          {/* Confirmation Modal */}
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

          {/* Scroll to Top Button */}
          <ScrollToTop />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;