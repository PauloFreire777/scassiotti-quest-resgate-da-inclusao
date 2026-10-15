/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutros com leve matiz índigo ("crepúsculo no campus").
        // Sobrescrever o `slate` faz TODOS os componentes antigos (modais etc.)
        // herdarem a nova paleta sem precisar reescrevê-los de uma vez.
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
        // Tokens legados (usados por componentes ainda não migrados)
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
        // Fonte arredondada e muito legível, empacotada localmente (@fontsource) → funciona offline.
        sans: ['"Nunito Variable"', 'Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Nunito Variable"', 'Nunito', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        pop: '0 10px 24px rgba(8, 5, 28, 0.45)'
      },
      animation: {
        'screen-shake': 'screenShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'subtle-shake': 'subtleShake 0.3s ease-in-out',
        'damage-float': 'damageFloat 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shockwave': 'shockwaveExpand 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
        'idle-bob': 'idleBob 3.4s ease-in-out infinite',
        'idle-float': 'idleFloat 4s ease-in-out infinite',
        'pop-in': 'popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'wave': 'wave 1.6s ease-in-out infinite',
        'hit': 'hit 0.55s ease-out both'
      },
      keyframes: {
        screenShake: {
          '10%, 90%': { transform: 'translate3d(-3px, 1px, 0) rotate(-0.5deg)' },
          '20%, 80%': { transform: 'translate3d(4px, -2px, 0) rotate(0.8deg)' },
          '30%, 50%, 70%': { transform: 'translate3d(-5px, 2px, 0) rotate(-0.8deg)' },
          '40%, 60%': { transform: 'translate3d(5px, -1px, 0) rotate(0.5deg)' }
        },
        subtleShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' }
        },
        damageFloat: {
          '0%': { opacity: '0', transform: 'translate(-50%, 0) scale(0.5)' },
          '20%': { opacity: '1', transform: 'translate(-50%, -24px) scale(1.2)' },
          '70%': { opacity: '1', transform: 'translate(-50%, -55px) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -85px) scale(0.8)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' }
        },
        shockwaveExpand: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(3.5)', opacity: '0' }
        },
        idleBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        idleFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.015)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.7) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        },
        wave: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(14deg)' }
        },
        hit: {
          '0%': { transform: 'translateX(0) scale(1)', filter: 'brightness(1)' },
          '15%': { transform: 'translateX(-10px) scale(1.04)', filter: 'brightness(2.2) saturate(0.4)' },
          '35%': { transform: 'translateX(9px) scale(1.02)', filter: 'brightness(1.6)' },
          '60%': { transform: 'translateX(-5px)', filter: 'brightness(1.2)' },
          '100%': { transform: 'translateX(0) scale(1)', filter: 'brightness(1)' }
        }
      }
    },
  },
  plugins: [],
}
