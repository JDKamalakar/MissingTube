import React, { useState, useEffect, useRef } from 'react'; // Import useRef
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
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main container to set CSS variables

  // State to hold calculated positions/widths
  const [selectorStyles, setSelectorStyles] = useState<{
    mobileTop: string;
    mobileHeight: string;
    desktopLeft: string;
    desktopWidth: string;
  }>({
    mobileTop: '0px',
    mobileHeight: '0px',
    desktopLeft: '0px',
    desktopWidth: '0px',
  });

  // Calculate and update selector styles on mount, filterMode change, or resize
  useEffect(() => {
    const calculateStyles = () => {
      if (allButtonRef.current && availableButtonRef.current && unavailableButtonRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const allRect = allButtonRef.current.getBoundingClientRect();
        const availableRect = availableButtonRef.current.getBoundingClientRect();
        const unavailableRect = unavailableButtonRef.current.getBoundingClientRect();

        // Determine current active button rect
        let activeRect = allRect;
        if (filterMode === 'available') activeRect = availableRect;
        if (filterMode === 'unavailable') activeRect = unavailableRect;

        // Mobile (vertical stack) calculations
        const mobileActiveTop = activeRect.top - containerRect.top;
        const mobileActiveHeight = activeRect.height; // Height of the button
        
        // Desktop (horizontal row) calculations
        const desktopActiveLeft = activeRect.left - containerRect.left;
        const desktopActiveWidth = activeRect.width; // Width of the button

        setSelectorStyles({
          mobileTop: `${mobileActiveTop}px`,
          mobileHeight: `${mobileActiveHeight}px`,
          desktopLeft: `${desktopActiveLeft}px`,
          desktopWidth: `${desktopActiveWidth}px`,
        });
      }
    };

    // Recalculate on mount, filterMode change, and window resize
    calculateStyles();
    window.addEventListener('resize', calculateStyles);

    // Set a small timeout after initial render to account for DOM reflow
    const timeoutId = setTimeout(calculateStyles, 100); 

    return () => {
      window.removeEventListener('resize', calculateStyles);
      clearTimeout(timeoutId);
    };
  }, [filterMode, totalCount, unavailableCount]); // Add totalCount/unavailableCount as dependencies if they change layout dynamically

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
    // MODIFIED: Added ref to container div
    <div ref={containerRef} className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left w-full sm:w-auto">
      {/* Mobile: Stack vertically, Desktop: Horizontal */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:flex-shrink-0"> 
        {/* Animated Selector Background - MODIFIED to use inline styles / CSS variables*/}
        <div 
          className={`absolute bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm`}
          style={{
            // Mobile styles
            top: selectorStyles.mobileTop,
            left: '4px', // From p-1 (4px)
            right: '4px', // From p-1 (4px)
            height: selectorStyles.mobileHeight,
            // Desktop overrides
            sm: {
                top: '4px', // From p-1 (4px)
                bottom: '4px', // From p-1 (4px)
                height: 'auto',
                left: selectorStyles.desktopLeft,
                width: selectorStyles.desktopWidth,
            }
          }}
        />
        
        <button
          ref={allButtonRef} // Add ref
          onClick={() => handleFilterChange('all')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
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
          ref={availableButtonRef} // Add ref
          onClick={() => handleFilterChange('available')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
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
          ref={unavailableButtonRef} // Add ref
          onClick={() => handleFilterChange('unavailable')}
          className={`group relative z-10 flex items-center justify-center gap-1 px-2 sm:px-4 lg:px-6 py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
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
};1