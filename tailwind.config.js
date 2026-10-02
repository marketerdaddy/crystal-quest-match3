/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crystal: {
          dark: '#080b14',
          panel: '#0e1626',
          card: 'rgba(20, 30, 50, 0.75)',
          border: 'rgba(100, 150, 255, 0.25)',
          ruby: '#ff2d55',
          sapphire: '#007aff',
          emerald: '#34c759',
          amethyst: '#af52de',
          topaz: '#ff9500',
          diamond: '#5ac8fa',
          astral: '#ff375f'
        }
      },
      fontFamily: {
        game: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        // Floating
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 5s ease-in-out 1.5s infinite',
        // Pulsing
        'pulse-subtle': 'pulse-glow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        // Shimmer
        'shimmer': 'shimmer 2.5s linear infinite',
        // Spinning
        'spin-slow': 'spin-slow 12s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 8s linear infinite',
        'spin-faster': 'spin-slow 4s linear infinite',
        // Bouncing
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        // Pop in
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        // Slide
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        // Fade
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-slow': 'fade-in 1s ease-out forwards',
        // Modal
        'modal-slide-up': 'modal-slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        // Radial pulse
        'radial-pulse': 'radial-pulse 2s ease-in-out infinite',
        // Twinkle
        'twinkle': 'twinkle 2s ease-in-out infinite',
        // Shake
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1.5deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(40px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-40px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(40px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'modal-slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'radial-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px 5px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 40px 15px rgba(6, 182, 212, 0.6)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.5), 0 0 30px rgba(6, 182, 212, 0.2)',
        'glow-gold': '0 0 15px rgba(234, 179, 8, 0.5), 0 0 30px rgba(234, 179, 8, 0.2)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.2)',
        'crystal': '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.2)',
      },
    },
  },
  plugins: [],
}
