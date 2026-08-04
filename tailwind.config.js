/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-darkest': '#0B0908',
        'bg-dark': '#1C1210',
        'bg-card': '#2C0F28',
        'surface-glass': 'rgba(242, 234, 217, 0.95)',
        'surface-border': 'rgba(11, 9, 8, 0.1)',
        'text-primary': '#F2EAD9',
        'text-secondary': '#A67F8B',
        'text-muted': '#6E6259',
        'text-accent': '#5E308A',
        'text-accent-hover': '#4A2370',
        'nav-bg': '#F2EAD9',
        'nav-text': '#0B0908',
      },
      fontFamily: {
        primary: ['Inter', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-bg': 'radial-gradient(1200px circle at 10% 10%, #1a0f1f 0%, #05070c 40%, #02030a 100%)',
        'gradient-avatar': 'linear-gradient(135deg, #5E308A, #4A2370)',
        'gradient-cta': 'linear-gradient(135deg, #5E308A 0%, #4A2370 100%)',
        'gradient-nordeste': 'linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #ef4444 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(94, 48, 138, 0.1) 0%, rgba(74, 35, 112, 0.1) 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 30px rgba(94, 48, 138, 0.15)',
        'cta': '0 4px 20px rgba(94, 48, 138, 0.3)',
      }
    },
  },
  plugins: [],
}
