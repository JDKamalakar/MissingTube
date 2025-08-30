import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);
  const themeToggleRef = useRef<HTMLDivElement>(null);

  const isSystemActive = theme === 'system';
  const isLightActive = theme === 'light';
  const isDarkActive = theme === 'dark';

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
    // [MODIFIED] Removed fixed positioning to allow placement inside another component
    <div ref={themeToggleRef} className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/25 dark:bg-black/25 backdrop-blur-md border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-300 group shadow-lg hover:scale-110 active:scale-95"
        aria-label="Toggle theme"
      >
        <div className={`relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 ease-in-out ${showOptions ? 'rotate-[360deg]' : 'rotate-0'}`}>
          <Monitor className={`absolute inset-0 transition-all duration-500 ease-out ${isSystemActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'} text-blue-500 dark:text-blue-400`} />
          <Sun className={`absolute inset-0 transition-all duration-500 ease-out ${isLightActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'} text-yellow-500`} />
          <Moon className={`absolute inset-0 transition-all duration-500 ease-out ${isDarkActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'} text-blue-400`} />
        </div>
      </button>

      <div className={`absolute top-full mt-2 right-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-2xl shadow-xl p-2 min-w-[160px] transform transition-all duration-300 ease-out origin-top-right ${showOptions ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        {[
          { label: 'System', value: 'system' as const, icon: Monitor },
          { label: 'Light', value: 'light' as const, icon: Sun },
          { label: 'Dark', value: 'dark' as const, icon: Moon },
        ].map(option => (
          <button key={option.value} onClick={() => handleThemeSelect(option.value)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${theme === option.value ? 'bg-primary/80 text-white' : 'text-gray-900 dark:text-white hover:bg-white/10 dark:hover:bg-black/10'}`}>
            <option.icon className="w-4 h-4" />
            {option.label}
          </button>
        ))}
        </div>
    </div>
  );
};