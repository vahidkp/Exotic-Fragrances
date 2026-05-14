import { notFound } from 'next/navigation';
import PDPGallery from '@/components/pdp/PDPGallery';
import PDPInfo from '@/components/pdp/PDPInfo';
import EditorialTagline from '@/components/pdp/EditorialTagline';
import EditorialHero from '@/components/pdp/EditorialHero';
import ProductStory from '@/components/pdp/ProductStory';
import CampaignSection from '@/components/pdp/CampaignSection';
import YouMayAlsoLike from '@/components/pdp/YouMayAlsoLike';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { getProduct, getProducts } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import type { Metadata } from 'next';

interface PDPProps {
  params: { handle: string };
}

/** Lifestyle/atmosphere shots used across editorial sections so the page isn't
 *  just the same bottle on a loop. Pulled from /public/images/. */
const EDITORIAL_IMAGES = [
  '/images/collection_bottles_amber.png',
  '/images/scent_muted_forest.png',
  '/images/scent_floral_pink.png',
  '/images/homepage_hero_luxury_fragrance_1778779966636.png',
  '/images/category_oud_oriental_fragrance_1778781746608.png',
  '/images/category_womens_fragrance_retry_1778781640503.png',
  '/images/category_unisex_fragrance_1778781036963.png',
  '/images/category_mens_fragrance_1778780026029.png',
];

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { product } = await getProduct(params.handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: [{ url: product.images[0]?.url ?? '' }],
    },
  };
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ handle: p.handle }));
}

export default async function PDPPage({ params }: PDPProps) {
  const [{ product }, { products: allProducts }] = await Promise.all([
    getProduct(params.handle),
    getProducts(8),
  ]);
  if (!product) notFound();

  const related = allProducts.filter((p) => p.handle !== params.handle).slice(0, 3);

  // Pick an editorial image deterministically from the product handle so each
  // PDP gets a stable but varied set, and the same image isn't repeated.
  const hash = product.handle
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pick = (offset: number) =>
    EDITORIAL_IMAGES[(hash + offset) % EDITORIAL_IMAGES.length];

  return (
    <>
      <nav className="container-page text-label text-muted py-4 sm:py-5 mt-[104px] md:mt-[112px] overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px]">
          <span>Home</span>
          <span>/</span>
          <span>Shop</span>
          <span>/</span>
          <span className="text-brand truncate max-w-[200px] sm:max-w-none">{product.title}</span>
        </div>
      </nav>

      <section className="container-page pb-12 sm:pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-20">
          <div className="lg:w-1/2 flex-shrink-0 min-w-0">
            <PDPGallery images={product.images} productTitle={product.title} />
          </div>
          <div className="lg:w-1/2 min-w-0">
            <PDPInfo product={product} />
          </div>
        </div>
      </section>

      <EditorialTagline
        eyebrow="Signature Experience"
        headline="A scent that transports you."
        body="Pure Grade A fragrance — crafted to capture the essence of a designer original, at a price that lets you wear it every day."
        bg="cream"
      />

      <EditorialHero imageSrc={pick(0)} />

      <ProductStory
        campaignName="The Exotic Signature"
        headline={`A modern way to wear ${product.title}.`}
        copy="An invitation to indulge. A fragrance that clings to memory long after you leave the room. Pure. Elevated. Yours."
        cta="Explore the Collection"
        ctaHref="/shop"
        imageSrc={pick(1)}
      />

      <CampaignSection
        headline="Echo your essence."
        subheadline="Every bottle tells a story. What will yours say?"
        imageSrc={pick(2)}
      />

      <YouMayAlsoLike products={related} />
      <NewsletterSection />
    </>
  );
}
