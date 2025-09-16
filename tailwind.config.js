/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ocean-inspired Material Design 3 Color System
        primary: 'rgb(var(--md-sys-color-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--md-sys-color-on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--md-sys-color-primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--md-sys-color-on-primary-container) / <alpha-value>)',
        
        secondary: 'rgb(var(--md-sys-color-secondary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--md-sys-color-on-secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--md-sys-color-secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--md-sys-color-on-secondary-container) / <alpha-value>)',
        
        tertiary: 'rgb(var(--md-sys-color-tertiary) / <alpha-value>)',
        'on-tertiary': 'rgb(var(--md-sys-color-on-tertiary) / <alpha-value>)',
        'tertiary-container': 'rgb(var(--md-sys-color-tertiary-container) / <alpha-value>)',
        'on-tertiary-container': 'rgb(var(--md-sys-color-on-tertiary-container) / <alpha-value>)',
        
        error: 'rgb(var(--md-sys-color-error) / <alpha-value>)',
        'on-error': 'rgb(var(--md-sys-color-on-error) / <alpha-value>)',
        'error-container': 'rgb(var(--md-sys-color-error-container) / <alpha-value>)',
        'on-error-container': 'rgb(var(--md-sys-color-on-error-container) / <alpha-value>)',
        
        warning: 'rgb(var(--md-sys-color-warning) / <alpha-value>)',
        'on-warning': 'rgb(var(--md-sys-color-on-warning) / <alpha-value>)',
        'warning-container': 'rgb(var(--md-sys-color-warning-container) / <alpha-value>)',
        'on-warning-container': 'rgb(var(--md-sys-color-on-warning-container) / <alpha-value>)',
        
        background: 'rgb(var(--md-sys-color-background) / <alpha-value>)',
        'on-background': 'rgb(var(--md-sys-color-on-background) / <alpha-value>)',
        
        surface: 'rgb(var(--md-sys-color-surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--md-sys-color-on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--md-sys-color-surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--md-sys-color-on-surface-variant) / <alpha-value>)',
        
        'surface-container-lowest': 'rgb(var(--md-sys-color-surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--md-sys-color-surface-container-low) / <alpha-value>)',
        'surface-container': 'rgb(var(--md-sys-color-surface-container) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--md-sys-color-surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--md-sys-color-surface-container-highest) / <alpha-value>)',
        
        outline: 'rgb(var(--md-sys-color-outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--md-sys-color-outline-variant) / <alpha-value>)',
        
        scrim: 'rgb(var(--md-sys-color-scrim) / <alpha-value>)',
        
        'inverse-surface': 'rgb(var(--md-sys-color-inverse-surface) / <alpha-value>)',
        'on-inverse-surface': 'rgb(var(--md-sys-color-on-inverse-surface) / <alpha-value>)',
        'inverse-primary': 'rgb(var(--md-sys-color-inverse-primary) / <alpha-value>)',

        'primary-rgb': 'var(--md-sys-color-primary-rgb)',
      },
      animation: {
        'fade-in': 'fade-in 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        'modal-enter': 'modal-enter 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slide-in-left 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slide-in-right 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'bounce-in 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'spin': 'spin 1s linear infinite',
        'bounce-up': 'bounce-up 1s infinite',
        'bounce-short-slow': 'bounce-short-slow 1.5s infinite',
        'super-fast-bounce': 'super-fast-bounce 0.3s infinite',
        'swipe-in-left': 'swipe-in-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'swipe-in-right': 'swipe-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slide-up 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        // --- ADDED WIGGLE AND SHAKE ANIMATIONS ---
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'shake': 'shake 0.4s linear infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'aurora-slow': 'aurora-slow 12s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'modal-enter': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(100%) scale(0.9)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        'bounce-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.3)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.05)' 
          },
          '70%': { 
            transform: 'scale(0.9)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
        'bounce-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }, 
        },
        'bounce-short-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'super-fast-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'swipe-in-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-100%)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        'swipe-in-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(100%)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        'slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(100%)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        // --- ADDED WIGGLE AND SHAKE KEYFRAMES ---
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'aurora': {
          '0%, 100%': { 
            transform: 'translateX(-50%) translateY(-50%) rotate(0deg) scale(1)',
            opacity: '0.3'
          },
          '25%': { 
            transform: 'translateX(-40%) translateY(-60%) rotate(90deg) scale(1.1)',
            opacity: '0.5'
          },
          '50%': { 
            transform: 'translateX(-60%) translateY(-40%) rotate(180deg) scale(0.9)',
            opacity: '0.4'
          },
          '75%': { 
            transform: 'translateX(-45%) translateY(-55%) rotate(270deg) scale(1.05)',
            opacity: '0.6'
          },
        },
        'aurora-slow': {
          '0%, 100%': { 
            transform: 'translateX(-50%) translateY(-50%) rotate(0deg) scale(1)',
            opacity: '0.2'
          },
          '33%': { 
            transform: 'translateX(-30%) translateY(-70%) rotate(120deg) scale(1.2)',
            opacity: '0.4'
          },
          '66%': { 
            transform: 'translateX(-70%) translateY(-30%) rotate(240deg) scale(0.8)',
            opacity: '0.3'
          },
        },
      },
      boxShadow: {
        'elevation-1': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(14, 165, 233, 0.05)',
        'elevation-2': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(14, 165, 233, 0.08)',
        'elevation-3': '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(14, 165, 233, 0.1)',
        'elevation-4': '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(14, 165, 233, 0.12)',
        'elevation-5': '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(14, 165, 233, 0.15)',
        'glow-small': '0 0 5px 1px rgba(var(--md-sys-color-primary-rgb), 0.2)', 
        'glow-large': '0 0 25px 8px rgba(var(--md-sys-color-primary-rgb), 0.6)', 
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      textShadow: {
        'sm': '0px 1px 2px rgba(0, 0, 0, 0.4)',
        'md': '0px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      dropShadow: {
        'sm-icon': '0px 1px 1px rgba(0, 0, 0, 0.3)',
        'md-icon': '0px 2px 2px rgba(0, 0, 0, 0.4)',
      },
      transitionDuration: {
        '225': '225ms',
        '195': '195ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'standard-decelerate': 'cubic-bezier(0, 0, 0, 1)',
        'standard-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'var(--mobile-safe-area-top)',
        'safe-bottom': 'var(--mobile-safe-area-bottom)',
        'safe-left': 'var(--mobile-safe-area-left)',
        'safe-right': 'var(--mobile-safe-area-right)',
      },
      height: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
      },
      minHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
      },
      maxHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newTextShadows = {};
      for (const key in theme('textShadow')) {
        newTextShadows[`.text-shadow-${key}`] = {
          'text-shadow': theme('textShadow')[key],
        };
      }
      addUtilities(newTextShadows, ['responsive', 'hover', 'group-hover']);

      const newDropShadows = {};
      for (const key in theme('dropShadow')) {
        newDropShadows[`.drop-shadow-${key}`] = {
          'filter': `drop-shadow(${theme('dropShadow')[key]})`,
        };
      }
      addUtilities(newDropShadows, ['responsive', 'hover', 'group-hover']);
    },
  ],
  safelist: [
    'group-hover:-rotate-[30deg]',
    'group-hover:rotate-[360deg]',
    'group-hover:animate-bounce-short-slow',
    'group-hover:drop-shadow-sm-icon',
    'group-hover:text-shadow-sm', 
    
    'invisible',
    'group-hover:visible',
    'group-hover:opacity-100',
    'group-hover:-top-16', 

    'max-h-0',
    'max-h-screen',

    'hover:scale-[1.005]',
    'hover:scale-[1.04]', 
    'hover:shadow-xl', 
    'hover:shadow-md',
  ],
};