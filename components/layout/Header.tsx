'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore, useCartCount } from '@/store/cart';
import { cn } from '@/lib/utils';
import SearchOverlay from '@/components/shared/SearchOverlay';

const NAV_LEFT = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?category=womens' },
];
const NAV_RIGHT = [
  { label: 'Wholesale', href: '/wholesale' },
  { label: 'About', href: '/about' },
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

  const useTransparent = transparent && !scrolled;
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
          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-9">
            {NAV_LEFT.map((n) => (
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

          {/* Mobile toggle */}
          <button
            className={cn('md:hidden p-2 flex-shrink-0', linkColour)}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
              {NAV_RIGHT.map((n) => (
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

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="md:hidden bg-warm-white border-t border-border px-5 py-6 flex flex-col gap-5 shadow-lg">
            {[...NAV_LEFT, ...NAV_RIGHT].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="text-body-lg font-medium text-brand hover:text-cta transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
