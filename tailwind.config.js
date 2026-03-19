/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        globe: {
          red: '#cc0000',
          darkred: '#a00000',
          cream: '#f4f1ec',
          warmgray: '#e8e4dd',
          text: '#1d1d1b',
          muted: '#555555',
          light: '#888888',
          rule: '#c4bfb6',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
