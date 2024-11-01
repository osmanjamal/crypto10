/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1a1f2e',
        'medium-blue': '#1c2c4f',
        'light-blue': '#2d4a7c',
      },
    },
  },
  plugins: [],
}