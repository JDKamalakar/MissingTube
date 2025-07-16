import React from 'react';
import { Filter, Eye, EyeOff } from 'lucide-react';
import { FilterMode } from '../types';

interface FilterControlsProps {
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  unavailableCount: number;
  totalCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filterMode,
  onFilterChange,
  unavailableCount,
  totalCount,
}) => {
  if (unavailableCount === 0) return null;

  const availableCount = totalCount - unavailableCount;

  const handleFilterChange = (newMode: FilterMode) => {
    if (newMode === filterMode) return;
    
    // Add smooth transition animation
    const container = document.querySelector('[data-filter-container]') || document.querySelector('[data-view-container]');
    if (container) {
      container.classList.add('opacity-50', 'scale-95');
      setTimeout(() => {
        onFilterChange(newMode);
        setTimeout(() => {
          container.classList.remove('opacity-50', 'scale-95');
        }, 150);
      }, 150);
    } else {
      onFilterChange(newMode);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left w-full sm:w-auto sm:min-w-[500px] lg:min-w-[600px]">
      {/* Mobile: Stack vertically, Desktop: Horizontal */}
      <div className="flex flex-col sm:flex-row w-full">
        {/* Animated Selector Background - Adjusted for mobile */}
        <div 
          className={`absolute bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
            filterMode === 'all' 
              ? 'top-1 left-1 right-1 h-[calc(33.333%-4px)] sm:top-1 sm:bottom-1 sm:left-1 sm:right-auto sm:w-[calc(33.333%-4px)] sm:h-auto' 
              : filterMode === 'available'
              ? 'top-[33.333%] left-1 right-1 h-[calc(33.333%-4px)] sm:top-1 sm:bottom-1 sm:left-[33.333%] sm:right-auto sm:w-[calc(33.333%-4px)] sm:h-auto'
              : 'top-[66.666%] left-1 right-1 h-[calc(33.333%-4px)] sm:top-1 sm:bottom-1 sm:left-[66.666%] sm:right-auto sm:w-[calc(33.333%-4px)] sm:h-auto'
          }`}
        />
        
        <button
          onClick={() => handleFilterChange('all')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 flex-1 touch-target ${
            filterMode === 'all'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white hover:bg-white/10'
          }`}
        >
          {/* MODIFIED: Add group-hover:drop-shadow-sm-icon and group-hover:text-shadow-sm */}
          <Filter className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'all' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white group-hover:drop-shadow-sm-icon'
          }`} />
          {/* MODIFIED: Add group-hover:text-shadow-sm */}
          <span className={`transition-all duration-225 ${
            filterMode === 'all' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white group-hover:text-shadow-sm'
          }`}>
            All ({totalCount})
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('available')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 flex-1 touch-target ${
            filterMode === 'available'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white hover:bg-white/10'
          }`}
        >
          {/* MODIFIED: Add group-hover:drop-shadow-sm-icon and group-hover:text-shadow-sm */}
          <Eye className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'available' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white group-hover:drop-shadow-sm-icon'
          }`} />
          {/* MODIFIED: Add group-hover:text-shadow-sm */}
          <span className={`transition-all duration-225 ${
            filterMode === 'available' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white group-hover:text-shadow-sm'
          }`}>
            Available ({availableCount})
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('unavailable')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 flex-1 touch-target ${
            filterMode === 'unavailable'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white hover:bg-white/10'
          }`}
        >
          {/* MODIFIED: Add group-hover:drop-shadow-sm-icon and group-hover:text-shadow-sm */}
          <EyeOff className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'unavailable' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white group-hover:drop-shadow-sm-icon'
          }`} />
          {/* MODIFIED: Add group-hover:text-shadow-sm */}
          <span className={`transition-all duration-225 ${
            filterMode === 'unavailable' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white group-hover:text-shadow-sm'
          }`}>
            Unavailable ({unavailableCount})
          </span>
        </button>
      </div>
    </div>
  );
};