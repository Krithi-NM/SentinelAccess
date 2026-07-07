/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#215868",
        secondary: "#F7F9F9",
        accent: "#FFD449",
        risk: {
          low: "#4CA771",
          medium: "#E8A33D",
          high: "#E8603C",
          critical: "#C62E2E",
        },
        body: "#2A2A2A",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
