import Image from 'next/image';
import Link from 'next/link';
import { SlideLeft, SlideRight } from '@/components/shared/Animated';

interface ProductStoryProps {
  campaignName: string;
  headline: string;
  copy: string;
  cta: string;
  ctaHref: string;
  imageSrc: string;
  reverse?: boolean;
}

export default function ProductStory({
  campaignName,
  headline,
  copy,
  cta,
  ctaHref,
  imageSrc,
  reverse = false,
}: ProductStoryProps) {
  const Text = reverse ? SlideLeft : SlideRight;
  const Img = reverse ? SlideRight : SlideLeft;
  return (
    <section
      className={`flex flex-col md:flex-row md:min-h-[600px] bg-warm-white w-full max-w-full overflow-hidden ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
    >
      <Img className="flex-1 relative bg-cream min-h-[280px] sm:min-h-[360px] md:min-h-0">
        <Image src={imageSrc} alt={headline} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </Img>
      <Text className="flex-1 flex items-center justify-center bg-warm-white px-5 py-12 sm:px-8 sm:py-16 md:p-20 min-w-0">
        <div className="max-w-md text-center w-full">
          <h2 className="font-display font-normal text-[22px] sm:text-[28px] md:text-[34px] text-brand mb-4 sm:mb-6 leading-[1.2]">
            {headline}
          </h2>
          <p className="text-[14px] sm:text-body-md text-brand/60 leading-relaxed mb-6 sm:mb-10 font-light">
            {copy}
          </p>
          <Link
            href={ctaHref}
            className="inline-block text-[10px] sm:text-[11px] tracking-[0.28em] sm:tracking-[0.35em] uppercase text-brand border-b border-brand/40 pb-1 hover:text-cta hover:border-cta transition-colors"
          >
            Acquire
          </Link>
        </div>
      </Text>
    </section>
  );
}
