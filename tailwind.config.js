/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in': 'slideIn 0.8s ease-out',
        'fade-in': 'fadeIn 1s ease-out',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};