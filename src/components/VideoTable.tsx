import React, { useState } from 'react';
import { Grid3X3, List, ChevronDown } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = (newMode: ViewMode) => {
    // If the new mode is the same as the current mode, and the mobile menu is open,
    // just close the menu and do nothing else.
    if (newMode === viewMode) {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      return;
    }
    
    // Find the container to apply the animation to.
    const container = document.querySelector('[data-filter-container]') || document.querySelector('[data-view-container]');
    
    if (container) {
      // Apply animation classes to fade and scale the content.
      container.classList.add('opacity-50', 'scale-95');
      
      // Delay the view change to allow the animation to start.
      setTimeout(() => {
        onViewModeChange(newMode);
        setIsMobileMenuOpen(false); // Close menu on view change
        
        // Wait a bit more, then remove the animation classes to reveal the new content.
        setTimeout(() => {
          container.classList.remove('opacity-50', 'scale-95');
        }, 150);
      }, 150);
    } else {
      // If no container is found, just change the view and close the menu without animation.
      onViewModeChange(newMode);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Desktop Toggle (visible on sm and larger screens) */}
      <div className="hidden sm:flex relative items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 w-auto">
        {/* Animated Selector Background */}
        <div 
          className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
            viewMode === 'grid' 
              ? 'left-1 w-[calc(50%-4px)]' 
              : 'left-[50%] w-[calc(50%-4px)]'
          }`}
        />
        
        <button
          onClick={() => handleViewChange('grid')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-sm
            ${viewMode === 'grid'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary'
            }`}
        >
          <Grid3X3 className={`w-4 h-4 transition-all duration-225 ${
            viewMode === 'grid' ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-white dark:group-hover:text-primary'
          }`} />
          <span className={`transition-all duration-225 ${
            viewMode === 'grid' 
              ? 'font-semibold text-white' 
              : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'
          }`}>
            Grid
          </span>
        </button>
        
        <button
          onClick={() => handleViewChange('table')}
          className={`group relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-225 flex-1 touch-target text-sm
            ${viewMode === 'table'
              ? 'text-white'
              : 'text-gray-900 dark:text-white hover:text-white dark:hover:text-primary'
            }`}
        >
          <List className={`w-4 h-4 transition-all duration-225 ${
            viewMode === 'table' ? 'scale-110' : 'group-hover:-rotate-12 group-hover:text-white dark:group-hover:text-primary'
          }`} />
          <span className={`transition-all duration-225 ${
            viewMode === 'table' 
              ? 'font-semibold text-white' 
              : 'text-gray-900 dark:text-white group-hover:font-semibold group-hover:text-white dark:group-hover:text-primary'
          }`}>
            Table
          </span>
        </button>
      </div>

      {/* Mobile Expanding Menu (visible on screens smaller than sm) */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl text-xs font-medium text-gray-900 dark:text-white border border-white/30 dark:border-white/20 transition-all duration-225 w-full mobile-button-compact
            ${viewMode === 'grid' ? 'text-primary dark:text-primary' : ''}`}
        >
          {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          <span>{viewMode === 'grid' ? 'Grid View' : 'Table View'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-225 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
        </button>

        {/* Menu options */}
        <div
          className={`absolute top-full mt-2 w-full origin-top transition-transform duration-225 ease-in-out z-20 ${
            isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-1 bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20">
            <button
              onClick={() => handleViewChange('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-225 hover:bg-primary/80 hover:text-white mobile-button-compact ${
                viewMode === 'grid' ? 'bg-primary/80 text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => handleViewChange('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium transition-all duration-225 hover:bg-primary/80 hover:text-white mobile-button-compact ${
                viewMode === 'table' ? 'bg-primary/80 text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};