import Image from 'next/image';
import { FadeUp } from '@/components/shared/Animated';

interface CampaignSectionProps {
  headline: string;
  subheadline: string;
  imageSrc: string;
}

export default function CampaignSection({
  headline,
  subheadline,
  imageSrc,
}: CampaignSectionProps) {
  return (
    <section className="bg-warm-white w-full max-w-full overflow-hidden">
      <FadeUp className="container-page text-center pt-14 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12">
        <h2 className="font-display font-normal text-[24px] sm:text-[32px] md:text-[40px] text-brand mb-3 sm:mb-4 leading-[1.15] tracking-[0.01em]">
          {headline}
        </h2>
        <p className="text-[14px] sm:text-body-md text-brand/60 max-w-xl mx-auto font-light leading-relaxed">
          {subheadline}
        </p>
      </FadeUp>
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/8] overflow-hidden">
        <Image
          src={imageSrc}
          alt={headline}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
