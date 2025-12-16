/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enables dark mode with a 'dark' class on <html>
  theme: {
    extend: {
      colors: {
        // Brand colors (work in both light and dark mode)
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

      // Gradient utilities (from your design doc)
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        'gradient-card': 'linear-gradient(135deg, #FF8C42 0%, #FFB380 100%)',
      },
    },
  },
  plugins: [],
}