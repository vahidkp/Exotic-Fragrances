'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const KEY_LABELS: Record<string, string> = {
  scent: 'Scent',
  gender: 'Gender',
  size: 'Size',
  price: 'Price',
  type: 'Type',
  category: 'Category',
};

const PRICE_LABELS: Record<string, string> = {
  '0-20': 'Under $20',
  '20-40': '$20–$40',
  '40-60': '$40–$60',
  '60-999': '$60+',
};

function prettify(key: string, value: string) {
  if (key === 'price') return PRICE_LABELS[value] ?? value;
  return value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Build list of [key, value] chips, ignoring sort/page
  const chips: Array<{ key: string; value: string; label: string }> = [];
  for (const [key, value] of Array.from(params.entries())) {
    if (key === 'sort' || key === 'page') continue;
    chips.push({
      key,
      value,
      label: `${KEY_LABELS[key] ?? key}: ${prettify(key, value)}`,
    });
  }

  if (chips.length === 0) return null;

  const remove = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    const remaining = p.getAll(key).filter((v) => v !== value);
    p.delete(key);
    remaining.forEach((v) => p.append(key, v));
    p.delete('page');
    router.push(`${pathname}?${p.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b border-border">
      <span className="text-[10px] tracking-[0.18em] uppercase text-muted font-medium mr-1">
        Active:
      </span>
      {chips.map(({ key, value, label }) => (
        <button
          key={`${key}-${value}`}
          onClick={() => remove(key, value)}
          className="inline-flex items-center gap-1.5 bg-cream text-brand text-[11px] tracking-[0.04em] px-3 py-1.5 rounded-full hover:bg-cta hover:text-white transition-colors"
        >
          <span>{label}</span>
          <X size={11} />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-[11px] tracking-[0.14em] uppercase text-cta hover:text-cta-hover transition-colors ml-1 border-b border-cta/40 hover:border-cta-hover"
      >
        Clear All
      </button>
    </div>
  );
}
