// src/components/ComparisonResultView.tsx

import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, GitCompare, ChevronDown, Download } from 'lucide-react';
import { ComparisonResult } from './ComparisonModal'; // Assuming type is exported from parent

interface ComparisonResultViewProps {
  comparisonResult: ComparisonResult;
  onCompareAnother: () => void;
  onDownloadMerged: () => void;
}

export const ComparisonResultView: React.FC<ComparisonResultViewProps> = ({
  comparisonResult,
  onCompareAnother,
  onDownloadMerged,
}) => {
  const [showUnavailableVideos, setShowUnavailableVideos] = useState(true);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const getStatusColor = (status: string) => {
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
    <div className="w-full flex-shrink-0 px-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <h3 className="text-lg font-semibold text-on-surface">Comparison Results</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {comparisonResult.hasNewData && (
              <div className="relative group w-full sm:w-auto">
                <button
                    onClick={onDownloadMerged}
                    className="group w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600/80 dark:bg-cyan-700/80 backdrop-blur-sm text-white rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-cyan-600/90 dark:hover:bg-cyan-700/90 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] border border-cyan-500/50 dark:border-cyan-700/50"
                >
                    <Download className="w-4 h-4 transition-transform duration-300 group-hover:animate-bounce-short-slow" />
                    Download All ({comparisonResult.mergedVideos.length})
                </button>
              </div>
          )}
          <div className="relative group w-full sm:w-auto">
            <button
              onClick={onCompareAnother}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md text-on-surface rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-white/30 hover:dark:bg-gray-700/30 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] border border-gray-300/30 dark:border-gray-700/30"
            >
              <GitCompare className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[360deg]" />
              Compare Another
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-6 pb-6 overflow-y-auto custom-scrollbar">
        
        {/* Recovered Videos Section (Top) */}
        <div className="w-full flex-shrink-0">
          {comparisonResult.unavailableMatches.length > 0 ? (
            <div className="bg-primary-container/80 dark:bg-primary-dark-container/80 backdrop-blur-md rounded-2xl border border-primary/50 dark:border-primary-dark/50 shadow-lg h-full flex flex-col">
              <button
                onClick={() => setShowUnavailableVideos(!showUnavailableVideos)}
                className={`group w-full p-4 flex items-center justify-between hover:bg-primary-container/90 dark:hover:bg-primary-dark-container/90 transition-all duration-200 ${
                  showUnavailableVideos ? 'rounded-t-2xl' : 'rounded-2xl'
                }`}
              >
                <h4 className="font-medium text-on-primary-container flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recovered Videos ({comparisonResult.unavailableMatches.length})
                </h4>
                <div className={`transition-transform duration-200 ${showUnavailableVideos ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              <div className={`transition-all duration-700 ease-out overflow-hidden ${showUnavailableVideos ? 'max-h-screen opacity-100 flex-grow' : 'max-h-0'}`}>
                <div className="p-4 pt-2">
                  <div className="bg-white/20 dark:bg-gray-800/20 p-4 backdrop-blur-lg rounded-2xl flex flex-col gap-0.5 border border-gray-300/30 dark:border-gray-700/30 overflow-hidden">
                    {comparisonResult.unavailableMatches.map((match, index) => {
                      const isFirst = index === 0;
                      const isLast = index === comparisonResult.unavailableMatches.length - 1;
                      const cornerClass = isFirst ? 'rounded-t-xl' : isLast ? 'rounded-b-xl' : '';

                      return (
                        <div 
                          key={index} 
                          className={`group bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-3 rounded-sm transition-all duration-300 transform origin-center hover:scale-105 hover:-translate-y-1 z-0 hover:z-10 ${cornerClass}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium text-on-surface">Index {match.currentIndex} - Index {match.fileIndex}</div>
                              <div className="text-xs px-2 py-1 rounded-lg bg-cyan-100/80 dark:bg-cyan-800/80 text-cyan-800 dark:text-cyan-200 shadow-sm">100% Match</div>
                          </div>
                          <div className="text-xs text-on-surface-variant space-y-1">
                              <div className="flex items-center gap-2 text-error"><AlertTriangle className="w-3 h-3" /><span className="truncate">Current: {match.currentTitle}</span></div>
                              <div className="truncate font-medium text-cyan-600 dark:text-cyan-400">Recovered: {match.fileTitle}</div>
                              <div className="text-xs opacity-75">ID: {match.videoId}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-md border border-gray-300/30 dark:border-gray-700/30 h-full flex flex-col justify-center">
              <div className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-inner border border-gray-300/30 dark:border-gray-700/30">
                  <CheckCircle className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">No Recoverable Titles Found</h3>
              <p className="text-on-surface-variant">No unavailable video titles were recovered.</p>
            </div>
          )}
        </div>

        {/* All Videos Section (Bottom) */}
        <div className="w-full flex-shrink-0">
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-lg h-full flex flex-col">
            <button
              onClick={() => setShowAllVideos(!showAllVideos)}
              className={`group w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                showAllVideos ? 'rounded-t-2xl' : 'rounded-2xl'
              }`}
            >
              <h4 className="font-medium text-on-surface flex items-center gap-2"><FileText className="w-5 h-5" />All Videos ({comparisonResult.allVideos.length})</h4>
              <div className={`transition-transform duration-200 ${showAllVideos ? 'rotate-180' : ''}`}><ChevronDown className="w-5 h-5" /></div>
            </button>
            <div className={`transition-all duration-700 ease-out overflow-hidden ${showAllVideos ? 'max-h-screen opacity-100 flex-grow' : 'max-h-0'}`}>
              <div className="p-4 pt-2">
                <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg p-4 rounded-2xl flex flex-col gap-0.5 border border-gray-300/30 dark:border-gray-700/30 overflow-hidden">
                  {comparisonResult.allVideos.map((video, index) => {
                    const isFirst = index === 0;
                    const isLast = index === comparisonResult.allVideos.length - 1;
                    const cornerClass = isFirst ? 'rounded-t-xl' : isLast ? 'rounded-b-xl' : '';

                    return (
                      <div 
                        key={index}
                        className={`group bg-white/30 dark:bg-gray-800/30 rounded-sm backdrop-blur-sm p-3 transition-all duration-300 transform origin-center hover:scale-[20px] hover:-translate-y-1 z-0 hover:z-10 ${cornerClass}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-on-surface">Index {video.currentIndex}{video.fileIndex && ` - Index ${video.fileIndex}`}</div>
                          <div className={`text-xs px-2 py-1 rounded-lg ${getStatusColor(video.status)} shadow-sm`}>{getStatusLabel(video.status)}</div>
                        </div>
                        <div className="text-xs text-on-surface-variant space-y-1">
                          <p className="truncate">Current: {video.currentTitle}</p>
                          {video.fileTitle && (<p className="truncate">File: {video.fileTitle}</p>)}
                          <p className="text-xs opacity-75">ID: {video.videoId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};