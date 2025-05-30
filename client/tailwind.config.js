/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dreamnet: {
          primary: "#5e0943",
          secondary: "#93186c",
          accent: "#d40f95",
          neutral: "#3d052b",
          "base-100": "#000000",
          info: "#c4c4c4",
          success: "#c4c4c4",
          warning: "#c4c4c4",
          error: "#c4c4c4",
        }
      },
      "light",
      "dark"
    ],
  },
};