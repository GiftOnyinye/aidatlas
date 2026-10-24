/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        sand: '#F4F1DE',        // Main page background
        surface: '#FFFFFF',     // Cards
        'surface-tint': '#FAF8F2',

        // Primary (Terracotta)
        clay: {
          50: '#FDF5F2',
          100: '#F9E6E0',
          400: '#E99882',
          500: '#E07A5F', // Main action color
          600: '#C9654B',
          700: '#A64F39',
        },

        // Secondary (Teal)
        teal: {
          50: '#EFFCF9',
          100: '#D1F2EB',
          400: '#3BB5A5',
          500: '#0F766E', // Success / Strong fit
          600: '#0D6560',
        },

        // Text
        slate: '#3D405B',       // Primary text
        muted: '#828282',       // Secondary text
        'muted-light': '#A8A8A8', // Tertiary text

        // Borders
        line: '#E5D9C5',        // Standard border
        'line-dark': '#D4C5AC', // Stronger border
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(61, 64, 91, 0.06)',
        'card': '0 4px 16px rgba(61, 64, 91, 0.08)',
        'lift': '0 8px 24px rgba(61, 64, 91, 0.12)',
      }
    }
  },
  plugins: []
};