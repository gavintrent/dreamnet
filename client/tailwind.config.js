/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        highlight: '#75d2a5',
        background: '#332e4e',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      
    ],
  },
};