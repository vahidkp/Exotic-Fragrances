'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

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

  const setSort = (sort: string) => {
    const p = new URLSearchParams(params.toString());
    p.set('sort', sort);
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-5 border-b border-border mb-6">
      <span className="text-[10px] sm:text-label text-muted">{total} Products</span>
      <div className="flex items-center gap-2 sm:gap-4">
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
  );
}
