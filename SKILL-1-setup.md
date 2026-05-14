---
name: exotic-fragrances-setup
description: Bootstrap the ExoticFragrances Next.js 14 project in the Antigravity environment. Use this skill at the very start of the project, before any component work begins. Triggers on: "set up the project", "initialise the app", "create the Next.js app", "scaffold the project", "configure the environment", or any request to start the ExoticFragrances build from scratch. This skill must be completed before any other exotic-fragrances-* skill can run.
---

# ExoticFragrances — Project Setup Skill

Bootstraps the complete Next.js 14 (App Router) project with all dependencies, folder structure, environment config, and third-party client connections (Shopify Storefront API + Sanity v3).

---

## Prerequisites

Confirm these are available before starting:
- Node.js 20+
- npm 10+ or pnpm 9+
- Shopify store with Storefront API access token
- Sanity project ID and dataset name
- Vercel account (for deployment)

---

## Step 1 — Create Next.js App

```bash
npx create-next-app@latest exotic-fragrances \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
cd exotic-fragrances
```

---

## Step 2 — Install All Dependencies

```bash
# Core UI & animation
npm install framer-motion@11 clsx tailwind-merge

# State & data
npm install zustand @tanstack/react-query

# Commerce
npm install @shopify/hydrogen-react

# CMS
npm install @sanity/client next-sanity

# Icons
npm install lucide-react

# Utilities
npm install date-fns

# Dev
npm install -D @types/node prettier prettier-plugin-tailwindcss
```

---

## Step 3 — Folder Structure

Create the following directories exactly:

```
exotic-fragrances/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [handle]/
│   │       └── page.tsx
│   └── api/
│       └── revalidate/
│           └── route.ts
├── components/
│   ├── layout/
│   ├── homepage/
│   ├── shop/
│   ├── pdp/
│   └── shared/
├── lib/
│   ├── shopify.ts
│   ├── sanity.ts
│   └── utils.ts
├── store/
│   └── cart.ts
├── hooks/
│   ├── useCart.ts
│   └── useFilters.ts
├── types/
│   └── index.ts
└── styles/
    └── tokens.css
```

```bash
mkdir -p app/shop/\[handle\] app/api/revalidate
mkdir -p components/{layout,homepage,shop,pdp,shared}
mkdir -p lib store hooks types styles
```

---

## Step 4 — Environment Variables

Create `.env.local`:

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_API_TOKEN=your_admin_token

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Revalidation
REVALIDATION_SECRET=your_random_secret_32_chars
```

---

## Step 5 — Shopify Client (`lib/shopify.ts`)

```typescript
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_URL = `https://${domain}/api/2024-01/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data as T;
}

// ── Core Queries ──────────────────────────────────────────────
export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id handle title description
    priceRange { minVariantPrice { amount currencyCode } }
    featuredImage { url altText width height }
    images(first: 8) { nodes { url altText width height } }
    variants(first: 20) {
      nodes { id title price { amount currencyCode } availableForSale selectedOptions { name value } }
    }
    tags metafields(identifiers: [{namespace:"custom",key:"scent_family"},{namespace:"custom",key:"inspired_by"}]) {
      key value
    }
  }
`;

export async function getProducts(first = 24, after?: string) {
  return shopifyFetch<{ products: { nodes: any[]; pageInfo: any } }>({
    query: `query Products($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { ...ProductFragment }
      }
    } ${PRODUCT_FRAGMENT}`,
    variables: { first, after },
  });
}

export async function getProduct(handle: string) {
  return shopifyFetch<{ product: any }>({
    query: `query Product($handle: String!) {
      product(handle: $handle) { ...ProductFragment }
    } ${PRODUCT_FRAGMENT}`,
    variables: { handle },
  });
}

export async function createCart() {
  return shopifyFetch<{ cartCreate: { cart: any } }>({
    query: `mutation CartCreate {
      cartCreate { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id title product { title featuredImage { url } } price { amount currencyCode } } } } } cost { totalAmount { amount currencyCode } } } }
    }`,
  });
}
```

---

## Step 6 — Sanity Client (`lib/sanity.ts`)

```typescript
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

export async function getHeroContent() {
  return sanityClient.fetch(`*[_type == "hero"][0]{
    headline, subheadline, ctaText, ctaLink,
    "imageUrl": image.asset->url,
    trustItems
  }`);
}

export async function getCategories() {
  return sanityClient.fetch(`*[_type == "category"] | order(order asc) {
    name, slug, description,
    "imageUrl": image.asset->url
  }`);
}

export async function getScentStories() {
  return sanityClient.fetch(`*[_type == "scentStory"] | order(order asc) {
    name, description, ctaText,
    "imageUrl": image.asset->url,
    reverse, background
  }`);
}
```

---

## Step 7 — TypeScript Types (`types/index.ts`)

```typescript
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  images: ProductImage[];
  variants: ProductVariant[];
  scentFamily?: string;
  inspiredBy?: string;
  tags: string[];
  isNew?: boolean;
}

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ScentStory {
  name: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  reverse: boolean;
  background: 'dark' | 'cream' | 'white';
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'best-selling';

export interface FilterState {
  scentFamily: string[];
  gender: string[];
  size: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  type: string[];
}
```

---

## Step 8 — Utilities (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function isNewProduct(createdAt: string, days = 30): boolean {
  return (Date.now() - new Date(createdAt).getTime()) < days * 86400000;
}
```

---

## Step 9 — Tailwind Config

In `tailwind.config.ts`, extend the theme:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:   '#1A1A1A',
        cta:     '#C4763A',
        gold:    '#D4A843',
        cream:   '#F5EDE3',
        'warm-white': '#F8F6F3',
        border:  '#E8DDD4',
        muted:   '#9A9590',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth:   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        entrance: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        exit:     'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## Step 10 — Verify Setup

```bash
npm run dev
# Expected: Next.js running at http://localhost:3000 with no TypeScript errors
npm run build
# Expected: Build succeeds, no type errors, all pages compile
```

**Skill complete when:** `npm run build` passes with zero errors and the app router is serving all three routes: `/`, `/shop`, `/shop/[handle]`.

Next skill to run: **exotic-fragrances-design-system**
