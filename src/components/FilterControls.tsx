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

        // Define a small padding for the floating effect around the selector
        const SELECTOR_INSET_PADDING = 2; // 2 pixels on each side for a floating effect

        // Calculate values for the selector
        const selectorTopPos = (activeRect.top - innerContainerElem.getBoundingClientRect().top) + SELECTOR_INSET_PADDING;
        const selectorLeftPos = (activeRect.left - innerContainerElem.getBoundingClientRect().left) + SELECTOR_INSET_PADDING;
        const selectorWidth = activeRect.width - (2 * SELECTOR_INSET_PADDING);
        const selectorHeight = activeRect.height - (2 * SELECTOR_INSET_PADDING);

        // Set CSS variables on the innerButtonsContainerRef for the selector
        innerContainerElem.style.setProperty('--selector-top', `${selectorTopPos}px`);
        innerContainerElem.style.setProperty('--selector-height', `${selectorHeight}px`);
        innerContainerElem.style.setProperty('--selector-left', `${selectorLeftPos}px`);
        innerContainerElem.style.setProperty('--selector-width', `${selectorWidth}px`);

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
        {/* Animated Selector Background - Styling is correct, uses CSS variables */}
        <div 
          className={`absolute bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm`}
          style={{
            top: 'var(--selector-top, 4px)', 
            left: 'var(--selector-left, 4px)', 
            width: 'var(--selector-width, calc(33.333% - 8px))', 
            height: 'var(--selector-height, calc(33.333% - 8px))', 
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
};2