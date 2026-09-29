/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Configuración de Tailwind CSS con tokens oficiales de BAUTO Resort Wear
 * @Capa: Estética / Técnica
 * @Riesgo_Evaluado: Bajo - Abstracción de tokens de diseño
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      fontFamily: {
        title: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-plus-jakarta)', 'sans-serif'],
        mono: ['var(--font-rajdhani)', 'sans-serif'],
        editorial: ['var(--font-lora)', 'serif'],
      },
      colors: {
        bauto: {
          terracota: '#B85C38',
          'terracota-dark': '#A04F2F',
          musgo: '#7A8265',
          oceano: '#5E8B9D',
          trigo: '#D4A24E',
          arena: '#A89078',
          ciruela: '#8A6E9B',
          carbon: '#1C1917',
          'carbon-soft': '#2C2C2C',
          piedra: '#78716C',
          'piedra-light': '#D7D7D7',
          nube: '#FAF9F6',
          perla: '#F2F0EB',
          vidrio: 'rgba(255, 255, 255, 0.55)',
          'vidrio-border': 'rgba(255, 255, 255, 0.40)',
          success: '#16A34A',
          danger: '#DC2626',
          warning: '#CA8A04',
        },
      },
      borderRadius: {
        pill: '999px',
        card: '40px',
        'card-sm': '24px',
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
        elevated: '0 12px 32px -4px rgba(28, 25, 23, 0.08)',
        glass: '0 8px 32px 0 rgba(28, 25, 23, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
