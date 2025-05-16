/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      center: true,
      screens: {
        xl: '1360px',
      },
    },
    extend: {
      colors: {
        'primary'  : '#2b71dc',
        'title'    : '0E0F10',
        'paragraph': '#0E0F10',
        'background'    : '#fff',
        'main'  :'#18bc9c'
      },
      fontFamily: {
        'monserrat': ['Montserrat', 'sans-serif'],
      },
      flexBasis: {
        'custom': 'calc(100% - 90px)',
      },
    },
  },
  plugins: [

  ],
}
