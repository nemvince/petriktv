/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petrik: {
          1: '#41988a',
          2: '#718935',
          3: '#99b18b'
        }
      },
    },
  },
  plugins: [],
}

