'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Instagram,
  Heart,
  MapPin,
  Mail,
  Truck,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useCartStore, useCartCount } from '@/store/cart';
import { cn } from '@/lib/utils';
import SearchOverlay from '@/components/shared/SearchOverlay';

const PRIMARY_NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?category=womens' },
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'About', href: '/about' },
];

const CATEGORY_SHORTCUTS = [
  { label: "Women's", href: '/shop?category=womens' },
  { label: "Men's", href: '/shop?category=mens' },
  { label: 'Unisex', href: '/shop?category=unisex' },
  { label: 'Oud & Oriental', href: '/shop?category=oud' },
];

const UTILITY_LINKS = [
  { label: 'My Account', href: '/account', icon: User },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Track Order', href: '/track', icon: Truck },
  { label: 'Help & FAQ', href: '/faq', icon: HelpCircle },
];

export default function Header() {
  const pathname = usePathname();
  const transparent = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartCount();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const useTransparent = transparent && !scrolled && !menuOpen;
  const headerBg = useTransparent
    ? 'bg-transparent'
    : 'bg-warm-white border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]';
  const linkColour = useTransparent ? 'text-white/90 hover:text-white' : 'text-brand hover:text-cta';

  return (
    <>
      <header
        className={cn(
          'fixed top-10 left-0 right-0 z-[100] transition-colors duration-300',
          headerBg
        )}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-18 gap-2">
          {/* Left nav (desktop) */}
          <nav className="hidden md:flex items-center gap-9">
            {PRIMARY_NAV.slice(0, 2).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-150 relative group',
                  linkColour
                )}
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className={cn(
              'md:hidden p-2 flex-shrink-0 transition-colors',
              menuOpen ? 'text-brand' : linkColour
            )}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="m"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Logo */}
          <Link
            href="/"
            aria-label="Exotic Fragrances — Home"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <Image
              src="/logo.png"
              alt="Exotic Fragrances"
              width={120}
              height={120}
              priority
              className={cn(
                'h-9 w-auto sm:h-10 md:h-14 transition-[filter] duration-300',
                useTransparent ? 'invert brightness-0 contrast-100' : ''
              )}
            />
          </Link>

          {/* Right nav + icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-6 flex-shrink-0">
            <nav className="hidden md:flex items-center gap-9 mr-2">
              {PRIMARY_NAV.slice(2).map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    'text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-150 relative group',
                    linkColour
                  )}
                >
                  {n.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>
            <button
              className={cn('p-2 transition-colors', linkColour)}
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              className={cn('p-2 transition-colors hidden md:block', linkColour)}
              aria-label="Account"
            >
              <User size={18} />
            </button>
            <button
              onClick={openCart}
              className={cn('relative p-2 transition-colors', linkColour)}
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-cta text-white text-[9px] font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer (editorial fullscreen) */}
      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileMenu({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="md:hidden fixed inset-0 top-[calc(40px+64px)] z-[95] bg-warm-white overflow-y-auto"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="container-page py-8 flex flex-col gap-10"
      >
        {/* Primary nav — large editorial links */}
        <nav>
          <p className="text-[10px] tracking-[0.24em] uppercase text-cta font-semibold mb-4">
            Menu
          </p>
          <ul className="divide-y divide-border/70">
            {PRIMARY_NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center justify-between py-4 transition-colors',
                      active ? 'text-cta' : 'text-brand hover:text-cta'
                    )}
                  >
                    <span className="font-display font-normal text-[24px] tracking-[0.01em]">
                      {n.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Shop by category — quick shortcuts */}
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-cta font-semibold mb-4">
            Shop by Category
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORY_SHORTCUTS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={onClose}
                className="border border-border rounded-sm px-4 py-3 text-[13px] text-brand bg-white hover:border-cta hover:text-cta transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Utility links */}
        <div>
          <p className="text-[10px] tracking-[0.24em] uppercase text-cta font-semibold mb-4">
            My Account
          </p>
          <ul className="space-y-1">
            {UTILITY_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 py-2.5 text-[14px] text-brand/85 hover:text-cta transition-colors"
                >
                  <Icon size={16} className="text-muted" strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA card */}
        <Link
          href="/wholesale"
          onClick={onClose}
          className="relative overflow-hidden rounded-sm bg-cta text-white p-6 flex flex-col gap-2 hover:bg-cta-hover transition-colors"
        >
          <span className="text-[10px] tracking-[0.24em] uppercase font-semibold text-white/75">
            For Businesses
          </span>
          <p className="font-display text-[20px] leading-tight">Vendors welcome.</p>
          <p className="text-[13px] text-white/80 leading-relaxed mb-2">
            1,000+ Grade A oils at below-wholesale prices. Volume tiers from 50 bottles.
          </p>
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-semibold">
            Wholesale Enquiry <ArrowRight size={13} />
          </span>
        </Link>

        {/* Contact + Social footer */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-3 mb-6">
            <p className="flex items-center gap-3 text-[13px] text-brand/75">
              <MapPin size={14} className="text-gold flex-shrink-0" strokeWidth={1.5} />
              New York City, NY
            </p>
            <p className="flex items-center gap-3 text-[13px] text-brand/75">
              <Mail size={14} className="text-gold flex-shrink-0" strokeWidth={1.5} />
              hello@exoticfragrances.com
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/exoticfragrances"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-brand hover:border-cta hover:text-cta transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <span className="text-[12px] text-muted">Follow @exoticfragrances</span>
          </div>
        </div>

        {/* Reserve bottom space so the floating chat button doesn't sit over the last link */}
        <div className="h-8" aria-hidden />
      </motion.div>
    </motion.div>
  );
}
