import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          surface: '#111118',
          elevated: '#1a1a24',
        },
        border: {
          DEFAULT: '#1e1e2e',
          hover: '#2a2a3e',
        },
        accent: {
          DEFAULT: '#003399',
          bright: '#4d79ff',
          muted: '#002266',
        },
        risk: {
          high: '#ff4444',
          amber: '#ffaa00',
          green: '#00cc66',
        },
        text: {
          primary: '#e4e4e7',
          secondary: '#8888a0',
          muted: '#555570',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
