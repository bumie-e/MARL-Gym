/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-purple-500', 'to-pink-500',
    'from-blue-500', 'to-cyan-500',
    'from-green-500', 'to-emerald-500',
    'from-indigo-500', 'to-purple-500',
    'from-yellow-400', 'to-orange-500',
    'bg-gradient-to-r',
    'from-green-400',
    'to-emerald-500',
    'from-yellow-400',
    'to-orange-500',
    'from-red-400',
    'to-pink-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
