import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SlideLeft, SlideRight } from '@/components/shared/Animated';

interface ScentStoryProps {
  name: string;
  description: string;
  imageSrc: string;
  reverse?: boolean;
  background?: 'dark' | 'cream' | 'white';
}

export default function ScentStory({
  name,
  description,
  imageSrc,
  reverse = false,
}: ScentStoryProps) {
  const TextBlock = reverse ? SlideRight : SlideLeft;
  const ImageBlock = reverse ? SlideLeft : SlideRight;

  return (
    <section className="bg-warm-white w-full max-w-full overflow-hidden">
      <div className="container-page py-12 md:py-24">
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center',
            reverse && 'md:[direction:rtl] md:[&>*]:[direction:ltr]'
          )}
        >
          <TextBlock className="px-0 md:px-4 min-w-0">
            <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-gold font-medium mb-3 sm:mb-5">
              Signature Scent
            </p>
            <h2 className="font-display font-normal text-[24px] sm:text-[30px] md:text-[40px] text-brand mb-4 sm:mb-5 tracking-[0.03em] sm:tracking-[0.04em] uppercase leading-[1.1]">
              {name}
            </h2>
            <p className="text-[14px] sm:text-body-md text-brand/60 leading-relaxed mb-6 sm:mb-8 font-light max-w-md">
              {description}
            </p>
            <Link
              href={`/shop/${name.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center justify-center bg-cta text-white text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-semibold px-5 sm:px-6 h-10 sm:h-11 rounded-sm hover:bg-cta-hover transition-colors"
            >
              Shop This Scent →
            </Link>
          </TextBlock>

          <ImageBlock
            className={cn(
              'relative aspect-[5/4] md:aspect-[6/5] bg-cream overflow-hidden w-full',
              reverse
                ? 'rounded-tr-[60px] sm:rounded-tr-[80px] md:rounded-tr-[120px]'
                : 'rounded-tl-[60px] sm:rounded-tl-[80px] md:rounded-tl-[120px]'
            )}
          >
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ImageBlock>
        </div>
      </div>
    </section>
  );
}
