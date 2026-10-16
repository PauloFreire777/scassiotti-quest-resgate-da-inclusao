/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutros com matiz índigo místico da arena RPG.
        slate: {
          50: '#f6f4ff',
          100: '#ece8ff',
          200: '#d9d2f7',
          300: '#b9afe0',
          400: '#9a8fcb',
          500: '#6f64a6',
          600: '#524887',
          700: '#3a3166',
          800: '#2a2350',
          900: '#1d1840',
          950: '#130f2e'
        },
        // Superfícies "papel" para cartas de palavra: máximo contraste de leitura.
        paper: {
          DEFAULT: '#fff3da',
          50: '#fffaf0',
          100: '#fff3da',
          200: '#f3e3bd',
          300: '#e0c98f',
          400: '#c9ae72',
          ink: '#2b2150'
        },
        // Papéis sintáticos: sempre cor + forma (ícone) + rótulo textual.
        role: {
          sujeito: '#3b82f6',
          verbo: '#22c55e',
          objeto: '#f59e0b'
        },
        cyber: {
          dark: '#130f2e',
          surface: '#1d1840',
          card: '#2a2350',
          elevated: '#3a3166',
          border: 'rgba(255, 255, 255, 0.12)',
          'border-focus': '#38bdf8'
        },
        svo: {
          sujeito: '#3b82f6',
          'sujeito-bg': 'rgba(59, 130, 246, 0.15)',
          'sujeito-border': '#60a5fa',
          verbo: '#10b981',
          'verbo-bg': 'rgba(16, 185, 129, 0.15)',
          'verbo-border': '#34d399',
          objeto: '#f59e0b',
          'objeto-bg': 'rgba(245, 158, 11, 0.15)',
          'objeto-border': '#fbbf24',
          conectivo: '#8b5cf6',
          'conectivo-bg': 'rgba(139, 92, 246, 0.15)',
          'conectivo-border': '#a78bfa'
        }
      },
      fontFamily: {
        sans: ['"Nunito Variable"', 'Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Nunito Variable"', 'Nunito', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        pop: '0 10px 24px rgba(8, 5, 28, 0.45)',
        gold: '0 0 25px rgba(251, 191, 36, 0.45), 0 15px 25px rgba(0, 0, 0, 0.85)'
      },
      animation: {
        'screen-shake': 'screenShake 0.48s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'subtle-shake': 'subtleShake 0.3s ease-in-out',
        'damage-float': 'damageFloat 1.1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shockwave': 'shockwaveExpand 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
        'idle-bob': 'idleBob 3.2s ease-in-out infinite',
        'idle-float': 'idleFloat 3.8s ease-in-out infinite',
        'pop-in': 'popIn 0.26s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'wave': 'wave 1.6s ease-in-out infinite',
        'hit': 'hit 0.55s ease-out both',
        'hero-attack': 'heroAttack 0.68s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-hit': 'heroHit 0.58s ease-out both',
        'monster-hit': 'monsterHit 0.68s ease-out both',
        'monster-attack': 'monsterAttack 0.62s cubic-bezier(0.22, 1, 0.36, 1) both',
        'heart-break': 'heartBreak 0.72s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards'
      },
      keyframes: {
        screenShake: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '15%, 75%': { transform: 'translate3d(-6px, 3px, 0) rotate(-0.6deg)' },
          '30%, 90%': { transform: 'translate3d(6px, -3px, 0) rotate(0.6deg)' },
          '45%': { transform: 'translate3d(-8px, -2px, 0) rotate(-0.8deg)' },
          '60%': { transform: 'translate3d(8px, 2px, 0) rotate(0.8deg)' }
        },
        subtleShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' }
        },
        damageFloat: {
          '0%': { opacity: '0', transform: 'translate(-50%, 10px) scale(0.3)' },
          '22%': { opacity: '1', transform: 'translate(-50%, -26px) scale(1.32)' },
          '40%': { opacity: '1', transform: 'translate(-50%, -38px) scale(1.08)' },
          '78%': { opacity: '1', transform: 'translate(-50%, -64px) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -95px) scale(0.85)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' }
        },
        shockwaveExpand: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(3.6)', opacity: '0' }
        },
        idleBob: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.012)' }
        },
        idleFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-11px) scale(1.018)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.72) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        },
        wave: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(14deg)' }
        },
        hit: {
          '0%': { transform: 'translateX(0) scale(1)', filter: 'brightness(1) drop-shadow(0 15px 25px rgba(0,0,0,0.85))' },
          '18%': { transform: 'translateX(-12px) scale(1.04)', filter: 'brightness(2.4) saturate(0.3) drop-shadow(0 0 28px rgba(255,255,255,0.95))' },
          '38%': { transform: 'translateX(11px) scale(1.02)', filter: 'brightness(1.5) sepia(0.8) hue-rotate(-50deg) saturate(3) drop-shadow(0 0 28px rgba(244,63,94,0.95))' },
          '65%': { transform: 'translateX(-6px)', filter: 'brightness(1.2) drop-shadow(0 15px 25px rgba(0,0,0,0.85))' },
          '100%': { transform: 'translateX(0) scale(1)', filter: 'brightness(1) drop-shadow(0 15px 25px rgba(0,0,0,0.85))' }
        },
        heroAttack: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '22%': { transform: 'translate3d(-8px, 3px, 0) scale(0.97)' },
          '48%': { transform: 'translate3d(38px, -10px, 0) scale(1.07)' },
          '72%': { transform: 'translate3d(16px, -4px, 0) scale(1.03)' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)' }
        },
        heroHit: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '20%': { transform: 'translate3d(-14px, 4px, 0) rotate(-2deg) scale(0.96)' },
          '45%': { transform: 'translate3d(10px, -2px, 0) rotate(1.5deg) scale(0.98)' },
          '70%': { transform: 'translate3d(-6px, 1px, 0) rotate(-1deg)' }
        },
        monsterHit: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '15%': { transform: 'translate3d(18px, -6px, 0) rotate(3deg) scale(1.05)' },
          '32%': { transform: 'translate3d(-15px, 4px, 0) rotate(-3deg) scale(0.95)' },
          '50%': { transform: 'translate3d(12px, -3px, 0) rotate(2deg) scale(1.02)' },
          '70%': { transform: 'translate3d(-8px, 2px, 0) rotate(-1deg)' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)' }
        },
        monsterAttack: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '20%': { transform: 'translate3d(10px, 2px, 0) scale(0.97)' },
          '45%': { transform: 'translate3d(-40px, -8px, 0) scale(1.08)' },
          '70%': { transform: 'translate3d(-15px, -3px, 0) scale(1.03)' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)' }
        },
        heartBreak: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '25%': { transform: 'scale(1.45) rotate(-12deg)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(12deg)', opacity: '0.95' },
          '75%': { transform: 'scale(1.1) translateY(6px) rotate(-8deg)', opacity: '0.5' },
          '100%': { transform: 'scale(0.75) translateY(14px)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
