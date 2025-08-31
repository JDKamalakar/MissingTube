import React, { useEffect, useRef } from 'react';
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

  const viewOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3 },
    { mode: 'table' as ViewMode, label: 'Table', icon: List },
  ];

  return (
    <div className="relative flex w-full sm:w-auto items-center rounded-2xl border border-white/30 bg-white/30 p-1 shadow-xl backdrop-blur-heavy dark:border-white/20 dark:bg-black/40">
      {/* Animated Selector Background */}
      <div className={`absolute top-1 bottom-1 rounded-2xl bg-primary/80 shadow-sm transition-all duration-300 ease-out backdrop-blur-sm ${viewMode === 'grid' ? 'left-1 w-[calc(50%-4px)]' : 'left-[50%] w-[calc(50%-4px)]'}`} />
      
      {viewOptions.map(option => (
        <button
          key={option.mode}
          onClick={() => handleViewChange(option.mode)}
          className={`group relative z-10 flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-225 active:scale-95 sm:px-6 ${
            viewMode === option.mode
              ? 'text-white'
              : 'text-gray-900 hover:text-primary dark:text-white'
          }`}
        >
          <option.icon className={`h-4 w-4 transition-all duration-225 ${
            viewMode === option.mode ? 'scale-110' : `group-hover:${option.mode === 'grid' ? 'rotate-12' : '-rotate-12'}`
          }`} />
          <span className={`whitespace-nowrap transition-all duration-225 ${
            viewMode === option.mode ? 'font-semibold' : ''
          }`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};