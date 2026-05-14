/**
 * Shopify Storefront API client.
 * Falls back to mock data when env vars are unset or the request fails,
 * so the site is fully functional out-of-the-box without Shopify credentials.
 */
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SCENT_STORIES } from './mock-data';
import type { Product, Category, ScentStoryData } from '@/types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const HAS_SHOPIFY = !!domain && !!token && !domain.startsWith('your-');

const API_URL = HAS_SHOPIFY
  ? `https://${domain}/api/2024-01/graphql.json`
  : '';

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!HAS_SHOPIFY) throw new Error('Shopify not configured');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data as T;
}

/* ── Public API — Returns mock when Shopify isn't configured ───────────── */

export async function getProducts(first = 24): Promise<{ products: Product[] }> {
  if (!HAS_SHOPIFY) {
    return { products: MOCK_PRODUCTS.slice(0, first) };
  }
  try {
    const data = await shopifyFetch<{ products: { nodes: any[] } }>({
      query: `query Products($first: Int!) {
        products(first: $first) {
          nodes {
            id handle title description
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { url altText width height }
            images(first: 8) { nodes { url altText width height } }
            variants(first: 20) {
              nodes { id title price { amount currencyCode } availableForSale selectedOptions { name value } }
            }
            tags
          }
        }
      }`,
      variables: { first },
    });
    const products = (data.products?.nodes ?? []).map(mapShopifyProduct);
    return { products };
  } catch {
    return { products: MOCK_PRODUCTS.slice(0, first) };
  }
}

export async function getProduct(handle: string): Promise<{ product: Product | null }> {
  if (!HAS_SHOPIFY) {
    const product = MOCK_PRODUCTS.find(p => p.handle === handle) ?? null;
    return { product };
  }
  try {
    const data = await shopifyFetch<{ product: any }>({
      query: `query Product($handle: String!) {
        product(handle: $handle) {
          id handle title description
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 8) { nodes { url altText width height } }
          variants(first: 20) {
            nodes { id title price { amount currencyCode } availableForSale selectedOptions { name value } }
          }
          tags
        }
      }`,
      variables: { handle },
    });
    return { product: data.product ? mapShopifyProduct(data.product) : null };
  } catch {
    return { product: MOCK_PRODUCTS.find(p => p.handle === handle) ?? null };
  }
}

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}

export async function getScentStories(): Promise<ScentStoryData[]> {
  return MOCK_SCENT_STORIES;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function mapShopifyProduct(node: any): Product {
  const variants = (node.variants?.nodes ?? []).map((v: any) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price?.amount ?? '0'),
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions ?? [],
  }));
  const images = (node.images?.nodes ?? []).map((img: any) => ({
    url: img.url,
    altText: img.altText ?? node.title,
    width: img.width ?? 1200,
    height: img.height ?? 1500,
  }));
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? '',
    price: parseFloat(node.priceRange?.minVariantPrice?.amount ?? '0'),
    currencyCode: node.priceRange?.minVariantPrice?.currencyCode ?? 'USD',
    images,
    variants,
    tags: node.tags ?? [],
  };
}
