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
        // Palet biru elegan / profesional — latar & aksen utama
        azure: {
          50: '#EFF6FF',
          100: '#DCEBFF',
          200: '#B7D8FF',
          300: '#89BEFF',
          400: '#569DFF',
          500: '#2E7DF5',
          600: '#1D5FDB',
          700: '#1848A8',
          800: '#123A85',
          900: '#0E2C63'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        seal: '0 0 0 3px rgba(212,162,76,0.25), 0 16px 34px -18px rgba(14,44,99,0.45)',
        card: '0 20px 45px -20px rgba(14,44,99,0.28)'
      },
      backgroundImage: {
        elegant: 'linear-gradient(135deg, #0E2C63 0%, #18449C 30%, #2E7DF5 65%, #5FA8F5 100%)'
      }
    }
  },
  plugins: []
}
