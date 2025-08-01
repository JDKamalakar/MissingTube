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
    <div className="relative flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left min-w-[600px]">
      {/* Animated Selector Background */}
      <div 
        className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
          filterMode === 'all' 
            ? 'left-1 w-[calc(33.333%-4px)]' 
            : filterMode === 'available'
            ? 'left-[33.333%] w-[calc(33.333%-4px)]'
            : 'left-[66.666%] w-[calc(33.333%-4px)]'
        }`}
      />
      
      <button
        onClick={() => handleFilterChange('all')}
        className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all duration-225 text-sm min-w-0 flex-1 justify-center ${
          filterMode === 'all'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
        }`}
      >
        <Filter className={`w-4 h-4 transition-all duration-225 ${
          filterMode === 'all' ? 'scale-110' : 'hover:rotate-12'
        }`} />
        <span className={`transition-all duration-225 ${
          filterMode === 'all' ? 'font-semibold' : ''
        }`}>
          All ({totalCount})
        </span>
      </button>
      
      <button
        onClick={() => handleFilterChange('available')}
        className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all duration-225 text-sm min-w-0 flex-1 justify-center ${
          filterMode === 'available'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
        }`}
      >
        <Eye className={`w-4 h-4 transition-all duration-225 ${
          filterMode === 'available' ? 'scale-110' : 'hover:scale-110'
        }`} />
        <span className={`transition-all duration-225 ${
          filterMode === 'available' ? 'font-semibold' : ''
        }`}>
          Available ({availableCount})
        </span>
      </button>
      
      <button
        onClick={() => handleFilterChange('unavailable')}
        className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all duration-225 text-sm min-w-0 flex-1 justify-center ${
          filterMode === 'unavailable'
            ? 'text-white'
            : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
        }`}
      >
        <EyeOff className={`w-4 h-4 transition-all duration-225 ${
          filterMode === 'unavailable' ? 'scale-110' : 'hover:scale-110'
        }`} />
        <span className={`transition-all duration-225 ${
          filterMode === 'unavailable' ? 'font-semibold' : ''
        }`}>
          Unavailable ({unavailableCount})
        </span>
      </button>
    </div>
  );
};