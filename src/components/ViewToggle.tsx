import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="relative flex items-center bg-surface-container rounded-2xl p-1 shadow-md border border-outline-variant">
      {/* Animated Selector Background */}
      <div 
        className={`absolute top-1 bottom-1 bg-primary-container rounded-2xl transition-all duration-300 ease-out shadow-sm ${
          viewMode === 'grid' 
            ? 'left-1 w-[calc(50%-4px)]' 
            : 'left-[50%] w-[calc(50%-4px)]'
        }`}
      />
      
      <button
        onClick={() => onViewModeChange('grid')}
        className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-2xl font-medium transition-all duration-225 ${
          viewMode === 'grid'
            ? 'text-on-primary-container'
            : 'text-on-surface hover:text-primary hover:bg-primary/8'
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
        onClick={() => onViewModeChange('table')}
        className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-2xl font-medium transition-all duration-225 ${
          viewMode === 'table'
            ? 'text-on-primary-container'
            : 'text-on-surface hover:text-primary hover:bg-primary/8'
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