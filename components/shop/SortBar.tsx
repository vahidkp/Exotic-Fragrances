'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from './FilterSidebar';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'best-selling', label: 'Best Selling' },
];

export default function SortBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setSort = (sort: string) => {
    const p = new URLSearchParams(params.toString());
    p.set('sort', sort);
    router.push(`${pathname}?${p.toString()}`);
  };

  const activeFilterCount = Array.from(params.entries()).filter(
    ([k]) => !['sort', 'page'].includes(k)
  ).length;

  useEffect(() => {
    if (drawerOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-5 border-b border-border mb-6">
        <span className="text-[10px] sm:text-label text-muted">{total} Products</span>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden relative inline-flex items-center gap-2 text-[13px] text-brand bg-transparent border border-border rounded px-3 py-1.5 sm:py-2 hover:border-cta hover:text-cta transition-colors"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-cta text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={params.get('sort') ?? 'featured'}
            onChange={(e) => setSort(e.target.value)}
            className="text-[13px] sm:text-body-md text-brand bg-transparent border border-border rounded px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer focus:outline-none focus:border-cta transition-colors max-w-[180px] sm:max-w-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="hidden md:flex gap-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'text-cta' : 'text-muted hover:text-brand'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'text-cta' : 'text-muted hover:text-brand'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[88vw] max-w-[380px] bg-white z-50 flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="sticky top-0 bg-white border-b border-border px-5 py-3 flex items-center justify-end z-10">
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="p-2 -m-2 text-brand hover:text-cta transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-6">
                <FilterSidebar />
              </div>
              <div className="border-t border-border bg-white px-5 py-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full h-12 bg-cta text-white text-[12px] tracking-[0.16em] uppercase font-semibold rounded-sm hover:bg-cta-hover transition-colors"
                >
                  Show {total} Product{total === 1 ? '' : 's'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
