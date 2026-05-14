import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';

export default function BestsellerCarousel({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);

  return (
    <section className="section-pad bg-warm-white">
      <div className="container-page">
        <FadeUp className="text-center mb-8 md:mb-12">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-cta font-medium mb-2 sm:mb-3">
            Bestsellers
          </p>
          <h2 className="font-display font-normal text-[26px] sm:text-[32px] md:text-[40px] text-brand tracking-[0.03em] uppercase leading-tight">
            Best Collections
          </h2>
        </FadeUp>

        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {featured.map((p) => (
            <StaggerItem key={p.id}>
              <Link href={`/shop/${p.handle}`} className="group block">
                <div className="relative aspect-[4/5] bg-cream overflow-hidden rounded-sm">
                  <Image
                    src={p.images[0]?.url ?? ''}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="pt-4 sm:pt-5 md:pt-6 text-center px-1">
                  <h3 className="font-display text-[14px] sm:text-[16px] md:text-[20px] tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.2em] uppercase text-brand mb-1.5 md:mb-2 group-hover:text-cta transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] md:text-[14px] text-muted">{formatPrice(p.price)}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
