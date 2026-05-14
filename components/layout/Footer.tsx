import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, MapPin } from 'lucide-react';

const COLS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Fragrances', href: '/shop' },
      { label: "Women's", href: '/shop?category=womens' },
      { label: "Men's", href: '/shop?category=mens' },
      { label: 'Unisex', href: '/shop?category=unisex' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Wholesale', href: '/wholesale' },
      { label: 'Store Location', href: '/contact' },
      { label: 'Journal', href: '/blog' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand text-white/80">
      <div className="container-page section-pad">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 md:gap-12">
          {/* Brand col */}
          <div className="col-span-2 min-w-0">
            <Image
              src="/logo.png"
              alt="Exotic Fragrances"
              width={140}
              height={140}
              className="h-16 sm:h-20 w-auto mb-5 sm:mb-6 brightness-0 invert"
            />
            <p className="text-body-md text-white/55 max-w-xs leading-relaxed mb-6">
              1,000+ Grade A fragrance oils below wholesale prices. Crafted in New York,
              dispatched across the USA in 24 hours.
            </p>
            <div className="space-y-3 text-body-md text-white/55">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                New York City, NY
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-gold flex-shrink-0" />
                hello@exoticfragrances.com
              </p>
              <p className="flex items-center gap-2">
                <Instagram size={14} className="text-gold flex-shrink-0" />
                @exoticfragrances
              </p>
            </div>
          </div>
          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading} className="min-w-0">
              <h3 className="text-label text-xs text-gold mb-4 sm:mb-5">{col.heading}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[14px] sm:text-body-md text-white/55 hover:text-white hover:translate-x-1 transition-all duration-150 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 sm:mt-12 md:mt-16 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] sm:text-xs text-white/35 text-center md:text-left">© 2025 Exotic Fragrances. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-[11px] sm:text-xs text-white/35 hover:text-white/70 transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden border-t border-white/5 bg-brand w-full max-w-full">
        <p className="font-display font-normal text-white text-[clamp(60px,22vw,300px)] leading-[0.95] text-center pt-6 pb-2 select-none tracking-[0.02em] whitespace-nowrap">
          EXOTIC
        </p>
      </div>
      <div className="bg-brand pb-4">
        <p className="text-center text-[10px] sm:text-[11px] text-white/30 tracking-[0.1em] sm:tracking-[0.12em] px-4">
          © 2025 Exotic Fragrances · Crafted in New York
        </p>
      </div>
    </footer>
  );
}
