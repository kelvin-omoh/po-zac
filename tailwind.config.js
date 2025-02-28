/** @type {import('tailwindcss').Config} */
// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        arsenal: ["Arsenal SC", "serif"]
      },
      screens: {
        xs: "340px",
        // ...defaultTheme.screens,
      }
    },
  },
  plugins: [],
};
