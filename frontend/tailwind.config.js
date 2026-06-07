/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f4',
          100: '#cce5e9',
          200: '#99cbd3',
          300: '#66b0bd',
          400: '#3396a7',
          500: '#00303d',
          600: '#00303d',
          700: '#002029',
          800: '#001720',
          900: '#000d15',
        },
        accent: {
          50: '#ecfcfc',
          100: '#d9f9f9',
          200: '#b3f3f3',
          300: '#8deded',
          400: '#67e7e7',
          500: '#34DDDD',
          600: '#2ab1b1',
          700: '#1f8585',
          800: '#155858',
          900: '#0a2c2c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-up-delay': 'slideUp 0.8s ease-out 0.3s both',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
