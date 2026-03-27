/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        script:  ['Great Vibes', 'cursive'],
        display: ['Cormorant Garamond', 'serif'],
        sans:    ['Nunito', 'sans-serif'],
      },
      colors: {
        rosa:    { DEFAULT: '#f4a7be', light: '#fde0ea', dark: '#e07898' },
        lila:    { DEFAULT: '#d8b4e2', light: '#f0e4f7', dark: '#b890cc' },
        crema:   { DEFAULT: '#fff8f2', dark: '#f5e8da' },
        durazno: { DEFAULT: '#fde3cf', dark: '#f5c8a8' },
        menta:   { DEFAULT: '#d4ede0', dark: '#a8d8c0' },
        dorado:  { DEFAULT: '#e8c47a', light: '#f8e8b8' },
        texto:   '#5a3550',
        suave:   '#b89aac',
      },
      animation: {
        'float':   'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'fadeUp':  'fadeUp .8s cubic-bezier(.34,1.56,.64,1) both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':     { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%,100%': { transform: 'scale(1)',    opacity: '1'   },
          '50%':     { transform: 'scale(1.05)', opacity: '.9'  },
        },
        shimmer: {
          '0%,100%': { textShadow: '0 0 0 transparent' },
          '50%':     { textShadow: '0 0 24px rgba(212,140,180,.6)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px) scale(.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)'      },
        },
      },
    },
  },
  plugins: [],
}
