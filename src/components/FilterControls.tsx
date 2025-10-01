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
  if (unavailableCount === 0) return null;
  const availableCount = totalCount - unavailableCount;
  const filterOptions = [
    { mode: 'all' as FilterMode, label: 'All', count: totalCount, icon: Filter, color: 'text-primary', hoverAnim: 'group-hover:rotate-12' },
    { mode: 'available' as FilterMode, label: 'Available', count: availableCount, icon: Eye, color: 'text-primary', hoverAnim: 'group-hover:[transform:rotate(360deg)]' },
    { mode: 'unavailable' as FilterMode, label: 'Unavailable', count: unavailableCount, icon: EyeOff, color: 'text-primary', hoverAnim: 'group-hover:[transform:rotate(-360deg)]' },
  ];
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
      <div ref={dropdownRef} className={`relative flex-1 sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- Desktop View --- */}
        <div className="hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left sm:w-[540px]">
          <div 
            className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
              filterMode === 'all' 
                ? 'left-1 w-[calc(33.333%-4px)]' 
                : filterMode === 'available'
                ? 'left-[33.333%] w-[calc(33.333%-4px)]'
                : 'left-[66.666%] w-[calc(33.333%-4px)]'
            }`}
          />
          {filterOptions.map(option => (
            <button
              key={option.mode}
              onClick={() => handleFilterChange(option.mode)}
              // [FIX 1] Added 'group' class to the button
              className={`group relative z-10 flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all duration-225 text-sm min-w-0 flex-1 ${
                filterMode === option.mode
                  ? 'text-white'
                  : 'text-gray-900 dark:text-white dark:hover:text-primary hover:text-white hover:bg-white/10'
              }`}
            >
              {/* [FIX 2] Corrected icon class to use option.hoverAnim directly */}
              <option.icon className={`w-4 h-4 transition-all duration-500 ${ 
                filterMode === option.mode ? 'scale-110' : option.hoverAnim
              }`} />
              <span className={`transition-all duration-225 whitespace-nowrap ${
                filterMode === option.mode ? 'font-semibold' : ''
              }`}>
                {`${option.label} (${option.count})`}
              </span>
            </button>
          ))}
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
          <div className={`absolute top-full mt-2 left-0 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl shadow-xl p-2 flex flex-col gap-0.5 w-full transform transition-all duration-500 ease-out origin-top-right ${
            isMobileMenuOpen
              ? 'opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto'
              : 'opacity-0 scale-75 -translate-y-4 rotate-12 pointer-events-none'
          }`}>
            {filterOptions.map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === filterOptions.length - 1;
              const cornerClass = isFirst ? 'rounded-t-xl rounded-sm' : isLast ? 'rounded-b-xl rounded-sm' : 'rounded-sm';
              return (
                <button
                  key={option.mode}
                  onClick={() => handleFilterChange(option.mode)}
                  className={`group w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 backdrop-blur-sm transform origin-center hover:scale-105 hover:-translate-y-1 text-sm font-medium ${cornerClass} ${
                    option.mode === filterMode
                      ? 'bg-primary/80 text-white'
                      : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${100 + index * 50}ms` : '0ms',
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  <option.icon
                    size={18}
                    className={`transition-all duration-500 group-hover:scale-110 ${
                      option.mode === filterMode ? 'text-white' : option.color
                    } ${option.hoverAnim} ${
                      option.mode === filterMode ? 'scale-110' : ''
                    }`}
                  />
                  <span className="whitespace-nowrap">{`${option.label} (${option.count})`}</span>
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
};111