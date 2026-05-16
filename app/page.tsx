import HeroSection from '@/components/homepage/HeroSection';
import TrustStrip from '@/components/homepage/TrustStrip';
import CategoryGrid from '@/components/homepage/CategoryGrid';
import ScentStory from '@/components/homepage/ScentStory';
import BestsellerCarousel from '@/components/homepage/BestsellerCarousel';
import WhyUs from '@/components/homepage/WhyUs';
import Testimonials from '@/components/homepage/Testimonials';
import FAQ from '@/components/homepage/FAQ';
import WholesaleModule from '@/components/homepage/WholesaleModule';
import InstagramStrip from '@/components/homepage/InstagramStrip';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { getProducts, getCategories, getScentStories } from '@/lib/shopify';

export default async function HomePage() {
  const [{ products }, categories, stories] = await Promise.all([
    getProducts(12),
    getCategories(),
    getScentStories(),
  ]);

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CategoryGrid categories={categories} />
      {stories.map((s, i) => (
        <ScentStory
          key={i}
          name={s.name}
          description={s.description}
          imageSrc={s.imageUrl}
          reverse={s.reverse}
          background={s.background}
        />
      ))}
      <BestsellerCarousel products={products} />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <WholesaleModule />
      <InstagramStrip />
      <NewsletterSection />
    </>
  );
}
