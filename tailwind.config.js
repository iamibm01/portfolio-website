/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C42',
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#F7931E',
          light: '#FFB380',
          dark: '#D67A0D',
        },
        accent: '#FF8C42',

        // Light mode specific
        light: {
          bg: '#FFF8F3',
          surface: '#FFFFFF',
          text: {
            primary: '#2D2D2D',
            secondary: '#666666',
          },
        },

        // Dark mode specific
        dark: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          text: {
            primary: '#F5F5F5',
            secondary: '#A0A0A0',
          },
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },

      // Typography scale (from your design doc)
      fontSize: {
        // Hero sizes
        'hero-sm': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 56px
        'hero-md': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 72px
        'hero-lg': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 96px

        // Section headings
        'section-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 36px
        'section-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 48px

        // Project/Card headings
        'card-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 24px
        'card-md': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 30px

        // Body text
        'body-sm': ['0.875rem', { lineHeight: '1.5' }], // 14px
        'body-base': ['1rem', { lineHeight: '1.6' }], // 16px
        'body-lg': ['1.125rem', { lineHeight: '1.7' }], // 18px
      },

      // Line height scale
      lineHeight: {
        tight: '1.1',
        snug: '1.3',
        normal: '1.5',
        relaxed: '1.7',
        loose: '2',
      },

      // Letter spacing
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
      },

      // Gradient utilities
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        'gradient-card': 'linear-gradient(135deg, #FF8C42 0%, #FFB380 100%)',
      },

      // Animation durations
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-rotate': 'floatRotate 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'slide-down': 'slideDown 0.3s ease-out', // ← Add this
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatRotate: {
          '0%, 100%': { transform: 'translateY(0px) rotate(12deg)' },
          '50%': { transform: 'translateY(-20px) rotate(22deg)' },
        },
        slideDown: {
          // ← Add this
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-rotate': 'floatRotate 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out', // ← Add
        'slide-up': 'slideUp 0.6s ease-out', // ← Add
        'slide-up-delay-1': 'slideUp 0.6s ease-out 0.2s backwards', // ← Add
        'slide-up-delay-2': 'slideUp 0.6s ease-out 0.4s backwards', // ← Add
        'slide-up-delay-3': 'slideUp 0.6s ease-out 0.6s backwards', // ← Add
        'fade-scale-delay': 'fadeScale 0.5s ease-out 0.8s backwards', // ← Add
        'stagger-1': 'fadeIn 0.4s ease-out 1s backwards', // ← Add
        'stagger-2': 'fadeIn 0.4s ease-out 1.1s backwards', // ← Add
        'stagger-3': 'fadeIn 0.4s ease-out 1.2s backwards', // ← Add
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatRotate: {
          '0%, 100%': { transform: 'translateY(0px) rotate(12deg)' },
          '50%': { transform: 'translateY(-20px) rotate(22deg)' },
        },
        slideDown: {
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
        fadeIn: {
          // ← Add
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          // ← Add
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeScale: {
          // ← Add
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
