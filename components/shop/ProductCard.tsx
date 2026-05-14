'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useToast } from '@/components/shared/Toast';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  // Default to the first non-sample variant so the headline price reflects the
  // standard size, not the $11 sample bottle.
  const defaultVariant =
    product.variants.find((v) => !/sample/i.test(v.title)) ?? product.variants[0];
  const [selectedSizeId, setSelectedSizeId] = useState(defaultVariant?.id);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { show } = useToast();
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWish = useWishlistStore((s) => s.handles.includes(product.handle));

  const selected =
    product.variants.find((v) => v.id === selectedSizeId) ?? defaultVariant;
  const displayPrice = selected?.price ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected) return;
    addItem({
      id: selected.id,
      variantId: selected.id,
      title: product.title,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      imageUrl: product.images[0]?.url ?? '',
    });
    openCart();
    show(`${product.title} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWish(product.handle);
    show(isWish ? 'Removed from wishlist' : 'Added to wishlist', 'success');
  };

  return (
    <Link href={`/shop/${product.handle}`} className="product-card block group">
      <div className="relative overflow-hidden bg-cream aspect-[4/5]">
        <Image
          src={product.images[0]?.url ?? ''}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <span className="tag text-[9px]">New</span>}
          {product.tags.includes('best-seller') && (
            <span className="tag text-[9px] bg-brand text-white">Best Seller</span>
          )}
        </div>
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={14}
            className={isWish ? 'fill-cta text-cta' : 'text-brand'}
          />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 h-11 bg-cta text-white text-xs tracking-[0.18em] uppercase font-semibold rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-cta-hover"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>

      <div className="pt-4 sm:pt-5 px-3 sm:px-5 pb-4 sm:pb-5 bg-white">
        {product.scentFamily && (
          <span className="text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-cta font-medium mb-1.5 sm:mb-2 block">
            {product.scentFamily}
          </span>
        )}
        <h3 className="font-display text-[15px] sm:text-heading-lg text-brand mb-2 line-clamp-1 group-hover:text-cta transition-colors">
          {product.title}
        </h3>

        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
            {product.variants.slice(0, 4).map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSizeId(v.id);
                }}
                disabled={!v.availableForSale}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] rounded-full border transition-all duration-150
                  ${
                    !v.availableForSale
                      ? 'border-border text-border line-through cursor-not-allowed'
                      : selectedSizeId === v.id
                      ? 'bg-brand text-white border-brand'
                      : 'border-border text-muted hover:border-cta hover:text-cta'
                  }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-sans-body font-semibold text-[15px] sm:text-price-sm text-brand">
            {formatPrice(displayPrice)}
          </span>
          {product.inspiredBy && (
            <span className="hidden sm:inline text-[10px] text-muted italic truncate">
              {product.inspiredBy.length > 18
                ? product.inspiredBy.slice(0, 18) + '…'
                : product.inspiredBy}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
