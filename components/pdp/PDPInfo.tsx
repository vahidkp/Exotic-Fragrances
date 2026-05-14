'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import Accordion from '@/components/shared/Accordion';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useToast } from '@/components/shared/Toast';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

/** Truncate at the last word/sentence boundary before maxLen, never mid-word */
function smartTruncate(text: string, maxLen = 200) {
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  // Prefer the last sentence end, otherwise the last space
  const lastSentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('— '));
  const cut = lastSentence > maxLen * 0.5 ? lastSentence + 1 : slice.lastIndexOf(' ');
  return slice.slice(0, cut).trim() + '…';
}

export default function PDPInfo({ product }: { product: Product }) {
  const defaultVariant =
    product.variants.find((v) => !/sample/i.test(v.title)) ?? product.variants[0];
  const [selected, setSelected] = useState(defaultVariant);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { show } = useToast();
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWish = useWishlistStore((s) => s.handles.includes(product.handle));

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
    openCart();
    show(`${product.title} — ${selected.title} added to cart`, 'success');
  };

  const accordionItems = [
    {
      title: 'Characteristics',
      content: (
        <dl className="space-y-3 text-body-md">
          <Row k="Brand" v="Exotic Fragrances" />
          {product.scentFamily && <Row k="Scent Family" v={product.scentFamily} />}
          {product.inspiredBy && <Row k="Inspired By" v={product.inspiredBy} />}
          <Row k="Type" v="Pure Grade A Fragrance Oil" />
          <Row k="Item No." v={product.id.toUpperCase()} />
        </dl>
      ),
    },
    {
      title: 'Description',
      content: (
        <div className="space-y-4 text-body-md text-brand/70 leading-relaxed">
          <p>{product.description}</p>
          <p className="text-sm text-muted">
            Top Notes: Bergamot, Pink Pepper, Fresh Citrus<br />
            Heart Notes: Rose, Jasmine, Ylang-Ylang<br />
            Base Notes: Sandalwood, White Musk, Amber
          </p>
        </div>
      ),
    },
    {
      title: 'Payment & Delivery',
      content: (
        <div className="space-y-2 text-body-md text-brand/70 leading-relaxed">
          <p>
            All orders processed and dispatched within 24 hours. Standard shipping
            3–7 business days, express 1–2.
          </p>
          <p>Complimentary standard shipping on US orders over $50.</p>
        </div>
      ),
    },
    {
      title: 'Returns',
      content: (
        <p className="text-body-md text-brand/70 leading-relaxed">
          Unsatisfied? Contact us within 30 days. Opened fragrance oils are
          non-returnable but we will resolve any quality issue.
        </p>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="lg:sticky lg:top-32"
    >
      <p className="text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-muted mb-3 sm:mb-4 font-medium">
        {product.scentFamily ? `${product.scentFamily} Perfume` : 'Perfume'}
      </p>

      <h1 className="font-display font-normal text-[26px] sm:text-[32px] md:text-[40px] text-brand leading-[1.1] mb-3 tracking-[0.01em]">
        {product.title}
      </h1>

      {product.inspiredBy && (
        <p className="text-[13px] sm:text-[14px] text-muted italic mb-4 sm:mb-5 font-light">
          Inspired by {product.inspiredBy}
        </p>
      )}

      {/* Rating row */}
      <div className="flex items-center gap-2 mb-5 sm:mb-6 flex-wrap">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className="fill-gold text-gold" strokeWidth={0} />
          ))}
        </div>
        <span className="text-[13px] text-muted">(128 reviews)</span>
        <a
          href="#reviews"
          className="text-[12px] text-cta border-b border-cta/60 hover:text-cta-hover hover:border-cta transition-colors"
        >
          Read all
        </a>
      </div>

      {/* Price + Below Wholesale badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-7">
        <p className="font-display font-medium text-[22px] sm:text-[26px] md:text-[28px] text-brand">
          {formatPrice(selected?.price ?? product.price)}
        </p>
        <span className="inline-flex items-center bg-success/10 text-success text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-semibold px-2.5 py-1 rounded-full">
          Below Wholesale
        </span>
      </div>

      <p className="text-[14px] sm:text-body-md text-brand/65 leading-relaxed mb-7 sm:mb-9 font-light max-w-md">
        {smartTruncate(product.description, 200)}
      </p>

      {product.variants.length > 1 && (
        <div className="mb-6 sm:mb-8">
          <p className="text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-muted mb-2 sm:mb-3 font-medium">
            Volume:
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                disabled={!v.availableForSale}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] tracking-[0.05em] uppercase font-medium rounded-sm border transition-all duration-150
                  ${
                    !v.availableForSale
                      ? 'border-border text-border line-through cursor-not-allowed'
                      : selected?.id === v.id
                      ? 'bg-brand text-white border-brand'
                      : 'border-border text-brand hover:border-brand hover:text-brand'
                  }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <p
          className={`text-xs mb-5 sm:mb-7 flex items-center gap-2 ${
            selected.availableForSale ? 'text-success' : 'text-error'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              selected.availableForSale ? 'bg-success' : 'bg-error'
            }`}
          />
          {selected.availableForSale ? 'In Stock — Ships in 24 hours' : 'Out of Stock'}
        </p>
      )}

      <div className="flex flex-col gap-3 mb-8 sm:mb-10">
        <div className="flex gap-2 sm:gap-3 w-full">
          <button
            onClick={handleAddToCart}
            disabled={!selected?.availableForSale}
            className="btn-primary flex-1 min-w-0 disabled:opacity-50 disabled:cursor-not-allowed gap-2 sm:gap-3"
          >
            <ShoppingBag size={16} />
            <span className="truncate">{selected?.availableForSale ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
          <button
            onClick={() => {
              toggleWish(product.handle);
              show(isWish ? 'Removed from wishlist' : 'Added to wishlist', 'success');
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 border border-border rounded-sm flex items-center justify-center hover:border-cta hover:text-cta transition-colors flex-shrink-0"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className={isWish ? 'fill-cta text-cta' : ''} />
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selected?.availableForSale}
          className="btn-ghost w-full disabled:opacity-50"
        >
          Buy It Now
        </button>
      </div>

      {/* Reassurance row */}
      <div className="grid grid-cols-3 gap-3 mb-8 sm:mb-10 py-5 sm:py-6 border-y border-border">
        {[
          { icon: Truck, text: 'Free US shipping over $50' },
          { icon: ShieldCheck, text: 'Grade A quality guarantee' },
          { icon: RotateCcw, text: '30-day support' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center text-center gap-2">
            <Icon size={20} className="text-gold" strokeWidth={1.4} />
            <p className="text-[10px] sm:text-[11px] text-brand/70 leading-tight tracking-[0.04em]">
              {text}
            </p>
          </div>
        ))}
      </div>

      <Accordion items={accordionItems} />
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-1.5 border-b border-border/50 last:border-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-brand text-right">{v}</dd>
    </div>
  );
}
