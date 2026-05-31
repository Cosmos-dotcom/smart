/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'qwen-bg': '#070807',
        'qwen-cyan': '#5eead4',
        'qwen-orange': '#ff6a00',
        'qwen-green': '#9ef86f',
        'qwen-card': 'rgba(12, 15, 14, 0.84)',
      },
    },
  },
  plugins: [],
};
