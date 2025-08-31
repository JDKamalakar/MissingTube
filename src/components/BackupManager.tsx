import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { downloadBackup } from '../utils/storage';

interface BackupManagerProps {
  onClose: () => void;
  currentVideos?: any[];
  currentPlaylistInfo?: any;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ onClose, currentVideos = [], currentPlaylistInfo = null }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Enhanced debug logging
    console.log('🎯 BackupManager mounted with data:', {
      hasPlaylistInfo: !!currentPlaylistInfo,
      playlistTitle: currentPlaylistInfo?.title,
      playlistId: currentPlaylistInfo?.id,
      videoCount: currentVideos.length,
      firstVideo: currentVideos[0]?.title,
      lastVideo: currentVideos[currentVideos.length - 1]?.title,
      sampleVideoData: currentVideos.slice(0, 3).map(v => ({
        index: v.index,
        title: v.title,
        unavailable: v.unavailable
      }))
    });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, currentVideos, currentPlaylistInfo]);

  const handleDownloadBackup = () => {
    try {
      console.log('🎬 BackupManager: Initiating download');
      console.log('📊 Data being passed to download:', {
        videosCount: currentVideos.length,
        playlistTitle: currentPlaylistInfo?.title,
        hasCompleteData: !!(currentVideos.length > 0 && currentPlaylistInfo)
      });

      // Create a deep copy to ensure data integrity
      const videosCopy = currentVideos.map(video => ({ ...video }));
      const playlistCopy = currentPlaylistInfo ? { ...currentPlaylistInfo } : null;

      console.log('📋 Copied data verification:', {
        originalCount: currentVideos.length,
        copyCount: videosCopy.length,
        firstVideoMatch: currentVideos[0]?.title === videosCopy[0]?.title,
        playlistTitleMatch: currentPlaylistInfo?.title === playlistCopy?.title
      });

      // Call download with copied data
      downloadBackup(videosCopy, playlistCopy);

      setDownloadStatus('success');
      setDownloadMessage('Download Completed Successfully!');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Download error:', error);
      setDownloadStatus('error');
      setDownloadMessage('Failed To Create Download');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  // Check if we have current data
  const hasCurrentData = currentVideos.length > 0 && currentPlaylistInfo;
  const videoCount = currentVideos.length;
  const availableCount = currentVideos.filter(v => !v.unavailable).length;
  const unavailableCount = currentVideos.filter(v => v.unavailable).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with more transparency (bg-black/10) and blur */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container: Replaced with Code 1's transparency and blur */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        {/* Title & Button Div: Replaced with Code 1's fixed header with transparency and blur */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm"> {/* Added border-b and shadow-sm for separator effect */}
          <div className="flex items-center gap-3">
            {/* Modal icon with transparency, depth, and scale on hover */}
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group">
              <Download className="w-6 h-6 text-primary transition-transform duration-1000 group-hover:animate-bounce-short-slow" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Download Data</h2>
          </div>
          {/* Close button with p-3 padding, transparency, depth, and red 'X' - now with spin and scale */}
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group" // Added group class
            aria-label="Close modal"
          >
            {/* X icon in red, spins and scales on hover */}
            <X className="w-5 h-5 text-error transition-transform duration-1000 group-hover:[transform:rotate(360deg)] group-hover:scale-110" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Download Playlist Data text card */}
            <div className="group relative text-center p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.08] z-0 hover:z-10">
              <h3 className="text-lg font-semibold text-on-surface mb-2">
                Download Playlist Data
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Create a JSON file containing your analyzed playlist data including all video information and metadata.
              </p>
            </div>

            {/* Current Data Status Card */}
            {hasCurrentData ? (
              <div className="group relative p-4 bg-tertiary-container/20 backdrop-blur-lg rounded-2xl border border-tertiary/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.08] z-0 hover:z-10">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-on-tertiary-container" />
                  <span className="font-medium text-on-tertiary-container">Ready to Download</span>
                </div>
                <div className="space-y-2 text-sm text-on-tertiary-container">
                  <div className="font-medium truncate">{currentPlaylistInfo.title}</div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{videoCount} total videos</span>
                    <span>•</span>
                    <span>{availableCount} available</span>
                    <span>•</span>
                    <span>{unavailableCount} unavailable</span>
                  </div>
                  <div className="text-xs opacity-75 mt-2">
                    Latest analysis data with complete video information
                  </div>
                </div>
              </div>
            ) : (
              <div className="group relative p-4 bg-warning-container/20 backdrop-blur-lg rounded-2xl border border-warning/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.08] z-0 hover:z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">No Current Data</span>
                </div>
                <p className="text-sm">
                  Please analyze a playlist first to download its data.
                </p>
              </div>
            )}

            <button
              onClick={handleDownloadBackup}
              disabled={!hasCurrentData}
              className="group w-full flex items-center justify-center gap-3 py-4 px-6 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.08] active:scale-[0.98]"
            >
              {/* Added group-hover:animate-bounce-short-slow to the Download icon */}
              <Download className="w-5 h-5 transition-all duration-500 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
              {hasCurrentData ? 'Download Current Data' : 'No Data Available'}
            </button>

            {downloadStatus !== 'idle' && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fade-in backdrop-blur-lg shadow-md ${
                downloadStatus === 'success'
                  ? 'bg-tertiary-container/20 text-on-tertiary-container border border-tertiary/30'
                  : 'bg-error-container/20 text-on-error-container border border-error/30'
              }`}>
                {downloadStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{downloadMessage}</span>
              </div>
            )}

            {/* What's Included Info Card */}
            <div className="group relative text-xs text-on-surface-variant bg-surface-container/20 backdrop-blur-lg rounded-2xl p-4 border border-outline-variant/30 shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.08] z-0 hover:z-10">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4" />
                <span className="font-medium">What's included:</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>• Complete playlist metadata and information</li>
                <li>• All video titles, durations, and thumbnails</li>
                <li>• Unavailable video detection and status</li>
                <li>• Channel information for each video</li>
                <li>• Analysis timestamp and version info</li>
                <li>• JSON format for easy data processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};