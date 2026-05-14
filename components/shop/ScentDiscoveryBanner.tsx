import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function ScentDiscoveryBanner() {
  return (
    <div className="bg-cream rounded-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Sparkles size={20} className="text-gold flex-shrink-0" strokeWidth={1.5} />
        <p className="text-body-md text-brand font-medium">
          Not sure where to start? Let us help you find your signature scent.
        </p>
      </div>
      <Link
        href="/scent-finder"
        className="text-[11px] tracking-[0.2em] uppercase text-cta border-b border-cta pb-1 hover:text-cta-hover transition-colors whitespace-nowrap font-medium"
      >
        Try Scent Finder →
      </Link>
    </div>
  );
}
