/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zendesk: {
          green: '#03363D',
          light: '#F8F9F9',
          border: '#D8DCDE'
        }
      }
    },
  },
  plugins: [],
}
