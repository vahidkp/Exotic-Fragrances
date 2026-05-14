import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';
import { formatPrice } from '@/lib/utils';

export default function YouMayAlsoLike({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="section-pad bg-warm-white w-full max-w-full overflow-hidden">
      <div className="container-page">
        <FadeUp className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-display font-normal text-[24px] sm:text-[28px] md:text-[34px] text-brand tracking-[0.01em]">
            You may also like
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {products.map((p) => {
            // Skip sample variants when picking the displayed price
            const variant =
              p.variants.find((v) => !/sample/i.test(v.title)) ?? p.variants[0];
            const price = variant?.price ?? p.price;
            return (
              <StaggerItem key={p.id}>
                <Link href={`/shop/${p.handle}`} className="group block">
                  <div className="relative aspect-[4/5] bg-cream overflow-hidden rounded-sm">
                    <Image
                      src={p.images[0]?.url ?? ''}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="pt-4 sm:pt-5 text-center px-1">
                    <h3 className="font-display text-[15px] sm:text-[18px] md:text-[20px] text-brand mb-1.5 group-hover:text-cta transition-colors tracking-[0.01em] line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-muted">{formatPrice(price)}</p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
