/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Arabic"', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: 'var(--color-primary, #059669)',
          secondary: 'var(--color-secondary, #065f46)',
          accent: 'var(--color-accent, #f59e0b)',
          bg: 'var(--color-bg, #f9fafb)'
        }
      }
    },
  },
  plugins: [],
}
