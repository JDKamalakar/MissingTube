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

  // Handle scroll detection for positioning
  useEffect(() => {
    const handleScroll = () => {
      // Sets scrolled state to true after scrolling 80px
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
      // Uses arbitrary values like `top-[26px]` for precise positioning
      className={`fixed z-40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'top-[20px] right-6'  // Scrolled
          : 'top-[26px] right-14' // Default Sate
      }`}
      style={{
        paddingTop: 'var(--mobile-safe-area-top)',
        paddingRight: 'var(--mobile-safe-area-right)'
      }}
    >
      <button
        onClick={() => setShowOptions(!showOptions)}
        // Conditionally changes shape and size based on the `isScrolled` state
        className={`flex items-center justify-center bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-gray-300/40 dark:border-gray-700/40 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group shadow-xl touch-target active:scale-95 hover:scale-110 ${
          isScrolled
            ? 'w-14 h-16 rounded-xl sm:rounded-2xl' // Scrolled state
            : 'p-2 sm:p-3 rounded-xl sm:rounded-2xl' // Default state
        }`}
        aria-label="Toggle theme"
      >
        <div className={`relative flex items-center justify-center transition-all duration-300 ease-in-out ${
            isScrolled ? 'w-6 h-6' : 'w-5 h-5 sm:w-6 sm:h-6'
          } ${showOptions ? 'rotate-[360deg]' : 'rotate-0'}`}
        >
          <Monitor
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              isSystemActive
                ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110'
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
                ? 'opacity-100 scale-100 rotate-0 group-hover:scale-110 group-hover:rotate-[360deg]'
                : 'opacity-0 scale-50 rotate-[-90deg]'
            } text-blue-400`}
          />
        </div>
      </button>

      {/* Theme Options Popover */}
      <div className={`absolute top-full mt-2 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-xl sm:rounded-2xl shadow-xl p-2 min-w-[160px] transform transition-all duration-300 ease-out origin-top-right ${
        showOptions
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-90 pointer-events-none'
      }`}>
        {[
          { label: 'System', value: 'system' as const, icon: Monitor, active: isSystemActive },
          { label: 'Light', value: 'light' as const, icon: Sun, active: isLightActive },
          { label: 'Dark', value: 'dark' as const, icon: Moon, active: isDarkActive },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleThemeSelect(option.value)}
            className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg sm:rounded-xl transition-colors duration-200 text-xs sm:text-sm font-medium ${
              option.active
                ? 'bg-primary/80 text-white'
                : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'
            }`}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};