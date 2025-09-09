// src/components/ComparisonModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { GitCompare, X } from 'lucide-react';
import { Video, PlaylistInfo } from '../types';
import { FileUploadView } from './FileUploadView';
import { ComparisonResultView } from './ComparisonResultView';

interface ComparisonModalProps {
  onClose: () => void;
  currentVideos: Video[];
  currentPlaylistInfo?: PlaylistInfo | null;
}

// Export this interface so child components can use it
export interface ComparisonResult {
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
  const [showContent, setShowContent] = useState(false);
  const [isComparisonView, setIsComparisonView] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.classList.add('overflow-hidden');

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('overflow-hidden');
    };
  }, [onClose]);
  
  const isUnavailableTitle = (title: string): boolean => {
    const unavailableTitles = ['Deleted video', 'Private video', 'Unavailable video', '[Deleted video]', '[Private video]', '[Unavailable video]'];
    return unavailableTitles.some(unavailable => title.toLowerCase().includes(unavailable.toLowerCase()));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleBackToUpload = () => {
    setComparisonResult(null);
    setFile(null);
    setError(null);
    setIsComparisonView(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        if (!fileContent.trim()) throw new Error('The uploaded file is empty.');

        let fileData;
        try {
            fileData = JSON.parse(fileContent);
        } catch (e) {
            throw new Error('The uploaded file contains invalid JSON.');
        }

        let fileVideos: any[] = [];
        let filePlaylistInfo: Partial<PlaylistInfo> | null = null;

        if (fileData.playlists?.[0]) {
            const playlist = fileData.playlists[0];
            fileVideos = playlist.videos || [];
            filePlaylistInfo = { id: playlist.id, title: playlist.title };
        } else if (Array.isArray(fileData)) {
            fileVideos = fileData;
        } else if (fileData.videos) {
            fileVideos = fileData.videos;
            filePlaylistInfo = { id: fileData.id, title: fileData.title };
        } else {
            throw new Error('Invalid file format.');
        }

        if (filePlaylistInfo?.id && currentPlaylistInfo.id && filePlaylistInfo.id !== currentPlaylistInfo.id) {
            const currentName = currentPlaylistInfo.title || 'Current';
            const fileName = filePlaylistInfo.title || 'Uploaded';
            throw new Error(`Wrong playlist file. File is for "${fileName}", but you are viewing "${currentName}".`);
        }

        const unavailableMatches: ComparisonResult['unavailableMatches'] = [];
        const allVideos: ComparisonResult['allVideos'] = [];
        const recoveredVideos: Video[] = [];
        let hasNewData = false;
        
        const fileVideoMap = new Map<string, Video & { fileIndex: number }>(fileVideos.map((v, i) => [v.videoId, { ...v, fileIndex: i }]));
        
        const mergedVideos: Video[] = currentVideos.map(currentVideo => {
            const fileMatch = fileVideoMap.get(currentVideo.videoId);
            if (fileMatch && (currentVideo.unavailable || isUnavailableTitle(currentVideo.title)) && !isUnavailableTitle(fileMatch.title)) {
                return { ...currentVideo, title: fileMatch.title, unavailable: false, channelTitle: fileMatch.channelTitle || currentVideo.channelTitle };
            }
            return currentVideo;
        });

        currentVideos.forEach((currentVideo, currentIndex) => {
            const fileMatch = fileVideoMap.get(currentVideo.videoId);
            let status: ComparisonResult['allVideos'][0]['status'] = 'no-match';
            let confidence = 0;

            if (fileMatch) {
                confidence = 100;
                if ((currentVideo.unavailable || isUnavailableTitle(currentVideo.title)) && !isUnavailableTitle(fileMatch.title)) {
                    status = 'unavailable-match';
                    hasNewData = true;
                    unavailableMatches.push({
                        currentIndex: currentIndex + 1,
                        fileIndex: fileMatch.fileIndex + 1,
                        currentTitle: currentVideo.title,
                        fileTitle: fileMatch.title,
                        videoId: currentVideo.videoId,
                        confidence: 100,
                    });
                    recoveredVideos.push({ ...currentVideo, title: fileMatch.title, unavailable: false, channelTitle: fileMatch.channelTitle || currentVideo.channelTitle });
                } else {
                    status = 'exact-match';
                }
            }

            allVideos.push({
                currentIndex: currentIndex + 1,
                fileIndex: fileMatch ? fileMatch.fileIndex + 1 : undefined,
                currentTitle: currentVideo.title,
                fileTitle: fileMatch?.title,
                videoId: currentVideo.videoId,
                confidence,
                isUnavailable: currentVideo.unavailable || isUnavailableTitle(currentVideo.title),
                status
            });
        });

        setComparisonResult({ unavailableMatches, allVideos, hasNewData, recoveredVideos, mergedVideos });
        setIsComparisonView(true);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDownloadMerged = () => {
    if (!comparisonResult || !currentPlaylistInfo) return;

    const backupData = {
      playlists: [{
        id: currentPlaylistInfo.id,
        title: `${currentPlaylistInfo.title} - Merged`,
        thumbnail: currentPlaylistInfo.thumbnail,
        lastAccessed: new Date().toISOString(),
        videoCount: comparisonResult.mergedVideos.length,
        videos: comparisonResult.mergedVideos,
      }],
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-data-${currentPlaylistInfo.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-6xl max-h-[90vh] flex flex-col transition-all animate-modal-enter elevation-3 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 group">
              <GitCompare className="w-6 h-6 text-primary transition-transform duration-1000 group-hover:[transform:rotate(-360deg)]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-lg font-semibold text-on-surface leading-tight">Compare With Local File</h2>
              {currentPlaylistInfo && <p className="text-sm text-on-surface-variant leading-tight">Currently viewing: {currentPlaylistInfo.title}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-error transition-transform duration-1000 group-hover:[transform:rotate(360deg)] group-hover:scale-110" />
          </button>
        </div>

        <div className="p-6 flex-grow relative overflow-x-hidden">
          <div className={`flex transition-transform duration-500 ease-in-out h-full ${isComparisonView ? '-translate-x-full' : 'translate-x-0'}`} style={{ width: '200%' }}>
            {/* View 1: File Upload */}
            <FileUploadView
                file={file}
                currentPlaylistInfo={currentPlaylistInfo}
                currentVideos={currentVideos}
                isProcessing={isProcessing}
                error={error}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onCompare={handleCompare}
            />
            
            {/* View 2: Comparison Results */}
            {comparisonResult && (
                <ComparisonResultView
                    comparisonResult={comparisonResult}
                    onCompareAnother={handleBackToUpload}
                    onDownloadMerged={handleDownloadMerged}
                />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};