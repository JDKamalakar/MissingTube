import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const themeToggleRef = useRef<HTMLDivElement>(null);

  const isSystemActive = theme === 'system';
  const isLightActive = theme === 'light';
  const isDarkActive = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeToggleRef.current && !themeToggleRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleThemeSelect = (selectedTheme: 'system' | 'light' | 'dark') => {
    setTheme(selectedTheme);
    setShowOptions(false);
  };

  return (
    <div
      ref={themeToggleRef}
      // [MODIFIED] Replaced `top-7` with an arbitrary value `top-[26px]` for finer control.
      // You can change `26px` to any value you need.
      className={`fixed z-40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'top-[26px] right-6'  // Scrolled
          : 'top-[25px] right-14' // Not-Scrolled
      }`}
      style={{
        paddingTop: 'var(--mobile-safe-area-top)',
        paddingRight: 'var(--mobile-safe-area-right)'
      }}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        // [FIXED] Corrected the className logic for hover effects
        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group shadow-xl touch-target hover:scale-110 active:scale-95"
        aria-label="Toggle theme"
      >
        <div className={`relative flex items-center justify-center transition-all duration-300 ease-in-out w-5 h-5 sm:w-6 sm:h-6 ${showOptions ? 'rotate-[360deg]' : 'rotate-0'}`}>
          <Monitor
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isSystemActive
                ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:animate-pulse'
                : 'opacity-0 scale-50 rotate-[-90deg]'
            } text-blue-500 dark:text-blue-400`}
          />
          <Sun
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isLightActive
                ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:rotate-180'
                : 'opacity-0 scale-50 rotate-[90deg]'
            } text-yellow-500`}
          />
          <Moon
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isDarkActive
                ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:animate-pulse group-hover:rotate-[360deg]'
                : 'opacity-0 scale-50 rotate-[-90deg]'
            } text-blue-400`}
          />
        </div>
      </button>

      <div className={`absolute top-12 sm:top-16 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-3 min-w-[140px] sm:min-w-[180px] transform transition-all duration-500 ease-out origin-top-right ${
        showOptions
          ? 'opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto'
          : 'opacity-0 scale-75 -translate-y-4 rotate-12 pointer-events-none'
      }`}>
        {[
          { label: 'System', value: 'system' as const, icon: Monitor, active: isSystemActive },
          { label: 'Light', value: 'light' as const, icon: Sun, active: isLightActive },
          { label: 'Dark', value: 'dark' as const, icon: Moon, active: isDarkActive },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleThemeSelect(option.value)}
            className={`group w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 backdrop-blur-sm mb-1 sm:mb-2 transform origin-center touch-target text-xs sm:text-sm ${
              option.active
                ? 'bg-blue-500/40 text-blue-700 dark:text-blue-300 shadow-lg scale-105 border border-blue-300/30 dark:border-blue-500/30'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
            } hover:scale-105 hover:-translate-y-1`}
          >
            <option.icon size={14} className={`transition-all duration-300 group-hover:scale-110 ${option.active ? 'scale-110' : ''}`} />
            <span className="text-xs sm:text-sm font-medium inline-block group-hover:scale-110 transition-transform duration-300">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};