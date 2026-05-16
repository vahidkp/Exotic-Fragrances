'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useToast } from '@/components/shared/Toast';
import { formatPrice } from '@/lib/utils';
import { themeFor } from '@/lib/scent-family';
import type { Product } from '@/types';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }: { product: Product }) {
  // Default to the first non-sample variant
  const defaultVariant =
    product.variants.find((v) => !/sample/i.test(v.title)) ?? product.variants[0];
  const [selectedSizeId, setSelectedSizeId] = useState(defaultVariant?.id);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { show } = useToast();
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWish = useWishlistStore((s) => s.handles.includes(product.handle));

  const selected =
    product.variants.find((v) => v.id === selectedSizeId) ?? defaultVariant;
  const displayPrice = selected?.price ?? product.price;
  const theme = themeFor(product.scentFamily);
  const isLowStock =
    typeof product.inventory === 'number' && product.inventory > 0 && product.inventory <= 8;
  const isBestSeller = product.tags.includes('best-seller');

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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  return (
    <>
      <Link href={`/shop/${product.handle}`} className="product-card block group">
        <div className="relative overflow-hidden bg-cream aspect-[4/5]">
          <Image
            src={product.images[0]?.url ?? ''}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.isNew && (
              <span className="bg-gold text-brand text-[9px] tracking-[0.16em] uppercase font-bold px-2.5 py-1 rounded-full">
                New
              </span>
            )}
            {isBestSeller && (
              <span className="bg-brand text-white text-[9px] tracking-[0.16em] uppercase font-bold px-2.5 py-1 rounded-full">
                Best Seller
              </span>
            )}
            {isLowStock && (
              <span className="bg-error text-white text-[9px] tracking-[0.16em] uppercase font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Only {product.inventory} Left
              </span>
            )}
          </div>

          {/* Top-right wishlist */}
          <button
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
          >
            <Heart
              size={14}
              className={isWish ? 'fill-cta text-cta' : 'text-brand'}
            />
          </button>

          {/* Quick View button (bottom-right) — appears on hover desktop, always visible on mobile */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-brand md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-sm hover:bg-cta hover:text-white"
            aria-label="Quick view"
          >
            <Eye size={15} />
          </button>

          {/* Add to Cart — full-width bottom strip, hover only on desktop */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-14 sm:right-16 h-10 sm:h-11 bg-cta text-white text-[10px] sm:text-xs tracking-[0.18em] uppercase font-semibold rounded-sm md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-cta-hover"
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>

        <div className="pt-4 sm:pt-5 px-3 sm:px-4 pb-4 sm:pb-5 bg-white">
          {/* Coloured scent family tag */}
          {product.scentFamily && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase font-semibold mb-2 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: theme.tint, color: theme.text }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {product.scentFamily}
            </span>
          )}

          <h3 className="font-display text-[15px] sm:text-heading-lg text-brand mb-1.5 line-clamp-1 group-hover:text-cta transition-colors">
            {product.title}
          </h3>

          {/* Star rating row */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < Math.round(product.rating!)
                        ? 'fill-gold text-gold'
                        : 'text-border'
                    }
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted">
                {product.rating.toFixed(1)}
                <span className="hidden sm:inline"> ({product.reviewCount})</span>
              </span>
            </div>
          )}

          {/* Size pills */}
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

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
