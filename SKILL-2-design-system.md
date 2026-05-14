---
name: exotic-fragrances-design-system
description: Configure the complete design system for ExoticFragrances — CSS tokens, Tailwind extension, global typography, font loading, and base styles. Use this skill immediately after exotic-fragrances-setup and before any component work. Triggers on: "set up the design system", "configure tokens", "add fonts", "set up CSS variables", "configure colours", "apply the brand styles", or any mention of design tokens, typography setup, or global styles for the ExoticFragrances project. Requires exotic-fragrances-setup to be complete.
---

# ExoticFragrances — Design System Skill

Implements the complete design token system, self-hosted fonts, Tailwind configuration, and global CSS for the Modern & Warm brand aesthetic.

---

## Font Setup (Self-Hosted — No Google Fonts Runtime)

Download and place font files in `public/fonts/`:
- `PlayfairDisplay-Bold.woff2`
- `PlayfairDisplay-Regular.woff2`
- `Inter-Variable.woff2` (variable font — covers all weights)

In `app/layout.tsx`:

```typescript
import localFont from 'next/font/local';

const playfair = localFont({
  src: [
    { path: '../public/fonts/PlayfairDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/PlayfairDisplay-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-playfair',
  display: 'optional', // prevents layout shift
  preload: true,
});

const inter = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'optional',
  preload: true,
});
```

Apply to `<html>`:
```tsx
<html lang="en" className={`${playfair.variable} ${inter.variable}`}>
```

---

## CSS Design Tokens (`styles/tokens.css`)

```css
:root {
  /* ── Colours ───────────────────────────────────────────── */
  --color-brand:          #1A1A1A;
  --color-brand-mid:      #4A4A4A;
  --color-cta:            #C4763A;
  --color-cta-hover:      #A85F28;
  --color-cta-active:     #8F4F1E;
  --color-gold:           #D4A843;
  --color-gold-light:     #E8C97A;
  --color-cream:          #F5EDE3;
  --color-warm-white:     #F8F6F3;
  --color-border:         #E8DDD4;
  --color-border-strong:  #C8BEB4;
  --color-muted:          #9A9590;
  --color-success:        #27AE60;
  --color-error:          #C0392B;
  --color-overlay:        rgba(26, 10, 0, 0.65);

  /* ── Typography ────────────────────────────────────────── */
  --font-display:   var(--font-playfair), Georgia, serif;
  --font-sans:      var(--font-inter), system-ui, sans-serif;

  /* Scale */
  --text-hero:       clamp(44px, 6vw, 72px);
  --text-display-lg: clamp(36px, 4vw, 56px);
  --text-display-md: clamp(28px, 3vw, 44px);
  --text-display-sm: clamp(22px, 2.5vw, 36px);
  --text-heading-xl: 28px;
  --text-heading-lg: 22px;
  --text-body-xl:    18px;
  --text-body-lg:    17px;
  --text-body-md:    15px;
  --text-label:      13px;
  --text-price:      clamp(22px, 2vw, 28px);
  --text-price-sm:   18px;

  /* ── Spacing ───────────────────────────────────────────── */
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   16px;
  --space-lg:   24px;
  --space-xl:   48px;
  --space-2xl:  80px;
  --space-3xl:  120px;
  --space-4xl:  160px;

  /* ── Layout ────────────────────────────────────────────── */
  --container-max: 1280px;
  --container-pad: clamp(16px, 4vw, 80px);
  --header-h:      72px;

  /* ── Borders & Radius ──────────────────────────────────── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-pill: 100px;

  /* ── Shadows ───────────────────────────────────────────── */
  --shadow-card:       0 2px 8px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.12);
  --shadow-overlay:    0 24px 64px rgba(0,0,0,0.24);

  /* ── Transitions ───────────────────────────────────────── */
  --dur-fast:       150ms;
  --dur-normal:     300ms;
  --dur-slow:       500ms;
  --dur-editorial:  800ms;
  --ease-smooth:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-entrance:  cubic-bezier(0.00, 0.00, 0.20, 1.00);
  --ease-exit:      cubic-bezier(0.40, 0.00, 1.00, 1.00);

  /* ── Z-index ───────────────────────────────────────────── */
  --z-base:     0;
  --z-raised:   10;
  --z-sticky:   100;
  --z-drawer:   200;
  --z-modal:    300;
  --z-toast:    400;
}
```

---

## Global Styles (`app/globals.css`)

```css
@import '../styles/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Base Reset ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body-md);
  color: var(--color-brand);
  background-color: #ffffff;
  overflow-x: hidden;
}

img { max-width: 100%; height: auto; display: block; }

/* ── Scrollbar ──────────────────────────────────────────── */
::-webkit-scrollbar              { width: 6px; height: 6px; }
::-webkit-scrollbar-track        { background: var(--color-warm-white); }
::-webkit-scrollbar-thumb        { background: var(--color-border-strong); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover  { background: var(--color-muted); }

/* ── Focus ──────────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--color-cta);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ── Typography Utilities ───────────────────────────────── */
@layer utilities {
  .font-display     { font-family: var(--font-display); }
  .font-sans        { font-family: var(--font-sans); }

  .text-hero        { font-size: var(--text-hero);       line-height: 1.05; letter-spacing: -0.02em; }
  .text-display-lg  { font-size: var(--text-display-lg); line-height: 1.1;  letter-spacing: -0.01em; }
  .text-display-md  { font-size: var(--text-display-md); line-height: 1.15; }
  .text-display-sm  { font-size: var(--text-display-sm); line-height: 1.2;  }
  .text-heading-xl  { font-size: var(--text-heading-xl); line-height: 1.3;  }
  .text-body-xl     { font-size: var(--text-body-xl);    line-height: 1.6;  }
  .text-body-lg     { font-size: var(--text-body-lg);    line-height: 1.65; }
  .text-body-md     { font-size: var(--text-body-md);    line-height: 1.6;  }
  .text-label       { font-size: var(--text-label);      line-height: 1.4;  letter-spacing: 0.12em; text-transform: uppercase; }

  .container-page   { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-pad); }
  .section-pad      { padding-block: var(--space-2xl); }
  .section-pad-lg   { padding-block: var(--space-3xl); }

  /* Gradient overlay for hero/tile images */
  .overlay-hero     { background: linear-gradient(135deg, var(--color-overlay) 0%, transparent 60%); }
  .overlay-tile     { background: linear-gradient(to top, rgba(26,10,0,0.7) 0%, transparent 50%); }
}

/* ── Component Base Styles ──────────────────────────────── */
@layer components {

  /* Button: Primary */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background-color: var(--color-cta); color: #ffffff;
    font-family: var(--font-sans); font-size: 15px; font-weight: 600;
    height: 56px; padding-inline: 28px; border-radius: var(--radius-sm);
    border: none; cursor: pointer; white-space: nowrap;
    transition: background-color var(--dur-fast) var(--ease-smooth),
                transform var(--dur-fast) var(--ease-smooth),
                box-shadow var(--dur-fast) var(--ease-smooth);
  }
  .btn-primary:hover {
    background-color: var(--color-cta-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(196, 118, 58, 0.35);
  }
  .btn-primary:active { background-color: var(--color-cta-active); transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Button: Ghost */
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent; color: var(--color-brand);
    font-family: var(--font-sans); font-size: 15px; font-weight: 600;
    height: 56px; padding-inline: 28px; border-radius: var(--radius-sm);
    border: 2px solid var(--color-brand); cursor: pointer; white-space: nowrap;
    transition: background-color var(--dur-fast) var(--ease-smooth),
                color var(--dur-fast) var(--ease-smooth);
  }
  .btn-ghost:hover { background-color: var(--color-brand); color: #ffffff; }

  /* Button: Small */
  .btn-sm { height: 40px; padding-inline: 20px; font-size: 13px; }

  /* Tag / Pill */
  .tag {
    display: inline-flex; align-items: center;
    background-color: var(--color-gold); color: #ffffff;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    height: 24px; padding-inline: 10px; border-radius: var(--radius-pill);
  }
  .tag-outline {
    background: transparent; color: var(--color-cta);
    border: 1px solid var(--color-cta);
  }

  /* Product Card */
  .product-card {
    background: #ffffff; border-radius: var(--radius-md);
    overflow: hidden; box-shadow: var(--shadow-card);
    transition: transform var(--dur-normal) var(--ease-smooth),
                box-shadow var(--dur-normal) var(--ease-smooth),
                border-color var(--dur-normal) var(--ease-smooth);
    border: 2px solid transparent;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--color-cta);
  }

  /* Accordion */
  .accordion-item { border-bottom: 1px solid var(--color-border); }
  .accordion-trigger {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; padding-block: 20px; background: none; border: none;
    font-family: var(--font-sans); font-size: 15px; font-weight: 500;
    color: var(--color-brand); cursor: pointer; text-align: left;
    transition: color var(--dur-fast);
  }
  .accordion-trigger:hover { color: var(--color-cta); }
  .accordion-content { overflow: hidden; }

  /* Horizontal scroll strip */
  .h-scroll {
    display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;
    scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 8px;
  }
  .h-scroll::-webkit-scrollbar { display: none; }
  .h-scroll > * { scroll-snap-align: start; flex-shrink: 0; }
}

/* ── Reduced Motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Tailwind Config Extension

Update `tailwind.config.ts` to mirror the token system:

```typescript
theme: {
  extend: {
    colors: {
      brand: 'var(--color-brand)',
      cta: {
        DEFAULT: 'var(--color-cta)',
        hover:   'var(--color-cta-hover)',
      },
      gold:    'var(--color-gold)',
      cream:   'var(--color-cream)',
      'warm-white': 'var(--color-warm-white)',
      border:  'var(--color-border)',
      muted:   'var(--color-muted)',
    },
    fontFamily: {
      display: 'var(--font-display)',
      sans:    'var(--font-sans)',
    },
    spacing: {
      '18': '72px',   // header height
      '22': '88px',
    },
    animation: {
      'fade-up':   'fadeUp 0.6s cubic-bezier(0.0, 0.0, 0.2, 1.0) both',
      'fade-in':   'fadeIn 0.4s ease both',
    },
    keyframes: {
      fadeUp: {
        from: { opacity: '0', transform: 'translateY(24px)' },
        to:   { opacity: '1', transform: 'translateY(0)' },
      },
      fadeIn: {
        from: { opacity: '0' },
        to:   { opacity: '1' },
      },
    },
  },
},
```

---

## Verification Checklist

- [ ] Playfair Display renders correctly in the browser (bold headlines)
- [ ] Inter renders correctly (body copy)
- [ ] No Flash of Unstyled Text (FOUT) — fonts load with `display: optional`
- [ ] CSS variables accessible in DevTools under `:root`
- [ ] `cn()` utility works: `cn('text-red-500', 'text-blue-500')` → `'text-blue-500'`
- [ ] `.btn-primary` and `.btn-ghost` render correctly
- [ ] `.product-card` hover state shows amber border and lift shadow
- [ ] `prefers-reduced-motion` suppresses all animations

**Next skill:** `exotic-fragrances-components`
