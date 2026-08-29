/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2E7D5B', dark: '#1F5A40', light: '#E7F3EC' },
        accent: '#F2994A',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
};