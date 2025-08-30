import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const handleViewChange = (newMode: ViewMode) => {
    if (newMode === viewMode) return;
    
    const container = document.querySelector('[data-filter-container]') || document.querySelector('[data-view-container]');
    if (container) {
      container.classList.add('opacity-50', 'scale-95');
      setTimeout(() => {
        onViewModeChange(newMode);
        setTimeout(() => {
          container.classList.remove('opacity-50', 'scale-95');
        }, 150);
      }, 150);
    } else {
      onViewModeChange(newMode);
    }
  };

  return (
    <div className="relative flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-xl border border-white/30 dark:border-white/20 w-full sm:w-auto">
      {/* Animated Selector Background */}
      <div 
        className={`absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-primary/80 backdrop-blur-sm rounded-lg sm:rounded-2xl transition-all duration-300 ease-out shadow-sm ${
          viewMode === 'grid' 
            ? 'left-0.5 sm:left-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)]' 
            : 'left-[50%] w-[calc(50%-2px)] sm:w-[calc(50%-4px)]'
        }`}
      />
      
      <button
        onClick={() => handleViewChange('grid')}
        className={`group relative z-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-xs sm:text-sm mobile-button-compact
          ${viewMode === 'grid'
            ? 'text-white' // Active button: white text
            // MODIFIED: Apply hover:text-white for light mode, dark:hover:text-primary for dark mode
            : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/10' 
          }`}
      >
        <Grid3X3 className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-225 ${
          viewMode === 'grid' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary' // MODIFIED: Apply group-hover:text-white for light mode, dark:group-hover:text-primary for dark mode
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'grid' 
            ? 'font-semibold text-white' // Active: bold white text
            : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary' // MODIFIED: Apply group-hover:text-white for light mode, dark:group-hover:text-primary for dark mode
        }`}>
          Grid
        </span>
      </button>
      
      <button
        onClick={() => handleViewChange('table')}
        className={`group relative z-10 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-xs sm:text-sm mobile-button-compact
          ${viewMode === 'table'
            ? 'text-white' // Active button: white text
            // MODIFIED: Apply hover:text-white for light mode, dark:hover:text-primary for dark mode
            : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/10' 
          }`}
      >
        <List className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-225 ${
          viewMode === 'table' ? 'scale-110' : 'group-hover:-rotate-12 group-hover:text-white dark:group-hover:text-primary' // MODIFIED: Apply group-hover:text-white for light mode, dark:group-hover:text-primary for dark mode
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'table' 
            ? 'font-semibold text-white' // Active: bold white text
            : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary' // MODIFIED: Apply group-hover:text-white for light mode, dark:group-hover:text-primary for dark mode
        }`}>
          Table
        </span>
      </button>
    </div>
  );
};