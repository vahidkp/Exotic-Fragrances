import Image from 'next/image';

interface ShopHeaderProps {
  category?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  womens: '/images/category_womens_fragrance_retry_1778781640503.png',
  mens: '/images/category_mens_fragrance_1778780026029.png',
  unisex: '/images/category_unisex_fragrance_1778781036963.png',
  oud: '/images/category_oud_oriental_fragrance_1778781746608.png',
  home: '/images/shop_header_final.png',
  accessories: '/images/shop_header_final.png',
  default: '/images/shop_header_final.png',
};

export default function ShopHeader({ category }: ShopHeaderProps) {
  const imgSrc = CATEGORY_IMAGES[category ?? 'default'] ?? CATEGORY_IMAGES.default;
  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    : 'All Fragrances';

  return (
    <div className="relative h-[280px] sm:h-[340px] md:h-[420px] flex items-end pb-8 sm:pb-12 md:pb-16 overflow-hidden mt-[104px] md:mt-[112px] w-full max-w-full">
      <Image src={imgSrc} alt={title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/30 to-transparent" />
      <div className="container-page relative z-10">
        <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-gold font-medium mb-2 sm:mb-4">Exotic Fragrances</p>
        <h1 className="font-display font-medium text-[28px] sm:text-[36px] md:text-display-lg text-white leading-[1.05]">
          {title}
        </h1>
      </div>
    </div>
  );
}
