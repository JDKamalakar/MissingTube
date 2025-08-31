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
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    if (newMode === viewMode) return;
    
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

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const viewOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3 },
    { mode: 'table' as ViewMode, label: 'Table', icon: List },
  ];

  return (
    <>
      <div ref={dropdownRef} className={`relative w-full sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- [MODIFIED] Desktop View now uses a true segmented control UI --- */}
        <div className="hidden sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl shadow-xl border border-white/30 dark:border-white/20 divide-x divide-white/30 dark:divide-white/20">
          {viewOptions.map((option, index) => {
            const isFirst = index === 0;
            const isLast = index === viewOptions.length - 1;
            const cornerClass = isFirst ? 'rounded-l-2xl' : isLast ? 'rounded-r-2xl' : '';

            return (
              <button
                key={option.mode}
                onClick={() => handleViewChange(option.mode)}
                className={`group relative flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors duration-225 flex-1 touch-target text-sm active:scale-95 ${cornerClass} ${
                  viewMode === option.mode
                    ? 'bg-primary/80 text-white'
                    : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'
                }`}
              >
                <option.icon className={`w-4 h-4 transition-transform duration-225 ${
                  viewMode === option.mode
                    ? 'scale-110'
                    : `${option.mode === 'grid' ? 'group-hover:rotate-12' : 'group-hover:-rotate-12'}`
                }`} />
                <span className={`transition-all duration-225 ${
                  viewMode === option.mode ? 'font-semibold' : 'group-hover:font-semibold'
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>


        {/* --- Mobile View (Dropdown) --- */}
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

          <div className={`absolute top-full left-0 right-0 mt-2 w-full overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/20 p-1 space-y-1 shadow-2xl">
              {viewOptions.map(option => (
                <button key={option.mode} onClick={() => handleViewChange(option.mode)} className={`group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-[color,background-color,box-shadow,transform] duration-200 text-left active:scale-95 ${option.mode === viewMode ? 'bg-primary/80 text-white font-semibold shadow-md' : 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <option.icon className={`w-4 h-4 ${option.mode === viewMode ? 'text-white' : 'text-primary'}`} />
                  <span className="text-xs font-semibold">{option.label}</span>
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