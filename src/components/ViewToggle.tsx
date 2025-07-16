import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { ViewMode } = from '../types';

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
    <div className="relative flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 w-full sm:w-auto">
      {/* Animated Selector Background */}
      <div 
        className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
          viewMode === 'grid' 
            ? 'left-1 w-[calc(50%-4px)]' 
            : 'left-[50%] w-[calc(50%-4px)]'
        }`}
      />
      
      <button
        onClick={() => handleViewChange('grid')}
        className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target mobile-text-sm
          ${viewMode === 'grid'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary-dark-variant hover:shadow-lg'
          }`}
      >
        <Grid3X3 className={`w-4 h-4 transition-all duration-225 ${
          viewMode === 'grid' ? 'scale-110' : 'group-hover:rotate-12'
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'grid' 
            ? 'font-semibold text-white'
            : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-primary-dark-variant'
        }`}>
          Grid
        </span>
      </button>
      
      <button
        onClick={() => handleViewChange('table')}
        className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target mobile-text-sm
          ${viewMode === 'table'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary-dark-variant hover:shadow-lg'
          }`}
      >
        <List className={`w-4 h-4 transition-all duration-225 ${
          viewMode === 'table' ? 'scale-110' : 'group-hover:-rotate-12' // MODIFIED: Changed group-hover:rotate-12 to group-hover:-rotate-12
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'table' 
            ? 'font-semibold text-white'
            : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-primary-dark-variant'
        }`}>
          Table
        </span>
      </button>
    </div>
  );
};