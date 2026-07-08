/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: { 600: '#0D4C5C', 700: '#093642' },
        gold: { 500: '#D4AF37', 600: '#B8962A' }
      }
    },
  },
  plugins: [],
}
