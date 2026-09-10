/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dfe3ea',
          300: '#c6ccd8',
          400: '#98a1b2',
          500: '#6b7488',
          600: '#4d5568',
          700: '#3a4152',
          800: '#242a37',
          900: '#151a24',
          950: '#0b0e14',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)',
        'card-hover': '0 12px 32px -8px rgb(16 24 40 / 0.14), 0 4px 10px -4px rgb(16 24 40 / 0.06)',
        pop: '0 20px 60px -12px rgb(16 24 40 / 0.22)',
        glow: '0 0 0 1px rgb(79 70 229 / 0.16), 0 12px 40px -12px rgb(79 70 229 / 0.45)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgb(16 24 40 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 24 40 / 0.045) 1px, transparent 1px)',
        'brand-sheen':
          'linear-gradient(110deg, transparent 20%, rgb(255 255 255 / 0.35) 45%, transparent 70%)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
        'fade-in': 'fade-in 0.22s ease-out both',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
