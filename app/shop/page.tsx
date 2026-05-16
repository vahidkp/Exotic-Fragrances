import { Suspense } from 'react';
import ShopHeader from '@/components/shop/ShopHeader';
import FilterSidebar from '@/components/shop/FilterSidebar';
import SortBar from '@/components/shop/SortBar';
import ProductGrid from '@/components/shop/ProductGrid';
import ScentDiscoveryBanner from '@/components/shop/ScentDiscoveryBanner';
import ActiveFilters from '@/components/shop/ActiveFilters';
import { getProducts } from '@/lib/shopify';
import type { Metadata } from 'next';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Shop All Fragrance Oils',
  description:
    'Browse 1,000+ Grade A fragrance oils, essential oils, body butters and more. Filter by scent family, gender, size, and price.',
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    scent?: string | string[];
    gender?: string | string[];
    size?: string | string[];
    price?: string;
    sort?: string;
    page?: string;
  };
}

function applyFilters(products: Product[], sp: ShopPageProps['searchParams']) {
  const asArr = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);
  const scents = asArr(sp.scent).map((s) => s.toLowerCase());
  const genders = asArr(sp.gender).map((s) => s.toLowerCase());
  const sizes = asArr(sp.size).map((s) => s.toLowerCase());

  let out = products;

  if (sp.category) {
    out = out.filter((p) => p.tags.includes(sp.category!.toLowerCase()));
  }
  if (scents.length) {
    out = out.filter(
      (p) => p.scentFamily && scents.includes(p.scentFamily.toLowerCase())
    );
  }
  if (genders.length) {
    out = out.filter((p) => p.tags.some((t) => genders.includes(t.toLowerCase())));
  }
  if (sizes.length) {
    out = out.filter((p) =>
      p.variants.some((v) =>
        sizes.includes(v.title.toLowerCase().replace(/\s/g, '-'))
      )
    );
  }
  if (sp.price) {
    const [min, max] = sp.price.split('-').map(Number);
    out = out.filter((p) => p.price >= min && p.price <= max);
  }

  switch (sp.sort) {
    case 'price-asc':
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      out = [...out].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
      break;
    case 'best-selling':
      out = [...out].sort(
        (a, b) =>
          Number(b.tags.includes('best-seller')) -
          Number(a.tags.includes('best-seller'))
      );
      break;
  }
  return out;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { products } = await getProducts(48);
  const filtered = applyFilters(products, searchParams);

  return (
    <>
      <ShopHeader category={searchParams.category} />
      <nav className="container-page py-4 sm:py-5 text-label text-muted overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px]">
          <span>Home</span>
          <span>/</span>
          <span>Shop</span>
          {searchParams.category && (
            <>
              <span>/</span>
              <span className="text-brand capitalize">{searchParams.category}</span>
            </>
          )}
        </div>
      </nav>

      <div className="container-page pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <Suspense fallback={null}>
              <SortBar total={filtered.length} />
            </Suspense>
            <Suspense fallback={null}>
              <ActiveFilters />
            </Suspense>
            <ScentDiscoveryBanner />
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </>
  );
}
