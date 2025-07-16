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
    // MODIFIED: Removed sm:min-w and lg:min-w from the outer div.
    // Adjusted w-full to w-auto for desktop flexibility.
    <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left w-full sm:w-auto">
      {/* Mobile: Stack vertically, Desktop: Horizontal */}
      {/* MODIFIED: Changed w-full to w-auto on sm for inner flex container, and added flex-shrink-0 */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:flex-shrink-0"> 
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
          // MODIFIED: Removed flex-1 to allow buttons to take only required space
          // Added sm:flex-auto to ensure they don't grow beyond content on desktop
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${ // Adjusted desktop px for more compact
            filterMode === 'all'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Filter className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'all' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            filterMode === 'all' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            All ({totalCount})
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('available')}
          // MODIFIED: Removed flex-1 to allow buttons to take only required space
          // Added sm:flex-auto to ensure they don't grow beyond content on desktop
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${ // Adjusted desktop px for more compact
            filterMode === 'available'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Eye className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'available' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            filterMode === 'available' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Available ({availableCount})
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('unavailable')}
          // MODIFIED: Removed flex-1 to allow buttons to take only required space
          // Added sm:flex-auto to ensure they don't grow beyond content on desktop
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${ // Adjusted desktop px for more compact
            filterMode === 'unavailable'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <EyeOff className={`w-4 h-4 transition-all duration-225 ${
            filterMode === 'unavailable' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            filterMode === 'unavailable' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Unavailable ({unavailableCount})
          </span>
        </button>
      </div>
    </div>
  );
};2