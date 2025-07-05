import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

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
      // Using a threshold (e.g., 80px) consistent with Navbar to avoid glitches
      setIsScrolled(window.scrollY > 80);
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
    setTheme('system');
    setShowOptions(false);
  };

  const handleManualTheme = (isDarkModeSelected: boolean) => {
    setTheme(isDarkModeSelected ? 'dark' : 'light');
    setShowOptions(false);
  };

  return (
    <div
      ref={themeToggleRef}
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'top-4 right-4' // When scrolled, position at top right
          : 'top-7 right-[4.25rem]' // When not scrolled, position with more spacing
      }`}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={`p-3 rounded-2xl bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group shadow-xl
          ${isScrolled
            ? 'scale-110 hover:scale-112'
            : 'hover:scale-110'
          }
        `}
        aria-label="Toggle theme"
      >
        <div className={`relative flex items-center justify-center transition-all duration-300 ease-in-out
                          ${isScrolled ? 'w-10 h-10' : 'w-6 h-6'}
                          ${showOptions ? 'rotate-[360deg]' : 'rotate-0'}`}>

          <Monitor
            className={`absolute inset-0 transition-all duration-500 ease-out
                        ${isSystemActive
                            ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:animate-pulse'
                            : 'opacity-0 scale-50 rotate-[-90deg]'
                        }
                        ${isScrolled ? 'translate-y-px' : ''}
                        text-blue-500 dark:text-blue-400`}
            size={isScrolled ? 36 : 24}
          />

          <Sun
            className={`absolute inset-0 transition-all duration-500 ease-out
                        ${isLightActive
                            ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:rotate-180'
                            : 'opacity-0 scale-50 rotate-[90deg]'
                        }
                        ${isScrolled ? 'translate-y-px' : ''}
                        text-yellow-500`}
            size={isScrolled ? 36 : 24}
          />

          <Moon
            className={`absolute inset-0 transition-all duration-500 ease-out
                        ${isDarkActive
                            ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:animate-pulse group-hover:rotate-[360deg]'
                            : 'opacity-0 scale-50 rotate-[-90deg]'
                        }
                        ${isScrolled ? 'translate-y-px' : ''}
                        text-blue-400`}
            size={isScrolled ? 36 : 24}
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
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm mb-2 transform origin-center
            ${isSystemActive
              ? 'bg-blue-500/40 text-blue-700 dark:text-blue-300 shadow-lg scale-105 border border-blue-300/30 dark:border-blue-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            }
            hover:scale-105 hover:-translate-y-1`}
          style={{
            transitionDelay: showOptions ? '100ms' : '0ms',
            opacity: showOptions ? 1 : 0
          }}
        >
          <Monitor
            size={18}
            className={`text-blue-500 transition-all duration-300
              ${isSystemActive ? 'scale-110' : ''}
              group-hover:rotate-12 group-hover:scale-110`}
          />
          <span className="text-sm font-medium inline-block group-hover:scale-110 transition-transform duration-300">System</span>
        </button>

        {/* Light Theme Button */}
        <button
          onClick={() => handleManualTheme(false)}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm mb-2 transform origin-center
            ${isLightActive
              ? 'bg-yellow-500/40 text-yellow-700 dark:text-yellow-300 shadow-lg scale-105 border border-yellow-300/30 dark:border-yellow-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            }
            hover:scale-105 hover:-translate-y-1`}
          style={{
            transitionDelay: showOptions ? '150ms' : '0ms',
            opacity: showOptions ? 1 : 0
          }}
        >
          <Sun
            size={18}
            className={`text-yellow-500 transition-all duration-300
              ${isLightActive ? 'scale-110' : ''}
              group-hover:rotate-180 group-hover:scale-110`}
          />
          <span className="text-sm font-medium inline-block group-hover:scale-110 transition-transform duration-300">Light</span>
        </button>

        {/* Dark Theme Button */}
        <button
          onClick={() => handleManualTheme(true)}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm transform origin-center
            ${isDarkActive
              ? 'bg-blue-500/40 text-blue-700 dark:text-blue-300 shadow-lg scale-105 border border-blue-300/30 dark:border-blue-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            }
            hover:scale-105 hover:-translate-y-1`}
          style={{
            transitionDelay: showOptions ? '200ms' : '0ms',
            opacity: showOptions ? 1 : 0
          }}
        >
          <Moon
            size={18}
            className={`text-blue-500 dark:text-blue-400 transition-all duration-300
              ${isDarkActive ? 'scale-110' : ''}
              group-hover:rotate-[360deg] group-hover:scale-110`}
          />
          <span className="text-sm font-medium inline-block group-hover:scale-110 transition-transform duration-300">Dark</span>
        </button>
      </div>
    </div>
  );
};