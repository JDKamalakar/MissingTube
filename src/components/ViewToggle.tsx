import React, { useState, useEffect, useRef } from 'react';
import { Grid3X3, List, ChevronDown } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleViewChange = (newMode: ViewMode) => {
    // We don't close the menu immediately to allow the user to see the animation
    if (newMode === viewMode) {
      setIsMobileMenuOpen(false);
      return;
    }
    
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

    // Close the dropdown after a short delay
    setTimeout(() => setIsMobileMenuOpen(false), 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const viewOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3 },
    { mode: 'table' as ViewMode, label: 'Table', icon: List },
  ];

  // --- [NEW] Logic to calculate selector position ---
  const activeIndex = viewOptions.findIndex(option => option.mode === viewMode);
  const itemHeight = 44; // h-11 in Tailwind
  const gap = 2; // gap-0.5 in Tailwind
  const selectorTransform = `translateY(${activeIndex * (itemHeight + gap)}px)`;

  return (
    <>
      <div ref={dropdownRef} className={`relative w-full sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- Desktop View (Segmented Control) --- */}
        <div className="hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 w-auto">
          <div className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${viewMode === 'grid' ? 'left-1 w-[calc(50%-4px)]' : 'left-[50%] w-[calc(50%-4px)]'}`} />
          {viewOptions.map(option => (
            <button key={option.mode} onClick={() => onViewModeChange(option.mode)} className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-colors duration-225 flex-1 touch-target text-sm active:scale-95 ${viewMode === option.mode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              <option.icon className={`w-4 h-4 transition-transform duration-225 ${viewMode === option.mode ? 'scale-110' : ''}`} />
              <span className="font-semibold">{option.label}</span>
            </button>
          ))}
        </div>

        {/* --- [MODIFIED] Mobile View (Vertical Segmented Control Dropdown) --- */}
        <div className="sm:hidden w-full">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center justify-between w-full bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-xl p-3 shadow-xl border border-white/30 dark:border-white/20 text-gray-900 dark:text-white transition-transform duration-200 active:scale-95">
            <div className="grid items-center">
              {viewOptions.map(option => (
                <div key={option.mode} style={{ gridArea: '1 / 1' }} className={`flex items-center gap-2 transition-all duration-500 ease-out ${viewMode === option.mode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  <option.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm pb-[1px]">{option.label}</span>
                </div>
              ))}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          <div className={`absolute top-full mt-2 left-0 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-xl p-2 flex flex-col gap-0.5 w-full transform transition-all duration-500 ease-out origin-top ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'
          } relative`}> {/* Added 'relative' for the selector */}
            
            {/* --- [NEW] The moving selector div --- */}
            <div
              className="absolute left-2 right-2 h-11 rounded-lg bg-primary/80 backdrop-blur-sm shadow-md transition-transform duration-300 ease-out z-0"
              style={{ 
                transform: selectorTransform,
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionProperty: 'transform, opacity',
                transitionDelay: isMobileMenuOpen ? '100ms' : '0ms'
              }}
            />
            
            {viewOptions.map((option, index) => (
              <button
                key={option.mode}
                onClick={() => handleViewChange(option.mode)}
                className={`group relative z-10 w-full flex items-center justify-start gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 active:scale-95 ${
                  viewMode === option.mode ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${150 + index * 50}ms` : '0ms',
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
              >
                <option.icon size={18} className={`transition-all duration-300 ${viewMode === option.mode ? 'text-white scale-110' : 'text-primary'}`}/>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};