'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toast';
import { formatPrice } from '@/lib/utils';
import { themeFor } from '@/lib/scent-family';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const defaultVariant =
    product.variants.find((v) => !/sample/i.test(v.title)) ?? product.variants[0];
  const [selected, setSelected] = useState(defaultVariant);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { show } = useToast();
  const theme = themeFor(product.scentFamily);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleAddToCart = () => {
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
    onClose();
    openCart();
    show(`${product.title} added to cart`, 'success');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[280]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={`Quick view: ${product.title}`}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[290] bg-white rounded-md shadow-2xl w-auto sm:w-[min(880px,calc(100vw-48px))] max-h-[min(720px,calc(100vh-48px))] overflow-hidden flex flex-col sm:flex-row"
            initial={{ opacity: 0, y: '-45%', scale: 0.96 }}
            animate={{ opacity: 1, y: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: '-45%', scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto bg-cream flex-shrink-0">
              <Image
                src={product.images[0]?.url ?? ''}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 440px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto min-w-0">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-cream transition-colors"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>

              {product.scentFamily && (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase font-semibold mb-3 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: theme.tint, color: theme.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                  {product.scentFamily}
                </span>
              )}

              <h2 className="font-display font-normal text-[24px] sm:text-[28px] text-brand leading-tight tracking-[0.01em] mb-2">
                {product.title}
              </h2>

              {product.inspiredBy && (
                <p className="text-[13px] text-muted italic mb-3 font-light">
                  Inspired by {product.inspiredBy}
                </p>
              )}

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < Math.round(product.rating!) ? 'fill-gold text-gold' : 'text-border'
                        }
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-muted">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              <p className="font-display font-medium text-[22px] text-brand mb-5">
                {formatPrice(selected?.price ?? product.price)}
              </p>

              <p className="text-[13px] sm:text-[14px] text-brand/65 leading-relaxed mb-6 font-light line-clamp-3">
                {product.description}
              </p>

              {/* Notes pyramid — compact */}
              {product.notes && (
                <div className="mb-6 text-[12px] leading-relaxed">
                  <NoteRow label="Top" notes={product.notes.top} />
                  <NoteRow label="Heart" notes={product.notes.heart} />
                  <NoteRow label="Base" notes={product.notes.base} />
                </div>
              )}

              {/* Volume selector */}
              {product.variants.length > 1 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-2 font-medium">
                    Volume
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelected(v)}
                        disabled={!v.availableForSale}
                        className={`px-3 py-1.5 text-[11px] uppercase font-medium rounded-sm border transition-all
                          ${
                            !v.availableForSale
                              ? 'border-border text-border line-through cursor-not-allowed'
                              : selected?.id === v.id
                              ? 'bg-brand text-white border-brand'
                              : 'border-border text-brand hover:border-cta hover:text-cta'
                          }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!selected?.availableForSale}
                  className="btn-primary w-full disabled:opacity-50 gap-2"
                >
                  <ShoppingBag size={15} />
                  {selected?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                  href={`/shop/${product.handle}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-brand hover:text-cta transition-colors py-2"
                >
                  View Full Details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="flex gap-3 py-1 border-b border-border/40 last:border-0">
      <span className="text-muted uppercase tracking-[0.12em] text-[10px] font-medium w-12 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-brand/80 text-[12px]">{notes.join(' · ')}</span>
    </div>
  );
}
