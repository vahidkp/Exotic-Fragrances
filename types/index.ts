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

export interface Category {
  name: string;
  slug: string;
  description?: string;
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
  handle?: string;
}

export interface ScentStoryData {
  name: string;
  description: string;
  ctaText?: string;
  imageUrl: string;
  reverse?: boolean;
  background?: 'dark' | 'cream' | 'white';
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-selling';

export interface FilterState {
  scentFamily: string[];
  gender: string[];
  size: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  type: string[];
}
