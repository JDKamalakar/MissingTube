import React, { useEffect } from 'react';
import { X, Clock, ExternalLink, Trash2, History } from 'lucide-react';
import { getPlaylists, savePlaylists } from '../utils/storage';
import { StoredPlaylist } from '../types';

interface HistoryPanelProps {
  onClose: () => void;
  onPlaylistSelect: (playlistId: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose, onPlaylistSelect }) => {
  const [playlists, setPlaylists] = React.useState<StoredPlaylist[]>([]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const storedPlaylists = getPlaylists();
    // Sort by last accessed date (most recent first)
    const sortedPlaylists = storedPlaylists.sort((a, b) =>
      new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
    );
    setPlaylists(sortedPlaylists);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handlePlaylistClick = (playlistId: string) => {
    onPlaylistSelect(playlistId);
    onClose();
  };

  const handleDeletePlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with more transparency (bg-black/10) and blur */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container: Adjusted max-width for mobile */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-xs sm:max-w-3xl animate-modal-enter elevation-3
                     max-h-[85vh] overflow-y-auto" // Changed max-w-sm to max-w-xs for very small screens
        role="dialog"
        aria-modal="true"
      >
        {/* Title & Button Div: Fixed header */}
        <div className="flex items-center justify-between p-4 sm:p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Modal icon */}
            <div className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-on-surface">Playlist History</h2>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        {/* Content area for history items */}
        <div className="p-4 sm:p-8">
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-surface-container rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">No History Yet</h3>
              <p className="text-sm text-on-surface-variant">
                Analyzed playlists will appear here for quick access
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className="group relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-3 sm:p-4 transition-all duration-300 ease-out cursor-pointer border border-gray-300/30 dark:border-gray-700/30
                             shadow-sm hover:bg-white/30 hover:dark:bg-gray-700/30 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] z-0 hover:z-10"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-xl shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/120x90/e5e7eb/9ca3af?text=No+Image';
                        }}
                      />
                    </div>

                    {/* MODIFIED: Ensure text content can shrink and wrap */}
                    <div className="flex-1 min-w-0 pr-2"> {/* Added pr-2 to create space before action buttons */}
                      <h3 className="font-medium text-on-surface truncate group-hover:text-primary transition-colors duration-225 text-base sm:text-lg">
                        {playlist.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-on-surface-variant">
                        <span className="truncate">{playlist.videoCount} videos</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{formatDate(playlist.lastAccessed)}</span>
                      </div>
                    </div>

                    {/* Action buttons, ensure they don't force width and handle truncation */}
                    <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-225">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank');
                        }}
                        className="w-8 h-8 p-2 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-2xl transition-all duration-300 hover:scale-125 active:scale-95"
                        title="Open in YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                        className="w-8 h-8 p-2 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container rounded-2xl transition-all duration-300 hover:scale-125 active:scale-95 group/delete"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4 transition-all duration-500 group-hover/delete:animate-bounce-short-slow group-hover/delete:scale-[1.1] group-hover/delete:stroke-[2.5px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};