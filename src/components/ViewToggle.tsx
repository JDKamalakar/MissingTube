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
    setIsMobileMenuOpen(false);
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

  // [MODIFIED] Added color and hoverAnim properties for exact replication
  const viewOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid', icon: Grid3X3, color: 'text-primary', hoverAnim: 'group-hover:rotate-12' },
    { mode: 'table' as ViewMode, label: 'Table', icon: List, color: 'text-primary', hoverAnim: 'group-hover:-rotate-12' },
  ];

  return (
    <>
      <div ref={dropdownRef} className={`relative flex-1 sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- Desktop View (Segmented Control - Unchanged) --- */}
        <div className="hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 w-auto">
          <div className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${viewMode === 'grid' ? 'left-1 w-[calc(50%-4px)]' : 'left-[50%] w-[calc(50%-4px)]'}`} />
          {viewOptions.map(option => (
            <button key={option.mode} onClick={() => handleViewChange(option.mode)} className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-sm active:scale-95 ${viewMode === option.mode ? 'text-white' : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary hover:shadow-lg hover:bg-white/10 dark:hover:bg-gray-800/10'}`}>
              <option.icon className={`w-4 h-4 transition-all duration-225 ${viewMode === option.mode ? 'scale-110' : `group-hover:text-white dark:group-hover:text-primary ${option.mode === 'grid' ? 'group-hover:rotate-12' : 'group-hover:-rotate-12'}`}`} />
              <span className={`transition-all duration-225 ${viewMode === option.mode ? 'font-semibold text-white' : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'}`}>{option.label}</span>
            </button>
          ))}
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
          
          {/* [MODIFIED] Dropdown container with exact animation and styling from Code 1 */}
          <div className={`absolute top-full mt-2 left-0 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-xl p-2 flex flex-col gap-0.5 w-full transform transition-all duration-500 ease-out origin-top-right ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto'
              : 'opacity-0 scale-75 -translate-y-4 rotate-12 pointer-events-none'
          }`}>
            {viewOptions.map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === viewOptions.length - 1;
              
              // [MODIFIED] Exact corner rounding logic from Code 1
              const cornerClass = isFirst ? 'rounded-t-xl rounded-sm' : isLast ? 'rounded-b-xl rounded-sm' : 'rounded-sm';

              return (
                // [MODIFIED] Exact button classes from Code 1
                <button
                  key={option.mode}
                  onClick={() => handleViewChange(option.mode)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 backdrop-blur-sm transform origin-center hover:scale-105 hover:-translate-y-1 text-sm font-medium ${cornerClass} ${
                    option.mode === viewMode
                      ? 'bg-primary/80 text-white'
                      : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${100 + index * 50}ms` : '0ms',
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  {/* [MODIFIED] Exact icon classes and logic from Code 1 */}
                  <option.icon
                    size={18}
                    className={`transition-all duration-300 group-hover:scale-110 ${option.color} ${option.hoverAnim} ${
                      option.mode === viewMode ? 'scale-110' : ''
                    }`}
                  />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};