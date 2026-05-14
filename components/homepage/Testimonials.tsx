import { FadeUp, StaggerGroup, StaggerItem } from '@/components/shared/Animated';

const REVIEWS = [
  {
    name: 'Sarah M.',
    label: 'Retail',
    rating: 5,
    quote:
      "I've been buying from Exotic for 3 years. The quality of their oils is unmatched — identical to the designer version at a fraction of the price.",
  },
  {
    name: 'James T.',
    label: 'Wholesale',
    rating: 5,
    quote:
      'As a small candle business, finding reliable, high-quality oils at wholesale pricing was a game changer. My customers can smell the difference.',
  },
  {
    name: 'Priya K.',
    label: 'Gift',
    rating: 5,
    quote:
      'I gifted the Vanilla Ember to my sister and she has reordered three times. The packaging makes every bottle feel like a luxury purchase.',
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad bg-[#2C1A0E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full bg-cta/10 blur-[120px]" />
      </div>
      <div className="container-page relative">
        <FadeUp className="text-center mb-10 md:mb-16">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-gold font-medium mb-3 sm:mb-4">
            In Their Words
          </p>
          <h2 className="font-display font-normal text-[26px] sm:text-[32px] md:text-display-md text-white tracking-[0.03em] uppercase">
            What Our Customers Say
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {REVIEWS.map((r) => (
            <StaggerItem key={r.name}>
              <div className="bg-white/[0.04] backdrop-blur rounded-md p-6 sm:p-8 md:p-9 flex flex-col gap-4 sm:gap-5 md:gap-6 border border-white/10 h-full">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="text-gold text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[15px] sm:text-body-lg text-white/80 leading-relaxed italic font-light">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="pt-2 border-t border-white/10">
                  <p className="font-sans-body font-semibold text-white text-sm">{r.name}</p>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-gold mt-1">
                    {r.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
