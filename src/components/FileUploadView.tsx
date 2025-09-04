// src/components/FileUploadView.tsx

import React from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, GitCompare } from 'lucide-react';
import { Video, PlaylistInfo } from '../types';

interface FileUploadViewProps {
  file: File | null;
  currentPlaylistInfo: PlaylistInfo | null;
  currentVideos: Video[];
  isProcessing: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCompare: () => void;
}

export const FileUploadView: React.FC<FileUploadViewProps> = ({
  file,
  currentPlaylistInfo,
  currentVideos,
  isProcessing,
  error,
  fileInputRef,
  onFileChange,
  onCompare,
}) => {
  return (
    <div className="w-full flex-shrink-0 space-y-6 p-6">
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
          onChange={onFileChange}
          className="hidden"
        />
        <div className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-inner border border-gray-300/30 dark:border-gray-700/30 group">
          <Upload className="w-8 h-8 text-on-surface-variant transition-transform duration-300 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px] group-hover:animate-bounce-short-slow" />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!currentPlaylistInfo}
          className="group px-6 py-3 bg-primary/80 dark:bg-primary-dark/80 backdrop-blur-sm text-on-primary rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-primary/50 dark:border-primary-dark/50"
        >
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

      <button
        onClick={onCompare}
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
            <GitCompare className="w-5 h-5 transition-transform duration-1000 group-hover:rotate-[360deg]" />
            Compare Files
          </>
        )}
      </button>
    </div>
  );
};