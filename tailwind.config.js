/** @type {import('tailwindcss').Config} */

// Colour tokens live as RGB channels in src/index.css (:root and .dark),
// so one class covers both themes and opacity modifiers keep working.
const token = name => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ground: token('ground'), // page
        surface: token('surface'), // tone step instead of borders and shadows
        ink: token('ink'), // all running text
        muted: token('muted'), // secondary notes only
        accent: token('accent'), // actions, and little else
        'on-accent': token('on-accent'), // text set on accent
        field: token('field'), // one full-bleed dark section
        diff: {
          add: token('diff-add'),
          del: token('diff-del'),
        },
      },

      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        code: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      // Five steps do the visible work
      fontSize: {
        sm: ['0.9375rem', { lineHeight: '1.5' }], // 15px, meta
        base: ['1.125rem', { lineHeight: '1.55' }], // 18px, body
        lead: ['clamp(1.375rem, 1.1rem + 1vw, 1.75rem)', { lineHeight: '1.35' }], // 22–28px, statements
        title: [
          'clamp(2.25rem, 1.5rem + 3.2vw, 4rem)',
          { lineHeight: '1', letterSpacing: '-0.03em' },
        ], // section h2
        display: [
          'clamp(3rem, 0.5rem + 7vw, 7.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.035em' },
        ], // h1, sized for the half-width hero column

        // Legacy steps, retired as each section is rebuilt (hero: step 4, sections: step 6)
        'hero-sm': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 56px
        'section-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 36px
        'section-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 48px
      },

      spacing: {
        gutter: 'clamp(1rem, 0.5rem + 2vw, 2rem)', // outer margins
        section: 'clamp(7.5rem, 5rem + 8vw, 12.5rem)', // gap between sections
      },

      borderRadius: {
        DEFAULT: '0',
        ui: '6px', // inside interface fragments only
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

      // Flat accent under the old name until Hero (step 4) and Contact (step 8) drop it
      backgroundImage: {
        'gradient-hero': 'linear-gradient(rgb(var(--accent)), rgb(var(--accent)))',
      },

      transitionDuration: {
        DEFAULT: '200ms',
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up-delay-1': 'slideUp 0.6s ease-out 0.2s backwards',
        'slide-up-delay-2': 'slideUp 0.6s ease-out 0.4s backwards',
        'slide-up-delay-3': 'slideUp 0.6s ease-out 0.6s backwards',
        'fade-scale-delay': 'fadeScale 0.5s ease-out 0.8s backwards',
        'stagger-1': 'fadeIn 0.4s ease-out 1s backwards',
        'stagger-2': 'fadeIn 0.4s ease-out 1.1s backwards',
        'stagger-3': 'fadeIn 0.4s ease-out 1.2s backwards',
        'cta-pulse': 'ctaPulse 3.5s ease-in-out infinite', // ProjectCard "Learn more" button
        marquee: 'marquee 50s linear infinite', // About skills strip
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeScale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Opacity and transform only, so it stays on the compositor (no border-width or box-shadow)
        // The track holds two copies of the list, so -50% lands exactly on the start of the second
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Two quick beats, then a rest; scale only, so the button stays fully opaque
        ctaPulse: {
          '0%, 20%, 40%, 100%': { transform: 'scale(1)' },
          '10%, 30%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
}
