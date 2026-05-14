---
name: exotic-fragrances-components
description: Build all shared/reusable UI components for the ExoticFragrances Next.js site — Button, Badge, Accordion, Toast, Cart drawer, Search overlay, Header, Footer, AnnouncementBar. Use this skill after the design system is configured and before building any individual pages. Triggers on: "build the components", "create shared components", "build the header", "build the footer", "build the cart drawer", "build the announcement bar", "create reusable UI", or any request to implement shared UI elements for ExoticFragrances. Requires exotic-fragrances-design-system to be complete.
---

# ExoticFragrances — Shared Components Skill

Implements all layout and shared components. Build these before any page-level work.

---

## Component Build Order

1. `AnnouncementBar` → 2. `Header` → 3. `Footer` → 4. `Cart` → 5. `SearchOverlay` → 6. `Toast` → 7. `Button` → 8. `Badge` → 9. `Accordion` → 10. `Root Layout`

---

## 1. AnnouncementBar (`components/layout/AnnouncementBar.tsx`)

```tsx
'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  '🌿 All orders dispatched within 24 hours across the USA',
  '✨ 1,000+ Grade A fragrance oils — below wholesale prices',
  '💼 Vendors welcome — download our wholesale catalogue',
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center h-10 px-8 bg-cta text-white text-label text-xs">
      <span className="transition-opacity duration-500">{MESSAGES[idx]}</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
```

---

## 2. Header (`components/layout/Header.tsx`)

```tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Home',      href: '/' },
  { label: 'Shop',      href: '/shop' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'About',     href: '/about' },
];

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, itemCount } = useCartStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bg = transparent && !scrolled ? 'bg-transparent' : 'bg-warm-white border-b border-border';

  return (
    <header className={cn('fixed top-10 left-0 right-0 z-sticky transition-colors duration-300', bg)}>
      <div className="container-page flex items-center justify-between h-18">

        {/* Left: Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.slice(0, 2).map(n => (
            <Link key={n.href} href={n.href}
              className="text-label text-xs text-brand hover:text-cta transition-colors duration-150 relative group">
              {n.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cta transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Mobile: Menu toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Centre: Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display font-bold text-xl tracking-widest text-brand">
          EXOTIC FRAGRANCES
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-8 mr-4">
            {NAV.slice(2).map(n => (
              <Link key={n.href} href={n.href}
                className="text-label text-xs text-brand hover:text-cta transition-colors duration-150 relative group">
                {n.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cta transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <button className="p-2 hover:text-cta transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="p-2 hover:text-cta transition-colors hidden md:block" aria-label="Account">
            <User size={20} />
          </button>
          <button onClick={openCart} className="relative p-2 hover:text-cta transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-cta text-white text-[10px] font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden bg-warm-white border-t border-border px-6 py-8 flex flex-col gap-6">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
              className="text-body-lg font-medium text-brand hover:text-cta transition-colors">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
```

---

## 3. Cart Store (`store/cart.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  cartId: string | null;
  checkoutUrl: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isOpen: false, cartId: null, checkoutUrl: null,

      get itemCount() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get total()     { return get().items.reduce((s, i) => s + i.price * i.quantity, 0); },

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),

      addItem: (newItem) => set(state => {
        const existing = state.items.find(i => i.variantId === newItem.variantId);
        if (existing) {
          return { items: state.items.map(i =>
            i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + 1 } : i
          )};
        }
        return { items: [...state.items, newItem] };
      }),

      removeItem: (variantId) => set(state => ({
        items: state.items.filter(i => i.variantId !== variantId)
      })),

      updateQuantity: (variantId, qty) => set(state => ({
        items: qty <= 0
          ? state.items.filter(i => i.variantId !== variantId)
          : state.items.map(i => i.variantId === variantId ? { ...i, quantity: qty } : i)
      })),
    }),
    { name: 'ef-cart-store' }
  )
);
```

---

## 4. Cart Drawer (`components/shared/CartDrawer.tsx`)

```tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, total, checkoutUrl } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-drawer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-modal flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-sans font-semibold text-lg text-brand">
                Your Cart {items.length > 0 && <span className="text-muted font-normal">({items.length})</span>}
              </h2>
              <button onClick={closeCart} className="p-2 hover:text-cta transition-colors" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                  <ShoppingBag size={48} className="text-border" />
                  <p className="text-body-lg text-muted">Your cart is empty</p>
                  <button onClick={closeCart} className="btn-primary btn-sm">Explore Fragrances</button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-warm-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-sm text-brand truncate">{item.title}</p>
                      <p className="text-xs text-muted mt-0.5">{item.variantTitle}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-border rounded">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1.5 hover:bg-warm-white transition-colors"><Minus size={12} /></button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1.5 hover:bg-warm-white transition-colors"><Plus size={12} /></button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-brand">{formatPrice(item.price * item.quantity)}</span>
                          <button onClick={() => removeItem(item.variantId)} className="text-muted hover:text-error transition-colors"><X size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-muted">Subtotal</span>
                  <span className="text-heading-lg font-bold text-brand">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted">Shipping calculated at checkout</p>
                <a href={checkoutUrl || '#'} className="btn-primary w-full text-center">
                  Proceed to Checkout
                </a>
                <button onClick={closeCart} className="btn-ghost w-full text-sm">Continue Shopping</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 5. Toast (`components/shared/Toast.tsx`)

```tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { create } from 'zustand';

interface ToastMessage { id: string; message: string; type: 'success' | 'error'; }
interface ToastStore {
  toasts: ToastMessage[];
  show: (message: string, type?: 'success' | 'error') => void;
  dismiss: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3500);
  },
  dismiss: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-overlay text-white text-sm font-medium max-w-xs
              ${t.type === 'success' ? 'bg-brand' : 'bg-error'}`}>
            {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

---

## 6. Accordion (`components/shared/Accordion.tsx`)

```tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem { title: string; content: React.ReactNode; }
interface AccordionProps { items: AccordionItem[]; className?: string; }

export default function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={cn('divide-y divide-border', className)}>
      {items.map((item, i) => (
        <div key={i} className="accordion-item">
          <button className="accordion-trigger" onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}>
            <span>{item.title}</span>
            {open === i ? <Minus size={16} className="text-cta flex-shrink-0" /> : <Plus size={16} className="flex-shrink-0" />}
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="accordion-content"
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ height: { duration: 0.3, ease: [0.25,0.46,0.45,0.94] }, opacity: { duration: 0.2 } }}>
                <div className="pb-6 text-body-md text-brand/70 leading-relaxed">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
```

---

## 7. Footer (`components/layout/Footer.tsx`)

```tsx
import Link from 'next/link';

const COLS = [
  { heading: 'Company',    links: [{ label:'About Us',href:'/about'},{label:'Wholesale',href:'/wholesale'},{label:'Store Location',href:'/contact'},{label:'Blog',href:'/blog'}]},
  { heading: 'My Account', links: [{ label:'Login',href:'/account'},{label:'My Orders',href:'/orders'},{label:'Wishlist',href:'/wishlist'},{label:'Track Order',href:'/track'}]},
  { heading: 'Help',       links: [{ label:'FAQ',href:'/faq'},{label:'Shipping Info',href:'/shipping'},{label:'Returns',href:'/returns'},{label:'Contact Us',href:'/contact'}]},
];

export default function Footer() {
  return (
    <footer className="bg-brand text-white/80">
      <div className="container-page section-pad">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-bold text-xl text-white mb-4 tracking-widest">EXOTIC<br/>FRAGRANCES</p>
            <p className="text-body-md text-white/60 max-w-xs leading-relaxed">
              1,000+ Grade A fragrance oils below wholesale prices. Shipped across the USA in 24 hours. New York City.
            </p>
          </div>
          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h3 className="text-label text-gold mb-5">{col.heading}</h3>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-body-md text-white/60 hover:text-white hover:translate-x-1 transition-all duration-150 inline-block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">© 2025 Exotic Fragrances. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <Link key={l} href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden border-t border-white/5">
        <p className="font-display font-bold text-white/[0.04] text-[clamp(60px,14vw,180px)] leading-none text-center py-4 select-none tracking-widest whitespace-nowrap">
          EXOTICFRAGRANCES
        </p>
      </div>
    </footer>
  );
}
```

---

## 8. Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shared/CartDrawer';
import ToastContainer from '@/components/shared/Toast';

const playfair = localFont({ src: [
  { path: '../public/fonts/PlayfairDisplay-Regular.woff2', weight: '400', style: 'normal' },
  { path: '../public/fonts/PlayfairDisplay-Bold.woff2',    weight: '700', style: 'normal' },
], variable: '--font-playfair', display: 'optional' });

const inter = localFont({ src: '../public/fonts/Inter-Variable.woff2', variable: '--font-inter', display: 'optional' });

export const metadata: Metadata = {
  title: { default: 'Exotic Fragrances — 1,000+ Pure Fragrance Oils', template: '%s | Exotic Fragrances' },
  description: 'Shop over 1,000 Grade A fragrance oils, essential oils, body butters and more at below-wholesale prices. Ships across the USA in 24 hours.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
      </body>
    </html>
  );
}
```

---

## Verification

- [ ] Header transparent on homepage hero, cream bg on scroll
- [ ] Cart drawer slides in from right with backdrop
- [ ] Cart item count badge appears in header
- [ ] Toast appears bottom-right on actions
- [ ] Accordion animates height smoothly
- [ ] Footer wordmark renders in faint display font
- [ ] AnnouncementBar rotates messages every 4s and is dismissable

**Next skills:** `exotic-fragrances-homepage` + `exotic-fragrances-shop-page` (can run in parallel)
