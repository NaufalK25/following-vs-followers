/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        github: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
        githubMono: [
          '"SFMono-Regular"',
          'Consolas',
          '"Liberation Mono"',
          'Menlo',
          'Courier',
          'monospace',
        ],
      },
      colors: {
        github: {
          bg: '#0D1117',
          card: '#161B22',
          overlay: '#1C2128',
          text: {
            primary: '#C9D1D9',
            secondary: '#8B949E',
            placeholder: '#6E7681',
          },
          border: {
            primary: '#30363D',
            muted: '#21262D',
          },
          button: {
            primary: {
              bg: '#238636',
              text: '#FFFFFF',
            },
            secondary: {
              bg: '#21262D',
              text: '#C9D1D9',
            },
          },
          accent: {
            link: '#58A6FF',
            hover: '#1F6FEB',
          },
        },
      },
    },
  },
  plugins: [],
}

