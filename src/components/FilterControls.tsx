import React, { useState, useEffect, useRef } from 'react';
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

  // Refs for each button
  const allButtonRef = useRef<HTMLButtonElement>(null);
  const availableButtonRef = useRef<HTMLButtonElement>(null);
  const unavailableButtonRef = useRef<HTMLButtonElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null); 
  const innerButtonsContainerRef = useRef<HTMLDivElement>(null); 

  // State to trigger re-calculation when filterMode changes
  const [currentFilterMode, setCurrentFilterMode] = useState(filterMode);
  useEffect(() => {
      setCurrentFilterMode(filterMode);
  }, [filterMode]);

  // Effect to calculate and set CSS variables AND outer container size
  useEffect(() => {
    const calculateAndSetDimensions = () => {
      if (allButtonRef.current && availableButtonRef.current && unavailableButtonRef.current && 
          innerButtonsContainerRef.current && outerContainerRef.current) {

        const innerContainerElem = innerButtonsContainerRef.current;
        const outerContainerElem = outerContainerRef.current; 

        const allRect = allButtonRef.current.getBoundingClientRect();
        const availableRect = availableButtonRef.current.getBoundingClientRect();
        const unavailableRect = unavailableButtonRef.current.getBoundingClientRect();
        
        let activeRect = allRect;
        if (currentFilterMode === 'available') activeRect = availableRect;
        if (currentFilterMode === 'unavailable') activeRect = unavailableRect;

        // The key is to calculate position/size relative to the *innerButtonsContainerRef*
        // because the selector is absolute within it.
        const innerContainerRect = innerContainerElem.getBoundingClientRect();

        const topPos = activeRect.top - innerContainerRect.top;
        const leftPos = activeRect.left - innerContainerRect.left;
        const width = activeRect.width;
        const height = activeRect.height;

        // Set CSS variables on the innerButtonsContainerRef for the selector
        innerContainerElem.style.setProperty('--selector-top', `${topPos}px`);
        innerContainerElem.style.setProperty('--selector-height', `${height}px`);
        innerContainerElem.style.setProperty('--selector-left', `${leftPos}px`);
        innerContainerElem.style.setProperty('--selector-width', `${width}px`);

        // Calculate the exact size of the *outer blur div* to match the inner content + its own p-1 padding
        const innerContainerRenderedWidth = innerContainerElem.offsetWidth;
        const innerContainerRenderedHeight = innerContainerElem.offsetHeight;

        const outerDesiredWidth = innerContainerRenderedWidth + 8; // 2 * p-1 (4px padding on each side)
        const outerDesiredHeight = innerContainerRenderedHeight + 8; // 2 * p-1

        // Apply these calculated dimensions directly to the outer blur div
        const isDesktop = window.innerWidth >= 640; 
        if (isDesktop) {
            outerContainerElem.style.width = `${outerDesiredWidth}px`;
            outerContainerElem.style.height = `${outerDesiredHeight}px`;
        } else {
            // For mobile, retain w-full and natural height to stretch horizontally
            outerContainerElem.style.width = '100%';
            outerContainerElem.style.height = 'auto';
        }
      }
    };

    // Initial calculation and on resize
    calculateAndSetDimensions();
    window.addEventListener('resize', calculateAndSetDimensions);

    // Timeout to catch initial render layout shifts
    const timeoutId = setTimeout(calculateAndSetDimensions, 100); 

    return () => {
      window.removeEventListener('resize', calculateAndSetDimensions);
      clearTimeout(timeoutId);
    };
  }, [currentFilterMode, totalCount, unavailableCount]); 

  const handleFilterChange = (newMode: FilterMode) => {
    if (newMode === currentFilterMode) return;
    
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
    <div ref={outerContainerRef} 
         className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left">
      
      <div 
        ref={innerButtonsContainerRef} 
        className="flex flex-col sm:flex-row w-full sm:w-auto sm:flex-shrink-0"
      > 
        {/* Animated Selector Background - MODIFIED to use inset and slightly less rounded */}
        <div 
          className={`absolute bg-primary/80 backdrop-blur-sm transition-all duration-300 ease-out shadow-sm rounded-xl`} {/* Changed rounded-2xl to rounded-xl for selector */}
          style={{
            // Use calculated dimensions, then add an inset effect
            top: `calc(var(--selector-top, 4px) + 2px)`, // Shift down by 2px
            left: `calc(var(--selector-left, 4px) + 2px)`, // Shift right by 2px
            width: `calc(var(--selector-width, 100px) - 4px)`, // Reduce width by 4px (2px left + 2px right)
            height: `calc(var(--selector-height, 40px) - 4px)`, // Reduce height by 4px (2px top + 2px bottom)
          }}
        />
        
        <button
          ref={allButtonRef} 
          onClick={() => handleFilterChange('all')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'all' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Filter className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'all' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 whitespace-nowrap ${ 
            currentFilterMode === 'all' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            All ({totalCount})
          </span>
        </button>
        
        <button
          ref={availableButtonRef} 
          onClick={() => handleFilterChange('available')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'available' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Eye className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'available' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 whitespace-nowrap ${
            currentFilterMode === 'available' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Available ({availableCount})
          </span>
        </button>
        
        <button
          ref={unavailableButtonRef} 
          onClick={() => handleFilterChange('unavailable')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'unavailable' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <EyeOff className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'unavailable' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 whitespace-nowrap ${
            currentFilterMode === 'unavailable' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Unavailable ({unavailableCount})
          </span>
        </button>
      </div>
    </div>
  );
};