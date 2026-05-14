import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';
import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';

const TAGLINES: Record<string, { eyebrow: string; copy: string }> = {
  womens: {
    eyebrow: 'Designer Inspired',
    copy: "Florals, gourmands and oud — inspired by the world's greatest women's perfumes.",
  },
  mens: {
    eyebrow: 'Grade A Quality',
    copy: 'Woody, leather and aquatic profiles built to last from morning to night.',
  },
  unisex: {
    eyebrow: '1,000+ Scents',
    copy: 'Notes that defy the binary — bold, bright, beautifully balanced.',
  },
  oud: {
    eyebrow: 'Pure & Potent',
    copy: 'A regal, all-night-long oud anchored by smoky agarwood and softened with patchouli.',
  },
  home: {
    eyebrow: 'Atmosphere',
    copy: 'Diffuser blends and candle oils — set the mood in any room.',
  },
  accessories: {
    eyebrow: 'Studio Edit',
    copy: 'Glass bottles, droppers and tools for blending fragrances at home.',
  },
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const cats = categories.slice(0, 6);

  return (
    <section className="bg-warm-white section-pad">
      <div className="container-page">
        <FadeUp className="text-center mb-10 md:mb-14">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-cta font-medium mb-3 sm:mb-4">
            Shop the Range
          </p>
          <h2 className="font-display font-normal text-[26px] sm:text-[32px] md:text-display-md text-brand tracking-[0.03em] sm:tracking-[0.04em] uppercase">
            Our Collections
          </h2>
        </FadeUp>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {cats.map((cat) => (
            <StaggerItem key={cat.slug}>
              <BannerCard cat={cat} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function BannerCard({ cat }: { cat: Category }) {
  const t = TAGLINES[cat.slug] ?? {
    eyebrow: 'Special Offers',
    copy: 'Discover the collection.',
  };
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group bg-cream rounded-sm overflow-hidden flex items-stretch h-[200px] sm:h-[220px] md:h-[240px] w-full max-w-full"
    >
      <div className="basis-[58%] sm:basis-[55%] flex flex-col py-5 sm:py-7 md:py-8 px-4 sm:px-6 md:px-8 min-w-0">
        <p className="text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-muted mb-2 sm:mb-3 font-medium truncate">
          {t.eyebrow}
        </p>
        <h3 className="font-display font-normal text-[15px] sm:text-[17px] md:text-[20px] text-brand mb-2 sm:mb-3 tracking-[0.02em] uppercase leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {cat.name}
        </h3>
        <p className="text-[11px] sm:text-[12px] md:text-[13px] text-brand/65 leading-relaxed font-light line-clamp-2 sm:line-clamp-2">
          {t.copy}
        </p>
        <span className="mt-auto inline-flex items-center justify-center self-start bg-cta text-white text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold px-3 sm:px-4 md:px-5 h-9 sm:h-10 rounded-sm group-hover:bg-cta-hover transition-colors whitespace-nowrap">
          Shop Now
        </span>
      </div>
      <div className="relative basis-[42%] sm:basis-[45%] flex-shrink-0 bg-cream overflow-hidden">
        <Image
          src={cat.imageUrl}
          alt={cat.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 22vw"
        />
      </div>
    </Link>
  );
}
