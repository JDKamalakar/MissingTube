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
    
    // Add smooth transition animation
    const container = document.querySelector('[data-view-container]');
    if (container) {
      container.classList.add('animate-pulse');
      setTimeout(() => {
        container.classList.remove('animate-pulse');
      }, 300);
    }
    
    onViewModeChange(newMode);
  };

  return (
    <div className="relative flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20">
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
        className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-2xl font-medium transition-all duration-225 ${
          viewMode === 'grid'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
        }`}
      >
        <Grid3X3 className={`w-4 h-4 transition-all duration-225 ${
          viewMode === 'grid' ? 'scale-110' : 'hover:rotate-12'
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'grid' ? 'font-semibold' : ''
        }`}>
          Grid
        </span>
      </button>
      
      <button
        onClick={() => handleViewChange('table')}
        className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-2xl font-medium transition-all duration-225 ${
          viewMode === 'table'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
        }`}
      >
        <List className={`w-4 h-4 transition-all duration-225 ${
          viewMode === 'table' ? 'scale-110' : 'hover:scale-110'
        }`} />
        <span className={`transition-all duration-225 ${
          viewMode === 'table' ? 'font-semibold' : ''
        }`}>
          Table
        </span>
      </button>
    </div>
  );
};