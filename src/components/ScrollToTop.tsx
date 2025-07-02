import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Ensure initial state check on component mount

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl 
                  transition-all duration-500 transform-gpu
                  group // Enable group-hover effects for icon and button
                  
                  // --- Base Styling: Transparency, Depth, Subtle Color, and FAINT GLOW ---
                  bg-primary-container/80 dark:bg-primary-container/30 
                  backdrop-blur-lg // Blurs content *behind* the button
                  border border-gray-300/30 dark:border-gray-700/30 
                  text-on-primary-container 
                  shadow-md // A standard button shadow for subtle lift
                  glow-small // *** FAINT, SMALL GLOW (ALWAYS ON) ***
                  
                  // --- Hover Effects: Background, Scale, and INCREASED GLOW ---
                  hover:bg-primary-container/90 hover:dark:bg-primary-container/40 
                  hover:scale-[1.08] active:scale-95 
                  hover:shadow-glow-large // *** INCREASED GLOW ON HOVER ***

                  // --- Enter/Exit Animation ---
                  ${isVisible
                    ? 'opacity-100 translate-y-0 rotate-0' // Visible: full opacity, in position, no rotation
                    : 'opacity-0 translate-y-full rotate-180 pointer-events-none' // Hidden: transparent, slides down fully, rotated 180deg
                  }
                `}
      aria-label="Scroll to top"
    >
      <ChevronUp 
        className="w-6 h-6 transition-transform duration-300 
                   group-hover:animate-bounce-up" // Icon bounce on hover
      />
    </button>
  );
};