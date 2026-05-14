'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR = ['Oud Velvet', 'Vanilla Ember', 'Citrus Lane', 'Amber Dusk', 'Jasmine Noir'];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    else setQuery('');
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.scentFamily?.toLowerCase().includes(q) ||
        p.inspiredBy?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 right-0 z-[300] bg-white shadow-2xl"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="container-page py-8">
              <div className="flex items-center gap-4 border-b-2 border-brand pb-4">
                <Search size={22} className="text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 1,000+ fragrance oils…"
                  className="flex-1 text-body-xl text-brand bg-transparent outline-none placeholder:text-border"
                  onKeyDown={(e) => e.key === 'Escape' && onClose()}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-muted hover:text-brand"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-muted hover:text-brand ml-4"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {!query && (
                  <div>
                    <p className="text-label text-xs text-muted mb-4">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-4 py-2 text-sm border border-border rounded-full text-brand hover:border-cta hover:text-cta transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query && results.length > 0 && (
                  <div>
                    <p className="text-label text-xs text-muted mb-4">
                      {results.length} results for &ldquo;{query}&rdquo;
                    </p>
                    <div className="space-y-2">
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          href={`/shop/${p.handle}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-md hover:bg-warm-white transition-colors group"
                        >
                          <div className="relative w-16 h-16 bg-cream rounded flex-shrink-0 overflow-hidden">
                            <Image
                              src={p.images[0].url}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans-body font-medium text-sm text-brand truncate group-hover:text-cta transition-colors">
                              {p.title}
                            </p>
                            <p className="text-xs text-muted mt-1">
                              {p.scentFamily} · {formatPrice(p.price)}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-border group-hover:text-cta transition-colors flex-shrink-0"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-body-lg text-muted">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-body-md text-muted/60 mt-2">
                      Try a different scent name or family.
                    </p>
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="btn-primary btn-sm mt-6 inline-flex"
                    >
                      Browse All Fragrances
                    </Link>
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
