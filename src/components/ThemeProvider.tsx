import React, { createContext, useContext, useState, useEffect } from 'react';

// Defines the types for the theme
type Theme = 'light' | 'dark' | 'system';

// Defines the shape of the context value
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

// Creates the React Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to consume the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

// The ThemeProvider component manages theme state and applies it to the document
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State to hold the current theme, initialized from localStorage or 'system'
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  // State to determine if the current effective theme is dark
  const [isDark, setIsDark] = useState(false);

  // Effect to update the theme whenever 'theme' state changes
  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;
      
      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // If theme is 'system', check the user's system preference
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(shouldBeDark); // Update isDark state

      // Apply or remove the 'dark' class to the document's root element
      const root = document.documentElement;
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Initial theme update and store theme in localStorage
    updateTheme();
    localStorage.setItem('theme', theme);

    // Set up a listener for system theme changes if the theme is set to 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme(); // Re-run updateTheme if system preference changes
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    // Cleanup function to remove the event listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]); // Depend on 'theme' state

  // Provide the theme, setTheme function, and isDark state to children
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};