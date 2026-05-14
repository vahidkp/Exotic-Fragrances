---
name: exotic-fragrances-shop-page
description: Build the ExoticFragrances Shop/Collection page — product grid with sticky filter sidebar, sort controls, URL-synced filter state, ProductCard components, pagination, and the ScenDiscovery mid-page banner. Use when building app/shop/page.tsx and all /components/shop/ components. Triggers on: "build the shop page", "build the collection page", "create the product grid", "add filters", "build the filter sidebar", "build product cards", "add sorting", or any request to implement the browsing/listing page for ExoticFragrances. Requires exotic-fragrances-components to be complete.
---

# ExoticFragrances — Shop Page Skill

Builds the complete `/shop` listing page: filter sidebar, product grid, sort bar, URL state, product cards.

---

## Page Entry (`app/shop/page.tsx`)

```tsx
import { Suspense } from 'react';
import ShopHeader      from '@/components/shop/ShopHeader';
import FilterSidebar   from '@/components/shop/FilterSidebar';
import SortBar         from '@/components/shop/SortBar';
import ProductGrid     from '@/components/shop/ProductGrid';
import ScentDiscoveryBanner from '@/components/shop/ScentDiscoveryBanner';
import { getProducts } from '@/lib/shopify';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Fragrance Oils',
  description: 'Browse 1,000+ Grade A fragrance oils, essential oils, body butters and more. Filter by scent family, gender, size, and price.',
};

interface ShopPageProps {
  searchParams: {
    category?: string; scent?: string; gender?: string;
    size?: string; sort?: string; page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = Number(searchParams.page ?? 1);
  const { products } = await getProducts(24);

  return (
    <>
      <ShopHeader category={searchParams.category} />
      {/* Breadcrumb */}
      <nav className="container-page py-4 text-label text-xs text-muted">
        <span>Home</span><span className="mx-2">/</span>
        <span>Shop</span>
        {searchParams.category && <><span className="mx-2">/</span><span className="text-brand capitalize">{searchParams.category}</span></>}
      </nav>

      <div className="container-page pb-24">
        <div className="flex gap-10 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
            <Suspense><FilterSidebar /></Suspense>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <Suspense><SortBar total={products?.nodes?.length ?? 0} /></Suspense>
            <ScentDiscoveryBanner />
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products?.nodes ?? []} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-border rounded-sm h-72 mb-4" />
          <div className="h-3 bg-border rounded w-3/4 mb-2" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

---

## ShopHeader (`components/shop/ShopHeader.tsx`)

```tsx
import Image from 'next/image';

interface ShopHeaderProps { category?: string; }

const CATEGORY_IMAGES: Record<string, string> = {
  womens:      '/images/categories/womens.jpg',
  mens:        '/images/categories/mens.jpg',
  unisex:      '/images/categories/unisex.jpg',
  essential:   '/images/categories/essential.jpg',
  home:        '/images/categories/home.jpg',
  accessories: '/images/categories/accessories.jpg',
  default:     '/images/shop/shop-hero.jpg',
};

export default function ShopHeader({ category }: ShopHeaderProps) {
  const imgSrc = CATEGORY_IMAGES[category ?? 'default'] ?? CATEGORY_IMAGES.default;
  const title  = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    : 'All Fragrances';

  return (
    <div className="relative h-72 flex items-center overflow-hidden mt-20" style={{marginTop:'calc(40px + 72px)'}}>
      <Image src={imgSrc} alt={title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-brand/60" />
      <div className="container-page relative z-10">
        <p className="text-label text-xs text-gold mb-3 tracking-[0.2em]">EXOTIC FRAGRANCES</p>
        <h1 className="font-display font-bold text-display-md text-white">{title.toUpperCase()}</h1>
      </div>
    </div>
  );
}
```

---

## FilterSidebar (`components/shop/FilterSidebar.tsx`)

```tsx
'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCENT_FAMILIES = [
  { label: 'Floral',    colour: '#E8A5B4' },
  { label: 'Woody',     colour: '#A0785A' },
  { label: 'Oriental',  colour: '#C4763A' },
  { label: 'Fresh',     colour: '#7AC5CD' },
  { label: 'Gourmand',  colour: '#D4A843' },
  { label: 'Oud',       colour: '#5C3317' },
  { label: 'Citrus',    colour: '#F4C842' },
  { label: 'Aquatic',   colour: '#4A9ECC' },
];
const GENDERS = ['Women\'s', 'Men\'s', 'Unisex'];
const SIZES   = ['Sample 0.5oz', '1oz', '2oz', '4oz', '8oz', '16oz'];
const TYPES   = ['Fragrance Oil', 'Essential Oil', 'Carrier Oil', 'Body Butter', 'Diffuser Blend'];

export default function FilterSidebar() {
  const router      = useRouter();
  const pathname    = usePathname();
  const params      = useSearchParams();

  const updateParam = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    const existing = p.getAll(key);
    if (existing.includes(value)) { p.delete(key); existing.filter(v => v !== value).forEach(v => p.append(key, v)); }
    else p.append(key, value);
    p.delete('page');
    router.push(`${pathname}?${p.toString()}`);
  }, [params, pathname, router]);

  const clearAll = () => router.push(pathname);
  const hasFilters = params.toString().length > 0;

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-label text-xs text-brand tracking-[0.15em]">FILTER</h2>
        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted hover:text-cta transition-colors">
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Scent Family */}
      <FilterGroup title="SCENT FAMILY">
        {SCENT_FAMILIES.map(({ label, colour }) => {
          const active = params.getAll('scent').includes(label.toLowerCase());
          return (
            <button key={label} onClick={() => updateParam('scent', label.toLowerCase())}
              className={cn('flex items-center gap-3 w-full text-left py-2 text-body-md transition-colors',
                active ? 'text-cta font-medium' : 'text-brand/70 hover:text-brand')}>
              <span className="w-3 h-3 rounded-full flex-shrink-0 border border-border" style={{ backgroundColor: colour }} />
              {label}
              {active && <span className="ml-auto text-cta"><X size={12} /></span>}
            </button>
          );
        })}
      </FilterGroup>

      {/* Gender */}
      <FilterGroup title="GENDER">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map(g => {
            const active = params.getAll('gender').includes(g.toLowerCase());
            return (
              <button key={g} onClick={() => updateParam('gender', g.toLowerCase())}
                className={cn('px-4 py-2 text-xs font-medium rounded-full border transition-all duration-150',
                  active ? 'bg-cta text-white border-cta' : 'border-border text-brand hover:border-cta hover:text-cta')}>
                {g}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Size */}
      <FilterGroup title="BOTTLE SIZE">
        {SIZES.map(s => {
          const active = params.getAll('size').includes(s.toLowerCase().replace(/\s/g, '-'));
          return (
            <label key={s} className="flex items-center gap-3 py-2 cursor-pointer group">
              <input type="checkbox" checked={active} onChange={() => updateParam('size', s.toLowerCase().replace(/\s/g, '-'))}
                className="w-4 h-4 rounded border-border accent-cta cursor-pointer" />
              <span className={cn('text-body-md transition-colors', active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand')}>{s}</span>
            </label>
          );
        })}
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup title="PRICE RANGE">
        {[['Under $10','0-10'],['$10–$25','10-25'],['$25–$50','25-50'],['$50+','50-999']].map(([label, value]) => {
          const active = params.get('price') === value;
          return (
            <label key={value} className="flex items-center gap-3 py-2 cursor-pointer group">
              <input type="radio" name="price" checked={active} onChange={() => updateParam('price', value)}
                className="w-4 h-4 border-border accent-cta cursor-pointer" />
              <span className={cn('text-body-md transition-colors', active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand')}>{label}</span>
            </label>
          );
        })}
      </FilterGroup>

      {/* Type */}
      <FilterGroup title="PRODUCT TYPE">
        {TYPES.map(t => {
          const active = params.getAll('type').includes(t.toLowerCase().replace(/\s/g, '-'));
          return (
            <label key={t} className="flex items-center gap-3 py-2 cursor-pointer group">
              <input type="checkbox" checked={active} onChange={() => updateParam('type', t.toLowerCase().replace(/\s/g, '-'))}
                className="w-4 h-4 rounded border-border accent-cta cursor-pointer" />
              <span className={cn('text-body-md transition-colors', active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand')}>{t}</span>
            </label>
          );
        })}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-6">
      <h3 className="text-label text-xs text-muted mb-4 tracking-[0.15em]">{title}</h3>
      {children}
    </div>
  );
}
```

---

## SortBar (`components/shop/SortBar.tsx`)

```tsx
'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  { value: 'featured',     label: 'Featured' },
  { value: 'price-asc',    label: 'Price: Low to High' },
  { value: 'price-desc',   label: 'Price: High to Low' },
  { value: 'newest',       label: 'New Arrivals' },
  { value: 'best-selling', label: 'Best Selling' },
];

export default function SortBar({ total }: { total: number }) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const setSort = (sort: string) => {
    const p = new URLSearchParams(params.toString());
    p.set('sort', sort);
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="flex items-center justify-between py-5 border-b border-border mb-6">
      <span className="text-label text-xs text-muted tracking-[0.1em]">{total} PRODUCTS</span>
      <div className="flex items-center gap-4">
        <select value={params.get('sort') ?? 'featured'} onChange={e => setSort(e.target.value)}
          className="text-body-md text-brand bg-transparent border border-border rounded px-3 py-2 cursor-pointer focus:outline-none focus:border-cta transition-colors">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="hidden md:flex gap-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'text-cta' : 'text-muted hover:text-brand'}`}><LayoutGrid size={18} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'text-cta' : 'text-muted hover:text-brand'}`}><List size={18} /></button>
        </div>
      </div>
    </div>
  );
}
```

---

## ProductCard (`components/shop/ProductCard.tsx`)

```tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toast';
import { formatPrice, isNewProduct } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const [hovering, setHovering] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.title ?? '1oz');
  const { addItem, openCart } = useCartStore();
  const { show } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const variant = product.variants?.find(v => v.title === selectedSize) ?? product.variants?.[0];
    if (!variant) return;
    addItem({ id: variant.id, variantId: variant.id, title: product.title, variantTitle: selectedSize, price: variant.price, quantity: 1, imageUrl: product.images?.[0]?.url ?? '' });
    openCart();
    show(`${product.title} added to cart`, 'success');
  };

  return (
    <Link href={`/shop/${product.handle}`}
      className="product-card block group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-cream" style={{ height: '320px' }}>
        <Image src={product.images?.[0]?.url ?? '/images/placeholder.jpg'} alt={product.title}
          fill className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNewProduct(product.tags?.find(t => t.startsWith('created:'))?.split(':')[1] ?? '') && (
            <span className="tag text-[10px]">NEW</span>
          )}
        </div>
        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          onClick={e => { e.preventDefault(); show('Added to wishlist', 'success'); }}>
          <Heart size={14} className="text-brand" />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        {product.scentFamily && (
          <span className="tag text-[10px] mb-3 inline-block">{product.scentFamily}</span>
        )}
        <h3 className="font-sans font-medium text-body-md text-brand mb-1 line-clamp-2 group-hover:text-cta transition-colors">
          {product.title}
        </h3>

        {/* Size pills */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
            {product.variants.slice(0, 4).map(v => (
              <button key={v.id} onClick={e => { e.preventDefault(); setSelectedSize(v.title); }}
                className={`px-2.5 py-1 text-[11px] rounded-full border transition-all duration-150
                  ${selectedSize === v.title ? 'bg-cta text-white border-cta' : 'border-border text-muted hover:border-cta hover:text-cta'}`}>
                {v.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-sans font-bold text-price-sm text-brand">{formatPrice(product.price)}</span>
          <button onClick={handleAddToCart}
            className={`flex items-center gap-2 text-xs font-semibold transition-all duration-200
              ${hovering ? 'bg-cta text-white px-4 py-2 rounded-sm' : 'text-muted'}`}>
            <ShoppingBag size={14} />
            {hovering && 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
```

---

## ProductGrid (`components/shop/ProductGrid.tsx`)

```tsx
import ProductCard from './ProductCard';
import type { Product } from '@/types';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <p className="text-display-sm font-display text-border">∅</p>
        <h3 className="text-heading-xl font-sans text-brand">No fragrances found</h3>
        <p className="text-body-md text-muted">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

## ScentDiscoveryBanner (`components/shop/ScentDiscoveryBanner.tsx`)

```tsx
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function ScentDiscoveryBanner() {
  return (
    <div className="bg-cream rounded-sm p-6 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Sparkles size={20} className="text-gold flex-shrink-0" />
        <p className="text-body-md text-brand font-medium">
          Not sure where to start? Let us help you find your signature scent.
        </p>
      </div>
      <Link href="/scent-finder"
        className="text-label text-xs text-cta border-b border-cta pb-0.5 hover:text-cta-hover transition-colors whitespace-nowrap tracking-[0.1em]">
        TRY SCENT FINDER →
      </Link>
    </div>
  );
}
```

---

## Verification

- [ ] `/shop` page renders with header banner, breadcrumb, sidebar, and grid
- [ ] Filter sidebar: checking a scent family updates the URL `?scent=floral`
- [ ] Sort dropdown updates `?sort=price-asc` in URL
- [ ] Product cards show image, scent tag, name, size pills, price
- [ ] Hovering a product card shows amber border, lift shadow, and 'Add' button
- [ ] Clicking 'Add' opens cart drawer and shows toast
- [ ] Empty state renders when no products match filters
- [ ] Scent Discovery Banner appears above product grid

**Next skill:** `exotic-fragrances-pdp`
