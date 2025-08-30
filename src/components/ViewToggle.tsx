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
        {/* --- Desktop View --- */}
        <div className="hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 w-auto">
          <div className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${viewMode === 'grid' ? 'left-1 w-[calc(50%-4px)]' : 'left-[50%] w-[calc(50%-4px)]'}`} />
          <button onClick={() => handleViewChange('grid')} className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-sm active:scale-95 ${viewMode === 'grid' ? 'text-white' : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/10'}`}>
            <Grid3X3 className={`w-4 h-4 transition-all duration-225 ${viewMode === 'grid' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary'}`} />
            <span className={`transition-all duration-225 ${viewMode === 'grid' ? 'font-semibold text-white' : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'}`}>Grid</span>
          </button>
          <button onClick={() => handleViewChange('table')} className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-sm active:scale-95 ${viewMode === 'table' ? 'text-white' : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/10'}`}>
            <List className={`w-4 h-4 transition-all duration-225 ${viewMode === 'table' ? 'scale-110' : 'group-hover:-rotate-12 group-hover:text-white dark:group-hover:text-primary'}`} />
            <span className={`transition-all duration-225 ${viewMode === 'table' ? 'font-semibold text-white' : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'}`}>Table</span>
          </button>
        </div>

        {/* --- Mobile View (Dropdown) --- */}
        <div className="sm:hidden w-full">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-between w-full bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-xl p-3 shadow-xl border border-white/30 dark:border-white/20 text-gray-900 dark:text-white transition-transform duration-200 active:scale-95"
          >
            <div className="relative h-5 flex items-center">
              {viewOptions.map(option => (
                <div
                  key={option.mode}
                  // [MODIFIED] Changed duration-300 to duration-500 for a slower animation
                  className={`flex items-center gap-2 transition-all duration-500 ease-out ${
                    viewMode === option.mode
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-2 absolute'
                  }`}
                >
                  <option.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{option.label}</span>
                </div>
              ))}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          <div className={`absolute top-full left-0 right-0 mt-2 w-full overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/20 p-2 space-y-1 shadow-2xl">
              {viewOptions.map(option => (
                <button 
                  key={option.mode} 
                  onClick={() => handleViewChange(option.mode)} 
                  // [MODIFIED] Replaced `transition-all` with specific properties to prevent icon shrinking
                  className={`group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-[color,background-color,box-shadow,transform] duration-200 text-left active:scale-95 ${
                    option.mode === viewMode 
                      ? 'bg-primary/80 text-white font-semibold shadow-md' 
                      : 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${option.mode === viewMode ? 'text-white' : 'text-primary'}`} />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};