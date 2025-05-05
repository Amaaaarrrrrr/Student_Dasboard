/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#1DA1F2',
          secondary: '#14171A',
          accent: '#657786',
          background: '#F5F8FA',
          text: '#14171A',
        },
      },
    },
    variants: {
      extend: {
        backgroundColor: ['active'],
        textColor: ['active'],
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#1DA1F2',
          secondary: '#14171A',
          accent: '#657786',
          background: '#F5F8FA',
          text: '#14171A',
        },
      },
    },
    variants: {
      extend: {
        backgroundColor: ['active'],
        textColor: ['active'],
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  