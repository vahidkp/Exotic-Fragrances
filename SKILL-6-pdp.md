---
name: exotic-fragrances-pdp
description: Build the ExoticFragrances Product Detail Page (PDP) — editorial PARFS-style layout with image gallery, sticky product info panel, volume selector, accordions, editorial tagline sections, full-width lifestyle images, product story splits, and You May Also Like upsell grid. Use when building app/shop/[handle]/page.tsx and all /components/pdp/ components. Triggers on: "build the product page", "build the PDP", "build the product detail page", "add the gallery", "build the volume selector", "add accordion details", "build the product story sections", or any request to implement the single product view. Requires exotic-fragrances-components and exotic-fragrances-shop-page to be complete.
---

# ExoticFragrances — Product Detail Page Skill

Builds the full editorial PDP following the PARFS reference: large image gallery left, sticky info right, then deep editorial storytelling sections below.

---

## Page Entry (`app/shop/[handle]/page.tsx`)

```tsx
import { notFound }        from 'next/navigation';
import PDPGallery           from '@/components/pdp/PDPGallery';
import PDPInfo              from '@/components/pdp/PDPInfo';
import EditorialTagline     from '@/components/pdp/EditorialTagline';
import EditorialHero        from '@/components/pdp/EditorialHero';
import ProductStory         from '@/components/pdp/ProductStory';
import CampaignSection      from '@/components/pdp/CampaignSection';
import ArtisticHero         from '@/components/pdp/ArtisticHero';
import YouMayAlsoLike       from '@/components/pdp/YouMayAlsoLike';
import NewsletterSection    from '@/components/homepage/NewsletterSection';
import { getProduct, getProducts } from '@/lib/shopify';
import type { Metadata } from 'next';

interface PDPProps { params: { handle: string }; }

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { product } = await getProduct(params.handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: { images: [{ url: product.images?.nodes?.[0]?.url ?? '' }] },
  };
}

export async function generateStaticParams() {
  const { products } = await getProducts(100);
  return (products?.nodes ?? []).map((p: any) => ({ handle: p.handle }));
}

export default async function PDPPage({ params }: PDPProps) {
  const [{ product }, { products: related }] = await Promise.all([
    getProduct(params.handle),
    getProducts(4),
  ]);
  if (!product) notFound();

  const images  = product.images?.nodes ?? [];
  const variants = product.variants?.nodes ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="container-page text-label text-xs text-muted py-4" style={{marginTop:'calc(40px + 72px)'}}>
        <span>Home</span><span className="mx-2">/</span>
        <span>Shop</span><span className="mx-2">/</span>
        <span className="text-brand">{product.title}</span>
      </nav>

      {/* Main product section: gallery + info */}
      <section className="container-page pb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2 flex-shrink-0">
            <PDPGallery images={images} productTitle={product.title} />
          </div>
          <div className="lg:w-1/2">
            <PDPInfo product={product} variants={variants} />
          </div>
        </div>
      </section>

      {/* Editorial sections */}
      <EditorialTagline
        eyebrow="SIGNATURE EXPERIENCE"
        headline={`A scent that transports you.`}
        body="Pure Grade A fragrance — crafted to capture the essence of a designer original, at a price that lets you wear it every day."
        bg="white"
      />
      <EditorialHero imageSrc={images[1]?.url ?? '/images/editorial/hero-1.jpg'} />
      <ProductStory
        campaignName="THE EXOTIC SIGNATURE"
        headline={product.title}
        copy="An invitation to indulge. A fragrance that clings to memory long after you leave the room. Pure. Elevated. Yours."
        cta="EXPLORE THE COLLECTION"
        ctaHref="/shop"
        imageSrc={images[2]?.url ?? '/images/editorial/story-1.jpg'}
      />
      <CampaignSection
        headline="Echo Your Essence"
        subheadline="Every bottle tells a story. What will yours say?"
        imageSrc={images[3]?.url ?? '/images/editorial/campaign-1.jpg'}
      />
      <ArtisticHero imageSrc="/images/editorial/artistic-close.jpg" />
      <YouMayAlsoLike products={related?.nodes?.filter((p: any) => p.handle !== params.handle).slice(0, 3) ?? []} />
      <NewsletterSection />
    </>
  );
}
```

---

## PDPGallery (`components/pdp/PDPGallery.tsx`)

```tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductImage } from '@/types';

export default function PDPGallery({ images, productTitle }: { images: ProductImage[]; productTitle: string }) {
  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const main   = images[0];
  const mosaic = images.slice(1, 5);

  return (
    <>
      {/* Main image */}
      <div className="relative group rounded-sm overflow-hidden bg-cream cursor-zoom-in"
        style={{ minHeight: '560px' }} onClick={() => setLightbox(true)}>
        <Image src={images[active]?.url ?? '/images/placeholder.jpg'} alt={productTitle}
          fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority sizes="(max-width: 1024px) 100vw, 50vw" />
        <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} className="text-brand" />
        </button>
      </div>

      {/* Mosaic thumbnails */}
      {mosaic.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[images[0], ...mosaic].map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative rounded-sm overflow-hidden bg-cream transition-all duration-150 ${active === i ? 'ring-2 ring-cta' : 'opacity-70 hover:opacity-100'}`}
              style={{ height: '80px' }}>
              <Image src={img?.url ?? '/images/placeholder.jpg'} alt={`${productTitle} view ${i + 1}`}
                fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-modal bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}>
            <motion.div className="relative w-full max-w-3xl aspect-square"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <Image src={images[active]?.url ?? ''} alt={productTitle} fill className="object-contain" sizes="800px" />
            </motion.div>
            <button className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## PDPInfo (`components/pdp/PDPInfo.tsx`)

```tsx
'use client';
import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import Accordion from '@/components/shared/Accordion';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toast';
import { formatPrice } from '@/lib/utils';

export default function PDPInfo({ product, variants }: { product: any; variants: any[] }) {
  const [selected, setSelected] = useState(variants[0]);
  const { addItem, openCart } = useCartStore();
  const { show } = useToast();

  const handleAddToCart = () => {
    addItem({ id: selected.id, variantId: selected.id, title: product.title, variantTitle: selected.title, price: parseFloat(selected.price.amount), quantity: 1, imageUrl: product.images?.nodes?.[0]?.url ?? '' });
    openCart();
    show(`${product.title} — ${selected.title} added to cart`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout'; // replace with actual Shopify checkout URL
  };

  const accordionItems = [
    { title: 'Scent Profile', content: (
      <div className="space-y-3">
        {[['Top Notes','Bergamot, Pink Pepper, Fresh Citrus'],['Heart Notes','Rose, Jasmine, Ylang-Ylang'],['Base Notes','Sandalwood, White Musk, Amber']].map(([k,v]) => (
          <div key={k} className="flex gap-4">
            <span className="text-label text-xs text-muted w-28 flex-shrink-0">{k}</span>
            <span className="text-body-md text-brand">{v}</span>
          </div>
        ))}
        <p className="text-xs text-muted mt-4 border-t border-border pt-4">
          Inspired by a world-renowned designer fragrance. Our version is crafted with the same care — pure, undiluted Grade A oil.
        </p>
      </div>
    )},
    { title: 'Full Description', content: <p className="text-body-md text-brand/70 leading-relaxed">{product.description ?? 'A pure, undiluted Grade A fragrance oil. Long-lasting, skin-safe, and crafted to the highest standard.'}</p> },
    { title: 'Ingredients & Safety', content: (
      <div className="space-y-2 text-body-md text-brand/70">
        <p>100% pure fragrance/essential oil blend. Skin-safe when diluted appropriately (recommended: 20–30% in carrier oil for body use).</p>
        <p className="text-xs text-muted">Not for direct undiluted skin application. Keep out of reach of children. Patch test recommended.</p>
      </div>
    )},
    { title: 'Shipping & Processing', content: (
      <div className="text-body-md text-brand/70 space-y-2">
        <p>All orders processed and dispatched within 24 hours. Standard shipping: 3–7 business days. Express: 1–2 business days.</p>
        <p>Free standard shipping on orders over $50.</p>
      </div>
    )},
    { title: 'Returns Policy', content: (
      <p className="text-body-md text-brand/70">We stand behind our quality. If you are not satisfied, contact us within 30 days for a full resolution. Opened fragrance oils are non-returnable but we will work with you on any quality issue.</p>
    )},
  ];

  return (
    <div className="lg:sticky lg:top-24">
      {/* Brand tag */}
      <p className="text-label text-xs text-muted mb-3 tracking-[0.2em]">EXOTIC FRAGRANCES</p>

      {/* Product name */}
      <h1 className="font-display font-bold text-display-sm text-brand leading-tight mb-4">{product.title}</h1>

      {/* Star rating */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="#D4A843" color="#D4A843" />)}</div>
        <span className="text-body-md text-muted">(128 reviews)</span>
        <a href="#reviews" className="text-xs text-cta border-b border-cta pb-0.5 ml-1 hover:text-cta-hover transition-colors">Read all</a>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-sans font-bold text-price text-brand">{formatPrice(parseFloat(selected?.price?.amount ?? '0'))}</span>
        <span className="tag text-[10px] bg-green-100 text-green-700 border-none">Below Wholesale Price</span>
      </div>

      {/* Volume selector */}
      {variants.length > 1 && (
        <div className="mb-8">
          <p className="text-label text-xs text-muted mb-3 tracking-[0.15em]">VOLUME</p>
          <div className="flex flex-wrap gap-2">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelected(v)} disabled={!v.availableForSale}
                className={`px-4 py-2 text-xs font-medium rounded border transition-all duration-150 
                  ${!v.availableForSale ? 'border-border text-border line-through cursor-not-allowed' :
                    selected?.id === v.id ? 'bg-cta text-white border-cta' : 'border-border text-brand hover:border-cta hover:text-cta'}`}>
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {selected && (
        <p className={`text-xs mb-6 flex items-center gap-2 ${selected.availableForSale ? 'text-green-600' : 'text-error'}`}>
          <span className={`w-2 h-2 rounded-full ${selected.availableForSale ? 'bg-green-500' : 'bg-error'}`} />
          {selected.availableForSale ? 'In Stock — Ready to Ship' : 'Out of Stock'}
        </p>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex gap-3">
          <button onClick={handleAddToCart} disabled={!selected?.availableForSale}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
            {selected?.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
          <button className="w-12 h-14 border border-border rounded flex items-center justify-center hover:border-cta hover:text-cta transition-colors flex-shrink-0"
            onClick={() => show('Added to wishlist', 'success')} aria-label="Add to wishlist">
            <Heart size={18} />
          </button>
        </div>
        <button onClick={handleBuyNow} disabled={!selected?.availableForSale} className="btn-ghost w-full disabled:opacity-50">
          BUY NOW
        </button>
      </div>

      {/* Accordions */}
      <Accordion items={accordionItems} />
    </div>
  );
}
```

---

## EditorialTagline (`components/pdp/EditorialTagline.tsx`)

```tsx
import { cn } from '@/lib/utils';

interface EditorialTaglineProps { eyebrow: string; headline: string; body: string; bg?: 'white' | 'cream' | 'dark'; }

export default function EditorialTagline({ eyebrow, headline, body, bg = 'white' }: EditorialTaglineProps) {
  const bgClass  = { white: 'bg-white', cream: 'bg-cream', dark: 'bg-brand' }[bg];
  const textMain = bg === 'dark' ? 'text-white' : 'text-brand';
  const textSub  = bg === 'dark' ? 'text-white/60' : 'text-brand/60';

  return (
    <section className={cn('section-pad text-center', bgClass)}>
      <div className="container-page max-w-2xl mx-auto">
        <p className="text-label text-xs text-gold mb-6 tracking-[0.25em]">{eyebrow}</p>
        <h2 className={cn('font-display font-bold text-display-md mb-6 leading-tight', textMain)}>{headline}</h2>
        <p className={cn('text-body-xl leading-relaxed', textSub)}>{body}</p>
      </div>
    </section>
  );
}
```

---

## EditorialHero (`components/pdp/EditorialHero.tsx`)

```tsx
'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function EditorialHero({ imageSrc }: { imageSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height: '600px' }}>
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <Image src={imageSrc} alt="Exotic Fragrances editorial" fill className="object-cover" sizes="100vw" />
      </motion.div>
    </div>
  );
}
```

---

## ProductStory (`components/pdp/ProductStory.tsx`)

```tsx
import Image from 'next/image';
import Link from 'next/link';

interface ProductStoryProps { campaignName: string; headline: string; copy: string; cta: string; ctaHref: string; imageSrc: string; }

export default function ProductStory({ campaignName, headline, copy, cta, ctaHref, imageSrc }: ProductStoryProps) {
  return (
    <section className="flex flex-col md:flex-row" style={{ minHeight: '560px' }}>
      {/* Image left */}
      <div className="flex-1 relative bg-cream min-h-[320px] md:min-h-0">
        <Image src={imageSrc} alt={headline} fill className="object-cover" sizes="50vw" />
      </div>
      {/* Text right */}
      <div className="flex-1 flex items-center justify-center bg-white p-12 md:p-20">
        <div className="max-w-md">
          <p className="text-label text-xs text-gold mb-6 tracking-[0.25em]">{campaignName}</p>
          <h2 className="font-display font-bold text-display-md text-brand mb-6 leading-tight">
            {headline.toUpperCase()}
          </h2>
          <p className="text-body-lg text-brand/60 leading-relaxed mb-10">{copy}</p>
          <Link href={ctaHref}
            className="text-label text-xs text-brand border-b border-brand pb-1 hover:text-cta hover:border-cta transition-colors tracking-[0.15em]">
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## CampaignSection (`components/pdp/CampaignSection.tsx`)

```tsx
import Image from 'next/image';

interface CampaignSectionProps { headline: string; subheadline: string; imageSrc: string; }

export default function CampaignSection({ headline, subheadline, imageSrc }: CampaignSectionProps) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
      <Image src={imageSrc} alt={headline} fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-brand/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center container-page section-pad">
        <h2 className="font-display font-bold text-display-md text-white mb-4">{headline}</h2>
        <p className="text-body-xl text-white/70 max-w-md">{subheadline}</p>
      </div>
    </section>
  );
}
```

---

## ArtisticHero (`components/pdp/ArtisticHero.tsx`)

```tsx
import Image from 'next/image';

export default function ArtisticHero({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative overflow-hidden" style={{ height: '480px' }}>
      <Image src={imageSrc} alt="Exotic Fragrances ingredients" fill
        className="object-cover object-center" sizes="100vw" />
    </div>
  );
}
```

---

## YouMayAlsoLike (`components/pdp/YouMayAlsoLike.tsx`)

```tsx
import ProductCard from '@/components/shop/ProductCard';
import type { Product } from '@/types';

export default function YouMayAlsoLike({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="section-pad bg-warm-white">
      <div className="container-page">
        <h2 className="font-display font-bold text-display-sm text-brand text-center mb-12">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
```

---

## Verification

- [ ] PDP loads at `/shop/[product-handle]` with no 404
- [ ] Main gallery image fills left 50% column on desktop, full-width on mobile
- [ ] 4 thumbnail mosaic appears below main image, clicking updates main image
- [ ] Lightbox opens on main image click with zoom animation
- [ ] Volume selector updates price when different size is selected
- [ ] Add to Cart opens cart drawer with correct item
- [ ] Buy Now redirects to checkout
- [ ] All 5 accordions open/close with smooth height animation
- [ ] Editorial tagline section renders centred text on correct background
- [ ] Full-width editorial hero has subtle parallax on scroll
- [ ] Product Story renders 50/50 split correctly
- [ ] Campaign Section renders with image + overlay + centred text
- [ ] You May Also Like shows 3 product cards

**Next skill:** `exotic-fragrances-animations`
