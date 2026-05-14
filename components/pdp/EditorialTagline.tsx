import { cn } from '@/lib/utils';
import { FadeUp } from '@/components/shared/Animated';

interface EditorialTaglineProps {
  eyebrow?: string;
  headline: string;
  body: string;
  bg?: 'white' | 'cream' | 'dark';
}

export default function EditorialTagline({
  headline,
  body,
  bg = 'white',
}: EditorialTaglineProps) {
  const bgClass = { white: 'bg-warm-white', cream: 'bg-cream', dark: 'bg-brand' }[bg];
  const textMain = bg === 'dark' ? 'text-white' : 'text-brand';
  const textSub = bg === 'dark' ? 'text-white/60' : 'text-brand/60';

  return (
    <section className={cn('py-14 sm:py-16 md:py-24 text-center', bgClass)}>
      <FadeUp className="container-page max-w-3xl mx-auto">
        <h2
          className={cn(
            'font-display font-normal text-[22px] sm:text-[26px] md:text-[32px] mb-4 sm:mb-5 leading-[1.25] tracking-[0.01em]',
            textMain
          )}
        >
          {headline}
        </h2>
        <p className={cn('text-[14px] sm:text-body-md leading-relaxed font-light max-w-xl mx-auto', textSub)}>
          {body}
        </p>
      </FadeUp>
    </section>
  );
}
