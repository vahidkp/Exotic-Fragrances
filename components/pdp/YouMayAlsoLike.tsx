import type { Product } from '@/types';
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';
import ProductCard from '@/components/shop/ProductCard';

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
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
