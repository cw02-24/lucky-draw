/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          400: '#94A3B8',
          300: '#CBD5E1',
          50: '#F8FAFC',
        },
        yellow: {
          400: '#FACC15',
          500: '#EAB308',
        },
        green: {
          400: '#4ADE80',
        },
        red: {
          400: '#F87171',
        },
        violet: {
          400: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
