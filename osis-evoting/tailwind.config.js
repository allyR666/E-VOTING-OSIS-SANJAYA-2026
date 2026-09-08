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
        },
        fiesta: {
          purple: '#7C3AED',
          magenta: '#DB2777',
          pink: '#F472B6',
          orange: '#F97316',
          amber: '#FBBF24',
          teal: '#14B8A6',
          sky: '#38BDF8',
          lime: '#A3E635'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        seal: '0 0 0 3px rgba(212,162,76,0.25), 0 16px 34px -18px rgba(76,29,149,0.55)',
        card: '0 20px 45px -20px rgba(76,29,149,0.35)'
      },
      backgroundImage: {
        fiesta: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 32%, #F97316 65%, #FBBF24 100%)'
      }
    }
  },
  plugins: []
}
