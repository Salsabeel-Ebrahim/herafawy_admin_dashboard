/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'] },
      colors: {
        page: '#f4f4f9',
        ink: '#24233a',
        muted: '#7c7b93',
        line: '#e8e8f0',
        primary: { DEFAULT: '#5b50d6', dark: '#4a40bd', soft: '#eceafc' },
        ok: { DEFAULT: '#12805c', soft: '#e3f6ee', line: '#bfe8d6' },
        warn: { DEFAULT: '#a5670b', soft: '#fdf1d9', line: '#f1dcae' },
        bad: { DEFAULT: '#c2394b', soft: '#fdeceb', line: '#f5c9c9' },
      },
      keyframes: {
        pop: { from: { opacity: 0, transform: 'translateY(8px) scale(.98)' }, to: { opacity: 1, transform: 'none' } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: { pop: 'pop .18s ease-out', fade: 'fade .15s ease-out' },
    },
  },
  plugins: [],
};
