import React, { useState, useEffect, useRef } from 'react';
import { Filter, Eye, EyeOff, ChevronDown } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allButtonRef = useRef<HTMLButtonElement>(null);
  const availableButtonRef = useRef<HTMLButtonElement>(null);
  const unavailableButtonRef = useRef<HTMLButtonElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null); 
  const innerButtonsContainerRef = useRef<HTMLDivElement>(null); 

  if (unavailableCount === 0) return null;

  const availableCount = totalCount - unavailableCount;
  
  const filterOptions = [
    { mode: 'all' as FilterMode, label: 'All', count: totalCount, icon: Filter },
    { mode: 'available' as FilterMode, label: 'Available', count: availableCount, icon: Eye },
    { mode: 'unavailable' as FilterMode, label: 'Unavailable', count: unavailableCount, icon: EyeOff },
  ];

  useEffect(() => {
    const calculateAndSetDimensions = () => {
      if (allButtonRef.current && availableButtonRef.current && unavailableButtonRef.current && 
          innerButtonsContainerRef.current && outerContainerRef.current) {
        const innerContainerElem = innerButtonsContainerRef.current;
        const outerContainerElem = outerContainerRef.current; 
        let activeRect;
        switch (filterMode) {
          case 'available': activeRect = availableButtonRef.current.getBoundingClientRect(); break;
          case 'unavailable': activeRect = unavailableButtonRef.current.getBoundingClientRect(); break;
          default: activeRect = allButtonRef.current.getBoundingClientRect();
        }
        const SELECTOR_VISUAL_INSET = 2;
        const baseTop = activeRect.top - innerContainerElem.getBoundingClientRect().top;
        const baseLeft = activeRect.left - innerContainerElem.getBoundingClientRect().left;
        innerContainerElem.style.setProperty('--selector-top', `${baseTop + SELECTOR_VISUAL_INSET}px`);
        innerContainerElem.style.setProperty('--selector-height', `${activeRect.height - (2 * SELECTOR_VISUAL_INSET)}px`);
        innerContainerElem.style.setProperty('--selector-left', `${baseLeft + SELECTOR_VISUAL_INSET}px`);
        innerContainerElem.style.setProperty('--selector-width', `${activeRect.width - (2 * SELECTOR_VISUAL_INSET)}px`);
        outerContainerElem.style.width = `${innerContainerElem.offsetWidth}px`;
        outerContainerElem.style.height = `${innerContainerElem.offsetHeight}px`;
      }
    };
    calculateAndSetDimensions();
    window.addEventListener('resize', calculateAndSetDimensions);
    const timeoutId = setTimeout(calculateAndSetDimensions, 100); 
    return () => {
      window.removeEventListener('resize', calculateAndSetDimensions);
      clearTimeout(timeoutId);
    };
  }, [filterMode, totalCount, unavailableCount]); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsMobileMenuOpen(false);
    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, [isMobileMenuOpen]);

  const handleFilterChange = (newMode: FilterMode) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (newMode === filterMode) return;
    
    const container = document.querySelector('[data-filter-container]') || document.querySelector('[data-view-container]');
    if (container) {
      container.classList.add('opacity-50', 'scale-95');
      setTimeout(() => {
        onFilterChange(newMode);
        setTimeout(() => { container.classList.remove('opacity-50', 'scale-95'); }, 150);
      }, 150);
    } else {
      onFilterChange(newMode);
    }
  };

  return (
    <>
      <div ref={dropdownRef} className={`relative w-full sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- Desktop View: Animated Sliding Filter --- */}
        <div ref={outerContainerRef} className="hidden sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left">
          <div ref={innerButtonsContainerRef} className="flex flex-row w-auto flex-shrink-0 p-1">
            <div className={`absolute bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm`} style={{ top: 'var(--selector-top)', left: 'var(--selector-left)', width: 'var(--selector-width)', height: 'var(--selector-height)' }} />
            {filterOptions.map(option => (
              <button
                key={option.mode}
                ref={{ all: allButtonRef, available: availableButtonRef, unavailable: unavailableButtonRef }[option.mode]}
                onClick={() => handleFilterChange(option.mode)}
                className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 text-sm touch-target ${filterMode === option.mode ? 'text-white' : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10'}`}
              >
                <option.icon className={`w-4 h-4 transition-all duration-225 ${filterMode === option.mode ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary group-hover:scale-110'}`} />
                <span className={`transition-all duration-225 whitespace-nowrap ${filterMode === option.mode ? 'font-semibold' : 'group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'}`}>{`${option.label} (${option.count})`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- Mobile View: Dropdown Filter --- */}
        <div className="sm:hidden w-full animate-slide-in-left">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center justify-between w-full bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-xl p-3 shadow-xl border border-white/30 dark:border-white/20 text-gray-900 dark:text-white transition-transform duration-200 active:scale-95">
            <div className="grid items-center">
              {filterOptions.map(option => (
                <div key={option.mode} style={{ gridArea: '1 / 1' }} className={`flex items-center gap-2 transition-all duration-500 ease-out ${filterMode === option.mode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  <option.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm pb-[1px]">{`${option.label} (${option.count})`}</span>
                </div>
              ))}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`absolute top-full left-0 right-0 mt-2 w-full overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/20 p-2 space-y-1 shadow-2xl">
              {filterOptions.map(option => (
                <button key={option.mode} onClick={() => handleFilterChange(option.mode)} className={`group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-[color,background-color,box-shadow,transform] duration-200 text-left active:scale-95 ${option.mode === filterMode ? 'bg-primary/80 text-white font-semibold shadow-md' : 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <option.icon className={`w-4 h-4 ${option.mode === filterMode ? 'text-white' : 'text-primary'}`} />
                  {/* [MODIFIED] Changed to text-xs to prevent wrapping on small screens */}
                  <span className="text-xs">{`${option.label} (${option.count})`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};