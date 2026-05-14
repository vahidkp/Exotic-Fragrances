---
name: exotic-fragrances-homepage
description: Build the complete ExoticFragrances homepage — all 17 sections including Hero, CategoryGrid, ScentStory editorial sections, BestsellerCarousel, WhyUs, Testimonials, WholesaleModule, and NewsletterSection. Use this skill when building the homepage (app/page.tsx) and all /components/homepage/ components. Triggers on: "build the homepage", "create the hero section", "build category grid", "add scent stories", "build the bestseller carousel", "build the newsletter section", or any request to implement the homepage for ExoticFragrances. Requires exotic-fragrances-components to be complete.
---

# ExoticFragrances — Homepage Skill

Builds the complete homepage following the Vanaya editorial reference. All scroll animations are handled by `exotic-fragrances-animations` — this skill focuses on layout and content structure.

---

## Page Entry (`app/page.tsx`)

```tsx
import HeroSection      from '@/components/homepage/HeroSection';
import TrustStrip       from '@/components/homepage/TrustStrip';
import CategoryGrid     from '@/components/homepage/CategoryGrid';
import ScentStory       from '@/components/homepage/ScentStory';
import BestsellerCarousel from '@/components/homepage/BestsellerCarousel';
import ScentFamilyFilter from '@/components/homepage/ScentFamilyFilter';
import WhyUs            from '@/components/homepage/WhyUs';
import Testimonials     from '@/components/homepage/Testimonials';
import WholesaleModule  from '@/components/homepage/WholesaleModule';
import InstagramStrip   from '@/components/homepage/InstagramStrip';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { getProducts, getCategories, getScentStories } from '@/lib/shopify';

export default async function HomePage() {
  const [products, categories, stories] = await Promise.all([
    getProducts(12),
    getCategories(),
    getScentStories(),
  ]);

  const SCENT_STORIES = [
    { name: 'Muted Forest',   description: 'The serene ambience of Muted Forest — tranquil notes of vetiver, cedarwood, and ancient trees. Peace and reflection in a bottle.', imageSrc: '/images/stories/muted-forest.jpg', reverse: false, bg: 'dark' as const },
    { name: 'Vanilla Ember',  description: 'Warm and inviting, Vanilla Ember captivates the senses. Creamy sweetness of vanilla with a hint of smoky, smouldering warmth.', imageSrc: '/images/stories/vanilla-ember.jpg', reverse: true,  bg: 'cream' as const },
    { name: 'Citrus Lane',    description: 'The sun-drenched vibrancy of Citrus Lane — fresh squeezed lemon, sharp grapefruit, and sweet mandarin inspired by a Mediterranean morning.', imageSrc: '/images/stories/citrus-lane.jpg', reverse: false, bg: 'white' as const },
  ];

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CategoryGrid categories={categories} />
      {SCENT_STORIES.map((s, i) => <ScentStory key={i} {...s} />)}
      <BestsellerCarousel products={products.products?.nodes ?? []} />
      <ScentFamilyFilter />
      <WhyUs />
      <Testimonials />
      <WholesaleModule />
      <InstagramStrip />
      <NewsletterSection />
    </>
  );
}
```

---

## HeroSection (`components/homepage/HeroSection.tsx`)

```tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-end pb-24 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero/hero-main.jpg"
        alt="Exotic fragrance oils — warm amber bottles on dark surface with botanicals"
        fill priority quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 overlay-hero" />

      {/* Content */}
      <div className="container-page relative z-10 max-w-2xl">
        <p className="text-label text-gold text-xs mb-6 tracking-[0.25em]">PURE FRAGRANCE OILS</p>

        <h1 className="font-display font-bold text-hero text-white leading-[1.05] mb-6 tracking-[-0.02em]">
          DISCOVER YOUR<br />EXOTIC SIGNATURE
        </h1>

        <p className="text-body-xl text-white/80 mb-10 max-w-md leading-relaxed">
          Over 1,000 Grade A oils inspired by the world's greatest perfumes. Below wholesale prices. Ships in 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <Link href="/shop" className="btn-primary min-w-[220px] text-center">
            Explore the Collection
          </Link>
          <Link href="/wholesale" className="text-white/80 underline underline-offset-4 hover:text-white transition-colors text-body-md self-center">
            Wholesale Enquiry →
          </Link>
        </div>

        {/* Trust micro-strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-10 text-xs text-white/60">
          {['★ 4.9/5 Customer Rating','1,000+ Scents','Ships in 24h','Below Wholesale Prices'].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/20">·</span>}
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## TrustStrip (`components/homepage/TrustStrip.tsx`)

```tsx
import { Award, Package, Layers, TrendingDown } from 'lucide-react';

const ITEMS = [
  { icon: Award,       label: 'Grade A Quality Guaranteed' },
  { icon: Layers,      label: '1,000+ Fragrance Oils' },
  { icon: TrendingDown,label: 'Below Wholesale Prices' },
  { icon: Package,     label: 'Dispatched in 24 Hours' },
];

export default function TrustStrip() {
  return (
    <div className="bg-cream border-y border-border">
      <div className="container-page py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={20} className="text-gold flex-shrink-0" />
              <span className="text-label text-xs text-brand">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## CategoryGrid (`components/homepage/CategoryGrid.tsx`)

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';

const FALLBACK_CATEGORIES = [
  { name: "Women's Scents",  slug: 'womens',    imageUrl: '/images/categories/womens.jpg' },
  { name: "Men's Scents",    slug: 'mens',       imageUrl: '/images/categories/mens.jpg' },
  { name: 'Unisex',          slug: 'unisex',     imageUrl: '/images/categories/unisex.jpg' },
  { name: 'Essential Oils',  slug: 'essential',  imageUrl: '/images/categories/essential.jpg' },
  { name: 'Home Fragrance',  slug: 'home',       imageUrl: '/images/categories/home.jpg' },
  { name: 'Bottles & More',  slug: 'accessories',imageUrl: '/images/categories/accessories.jpg' },
];

export default function CategoryGrid({ categories }: { categories?: Category[] }) {
  const cats = categories?.length ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <h2 className="font-display font-bold text-display-sm text-brand text-center mb-16">
          OUR COLLECTIONS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cats.map(cat => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-sm" style={{ height: '480px' }}>
              <Image src={cat.imageUrl} alt={cat.name} fill
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw" />
              <div className="absolute inset-0 overlay-tile" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-display font-bold text-display-sm text-white mb-3">{cat.name}</h3>
                <span className="text-label text-xs text-gold border-b border-gold pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## ScentStory (`components/homepage/ScentStory.tsx`)

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ScentStoryProps {
  name: string; description: string; imageSrc: string;
  reverse?: boolean; bg?: 'dark' | 'cream' | 'white';
}

export default function ScentStory({ name, description, imageSrc, reverse = false, bg = 'white' }: ScentStoryProps) {
  const bgClass = { dark: 'bg-brand', cream: 'bg-cream', white: 'bg-white' }[bg];
  const textClass = bg === 'dark' ? 'text-white' : 'text-brand';
  const mutedClass = bg === 'dark' ? 'text-white/60' : 'text-brand/60';

  return (
    <section className={cn('flex flex-col md:flex-row', bgClass, reverse && 'md:flex-row-reverse')}>
      {/* Text block */}
      <div className={cn('flex-1 flex items-center justify-center p-12 md:p-20', textClass)}>
        <div className="max-w-md">
          <p className="text-label text-xs text-gold mb-6 tracking-[0.2em]">SIGNATURE SCENT</p>
          <h2 className={cn('font-display font-bold text-display-md mb-6 leading-tight', textClass)}>
            {name.toUpperCase()}
          </h2>
          <p className={cn('text-body-lg leading-relaxed mb-10', mutedClass)}>{description}</p>
          <Link href={`/shop?scent=${name.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn('inline-flex items-center gap-2 text-label text-xs tracking-[0.15em] border-b pb-1 transition-colors duration-150',
              bg === 'dark' ? 'border-white/40 text-white hover:border-gold hover:text-gold'
                           : 'border-brand/40 text-brand hover:border-cta hover:text-cta')}>
            SHOP THIS SCENT →
          </Link>
        </div>
      </div>
      {/* Image block */}
      <div className="flex-1 relative min-h-[400px] md:min-h-[640px]">
        <Image src={imageSrc} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    </section>
  );
}
```

---

## BestsellerCarousel (`components/homepage/BestsellerCarousel.tsx`)

```tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function BestsellerCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'right' ? 296 : -296, behavior: 'smooth' });
  };

  return (
    <section className="section-pad bg-warm-white overflow-hidden">
      <div className="container-page">
        {/* Heading row */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display font-bold text-display-sm text-brand">BEST COLLECTIONS</h2>
          <div className="flex items-center gap-4">
            <Link href="https://instagram.com/exoticfragrances" target="_blank"
              className="hidden md:flex items-center gap-2 text-label text-xs text-muted hover:text-cta transition-colors">
              Quick Update On Instagram <Instagram size={14} />
            </Link>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-cta hover:text-cta transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-cta hover:text-cta transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Scroll strip */}
        <div ref={ref} className="h-scroll -mx-4 px-4">
          {products.map(p => (
            <Link key={p.id} href={`/shop/${p.handle}`}
              className="product-card flex-shrink-0 w-[270px]">
              <div className="relative h-[340px] bg-cream overflow-hidden">
                <Image src={p.images?.[0]?.url ?? '/images/placeholder.jpg'} alt={p.title}
                  fill className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="270px" />
              </div>
              <div className="p-5">
                {p.scentFamily && <span className="tag text-[10px] mb-3 inline-block">{p.scentFamily}</span>}
                <h3 className="font-sans font-medium text-body-md text-brand truncate mb-1">{p.title}</h3>
                <p className="font-sans font-bold text-price-sm text-brand">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## WhyUs (`components/homepage/WhyUs.tsx`)

```tsx
import { FlaskConical, Infinity, TrendingDown, Truck } from 'lucide-react';

const ITEMS = [
  { icon: FlaskConical, heading: 'Grade A Quality',       body: 'Pure, undiluted fragrance oils crafted to the highest standard — the same quality used by leading perfume houses.' },
  { icon: Infinity,     heading: '1,000+ Scents',         body: 'One of the largest collections of fragrance, body, and essential oils in the USA — all in one place.' },
  { icon: TrendingDown, heading: 'Below Wholesale Prices',body: 'We cut out the middleman. Premium fragrance oils at prices that make every scent accessible.' },
  { icon: Truck,        heading: '24-Hour Dispatch',      body: 'Every order processed and dispatched within 24 hours — fast, reliable shipping across the USA.' },
];

export default function WhyUs() {
  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <h2 className="font-display font-bold text-display-sm text-brand text-center mb-16">
          WHY EXOTIC FRAGRANCES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {ITEMS.map(({ icon: Icon, heading, body }) => (
            <div key={heading} className="flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-card">
                <Icon size={24} className="text-gold" />
              </div>
              <h3 className="font-sans font-semibold text-heading-lg text-brand">{heading}</h3>
              <p className="text-body-md text-brand/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Testimonials (`components/homepage/Testimonials.tsx`)

```tsx
const REVIEWS = [
  { name: 'Sarah M.', label: 'Retail Customer', rating: 5, quote: 'I\'ve been buying from Exotic Fragrances for 3 years. The quality of their oils is unmatched — identical to the designer version at a fraction of the price.' },
  { name: 'James T.', label: 'Candle Maker',    rating: 5, quote: 'As a small candle business owner, finding reliable, high-quality oils at wholesale pricing was a game changer. My customers love the scents.' },
  { name: 'Priya K.', label: 'Wholesale Vendor',rating: 5, quote: 'The bulk pricing and 24-hour dispatch keep my retail operation running smoothly. Their catalogue is enormous and the service is outstanding.' },
];

export default function Testimonials() {
  return (
    <section className="section-pad bg-[#2C1A0E]">
      <div className="container-page">
        <h2 className="font-display font-bold text-display-sm text-white text-center mb-16">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map(r => (
            <div key={r.name} className="bg-white/5 rounded-md p-8 flex flex-col gap-6 border border-white/10">
              <div className="flex gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-gold text-lg">★</span>
                ))}
              </div>
              <p className="text-body-lg text-white/80 leading-relaxed italic">"{r.quote}"</p>
              <div>
                <p className="font-sans font-semibold text-white text-sm">{r.name}</p>
                <p className="text-label text-xs text-gold">{r.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## WholesaleModule (`components/homepage/WholesaleModule.tsx`)

```tsx
import Link from 'next/link';
import { Download, MessageCircle } from 'lucide-react';

export default function WholesaleModule() {
  return (
    <section className="section-pad bg-cta text-white">
      <div className="container-page text-center">
        <p className="text-label text-xs text-white/60 mb-4 tracking-[0.2em]">FOR BUSINESSES & VENDORS</p>
        <h2 className="font-display font-bold text-display-md text-white mb-6">Vendors Welcome</h2>
        <p className="text-body-xl text-white/80 max-w-xl mx-auto mb-12 leading-relaxed">
          Shop our full 1,000+ catalogue at below-wholesale prices. Perfect for candle makers, soap crafters, resellers, and fragrance businesses of any size.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/catalogue.pdf" download className="btn-ghost text-white border-white hover:bg-white hover:text-cta inline-flex items-center gap-2">
            <Download size={16} /> Download Catalogue
          </a>
          <a href="https://wa.me/12125551234" target="_blank" className="bg-white text-cta font-semibold h-14 px-7 rounded-sm inline-flex items-center gap-2 hover:bg-cream transition-colors">
            <MessageCircle size={16} /> WhatsApp Enquiry
          </a>
          <Link href="/wholesale" className="text-white/70 underline underline-offset-4 hover:text-white transition-colors self-center text-body-md">
            Learn More →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## NewsletterSection (`components/homepage/NewsletterSection.tsx`)

```tsx
'use client';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // replace with real API call
    show('Welcome! Your 10% discount code is on its way.', 'success');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="section-pad bg-brand text-white">
      <div className="container-page text-center max-w-xl mx-auto">
        <p className="text-label text-xs text-gold mb-4 tracking-[0.2em]">JOIN THE CLUB</p>
        <h2 className="font-display font-bold text-display-sm text-white mb-4">
          10% Off Your First Order
        </h2>
        <p className="text-body-lg text-white/60 mb-10 leading-relaxed">
          Get new product announcements, exclusive discounts, and fragrance inspiration delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 h-14 px-5 bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-white/40 text-body-md focus:outline-none focus:border-gold transition-colors"
            required
          />
          <button type="submit" disabled={loading}
            className="h-14 px-8 bg-gold text-brand font-semibold text-body-md rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-60 whitespace-nowrap">
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>
        <p className="text-xs text-white/30 mt-4">No spam, ever. Unsubscribe at any time.</p>
      </div>
    </section>
  );
}
```

---

## Verification

- [ ] Hero fills 100vh with lifestyle image and gradient overlay
- [ ] Trust strip shows 4 icons below hero with no layout shift
- [ ] Category grid shows 6 tiles (2-col mobile, 3-col desktop) with hover overlay
- [ ] 3 scent story sections alternate layout and background correctly
- [ ] Bestseller carousel scrolls horizontally with arrow controls
- [ ] WhyUs shows 4 icon cards in a row
- [ ] Testimonials render on dark background
- [ ] WholesaleModule renders in amber background
- [ ] Newsletter form submits and shows toast
- [ ] Footer wordmark renders as giant faint text

**Next skills:** `exotic-fragrances-shop-page` + `exotic-fragrances-pdp`
