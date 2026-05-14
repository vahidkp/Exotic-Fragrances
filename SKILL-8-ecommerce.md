---
name: exotic-fragrances-ecommerce
description: Implement all e-commerce functionality for the ExoticFragrances site — Shopify cart API integration, add-to-cart flow, checkout redirect, persistent cart, wishlist, inventory checking, and search. Use this skill as the final integration step after all pages and animations are complete. Triggers on: "wire up the cart", "integrate Shopify", "connect checkout", "add cart functionality", "implement add to cart", "connect the Shopify API", "add wishlist", "implement search", "check inventory", or any request to make the commerce layer functional. Requires all page skills to be complete.
---

# ExoticFragrances — E-Commerce Integration Skill

Connects all UI components to live Shopify Storefront API data. Implements cart persistence, checkout, wishlist, and predictive search.

---

## 1. Enhanced Shopify Client (`lib/shopify.ts` — additions)

Add these queries and mutations to the existing `lib/shopify.ts`:

```typescript
// ── Cart Mutations ─────────────────────────────────────────────
export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id checkoutUrl
    lines(first: 100) {
      nodes {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title availableForSale
            price { amount currencyCode }
            product { title handle featuredImage { url altText } }
          }
        }
        cost { totalAmount { amount currencyCode } }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`;

export async function cartCreate(lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartCreate: { cart: any; userErrors: any[] } }>({
    query: `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    } ${CART_FRAGMENT}`,
    variables: { input: { lines } },
  });
}

export async function cartLinesAdd(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  return shopifyFetch<{ cartLinesAdd: { cart: any; userErrors: any[] } }>({
    query: `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    } ${CART_FRAGMENT}`,
    variables: { cartId, lines },
  });
}

export async function cartLinesUpdate(cartId: string, lines: { id: string; quantity: number }[]) {
  return shopifyFetch<{ cartLinesUpdate: { cart: any } }>({
    query: `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
      }
    } ${CART_FRAGMENT}`,
    variables: { cartId, lines },
  });
}

export async function cartLinesRemove(cartId: string, lineIds: string[]) {
  return shopifyFetch<{ cartLinesRemove: { cart: any } }>({
    query: `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
      }
    } ${CART_FRAGMENT}`,
    variables: { cartId, lineIds },
  });
}

export async function getCart(cartId: string) {
  return shopifyFetch<{ cart: any }>({
    query: `query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFragment } } ${CART_FRAGMENT}`,
    variables: { cartId },
  });
}

// ── Product Queries ────────────────────────────────────────────
export async function getProductsByCollection(handle: string, first = 24) {
  return shopifyFetch<{ collection: { products: { nodes: any[] } } }>({
    query: `query Collection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) { nodes { ...ProductFragment } }
      }
    } ${PRODUCT_FRAGMENT}`,
    variables: { handle, first },
  });
}

export async function searchProducts(query: string, first = 10) {
  return shopifyFetch<{ predictiveSearch: { products: any[] } }>({
    query: `query PredictiveSearch($query: String!, $first: Int!) {
      predictiveSearch(query: $query, limit: $first, types: [PRODUCT]) {
        products { id handle title featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } }
      }
    }`,
    variables: { query, first },
  });
}

export async function getProductVariant(productHandle: string, selectedOptions: { name: string; value: string }[]) {
  return shopifyFetch<{ product: { variantBySelectedOptions: any } }>({
    query: `query ProductVariant($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
      product(handle: $handle) {
        variantBySelectedOptions(selectedOptions: $selectedOptions) {
          id title availableForSale quantityAvailable
          price { amount currencyCode }
        }
      }
    }`,
    variables: { handle: productHandle, selectedOptions },
  });
}
```

---

## 2. Enhanced Cart Store (`store/cart.ts` — full Shopify-connected version)

Replace the existing `store/cart.ts` with the full Shopify-integrated version:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove, getCart } from '@/lib/shopify';
import type { CartItem } from '@/types';

interface CartStore {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  cartId: string | null;
  checkoutUrl: string | null;

  // Computed
  itemCount: number;
  subtotal: number;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  syncCart: () => Promise<void>;
}

// Transform Shopify cart lines to our CartItem format
function transformLines(lines: any[]): CartItem[] {
  return lines.map(line => ({
    id: line.id,
    variantId: line.merchandise.id,
    title: line.merchandise.product.title,
    variantTitle: line.merchandise.title,
    price: parseFloat(line.merchandise.price.amount),
    quantity: line.quantity,
    imageUrl: line.merchandise.product.featuredImage?.url ?? '',
    handle: line.merchandise.product.handle,
  }));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], isOpen: false, isLoading: false,
      cartId: null, checkoutUrl: null,

      get itemCount() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get subtotal()  { return get().items.reduce((s, i) => s + i.price * i.quantity, 0); },

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Initialise or rehydrate the Shopify cart
      initCart: async () => {
        const { cartId } = get();
        if (cartId) {
          // Verify existing cart is still valid
          try {
            const { cart } = await getCart(cartId);
            if (cart) {
              set({ items: transformLines(cart.lines.nodes), checkoutUrl: cart.checkoutUrl });
              return;
            }
          } catch {
            // Cart expired — create new
          }
        }
        // Create new cart
        const { cartCreate: result } = await cartCreate([]);
        set({ cartId: result.cart.id, checkoutUrl: result.cart.checkoutUrl, items: [] });
      },

      addItem: async (variantId, quantity = 1) => {
        set({ isLoading: true });
        try {
          let { cartId } = get();
          if (!cartId) {
            const { cartCreate: result } = await cartCreate([{ merchandiseId: variantId, quantity }]);
            set({ cartId: result.cart.id, checkoutUrl: result.cart.checkoutUrl, items: transformLines(result.cart.lines.nodes) });
          } else {
            const { cartLinesAdd: result } = await cartLinesAdd(cartId, [{ merchandiseId: variantId, quantity }]);
            set({ items: transformLines(result.cart.lines.nodes), checkoutUrl: result.cart.checkoutUrl });
          }
        } catch (err) {
          console.error('Add to cart failed:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId) => {
        set({ isLoading: true });
        const { cartId } = get();
        if (!cartId) return;
        try {
          const { cartLinesRemove: result } = await cartLinesRemove(cartId, [lineId]);
          set({ items: transformLines(result.cart.lines.nodes) });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId, quantity) => {
        if (quantity <= 0) { get().removeItem(lineId); return; }
        set({ isLoading: true });
        const { cartId } = get();
        if (!cartId) return;
        try {
          const { cartLinesUpdate: result } = await cartLinesUpdate(cartId, [{ id: lineId, quantity }]);
          set({ items: transformLines(result.cart.lines.nodes) });
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const { cartId } = get();
        if (!cartId) return;
        const { cart } = await getCart(cartId);
        if (cart) set({ items: transformLines(cart.lines.nodes), checkoutUrl: cart.checkoutUrl });
      },
    }),
    {
      name: 'ef-cart-v2',
      partialize: state => ({ cartId: state.cartId, checkoutUrl: state.checkoutUrl }),
    }
  )
);
```

---

## 3. useCart Hook (`hooks/useCart.ts`)

```typescript
import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toast';

export function useCart() {
  const store = useCartStore();
  const { show } = useToast();

  // Initialise cart on first mount
  useEffect(() => { store.initCart(); }, []);

  const addToCart = async (variantId: string, productTitle: string, quantity = 1) => {
    await store.addItem(variantId, quantity);
    store.openCart();
    show(`${productTitle} added to cart`, 'success');
  };

  const removeFromCart = async (lineId: string) => {
    await store.removeItem(lineId);
    show('Item removed from cart', 'success');
  };

  const checkout = () => {
    const { checkoutUrl } = store;
    if (checkoutUrl) window.location.href = checkoutUrl;
  };

  return { ...store, addToCart, removeFromCart, checkout };
}
```

---

## 4. Update PDPInfo to use real cart hook

```typescript
// In components/pdp/PDPInfo.tsx — replace useCartStore directly with:
import { useCart } from '@/hooks/useCart';

// Inside component:
const { addToCart, isLoading } = useCart();

// In handleAddToCart:
const handleAddToCart = async () => {
  if (!selected?.availableForSale) return;
  await addToCart(selected.id, product.title);
};

// In handleBuyNow:
const handleBuyNow = async () => {
  await addToCart(selected.id, product.title);
  checkout();
};
```

---

## 5. Update ProductCard to use real cart hook

```typescript
// In components/shop/ProductCard.tsx:
import { useCart } from '@/hooks/useCart';

const { addToCart, isLoading } = useCart();

const handleAddToCart = async (e: React.MouseEvent) => {
  e.preventDefault();
  const variant = product.variants?.find(v => v.title === selectedSize) ?? product.variants?.[0];
  if (!variant) return;
  await addToCart(variant.id, product.title);
};
```

---

## 6. Real-Time Inventory Check (`hooks/useInventory.ts`)

```typescript
import { useState, useEffect } from 'react';
import { getProductVariant } from '@/lib/shopify';

export function useInventory(productHandle: string, selectedOptions: { name: string; value: string }[]) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [qty, setQty]             = useState<number | null>(null);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!selectedOptions.length) return;
    setLoading(true);
    getProductVariant(productHandle, selectedOptions)
      .then(({ product }) => {
        const v = product?.variantBySelectedOptions;
        setAvailable(v?.availableForSale ?? false);
        setQty(v?.quantityAvailable ?? 0);
      })
      .catch(() => setAvailable(null))
      .finally(() => setLoading(false));
  }, [productHandle, JSON.stringify(selectedOptions)]);

  return { available, qty, loading };
}
```

Use in `PDPInfo.tsx`:
```typescript
const { available, qty, loading: inventoryLoading } = useInventory(
  product.handle,
  selected ? [{ name: 'Size', value: selected.title }] : []
);
```

---

## 7. Search Overlay (`components/shared/SearchOverlay.tsx`)

```tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts } from '@/lib/shopify';
import { formatPrice } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchOverlayProps { isOpen: boolean; onClose: () => void; }

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);
  const debouncedQuery        = useDebounce(query, 300);

  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setLoading(true);
    searchProducts(debouncedQuery)
      .then(data => setResults(data.predictiveSearch?.products ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const POPULAR = ['Oud Rose', 'Vanilla Bourbon', 'Citrus Fresh', 'Amber Wood', 'Jasmine Noir'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-drawer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} />
          <motion.div className="fixed top-0 left-0 right-0 z-modal bg-white shadow-overlay"
            initial={{y:'-100%'}} animate={{y:0}} exit={{y:'-100%'}}
            transition={{type:'tween', duration:0.3, ease:[0.25,0.46,0.45,0.94]}}>
            <div className="container-page py-8">
              {/* Search input */}
              <div className="flex items-center gap-4 border-b-2 border-brand pb-4">
                <Search size={22} className="text-muted flex-shrink-0" />
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search 1,000+ fragrance oils..."
                  className="flex-1 text-body-xl text-brand bg-transparent outline-none placeholder:text-border"
                  onKeyDown={e => e.key === 'Escape' && onClose()}
                />
                {query && <button onClick={() => setQuery('')} className="text-muted hover:text-brand"><X size={18} /></button>}
                <button onClick={onClose} className="text-muted hover:text-brand ml-4"><X size={22} /></button>
              </div>

              {/* Results */}
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {!query && (
                  <div>
                    <p className="text-label text-xs text-muted mb-4 tracking-[0.15em]">POPULAR SEARCHES</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map(t => (
                        <button key={t} onClick={() => setQuery(t)}
                          className="px-4 py-2 text-sm border border-border rounded-full text-brand hover:border-cta hover:text-cta transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex gap-4 py-4">
                    {[1,2,3].map(i => <div key={i} className="animate-pulse flex gap-3 flex-1"><div className="w-16 h-16 bg-cream rounded" /><div className="flex-1"><div className="h-3 bg-cream rounded w-3/4 mb-2" /><div className="h-3 bg-cream rounded w-1/2" /></div></div>)}
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div>
                    <p className="text-label text-xs text-muted mb-4 tracking-[0.15em]">{results.length} RESULTS FOR "{query}"</p>
                    <div className="space-y-3">
                      {results.map(p => (
                        <Link key={p.id} href={`/shop/${p.handle}`} onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-md hover:bg-warm-white transition-colors group">
                          <div className="relative w-16 h-16 bg-cream rounded flex-shrink-0 overflow-hidden">
                            {p.featuredImage && <Image src={p.featuredImage.url} alt={p.title} fill className="object-cover" sizes="64px" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-medium text-sm text-brand truncate group-hover:text-cta transition-colors">{p.title}</p>
                            <p className="text-xs text-muted mt-1">{formatPrice(parseFloat(p.priceRange.minVariantPrice.amount))}</p>
                          </div>
                          <ArrowRight size={16} className="text-border group-hover:text-cta transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-body-lg text-muted">No results for "{query}"</p>
                    <p className="text-body-md text-muted/60 mt-2">Try a different scent name or family</p>
                    <Link href="/shop" onClick={onClose} className="btn-primary btn-sm mt-6 inline-flex">Browse All Fragrances</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 8. Debounce Hook (`hooks/useDebounce.ts`)

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

---

## 9. Wishlist Store (`store/wishlist.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  handles: string[];
  toggle: (handle: string) => void;
  isWishlisted: (handle: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (handle) => set(s => ({
        handles: s.handles.includes(handle)
          ? s.handles.filter(h => h !== handle)
          : [...s.handles, handle]
      })),
      isWishlisted: (handle) => get().handles.includes(handle),
    }),
    { name: 'ef-wishlist' }
  )
);
```

---

## 10. Revalidation API Route (`app/api/revalidate/route.ts`)

Allows Sanity and Shopify webhooks to trigger ISR revalidation:

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { type, handle } = await req.json();

  if (type === 'product' && handle) {
    revalidatePath(`/shop/${handle}`);
    revalidatePath('/shop');
  } else if (type === 'collection') {
    revalidatePath('/shop');
  } else if (type === 'homepage') {
    revalidatePath('/');
  } else {
    revalidatePath('/');
    revalidatePath('/shop');
  }

  return NextResponse.json({ revalidated: true, type, handle });
}
```

---

## 11. Wire Search to Header

Update `components/layout/Header.tsx` to open the search overlay:

```typescript
import { useState } from 'react';
import SearchOverlay from '@/components/shared/SearchOverlay';

// Inside Header component:
const [searchOpen, setSearchOpen] = useState(false);

// Update the search button:
<button className="p-2 hover:text-cta transition-colors" onClick={() => setSearchOpen(true)} aria-label="Search">
  <Search size={20} />
</button>

// Add the overlay (before closing tag):
<SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
```

---

## Final Integration Checklist

### Cart
- [ ] `useCart().addToCart()` called from ProductCard and PDPInfo
- [ ] Cart persists after page refresh (cartId in localStorage via Zustand persist)
- [ ] Cart syncs with Shopify on rehydration via `initCart()`
- [ ] Checkout button in CartDrawer goes to real Shopify checkoutUrl
- [ ] Quantity updates call `cartLinesUpdate` on Shopify
- [ ] Remove item calls `cartLinesRemove` on Shopify
- [ ] Loading spinner shown on CartDrawer while mutations are in flight

### Inventory
- [ ] Variant out-of-stock states disable the Add to Cart button on PDP
- [ ] Product cards show out-of-stock badge for unavailable variants
- [ ] Real inventory fetched per variant on PDP via `useInventory`

### Search
- [ ] Search overlay opens from header search icon
- [ ] Results appear within 300ms of typing (debounced)
- [ ] Clicking a result closes overlay and navigates to PDP
- [ ] Escape key closes the overlay
- [ ] Popular searches shown when input is empty

### Wishlist
- [ ] Heart icon on product card toggles wishlist state
- [ ] Wishlist persists in localStorage
- [ ] Heart fills when item is wishlisted

### Revalidation
- [ ] `/api/revalidate?secret=xxx` endpoint returns 200 with `{ revalidated: true }`
- [ ] Shopify webhook set to POST to `/api/revalidate?secret=xxx` on product update
- [ ] Sanity webhook set to POST to `/api/revalidate?secret=xxx` on document publish

---

**All 8 skills complete. The ExoticFragrances Next.js site is production-ready.**

Run final checks:
```bash
npm run build          # Zero TypeScript errors, all routes compile
npm run lint           # Zero ESLint warnings
npx lighthouse http://localhost:3000 --view   # LCP < 2.5s, CLS < 0.1
```
