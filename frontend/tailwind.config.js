/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mm-navy': '#003366',
        'mm-blue': '#0066CC',
        'mm-sky': '#0099FF',
        'mm-gold': '#FFD700',
        'mm-light': '#E6F2FF',
        'mm-border': '#0052A3',
        'mm-success': '#06A77D',
        'mm-warning': '#FF6B35',
        'mm-text': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
