import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, X, GitCompare, ChevronDown, Download } from 'lucide-react';
import { Video, PlaylistInfo } from '../types';

interface ComparisonModalProps {
  onClose: () => void;
  currentVideos: Video[];
  currentPlaylistInfo?: PlaylistInfo | null;
}

interface ComparisonResult {
  unavailableMatches: Array<{
    currentIndex: number;
    fileIndex: number;
    currentTitle: string;
    fileTitle: string;
    videoId: string;
    confidence: 100;
  }>;
  allVideos: Array<{
    currentIndex: number;
    fileIndex?: number;
    currentTitle: string;
    fileTitle?: string;
    videoId: string;
    confidence: number;
    isUnavailable: boolean;
    status: 'exact-match' | 'unavailable-match' | 'no-match';
  }>;
  hasNewData: boolean;
  recoveredVideos: Video[];
  mergedVideos: Video[];
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose, currentVideos, currentPlaylistInfo }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUnavailableVideos, setShowUnavailableVideos] = useState(true);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showContent, setShowContent] = useState(false); // State to control modal entry animation
  const [isComparisonView, setIsComparisonView] = useState(false); // Controls which view is active
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Trigger the enter animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 50); // Small delay to allow the modal to mount before animating

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const isUnavailableTitle = (title: string): boolean => {
    const unavailableTitles = [
      'Deleted video',
      'Private video',
      'Unavailable video',
      '[Deleted video]',
      '[Private video]',
      '[Unavailable video]'
    ];
    return unavailableTitles.some(unavailable =>
      title.toLowerCase().includes(unavailable.toLowerCase())
    );
  };

  const handleCompare = async () => {
    if (!file || !currentPlaylistInfo) {
      setError('Please select a file and ensure a current playlist is loaded.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setComparisonResult(null);

    try {
      const fileContent = await file.text();

      if (!fileContent || fileContent.trim().length === 0) {
        throw new Error('The uploaded file is empty. Please select a file with valid JSON content.');
      }

      let fileData;
      try {
        fileData = JSON.parse(fileContent);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error('The uploaded file contains invalid JSON. Please check the file format and try again.');
        }
        throw parseError;
      }

      let fileVideos: any[] = [];
      let filePlaylistInfo: Partial<PlaylistInfo> | null = null;

      if (fileData.playlists && Array.isArray(fileData.playlists) && fileData.playlists.length > 0) {
        const playlist = fileData.playlists[0];
        fileVideos = playlist.videos || [];
        filePlaylistInfo = {
          id: playlist.id,
          title: playlist.title,
          thumbnail: playlist.thumbnail
        };
      } else if (Array.isArray(fileData)) {
        fileVideos = fileData;
        filePlaylistInfo = null;
      } else if (fileData.videos && Array.isArray(fileData.videos)) {
        fileVideos = fileData.videos;
        filePlaylistInfo = {
          id: fileData.id,
          title: fileData.title,
          thumbnail: fileData.thumbnail
        };
      } else {
        throw new Error('Invalid file format. The file must contain video data in a supported format.');
      }

      if (filePlaylistInfo && currentPlaylistInfo.id && filePlaylistInfo.id) {
        if (filePlaylistInfo.id !== currentPlaylistInfo.id) {
          const currentPlaylistName = currentPlaylistInfo.title || 'Current Playlist';
          const filePlaylistName = filePlaylistInfo.title || 'Uploaded File Playlist';

          setError(
            `Wrong playlist file selected. This file is for "${filePlaylistName}", but you are viewing "${currentPlaylistName}".`
          );
          setIsProcessing(false);
          return;
        }
      }

      const unavailableMatches: ComparisonResult['unavailableMatches'] = [];
      const allVideos: ComparisonResult['allVideos'] = [];
      const recoveredVideos: Video[] = [];
      let hasNewData = false;

      const fileVideoMap = new Map<string, Video & { fileIndex: number }>();
      fileVideos.forEach((video, index) => {
        if (video.videoId) {
          fileVideoMap.set(video.videoId, { ...video, fileIndex: index });
        }
      });

      // Create merged videos array with recovered titles
      const mergedVideos: Video[] = currentVideos.map(currentVideo => {
        if (currentVideo.videoId && fileVideoMap.has(currentVideo.videoId)) {
          const fileMatch = fileVideoMap.get(currentVideo.videoId)!;
          
          // If current video is unavailable but file has a proper title
          if ((currentVideo.unavailable || isUnavailableTitle(currentVideo.title)) &&
              !isUnavailableTitle(fileMatch.title)) {
            return {
              ...currentVideo,
              title: fileMatch.title,
              unavailable: false,
              channelTitle: fileMatch.channelTitle || currentVideo.channelTitle
            };
          }
        }
        return currentVideo;
      });

      currentVideos.forEach((currentVideo, currentIndex) => {
        let status: 'exact-match' | 'unavailable-match' | 'no-match' = 'no-match';
        let fileMatch = null;
        let confidence = 0;
        let fileIndexForDisplay: number | undefined = undefined;

        if (currentVideo.videoId && fileVideoMap.has(currentVideo.videoId)) {
          fileMatch = fileVideoMap.get(currentVideo.videoId)!;
          confidence = 100;
          fileIndexForDisplay = fileMatch.fileIndex + 1;

          if (currentVideo.unavailable || isUnavailableTitle(currentVideo.title)) {
            if (!isUnavailableTitle(fileMatch.title)) {
              unavailableMatches.push({
                currentIndex: currentIndex + 1,
                fileIndex: fileMatch.fileIndex + 1,
                currentTitle: currentVideo.title,
                fileTitle: fileMatch.title,
                videoId: currentVideo.videoId,
                confidence: 100
              });

              // Create recovered video entry
              recoveredVideos.push({
                ...currentVideo,
                title: fileMatch.title,
                unavailable: false,
                channelTitle: fileMatch.channelTitle || currentVideo.channelTitle
              });

              status = 'unavailable-match';
              hasNewData = true;
            } else {
              status = 'exact-match';
            }
          } else {
            status = 'exact-match';
          }
        }

        allVideos.push({
          currentIndex: currentIndex + 1,
          fileIndex: fileIndexForDisplay,
          currentTitle: currentVideo.title,
          fileTitle: fileMatch?.title,
          videoId: currentVideo.videoId,
          confidence,
          isUnavailable: currentVideo.unavailable || isUnavailableTitle(currentVideo.title),
          status
        });
      });

      setComparisonResult({
        unavailableMatches,
        allVideos,
        hasNewData,
        recoveredVideos,
        mergedVideos
      });
      setShowUnavailableVideos(true);
      setShowAllVideos(false);
      setIsComparisonView(true); // <-- Set to true after successful comparison

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing the file. Please try again.');
      }
      console.error('Comparison error:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownloadMerged = () => {
    if (!comparisonResult) return;

    const backupData = {
      playlists: [{
        id: currentPlaylistInfo?.id,
        title: `${currentPlaylistInfo?.title || 'Unknown Playlist'} - Complete Merged Data`,
        thumbnail: currentPlaylistInfo?.thumbnail,
        lastAccessed: new Date().toISOString(),
        videoCount: comparisonResult.mergedVideos.length,
        videos: comparisonResult.mergedVideos
      }],
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-complete-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    // Using a clear cyan/teal for consistency
    return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800/50 dark:text-cyan-200';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'exact-match':
        return 'Match';
      case 'unavailable-match':
        return 'Recovered';
      default:
        return 'No Match';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div
        className={`relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-6xl max-h-[90vh] flex flex-col transition-all animate-modal-enter elevation-3
        ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Fixed with transparency and blur */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Icon container with transparency, depth, and hover effects - adjusted scale */}
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group">
              <GitCompare className="w-6 h-6 text-primary transition-transform duration-1000 group-hover:[transform:rotate(-360deg)]" />
            </div>
            {/* MODIFIED: Title and Playlist Info for Mobile View */}
            {/* Using text-center on mobile to stack and center text */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-lg font-semibold text-on-surface leading-tight">
                Compare With Local File
              </h2>
              {currentPlaylistInfo && (
                <p className="text-sm text-on-surface-variant leading-tight">
                  Currently viewing: {currentPlaylistInfo.title}
                </p>
              )}
            </div>
          </div>
          {/* Close button with transparency, depth, and hover effects - now with spin and scale */}
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group" // Added group class
            aria-label="Close modal"
          >
            {/* X icon in red, spins and scales on hover */}
            <X className="w-5 h-5 text-error transition-transform duration-1000 group-hover:[transform:rotate(360deg)] group-hover:scale-110" />
          </button>
        </div>

        {/* Content area with proper overflow handling for slide transition */}
        {/* The main flex container for the "pages" */}
        <div className="p-6 flex-grow relative overflow-x-hidden custom-scrollbar">
          <div className={`flex transition-transform duration-500 ease-in-out h-full
                          ${isComparisonView ? '-translate-x-full' : 'translate-x-0'}`}
               style={{ width: '200%' }}> {/* Always 200% width for the sliding effect */}

            {/* Select File View - Now always takes full width of its container */}
            <div className="w-full flex-shrink-0 space-y-6 px-6">
              <div className="text-center">
                <div className="p-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-md border border-gray-300/30 dark:border-gray-700/30 mb-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.04]">
                  <h3 className="text-lg font-semibold text-on-surface mb-2">
                    Upload JSON File for Comparison
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    Upload a backup file to find titles for any unavailable videos in the current playlist.
                  </p>
                </div>
              </div>

              {currentPlaylistInfo ? (
                <div className="p-4 bg-primary-container/80 dark:bg-primary-dark-container/80 backdrop-blur-md rounded-2xl border border-primary/50 dark:border-primary-dark/50 shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-on-primary-container" />
                    <span className="font-medium text-on-primary-container">Current Playlist Ready</span>
                  </div>
                  <div className="text-sm text-on-primary-container">
                    <div className="font-medium truncate">{currentPlaylistInfo.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {currentVideos.length} videos loaded for comparison
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-error-container/80 dark:bg-error-dark-container/80 backdrop-blur-md rounded-2xl border border-error/50 dark:border-error-dark/50 shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.04]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-on-error-container" />
                    <span className="font-medium text-on-error-container">No Playlist Loaded</span>
                  </div>
                  <p className="text-sm text-on-error-container">
                    Please analyze a playlist before comparing it with a file.
                  </p>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300/30 dark:border-gray-700/30 rounded-2xl p-8 text-center bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-md">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (selectedFile && selectedFile.type === 'application/json') {
                      setFile(selectedFile);
                      setError(null);
                      setComparisonResult(null);
                    } else {
                      setError('Please select a valid JSON file.');
                      setFile(null);
                      setComparisonResult(null);
                    }
                  }}
                  className="hidden"
                />

                <div className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-inner border border-gray-300/30 dark:border-gray-700/30 hover:animate-bounce-short-slow">
                  {/* Upload icon with bounce animation on hover */}
                  <Upload className="w-8 h-8 text-on-surface-variant transition-transform duration-300 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                </div>

                {/* Select JSON File Button with adjusted scale for hover */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!currentPlaylistInfo}
                  className="group px-6 py-3 bg-primary/80 dark:bg-primary-dark/80 backdrop-blur-sm text-on-primary rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-primary/50 dark:border-primary-dark/50"
                >
                  {/* Upload icon with bounce animation on hover (for this specific button) */}
                  <Upload className="w-5 h-5 transition-transform duration-300 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                  Select JSON File
                </button>

                {file && (
                  <div className="mt-4 p-3 bg-cyan-100/80 dark:bg-cyan-800/80 backdrop-blur-md rounded-2xl inline-block shadow-md border border-cyan-500/50 dark:border-cyan-700/50">
                    <div className="flex items-center gap-2 justify-center">
                      <FileText className="w-4 h-4 text-cyan-800 dark:text-cyan-200" />
                      <span className="text-sm font-medium text-cyan-800 dark:text-cyan-200">{file.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-error-container/80 dark:bg-error-dark-container/80 text-on-error-container rounded-2xl shadow-md border border-error/50 dark:border-error/50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Compare Files Button with adjusted scale for hover */}
              <button
                onClick={handleCompare}
                disabled={!file || !currentPlaylistInfo || isProcessing}
                className="group w-full py-3 bg-secondary/80 dark:bg-secondary-dark/80 backdrop-blur-sm text-on-secondary rounded-2xl font-medium hover:bg-secondary/90 dark:hover:bg-secondary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-secondary/50 dark:border-secondary-dark/50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[360deg]" />
                    Compare Files
                  </>
                )}
              </button>
            </div>

            {/* Comparison Results View - Takes full width on mobile, half on desktop */}
            <div className="w-full flex-shrink-0 space-y-6 px-6">
              {comparisonResult && (
                <div className="h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                    <h3 className="text-lg font-semibold text-on-surface">Comparison Results</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      {/* Show "Download All" only if new data was found */}
                      <div className="relative group w-full sm:w-auto">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl shadow-md border border-gray-300/30 dark:border-gray-700/30 py-2 px-4 text-center text-on-surface-variant text-sm whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-top-16 pointer-events-none invisible group-hover:visible">
                            Download Merged Playlist
                        </div>
                        {comparisonResult.hasNewData && (
                          <button
                            onClick={handleDownloadMerged}
                            className="group w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600/80 dark:bg-cyan-700/80 backdrop-blur-sm text-white rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-cyan-600/90 dark:hover:bg-cyan-700/90 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] border border-cyan-500/50 dark:border-cyan-700/50"
                          >
                            {/* Download icon with bounce animation on hover */}
                            <Download className="w-4 h-4 transition-transform duration-300 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                            Download All ({comparisonResult.mergedVideos.length})
                          </button>
                        )}
                      </div>
                      
                      {/* Compare Another Button with adjusted scale for hover */}
                      <div className="relative group w-full sm:w-auto">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl shadow-md border border-gray-300/30 dark:border-gray-700/30 py-2 px-4 text-center text-on-surface-variant text-sm whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-top-16 pointer-events-none invisible group-hover:visible">
                            Upload New File
                        </div>
                        <button
                          onClick={() => {
                            setComparisonResult(null);
                            setFile(null);
                            setError(null);
                            setIsComparisonView(false); // Go back to upload view
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md text-on-surface rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] border border-gray-300/30 dark:border-gray-700/30"
                        >
                          <GitCompare className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[360deg]" />
                          Compare Another
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable content for results, responsive layout */}
                  <div className="flex flex-col sm:flex-row flex-grow gap-6 pb-6 overflow-y-auto custom-scrollbar">
                    {/* Unavailable Videos Section - Subtler hover for the main container */}
                    <div className="w-full sm:flex-1 flex-shrink-0">
                      {comparisonResult.unavailableMatches.length > 0 ? (
                        <div className="bg-primary-container/80 dark:bg-primary-dark-container/80 backdrop-blur-md rounded-2xl border border-primary/50 dark:border-primary-dark/50 shadow-lg transition-all duration-200 hover:scale-[1.005] hover:shadow-xl h-full flex flex-col">
                          <button
                            onClick={() => setShowUnavailableVideos(!showUnavailableVideos)}
                            // MODIFIED: Simplified flex for title and arrow, removed blinker
                            className="group w-full p-4 flex items-center justify-between hover:bg-primary-container/90 dark:hover:bg-primary-dark-container/90 rounded-t-2xl transition-all duration-200"
                          >
                            <h4 className="font-medium text-on-primary-container flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                              Recovered Videos ({comparisonResult.unavailableMatches.length})
                            </h4>
                            {/* Arrow at the end, in line with title */}
                            <div className={`transition-transform duration-200 ${showUnavailableVideos ? 'rotate-180' : ''}`}>
                              <ChevronDown className="w-5 h-5" />
                            </div>
                            {/* REMOVED: Titles Found blinker */}
                          </button>

                          <div className={`transition-all duration-300 ease-out overflow-hidden ${
                            showUnavailableVideos ? 'max-h-screen opacity-100 flex-grow' : 'max-h-0'
                          }`}>
                            <div className="p-4 pt-0 space-y-3 overflow-y-auto custom-scrollbar"> {/* Ensure this has a height if needed */}
                              {comparisonResult.unavailableMatches.map((match, index) => (
                                <div key={index} className="group bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-300/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-[1.04] hover:shadow-md">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium text-on-surface">
                                      Index {match.currentIndex} - Index {match.fileIndex}
                                    </div>
                                    <div className="text-xs px-2 py-1 rounded-lg bg-cyan-100/80 dark:bg-cyan-800/80 text-cyan-800 dark:text-cyan-200 shadow-sm">
                                      100% Match
                                    </div>
                                  </div>
                                  <div className="text-xs text-on-surface-variant space-y-1">
                                    <div className="flex items-center gap-2 text-error">
                                      <AlertTriangle className="w-3 h-3 transition-transform duration-300 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                                      <span className="truncate">Current: {match.currentTitle}</span>
                                    </div>
                                    <div className="truncate font-medium text-cyan-600 dark:text-cyan-400">Recovered: {match.fileTitle}</div>
                                    <div className="text-xs opacity-75">ID: {match.videoId}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-md border border-gray-300/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-[1.005] hover:shadow-xl h-full flex flex-col justify-center">
                          <div className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-inner border border-gray-300/30 dark:border-gray-700/30">
                            <CheckCircle className="w-8 h-8 text-on-surface-variant" />
                          </div>
                          <h3 className="text-lg font-semibold text-on-surface mb-2">No Recoverable Titles Found</h3>
                          <p className="text-on-surface-variant">
                            No unavailable video titles were recovered from the uploaded file.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* All Videos Section - Subtler hover for the main container */}
                    <div className="w-full sm:flex-1 flex-shrink-0">
                      <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-lg transition-all duration-200 hover:scale-[1.005] hover:shadow-xl h-full flex flex-col">
                        <button
                          onClick={() => setShowAllVideos(!showAllVideos)}
                          // MODIFIED: Simplified flex for title and arrow
                          className="group w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-gray-700/30 rounded-t-2xl transition-all duration-200"
                        >
                          <h4 className="font-medium text-on-surface flex items-center gap-2">
                            <FileText className="w-5 h-5 transition-transform duration-300 group-hover:scale-140" />
                            All Videos ({comparisonResult.allVideos.length})
                          </h4>
                          {/* Arrow at the end, in line with title */}
                          <div className={`transition-transform duration-200 ${showAllVideos ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </button>

                        <div className={`transition-all duration-300 ease-out overflow-hidden ${
                          showAllVideos ? 'max-h-screen opacity-100 flex-grow' : 'max-h-0'
                        }`}>
                          <div className="p-4 pt-0 space-y-2 overflow-y-auto custom-scrollbar"> {/* Ensure this has a height if needed */}
                            {comparisonResult.allVideos.map((video, index) => (
                              <div key={index} className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-300/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-[1.04] hover:shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium text-on-surface">
                                    Index {video.currentIndex}
                                    {video.fileIndex && ` - Index ${video.fileIndex}`}
                                  </div>
                                  <div className={`text-xs px-2 py-1 rounded-lg ${getStatusColor(video.status)} shadow-sm`}>
                                    {getStatusLabel(video.status)}
                                  </div>
                                </div>
                                <div className="text-xs text-on-surface-variant space-y-1">
                                  <p className="truncate">Current: {video.currentTitle}</p>
                                  {video.fileTitle && (
                                    <p className="truncate">File: {video.fileTitle}</p>
                                  )}
                                  <p className="text-xs opacity-75">ID: {video.videoId}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};