'use client';
import { useState } from 'react';
import { Info, Droplets, Clock, Wind } from 'lucide-react';
import type { Product } from '@/types';

const SIZE_GUIDE = [
  { size: '0.5oz Sample', sprays: '50–60', use: 'Try before you commit' },
  { size: '1oz', sprays: '100–120', use: 'Daily wear · 1–2 months' },
  { size: '2oz', sprays: '220–260', use: 'Everyday signature · 3–4 months' },
  { size: '4oz', sprays: '450–520', use: 'Long-term staple · 6–8 months' },
  { size: '8oz', sprays: '900+', use: 'Wholesale / refill · 12+ months' },
];

export default function ScentIntelligence({ product }: { product: Product }) {
  const [tab, setTab] = useState<'notes' | 'profile' | 'sizes'>('notes');

  const longevity = product.longevity ?? 3;
  const sillage = product.sillage ?? 3;

  return (
    <section className="bg-warm-white border-t border-border">
      <div className="container-page py-12 sm:py-16">
        {/* Tab nav */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
          {(
            [
              { id: 'notes' as const, label: 'Scent Profile' },
              { id: 'profile' as const, label: 'Performance' },
              { id: 'sizes' as const, label: 'Size Guide' },
            ]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 sm:px-5 py-3 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase font-medium transition-colors -mb-px border-b-2 ${
                tab === t.id
                  ? 'text-brand border-cta'
                  : 'text-muted border-transparent hover:text-brand'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notes pyramid */}
        {tab === 'notes' && product.notes && (
          <div className="grid md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto">
            {[
              { label: 'Top Notes', sub: 'First 15 minutes', notes: product.notes.top, icon: Wind },
              { label: 'Heart Notes', sub: '15 min – 2 hours', notes: product.notes.heart, icon: Droplets },
              { label: 'Base Notes', sub: '2 hours onward', notes: product.notes.base, icon: Clock },
            ].map(({ label, sub, notes, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-sm p-6 sm:p-7 border border-border/60"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className="text-gold" strokeWidth={1.5} />
                  <p className="text-[11px] tracking-[0.2em] uppercase text-cta font-semibold">
                    {label}
                  </p>
                </div>
                <p className="text-[11px] text-muted mb-4 tracking-[0.04em]">{sub}</p>
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li key={n} className="text-[14px] text-brand/80 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Performance bars */}
        {tab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-7">
            <PerfBar label="Longevity" value={longevity} legend={['Light', 'Soft', 'Moderate', 'Long', 'All Day']} />
            <PerfBar label="Sillage" value={sillage} legend={['Intimate', 'Close', 'Moderate', 'Strong', 'Heavy']} />
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Stat label="Concentration" value="Grade A · Pure Oil" />
              <Stat label="Season" value={seasonFor(longevity, sillage)} />
              <Stat label="Wear Occasion" value={occasionFor(product.scentFamily)} />
              <Stat label="Skin Safety" value="Dilute 20–30% in carrier oil" />
            </div>
          </div>
        )}

        {/* Size guide */}
        {tab === 'sizes' && (
          <div className="max-w-3xl mx-auto">
            <p className="text-[13px] sm:text-[14px] text-brand/65 leading-relaxed mb-6 max-w-2xl">
              Not sure which size to start with? Here&apos;s a rough guide to how each bottle wears
              over time. Roller-ball application varies — these counts assume light atomiser sprays.
            </p>
            <div className="bg-white rounded-sm border border-border/60 overflow-hidden">
              <table className="w-full text-[13px] sm:text-[14px]">
                <thead className="bg-cream">
                  <tr className="text-left">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-brand">
                      Size
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-brand">
                      Approx. Sprays
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-brand">
                      Use Case
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.size} className="border-t border-border/60">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-brand">{row.size}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-brand/70">{row.sprays}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-brand/70">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="flex items-start gap-2 text-[12px] text-muted mt-5">
              <Info size={14} className="text-gold flex-shrink-0 mt-0.5" />
              First-time? We recommend the 0.5oz Sample so you can test on skin before
              committing to a larger size.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function PerfBar({ label, value, legend }: { label: string; value: number; legend: string[] }) {
  const pct = (value / 5) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] tracking-[0.2em] uppercase text-cta font-semibold">{label}</p>
        <p className="text-[12px] text-brand font-medium">{legend[value - 1]}</p>
      </div>
      <div className="relative h-1.5 bg-cream rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-cta rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-muted">
        {legend.map((l, i) => (
          <span key={i} className={i + 1 === value ? 'text-brand font-medium' : ''}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/60 pb-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-muted font-medium mb-1">{label}</p>
      <p className="text-[13px] text-brand">{value}</p>
    </div>
  );
}

function seasonFor(longevity: number, sillage: number) {
  if (longevity >= 4 && sillage >= 4) return 'Autumn · Winter · Evening';
  if (longevity <= 3 && sillage <= 3) return 'Spring · Summer · Daytime';
  return 'All seasons · Versatile wear';
}

function occasionFor(family: string | undefined) {
  switch (family) {
    case 'Oud':
    case 'Oriental':
      return 'Date night · Dinner · Special occasions';
    case 'Woody':
      return 'Office · Smart casual · Year-round';
    case 'Floral':
      return 'Daytime · Romantic · Spring & Summer';
    case 'Citrus':
    case 'Fresh':
    case 'Aquatic':
      return 'Morning · Workout · Warm weather';
    case 'Gourmand':
      return 'Cosy evenings · Cool months';
    default:
      return 'Versatile · Any time of day';
  }
}
