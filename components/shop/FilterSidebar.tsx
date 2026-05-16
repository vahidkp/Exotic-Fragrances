'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCENT_FAMILIES = [
  { label: 'Floral', colour: '#E8A5B4' },
  { label: 'Woody', colour: '#A0785A' },
  { label: 'Oriental', colour: '#C4763A' },
  { label: 'Fresh', colour: '#7AC5CD' },
  { label: 'Gourmand', colour: '#D4A843' },
  { label: 'Oud', colour: '#5C3317' },
  { label: 'Citrus', colour: '#F4C842' },
  { label: 'Aquatic', colour: '#4A9ECC' },
];
const GENDERS = ["Women's", "Men's", 'Unisex'];
const SIZES = ['Sample 0.5oz', '1oz', '2oz', '4oz', '8oz', '16oz'];
const PRICES: Array<[string, string]> = [
  ['Under $20', '0-20'],
  ['$20–$40', '20-40'],
  ['$40–$60', '40-60'],
  ['$60+', '60-999'],
];
const TYPES = ['Fragrance Oil', 'Essential Oil', 'Carrier Oil', 'Body Butter', 'Diffuser Blend'];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      const existing = p.getAll(key);
      p.delete(key);
      if (existing.includes(value)) {
        existing.filter((v) => v !== value).forEach((v) => p.append(key, v));
      } else {
        [...existing, value].forEach((v) => p.append(key, v));
      }
      p.delete('page');
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router]
  );

  const setSingle = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (p.get(key) === value) p.delete(key);
      else p.set(key, value);
      p.delete('page');
      router.push(`${pathname}?${p.toString()}`);
    },
    [params, pathname, router]
  );

  const clearAll = () => router.push(pathname);
  const hasFilters = Array.from(params.entries()).some(
    ([k]) => !['sort', 'page'].includes(k)
  );

  return (
    <div className="font-sans-body">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-label text-brand">Filter</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] tracking-[0.14em] uppercase text-cta hover:text-cta-hover transition-colors font-semibold border-b border-cta/40 hover:border-cta-hover pb-0.5"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <FilterGroup title="Scent Family">
        <div className="space-y-1">
          {SCENT_FAMILIES.map(({ label, colour }) => {
            const v = label.toLowerCase();
            const active = params.getAll('scent').includes(v);
            return (
              <button
                key={label}
                onClick={() => toggleMulti('scent', v)}
                className={cn(
                  'flex items-center gap-3 w-full text-left py-1.5 text-body-md transition-colors',
                  active ? 'text-cta font-medium' : 'text-brand/70 hover:text-brand'
                )}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 border border-border"
                  style={{ backgroundColor: colour }}
                />
                {label}
                {active && (
                  <span className="ml-auto text-cta">
                    <X size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => {
            const v = g.toLowerCase().replace("'s", '');
            const active = params.getAll('gender').includes(v);
            return (
              <button
                key={g}
                onClick={() => toggleMulti('gender', v)}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-full border transition-all duration-150',
                  active
                    ? 'bg-cta text-white border-cta'
                    : 'border-border text-brand hover:border-cta hover:text-cta'
                )}
              >
                {g}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Bottle Size">
        {SIZES.map((s) => {
          const v = s.toLowerCase().replace(/\s/g, '-');
          const active = params.getAll('size').includes(v);
          return (
            <label
              key={s}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleMulti('size', v)}
                className="w-4 h-4 rounded border-border accent-cta cursor-pointer"
              />
              <span
                className={cn(
                  'text-body-md transition-colors',
                  active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand'
                )}
              >
                {s}
              </span>
            </label>
          );
        })}
      </FilterGroup>

      <FilterGroup title="Price Range">
        {PRICES.map(([label, value]) => {
          const active = params.get('price') === value;
          return (
            <label
              key={value}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <input
                type="radio"
                name="price"
                checked={active}
                onChange={() => setSingle('price', value)}
                className="w-4 h-4 border-border accent-cta cursor-pointer"
              />
              <span
                className={cn(
                  'text-body-md transition-colors',
                  active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand'
                )}
              >
                {label}
              </span>
            </label>
          );
        })}
      </FilterGroup>

      <FilterGroup title="Product Type">
        {TYPES.map((t) => {
          const v = t.toLowerCase().replace(/\s/g, '-');
          const active = params.getAll('type').includes(v);
          return (
            <label
              key={t}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleMulti('type', v)}
                className="w-4 h-4 rounded border-border accent-cta cursor-pointer"
              />
              <span
                className={cn(
                  'text-body-md transition-colors',
                  active ? 'text-cta font-medium' : 'text-brand/70 group-hover:text-brand'
                )}
              >
                {t}
              </span>
            </label>
          );
        })}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-5">
      <h3 className="text-label text-muted mb-4">{title}</h3>
      {children}
    </div>
  );
}
