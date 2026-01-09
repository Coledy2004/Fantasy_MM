/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mm-navy': '#003B5C',
        'mm-blue': '#00A3E0',
        'mm-sky': '#4FC3F7',
        'mm-gold': '#FFC72C',
        'mm-light': '#1E2A3A',
        'mm-border': '#2C3E50',
        'mm-success': '#4CAF50',
        'mm-warning': '#FF6B35',
        'mm-text': '#E0E0E0',
        'mm-dark': '#0A1628',
        'mm-card-bg': '#162235',
      },
    },
  },
  plugins: [],
}
