/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00AFF0',
        'dark': '#0F1419',
        'darker': '#000000',
      }
    },
  },
  plugins: [],
}
