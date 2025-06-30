import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, X, GitCompare, ChevronDown, ChevronUp } from 'lucide-react';
import { Video } from '../types';

interface ComparisonModalProps {
  onClose: () => void;
  currentVideos: Video[];
}

interface ComparisonResult {
  exactMatches: Array<{
    currentIndex: number;
    fileIndex: number;
    currentTitle: string;
    fileTitle: string;
    videoId: string;
    confidence: 100;
  }>;
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
    currentTitle: string;
    fileTitle?: string;
    videoId: string;
    confidence: number;
    isUnavailable: boolean;
    status: 'exact-match' | 'unavailable-match' | 'no-match';
  }>;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose, currentVideos }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExactMatches, setShowExactMatches] = useState(false); // Minimized by default
  const [showUnavailableMatches, setShowUnavailableMatches] = useState(true); // Expanded by default
  const [showAllVideos, setShowAllVideos] = useState(true); // Expanded by default
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid JSON file');
    }
  };

  const extractPlaylistId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('list');
    } catch {
      return null;
    }
  };

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
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const fileContent = await file.text();
      
      // Check if file content is empty or only whitespace
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
      
      // Extract videos and playlist info from file data
      let fileVideos: any[] = [];
      let filePlaylistId: string | null = null;
      
      if (fileData.playlists && fileData.playlists.length > 0) {
        // Backup format
        const playlist = fileData.playlists[0];
        fileVideos = playlist.videos || [];
        filePlaylistId = playlist.id;
      } else if (Array.isArray(fileData)) {
        // Direct video array
        fileVideos = fileData;
      } else if (fileData.videos) {
        // Object with videos property
        fileVideos = fileData.videos;
        filePlaylistId = fileData.id;
      } else {
        throw new Error('Invalid file format. The file must contain video data in a supported format.');
      }

      // Get current playlist ID (assuming it's available from the first video's URL or stored somewhere)
      const currentPlaylistId = currentVideos.length > 0 ? 
        extractPlaylistId(window.location.href) || 'current' : null;

      // Check if playlist IDs match (if both are available)
      if (filePlaylistId && currentPlaylistId && filePlaylistId !== currentPlaylistId) {
        setError(`Wrong playlist file. The uploaded file contains data for playlist "${filePlaylistId}" but you're currently viewing a different playlist.`);
        setIsProcessing(false);
        return;
      }

      const exactMatches: ComparisonResult['exactMatches'] = [];
      const unavailableMatches: ComparisonResult['unavailableMatches'] = [];
      const allVideos: ComparisonResult['allVideos'] = [];

      // Create a map of file videos by video ID for quick lookup
      const fileVideoMap = new Map();
      fileVideos.forEach((video, index) => {
        if (video.videoId) {
          fileVideoMap.set(video.videoId, { ...video, fileIndex: index });
        }
      });

      // Process each current video
      currentVideos.forEach((currentVideo, currentIndex) => {
        let status: 'exact-match' | 'unavailable-match' | 'no-match' = 'no-match';
        let fileMatch = null;
        let confidence = 0;

        // Try to find match by video ID
        if (currentVideo.videoId && fileVideoMap.has(currentVideo.videoId)) {
          fileMatch = fileVideoMap.get(currentVideo.videoId);
          confidence = 100;

          if (currentVideo.unavailable) {
            // Current is unavailable but we found a match by video ID
            if (!isUnavailableTitle(fileMatch.title)) {
              // File has real title, current is unavailable - this is a match
              unavailableMatches.push({
                currentIndex: currentIndex + 1,
                fileIndex: fileMatch.fileIndex + 1,
                currentTitle: currentVideo.title,
                fileTitle: fileMatch.title,
                videoId: currentVideo.videoId,
                confidence: 100
              });
              status = 'unavailable-match';
            } else {
              // Both are unavailable titles - still a match but different category
              exactMatches.push({
                currentIndex: currentIndex + 1,
                fileIndex: fileMatch.fileIndex + 1,
                currentTitle: currentVideo.title,
                fileTitle: fileMatch.title,
                videoId: currentVideo.videoId,
                confidence: 100
              });
              status = 'exact-match';
            }
          } else {
            // Current is available and we found a match by video ID
            exactMatches.push({
              currentIndex: currentIndex + 1,
              fileIndex: fileMatch.fileIndex + 1,
              currentTitle: currentVideo.title,
              fileTitle: fileMatch.title,
              videoId: currentVideo.videoId,
              confidence: 100
            });
            status = 'exact-match';
          }
        }

        // Add to all videos list
        allVideos.push({
          currentIndex: currentIndex + 1,
          currentTitle: currentVideo.title,
          fileTitle: fileMatch?.title,
          videoId: currentVideo.videoId,
          confidence,
          isUnavailable: currentVideo.unavailable,
          status
        });
      });

      setComparisonResult({ exactMatches, unavailableMatches, allVideos });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exact-match':
        return 'bg-tertiary-container text-on-tertiary-container';
      case 'unavailable-match':
        return 'bg-primary-container text-on-primary-container';
      default:
        return 'bg-error-container text-on-error-container';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'exact-match':
        return 'Match';
      case 'unavailable-match':
        return 'Unavailable Match';
      default:
        return 'No Match';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with navbar-like blur */}
      <div 
        className="fixed inset-0 bg-scrim/60 blur-subtle transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal with navbar-like transparency */}
      <div 
        className="relative bg-surface/90 blur-light rounded-2xl shadow-2xl border border-outline-variant w-full max-w-5xl max-h-[90vh] animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-container rounded-2xl">
              <GitCompare className="w-6 h-6 text-on-primary-container" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">Compare With Local File</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-2xl transition-all duration-225 hover:scale-110 active:scale-95 text-on-surface-variant hover:text-on-surface"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-6">
            {!comparisonResult && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-on-surface mb-2">
                    Upload JSON File for Comparison
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Upload a JSON file containing video data to compare with the current playlist.
                    Comparison is based on video IDs and will identify exact matches and unavailable video recoveries.
                  </p>
                </div>

                <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="p-4 bg-surface-container rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-on-surface-variant" />
                  </div>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 transition-all duration-225 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Select JSON File
                  </button>
                  
                  {file && (
                    <div className="mt-4 p-3 bg-tertiary-container/70 backdrop-blur-sm rounded-2xl">
                      <div className="flex items-center gap-2 justify-center">
                        <FileText className="w-4 h-4 text-on-tertiary-container" />
                        <span className="text-sm font-medium text-on-tertiary-container">{file.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {file && (
                  <button
                    onClick={handleCompare}
                    disabled={isProcessing}
                    className="w-full py-3 bg-secondary text-on-secondary rounded-2xl font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <GitCompare className="w-5 h-5" />
                        Compare Files
                      </>
                    )}
                  </button>
                )}

                {error && (
                  <div className="p-4 bg-error-container/70 backdrop-blur-sm text-on-error-container rounded-2xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-on-surface-variant bg-surface-container/70 backdrop-blur-sm rounded-2xl p-4">
                  <p className="mb-2">
                    <strong>How comparison works:</strong>
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Matches videos by their unique video IDs</li>
                    <li>• Identifies exact matches (100% confidence)</li>
                    <li>• Finds titles for unavailable videos</li>
                    <li>• Validates playlist compatibility</li>
                  </ul>
                </div>
              </>
            )}

            {comparisonResult && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-on-surface">Comparison Results</h3>
                  <button
                    onClick={() => {
                      setComparisonResult(null);
                      setFile(null);
                      setError(null);
                    }}
                    className="px-4 py-2 bg-surface-container/70 backdrop-blur-sm text-on-surface rounded-2xl font-medium hover:bg-surface-container-high transition-all duration-225"
                  >
                    Compare Another File
                  </button>
                </div>

                {/* All Videos - Expanded by default */}
                <div className="bg-surface-container/70 backdrop-blur-sm rounded-2xl border border-outline-variant">
                  <button
                    onClick={() => setShowAllVideos(!showAllVideos)}
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-container-high transition-all duration-225 rounded-t-2xl"
                  >
                    <h4 className="font-medium text-on-surface flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      All Videos ({comparisonResult.allVideos.length})
                    </h4>
                    {showAllVideos ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showAllVideos && (
                    <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                      {comparisonResult.allVideos.map((video, index) => (
                        <div key={index} className="bg-surface rounded-2xl p-3 border border-outline-variant">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-on-surface">
                              Index {video.currentIndex}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(video.status)}`}>
                                {getStatusLabel(video.status)}
                              </div>
                              {video.confidence > 0 && (
                                <div className="text-xs px-2 py-1 rounded-full bg-tertiary text-on-tertiary">
                                  {video.confidence}%
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-on-surface-variant space-y-1">
                            <div className="flex items-center gap-2">
                              {video.isUnavailable && (
                                <AlertTriangle className="w-3 h-3 text-error" />
                              )}
                              <span className="truncate">Current: {video.currentTitle}</span>
                            </div>
                            {video.fileTitle && (
                              <div className="truncate">File: {video.fileTitle}</div>
                            )}
                            <div className="text-xs opacity-75">ID: {video.videoId}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Exact Matches - Minimized by default */}
                {comparisonResult.exactMatches.length > 0 && (
                  <div className="bg-tertiary-container/70 backdrop-blur-sm rounded-2xl border border-tertiary">
                    <button
                      onClick={() => setShowExactMatches(!showExactMatches)}
                      className="w-full p-4 flex items-center justify-between hover:bg-tertiary-container transition-all duration-225 rounded-t-2xl"
                    >
                      <h4 className="font-medium text-on-tertiary-container flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Exact Matches ({comparisonResult.exactMatches.length})
                      </h4>
                      {showExactMatches ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showExactMatches && (
                      <div className="p-4 pt-0 space-y-3 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        {comparisonResult.exactMatches.map((match, index) => (
                          <div key={index} className="bg-surface-container/70 backdrop-blur-sm rounded-2xl p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium text-on-surface">
                                Index {match.currentIndex} ↔ Index {match.fileIndex}
                              </div>
                              <div className="text-xs px-2 py-1 rounded-full bg-tertiary text-on-tertiary">
                                100% match
                              </div>
                            </div>
                            <div className="text-xs text-on-surface-variant space-y-1">
                              <div className="truncate">Current: {match.currentTitle}</div>
                              <div className="truncate">File: {match.fileTitle}</div>
                              <div className="text-xs opacity-75">ID: {match.videoId}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Unavailable Matches - Expanded by default */}
                {comparisonResult.unavailableMatches.length > 0 && (
                  <div className="bg-primary-container/70 backdrop-blur-sm rounded-2xl border border-primary">
                    <button
                      onClick={() => setShowUnavailableMatches(!showUnavailableMatches)}
                      className="w-full p-4 flex items-center justify-between hover:bg-primary-container transition-all duration-225 rounded-t-2xl"
                    >
                      <h4 className="font-medium text-on-primary-container flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Matched Unavailable Videos ({comparisonResult.unavailableMatches.length})
                      </h4>
                      {showUnavailableMatches ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showUnavailableMatches && (
                      <div className="p-4 pt-0 space-y-3 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        {comparisonResult.unavailableMatches.map((match, index) => (
                          <div key={index} className="bg-surface-container/70 backdrop-blur-sm rounded-2xl p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium text-on-surface">
                                Index {match.currentIndex} ↔ Index {match.fileIndex}
                              </div>
                              <div className="text-xs px-2 py-1 rounded-full bg-primary text-on-primary">
                                100% match
                              </div>
                            </div>
                            <div className="text-xs text-on-surface-variant space-y-1">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-error" />
                                <span className="truncate">Current: {match.currentTitle}</span>
                              </div>
                              <div className="truncate">File: {match.fileTitle}</div>
                              <div className="text-xs opacity-75">ID: {match.videoId}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {comparisonResult.exactMatches.length === 0 && comparisonResult.unavailableMatches.length === 0 && (
                  <div className="text-center py-8">
                    <div className="p-4 bg-surface-container rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <h3 className="text-lg font-semibold text-on-surface mb-2">No Matches Found</h3>
                    <p className="text-on-surface-variant">
                      No video ID matches were found between the current playlist and the uploaded file.
                      This might indicate different playlists or incompatible data formats.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};