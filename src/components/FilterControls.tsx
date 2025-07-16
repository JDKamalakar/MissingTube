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

  const allButtonRef = useRef<HTMLButtonElement>(null);
  const availableButtonRef = useRef<HTMLButtonElement>(null);
  const unavailableButtonRef = useRef<HTMLButtonElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null); 
  const innerButtonsContainerRef = useRef<HTMLDivElement>(null); 

  const [currentFilterMode, setCurrentFilterMode] = useState(filterMode);
  useEffect(() => {
      setCurrentFilterMode(filterMode);
  }, [filterMode]);

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

        // Selector Positioning and Sizing Logic
        const SELECTOR_VISUAL_INSET = 2; // This value controls the floating space on all sides

        const baseTop = activeRect.top - innerContainerElem.getBoundingClientRect().top;
        const baseLeft = activeRect.left - innerContainerElem.getBoundingClientRect().left;

        const selectorTopPos = baseTop + SELECTOR_VISUAL_INSET;
        const selectorLeftPos = baseLeft + SELECTOR_VISUAL_INSET;
        const selectorWidth = activeRect.width - (2 * SELECTOR_VISUAL_INSET);
        const selectorHeight = activeRect.height - (2 * SELECTOR_VISUAL_INSET);

        innerContainerElem.style.setProperty('--selector-top', `${selectorTopPos}px`);
        innerContainerElem.style.setProperty('--selector-height', `${selectorHeight}px`);
        innerContainerElem.style.setProperty('--selector-left', `${selectorLeftPos}px`);
        innerContainerElem.style.setProperty('--selector-width', `${selectorWidth}px`);

        // Outer Blur Div Sizing Logic
        const innerContainerRenderedWidth = innerContainerElem.offsetWidth;
        const innerContainerRenderedHeight = innerContainerElem.offsetHeight;

        const outerDesiredWidth = innerContainerRenderedWidth; 
        const outerDesiredHeight = innerContainerRenderedHeight; 

        const isDesktop = window.innerWidth >= 640; 
        if (isDesktop) {
            outerContainerElem.style.width = `${outerDesiredWidth}px`;
            outerContainerElem.style.height = `${outerDesiredHeight}px`;
        } else {
            outerContainerElem.style.width = '100%';
            outerContainerElem.style.height = 'auto';
        }
      }
    };

    calculateAndSetDimensions();
    window.addEventListener('resize', calculateAndSetDimensions);
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
         className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left">
      
      <div 
        ref={innerButtonsContainerRef} 
        className="flex flex-col sm:flex-row w-full sm:w-auto sm:flex-shrink-0 p-1" 
      > 
        <div 
          className={`absolute bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm`}
          style={{
            top: 'var(--selector-top)', 
            left: 'var(--selector-left)', 
            width: 'var(--selector-width)', 
            height: 'var(--selector-height)', 
          }}
        />
        
        <button
          ref={allButtonRef} 
          onClick={() => handleFilterChange('all')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'all' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          {/* ICON SIZE: w-4 h-4 (16px base size) + group-hover:scale-110 for inactive hover effect */}
          <Filter className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'all' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon group-hover:scale-110'
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
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'available' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          {/* ICON SIZE: w-4 h-4 (16px base size) + group-hover:scale-110 for inactive hover effect */}
          <Eye className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'available' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon group-hover:scale-110'
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
          className={`group relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-225 mobile-text-sm min-w-0 touch-target sm:flex-auto ${
            currentFilterMode === 'unavailable' 
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'
          }`}
        >
          {/* ICON SIZE: w-4 h-4 (16px base size) + group-hover:scale-110 for inactive hover effect */}
          <EyeOff className={`w-4 h-4 transition-all duration-225 ${
            currentFilterMode === 'unavailable' ? 'scale-110' : 'group-hover:animate-spin group-hover:text-white dark:group-hover:text-primary group-hover:drop-shadow-sm-icon group-hover:scale-110'
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