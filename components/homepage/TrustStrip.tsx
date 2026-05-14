import { Award, Package, Layers, TrendingDown } from 'lucide-react';

const ITEMS = [
  { icon: Award, label: 'Grade A Quality Guaranteed' },
  { icon: Layers, label: '1,000+ Fragrance Oils' },
  { icon: TrendingDown, label: 'Below Wholesale Prices' },
  { icon: Package, label: 'Dispatched in 24 Hours' },
];

export default function TrustStrip() {
  return (
    <div className="bg-cream border-y border-border w-full max-w-full overflow-hidden">
      <div className="group relative py-5 md:py-6 overflow-hidden">
        {/* Inner track — two identical sequences side-by-side translate -50% for seamless infinite loop */}
        <div className="trust-marquee-track flex w-max will-change-transform [backface-visibility:hidden]">
          {/* Sequence A */}
          <ul className="flex flex-shrink-0">
            {ITEMS.map(({ icon: Icon, label }) => (
              <li
                key={`a-${label}`}
                className="flex items-center gap-3 px-6 md:px-10 flex-shrink-0"
              >
                <Icon
                  size={18}
                  className="text-gold flex-shrink-0 md:w-5 md:h-5"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] md:text-[12px] tracking-[0.15em] md:tracking-[0.18em] uppercase text-brand font-medium whitespace-nowrap">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          {/* Sequence B — identical clone, marked aria-hidden so screen readers don't double-read */}
          <ul className="flex flex-shrink-0" aria-hidden="true">
            {ITEMS.map(({ icon: Icon, label }) => (
              <li
                key={`b-${label}`}
                className="flex items-center gap-3 px-6 md:px-10 flex-shrink-0"
              >
                <Icon
                  size={18}
                  className="text-gold flex-shrink-0 md:w-5 md:h-5"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] md:text-[12px] tracking-[0.15em] md:tracking-[0.18em] uppercase text-brand font-medium whitespace-nowrap">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-cream to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-cream to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
