import type { Product } from '@/types';
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';
import ProductCard from '@/components/shop/ProductCard';

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
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
