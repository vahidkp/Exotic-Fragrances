import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';
import LottieIcon from '@/components/shared/LottieIcon';
import bubbles from '@/lib/lottie/bubbles.json';
import orbit from '@/lib/lottie/orbit.json';
import arrowDown from '@/lib/lottie/arrow-down.json';
import truck from '@/lib/lottie/truck.json';

const ITEMS = [
  {
    lottie: bubbles,
    heading: 'Grade A Quality',
    body: 'Pure, undiluted fragrance oils — the same grade used by leading perfume houses.',
  },
  {
    lottie: orbit,
    heading: '1,000+ Scents',
    body: 'One of the largest catalogues of fragrance, body and essential oils in the USA.',
  },
  {
    lottie: arrowDown,
    heading: 'Below Wholesale',
    body: 'No middleman, no mark-up. Designer-inspired fragrances at prices that make every scent accessible.',
  },
  {
    lottie: truck,
    heading: 'Fast USA Shipping',
    body: 'Every order processed and dispatched within 24 hours — reliable delivery across all fifty states.',
  },
];

export default function WhyUs() {
  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <FadeUp className="text-center mb-10 md:mb-16">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-cta font-medium mb-3 sm:mb-4">
            The Promise
          </p>
          <h2 className="font-display font-normal text-[26px] sm:text-[32px] md:text-display-md text-brand tracking-[0.03em] uppercase">
            Why Exotic Fragrances
          </h2>
        </FadeUp>

        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {ITEMS.map(({ lottie, heading, body }) => (
            <StaggerItem key={heading}>
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center bg-white rounded-full shadow-card">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                    <LottieIcon data={lottie} />
                  </div>
                </div>
                <h3 className="font-display text-[15px] sm:text-[18px] md:text-heading-lg text-brand">{heading}</h3>
                <p className="text-[13px] sm:text-[14px] md:text-body-md text-brand/60 leading-relaxed font-light">
                  {body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
