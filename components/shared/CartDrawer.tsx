'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCartStore, useCartTotal } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem } = useCartStore();
  const total = useCartTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[300] flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-heading-lg text-brand">
                Your Cart{' '}
                {items.length > 0 && (
                  <span className="text-muted font-normal text-body-md">({items.length})</span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:text-cta transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                  <ShoppingBag size={48} className="text-border" />
                  <p className="text-body-lg text-muted">Your cart is empty</p>
                  <button onClick={closeCart} className="btn-primary btn-sm">
                    Explore Fragrances
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="relative w-20 h-24 rounded-sm overflow-hidden flex-shrink-0 bg-warm-white">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans-body font-medium text-sm text-brand truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{item.variantTitle}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 hover:bg-warm-white transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 hover:bg-warm-white transition-colors"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-brand">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted hover:text-error transition-colors"
                            aria-label="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4 bg-warm-white">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-muted">Subtotal</span>
                  <span className="text-heading-lg font-display font-bold text-brand">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-muted">Shipping calculated at checkout.</p>
                <button className="btn-primary w-full">Proceed to Checkout</button>
                <button onClick={closeCart} className="btn-ghost w-full">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
