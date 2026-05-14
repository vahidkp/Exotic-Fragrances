import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        'brand-mid': 'var(--color-brand-mid)',
        cta: {
          DEFAULT: 'var(--color-cta)',
          hover: 'var(--color-cta-hover)',
          active: 'var(--color-cta-active)',
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
          light: 'var(--color-gold-light)',
        },
        cream: 'var(--color-cream)',
        'warm-white': 'var(--color-warm-white)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        muted: 'var(--color-muted)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      zIndex: {
        base: '0',
        raised: '10',
        sticky: '100',
        drawer: '200',
        modal: '300',
        toast: '400',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.0, 0.0, 0.2, 1.0) both',
        'fade-in': 'fadeIn 0.4s ease both',
        'trust-marquee': 'trustMarquee 16s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        trustMarquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        entrance: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        exit: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
      },
    },
  },
  plugins: [],
};

export default config;
