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

  const handleApiKeyChange = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
  }, []);

  const handleFetchPlaylist = async (playlistId: string) => {
    if (playlistId === 'test_test') {
      setIsLoading(true);
      setVideos([]);
      setPlaylistInfo(null);
      
      setTimeout(() => {
        setPlaylistInfo(testData.playlistInfo as PlaylistInfo);
        setVideos(testData.videos as Video[]);
        setLastPlaylistId('test_test');
        setIsLoading(false);
      }, 500);
      return;
    }

    if (!apiKey) {
      console.warn('Please configure your API key first');
      return;
    }

    if (playlistId === lastPlaylistId && videos.length > 0) {
      setPendingPlaylistId(playlistId);
      setShowConfirmation(true);
      return;
    }

    await fetchPlaylistData(playlistId);
  };

  const fetchPlaylistData = async (playlistId: string) => {
    setIsLoading(true);
    setVideos([]);
    setPlaylistInfo(null);
    try {
      const youtubeService = new YouTubeService(apiKey);
      const info = await youtubeService.fetchPlaylistInfo(playlistId);
      if (!info) {
        console.error('Failed to fetch playlist information');
        return;
      }
      setPlaylistInfo(info);
      const fetchedVideos = await youtubeService.fetchVideos(playlistId);
      setVideos(fetchedVideos);
      setLastPlaylistId(playlistId);
      
      const storedPlaylists = getPlaylists();
      const existingIndex = storedPlaylists.findIndex(p => p.id === playlistId);
      
      const playlistData = {
        id: playlistId,
        title: info.title,
        thumbnail: info.thumbnail,
        lastAccessed: new Date().toISOString(),
        videoCount: fetchedVideos.length,
        videos: fetchedVideos,
      };
      
      if (existingIndex >= 0) {
        storedPlaylists[existingIndex] = playlistData;
      } else {
        storedPlaylists.push(playlistData);
      }
      
      savePlaylists(storedPlaylists);
      
    } catch (error) {
      console.error('Error fetching playlist:', error);
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

  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setApiKey(decryptApiKey(stored));
    }
  }, []);

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
                <div className="mb-12">
                  {isLoading ? (
                    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-light rounded-3xl p-8 animate-pulse border border-white/20">
                      <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-white/20 rounded-3xl"></div>
                        <div className="flex-1">
                          <div className="h-8 bg-white/20 rounded-2xl mb-4 w-3/4"></div>
                          <div className="h-4 bg-white/20 rounded-2xl mb-2 w-1/2"></div>
                          <div className="h-4 bg-white/20 rounded-2xl w-1/3"></div>
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

                <div className="mb-12">
                  {isLoading ? (
                    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-light rounded-3xl p-6 animate-pulse border border-white/20">
                      <div className="h-6 bg-white/20 rounded-2xl mb-4 w-1/4"></div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-white/10 rounded-3xl p-4">
                            <div className="h-12 bg-white/20 rounded-2xl mb-2"></div>
                            <div className="h-6 bg-white/20 rounded-2xl mb-1"></div>
                            <div className="h-4 bg-white/20 rounded-2xl"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <StatsPanel stats={stats} />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-4 animate-slide-in-left">
                    {showFilterControls && (
                      <FilterControls
                        filterMode={filterMode}
                        onFilterChange={handleFilterModeChange}
                        unavailableCount={unavailableCount}
                        totalCount={videos.length}
                      />
                    )}
                  </div>
                  {showViewToggle && (
                    <div className="animate-slide-in-right">
                      <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
                    </div>
                  )}
                </div>

                <div className="mb-12">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white/10 dark:bg-black/20 backdrop-blur-light rounded-3xl p-4 animate-pulse border border-white/20">
                          <div className="h-48 bg-white/20 rounded-2xl mb-4"></div>
                          <div className="h-4 bg-white/20 rounded-2xl mb-2"></div>
                          <div className="h-3 bg-white/20 rounded-2xl mb-4 w-2/3"></div>
                          <div className="flex gap-2">
                            <div className="flex-1 h-8 bg-white/20 rounded-2xl"></div>
                            <div className="w-8 h-8 bg-white/20 rounded-2xl"></div>
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

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-white/80 text-lg">Analyzing playlist...</p>
              </div>
            )}

            {!playlistInfo && !isLoading && (
              <div className="text-center py-16">
                <div className="p-6 bg-white/10 dark:bg-black/20 backdrop-blur-light rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center border border-white/20">
                  <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Ready to analyze your playlist
                </h3>
                <p className="text-white/70 text-lg">
                  Enter your playlist URL above to get started with detailed analysis
                </p>
              </div>
            )}
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