import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="relative flex items-center bg-surface-container rounded-full p-3 shadow-md border border-outline-variant">
      {/* Animated Selector Background */}
      <div 
        className={`absolute top-2 bottom-2 bg-primary-container rounded-full transition-all duration-300 ease-out shadow-sm ${
          theme === 'light' 
            ? 'left-2 w-[calc(33.333%-4px)]' 
            : theme === 'dark'
            ? 'left-[33.333%] w-[calc(33.333%-4px)]'
            : 'left-[66.666%] w-[calc(33.333%-4px)]'
        }`}
      />
      
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative z-10 flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all duration-225 text-sm min-w-0 flex-1 justify-center ${
            theme === value
              ? 'text-on-primary-container'
              : 'text-on-surface hover:text-primary hover:bg-primary/8'
          }`}
          title={`Switch to ${label} theme`}
        >
          <Icon className={`w-4 h-4 transition-all duration-225 ${
            theme === value ? 'scale-110' : 'hover:scale-110'
          }`} />
          <span className={`hidden sm:inline transition-all duration-225 ${
            theme === value ? 'font-semibold' : ''
          }`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};