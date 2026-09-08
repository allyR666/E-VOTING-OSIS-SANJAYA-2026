/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080B14',
          900: '#0B1120',
          800: '#111A2E',
          700: '#182342',
          600: '#243256'
        },
        parchment: '#F4EFE4',
        gold: {
          400: '#E4BE72',
          500: '#D4A24C',
          600: '#B5822F'
        },
        merah: {
          500: '#C13B3B',
          600: '#A32E2E'
        },
        sage: {
          400: '#6FAE85',
          500: '#3E8E5A'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        seal: '0 0 0 3px rgba(212,162,76,0.25), 0 20px 45px -20px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(244,239,228,0.06) 1px, transparent 0)"
      }
    }
  },
  plugins: []
}
