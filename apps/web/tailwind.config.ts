import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF5623',
          light: '#FF7950',
          dark: '#E04010',
        },
        bg: {
          DEFAULT: '#EEEEEE',
          card: '#FFFFFF',
        },
        nav: {
          dark: '#181818',
        },
        text: {
          primary: '#303030',
          secondary: '#5E5E5E',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.12)',
          focus: 'rgba(0,0,0,0.2)',
        },
        difficulty: {
          easy: '#16A34A',
          moderate: '#D97706',
          challenging: '#DC2626',
        },
        status: {
          pending: '#6B7280',
          processing: '#2563EB',
          completed: '#16A34A',
          failed: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'Bricolage Grotesque', 'sans-serif'],
      },
      borderRadius: {
        card: '32px',
        'card-sm': '16px',
        pill: '100px',
        input: '100px',
      },
      boxShadow: {
        sidebar: '0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)',
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px 0 rgba(0,0,0,0.12)',
        'orange-glow': '0 0 0 4px #FF795040',
      },
      width: {
        sidebar: '304px',
      },
      letterSpacing: {
        tight: '-0.04em',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
