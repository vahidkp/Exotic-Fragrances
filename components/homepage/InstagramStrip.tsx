import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FadeUp } from '@/components/shared/Animated';

const IG_IMAGES: { src: string; alt: string }[] = [
  {
    src: '/images/category_womens_fragrance_retry_1778781640503.png',
    alt: "Women's signature fragrance",
  },
  {
    src: '/images/category_mens_fragrance_1778780026029.png',
    alt: "Men's signature fragrance",
  },
  {
    src: '/images/category_unisex_fragrance_1778781036963.png',
    alt: 'Unisex fragrance edit',
  },
  {
    src: '/images/category_oud_oriental_fragrance_1778781746608.png',
    alt: 'Oud & Oriental edit',
  },
];

export default function InstagramStrip() {
  return (
    <section className="bg-warm-white pt-12 pb-20">
      <div className="container-page">
        <FadeUp>
          <div className="flex items-center justify-center gap-5 mb-12">
            <span className="h-px w-12 md:w-20 bg-border-strong" aria-hidden />
            <p className="font-display text-[14px] md:text-[16px] tracking-[0.32em] uppercase text-brand whitespace-nowrap">
              @exoticfragrances
            </p>
            <span className="h-px w-12 md:w-20 bg-border-strong" aria-hidden />
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {IG_IMAGES.map((img, i) => (
            <Link
              key={i}
              href="https://instagram.com/exoticfragrances"
              target="_blank"
              className="relative overflow-hidden bg-cream rounded-sm group aspect-[4/5]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-brand/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={20} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
