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
  const innerButtonsContainerRef = useRef<HTMLDivElement>(null); // Ref for the flex container holding buttons

  // State to trigger re-calculation when filterMode changes
  const [currentFilterMode, setCurrentFilterMode] = useState(filterMode);
  useEffect(() => {
      setCurrentFilterMode(filterMode);
  }, [filterMode]);

  // State to store the calculated size of the inner buttons container
  const [innerContainerSize, setInnerContainerSize] = useState({ width: 0, height: 0 });

  // Effect to calculate and set CSS variables AND inner container size
  useEffect(() => {
    const calculateAndSetDimensions = () => {
      if (allButtonRef.current && availableButtonRef.current && unavailableButtonRef.current && innerButtonsContainerRef.current) {
        const containerElem = innerButtonsContainerRef.current;
        const allRect = allButtonRef.current.getBoundingClientRect();
        const availableRect = availableButtonRef.current.getBoundingClientRect();
        const unavailableRect = unavailableButtonRef.current.getBoundingClientRect();
        
        let activeRect = allRect;
        if (currentFilterMode === 'available') activeRect = availableRect;
        if (currentFilterMode === 'unavailable') activeRect = unavailableRect;

        // Calculate values for the selector
        const topPos = activeRect.top - containerElem.getBoundingClientRect().top;
        const leftPos = activeRect.left - containerElem.getBoundingClientRect().left;
        const width = activeRect.width;
        const height = activeRect.height;

        // Set CSS variables on the container for the selector
        containerElem.style.setProperty('--selector-top', `${topPos}px`);
        containerElem.style.setProperty('--selector-height', `${height}px`);
        containerElem.style.setProperty('--selector-left', `${leftPos}px`);
        containerElem.style.setProperty('--selector-width', `${width}px`);

        // Calculate the total combined size of the inner buttons container
        // On desktop (sm and up), buttons are horizontal. On mobile, they are vertical.
        const isDesktop = window.innerWidth >= 640; // Tailwind's sm breakpoint

        let totalContentWidth = 0;
        let totalContentHeight = 0;

        if (isDesktop) {
          // Horizontal layout: Sum of widths + gaps
          totalContentWidth = allRect.width + availableRect.width + unavailableRect.width + 2 * 4; // 2 gaps of 4px (gap-1)
          totalContentHeight = Math.max(allRect.height, availableRect.height, unavailableRect.height); // Max height of any button
        } else {
          // Vertical layout: Max width + sum of heights + gaps
          totalContentWidth = Math.max(allRect.width, availableRect.width, unavailableRect.width); // Max width of any button
          totalContentHeight = allRect.height + availableRect.height + unavailableRect.height + 2 * 4; // 2 gaps of 4px (space-y-1)
        }
        
        setInnerContainerSize({ width: totalContentWidth, height: totalContentHeight });
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
    // Outer div (blur one) - Modified to rely on inner container's calculated size
    <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left w-full sm:w-auto">
      {/* Inner div containing the buttons - Explicitly set width/height based on calculation */}
      <div 
        ref={innerButtonsContainerRef} 
        className="flex flex-col sm:flex-row w-full sm:w-auto sm:flex-shrink-0"
        style={{
          // Apply calculated dimensions for desktop
          // For mobile, w-full ensures it stretches, and height will naturally fit content
          width: innerContainerSize.width ? `${innerContainerSize.width}px` : 'auto',
          height: innerContainerSize.height ? `${innerContainerSize.height}px` : 'auto',
        }}
      > 
        {/* Animated Selector Background - Styling remains */}
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
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'all' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Filter className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'all' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            currentFilterMode === 'all' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            All ({totalCount})
          </span>
        </button>
        
        <button
          ref={availableButtonRef} 
          onClick={() => handleFilterChange('available')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'available' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <Eye className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'available' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            currentFilterMode === 'available' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Available ({availableCount})
          </span>
        </button>
        
        <button
          ref={unavailableButtonRef} 
          onClick={() => handleFilterChange('unavailable')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'unavailable' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          <EyeOff className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'unavailable' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon'
          }`} />
          <span className={`transition-all duration-225 ${
            currentFilterMode === 'unavailable' ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary group-hover:text-shadow-sm'
          }`}>
            Unavailable ({unavailableCount})
          </span>
        </button>
      </div>
    </div>
  );
};