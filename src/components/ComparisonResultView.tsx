// src/components/ComparisonModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { GitCompare, X } from 'lucide-react';
import { Video, PlaylistInfo } from '../types';
import { FileUploadView } from './FileUploadView';
import { ComparisonResultView } from './ComparisonResultView';

// ... (interfaces remain the same) ...
export interface ComparisonResult { /* ... */ }

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose, currentVideos, currentPlaylistInfo }) => {
  // ... (all state and logic remains the same) ...

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
        {/* Header is unchanged */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0">
            {/* ... header content ... */}
        </div>

        {/* MODIFIED: Removed `p-6` from this container */}
        <div className="flex-grow relative overflow-x-hidden">
          <div className={`flex transition-transform duration-500 ease-in-out h-full ${isComparisonView ? '-translate-x-full' : 'translate-x-0'}`} style={{ width: '200%' }}>
            
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