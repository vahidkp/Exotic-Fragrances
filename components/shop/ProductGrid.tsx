'use client';
import ProductCard from './ProductCard';
import type { Product } from '@/types';
import { StaggerGroup, StaggerItem } from '@/components/shared/Animated';

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <p className="font-display text-display-md text-border">∅</p>
        <h3 className="text-heading-xl font-display text-brand">No fragrances found</h3>
        <p className="text-body-md text-muted">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }
  return (
    <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-10 mt-6">
      {products.map((p) => (
        <StaggerItem key={p.id}>
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
