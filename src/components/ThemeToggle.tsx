import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider'; // Adjust path as needed

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [showOptions, setShowOptions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const themeToggleRef = useRef<HTMLDivElement>(null);

  // Derive active states based on the 'theme' value from useTheme
  const isSystemActive = theme === 'system';
  const isLightActive = theme === 'light';
  const isDarkActive = theme === 'dark';

  // Handle scroll detection for positioning
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close the options popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeToggleRef.current && !themeToggleRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  // Handlers for theme selection
  const handleSystemTheme = () => {
    setTheme('system'); // Set theme to 'system'
    setShowOptions(false);
  };

  const handleManualTheme = (isDarkModeSelected: boolean) => {
    setTheme(isDarkModeSelected ? 'dark' : 'light'); // Set theme to 'dark' or 'light'
    setShowOptions(false);
  };

  return (
    <div 
      ref={themeToggleRef} 
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'top-4 right-4' // When scrolled, position next to navbar buttons
          : 'top-6 right-6' // When not scrolled, position as if part of MissingTube area
      }`}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="p-3 rounded-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-110 group shadow-xl"
        aria-label="Toggle theme"
      >
        {/* Outer div to handle the 360-degree rotation when popover opens/closes */}
        <div className={`relative w-6 h-6 flex items-center justify-center 
                         transition-transform duration-700 ease-in-out 
                         ${showOptions ? 'rotate-[360deg]' : 'rotate-0'}`}>
          
          {/* System Theme Icon - Managed for visibility and animation */}
          <Monitor 
            className={`absolute inset-0 transition-all duration-500 ease-out 
                        ${isSystemActive 
                           ? 'opacity-100 scale-100 rotate-0' // Active: visible, default orientation
                           : 'opacity-0 scale-50 rotate-[-90deg]' // Inactive: hidden, rotated away
                        }
                        text-blue-500 dark:text-blue-400`}
            size={24}
          />

          {/* Light Theme Icon - Managed for visibility and animation */}
          <Sun 
            className={`absolute inset-0 transition-all duration-500 ease-out 
                        ${isLightActive 
                           ? 'opacity-100 scale-100 rotate-0' 
                           : 'opacity-0 scale-50 rotate-[90deg]' // Rotated the other way for variety
                        }
                        text-yellow-500`}
            size={24}
          />

          {/* Dark Theme Icon - Managed for visibility and animation */}
          <Moon 
            className={`absolute inset-0 transition-all duration-500 ease-out 
                        ${isDarkActive 
                           ? 'opacity-100 scale-100 rotate-0' 
                           : 'opacity-0 scale-50 rotate-[-90deg]'
                        }
                        text-blue-400`}
            size={24}
          />
        </div>
      </button>

      {/* Theme Options Popover */}
      <div className={`absolute top-16 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl shadow-xl p-3 min-w-[180px] transform transition-all duration-500 ease-out origin-top-right ${
        showOptions 
          ? 'opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto'
          : 'opacity-0 scale-75 -translate-y-4 rotate-12 pointer-events-none'
      }`}>
        {/* System Theme Button */}
        <button
          onClick={handleSystemTheme}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm mb-2 ${
            isSystemActive 
              ? 'bg-primary-container text-on-primary-container shadow-lg scale-105 border border-outline-variant' 
              : 'text-on-surface hover:bg-surface-container'
          }`}
          style={{ 
            transitionDelay: showOptions ? '100ms' : '0ms',
            transform: showOptions ? 'translateX(0)' : 'translateX(-10px)',
            opacity: showOptions ? 1 : 0
          }}
        >
          {/* Apply specific color and group-hover animation */}
          <Monitor size={18} className="text-blue-500 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-sm font-medium">System</span>
        </button>
        
        {/* Light Theme Button */}
        <button
          onClick={() => handleManualTheme(false)}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm mb-2 ${
            isLightActive 
              ? 'bg-warning-container text-on-warning-container shadow-lg scale-105 border border-outline-variant' 
              : 'text-on-surface hover:bg-surface-container'
          }`}
          style={{ 
            transitionDelay: showOptions ? '150ms' : '0ms',
            transform: showOptions ? 'translateX(0)' : 'translateX(-10px)',
            opacity: showOptions ? 1 : 0
          }}
        >
          {/* Apply specific color and group-hover animation */}
          <Sun size={18} className="text-yellow-500 transition-transform duration-300 group-hover:rotate-180" />
          <span className="text-sm font-medium">Light</span>
        </button>
        
        {/* Dark Theme Button */}
        <button
          onClick={() => handleManualTheme(true)}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm ${
            isDarkActive 
              ? 'bg-primary-container text-on-primary-container shadow-lg scale-105 border border-outline-variant' 
              : 'text-on-surface hover:bg-surface-container'
          }`}
          style={{ 
            transitionDelay: showOptions ? '200ms' : '0ms',
            transform: showOptions ? 'translateX(0)' : 'translateX(-10px)',
            opacity: showOptions ? 1 : 0
          }}
        >
          {/* Apply specific color and group-hover animation */}
          <Moon size={18} className="text-blue-400 transition-transform duration-300 group-hover:-rotate-12" />
          <span className="text-sm font-medium">Dark</span>
        </button>
      </div>
    </div>
  );
};