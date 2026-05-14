import Link from 'next/link';
import { Download, MessageCircle } from 'lucide-react';
import { FadeUp } from '@/components/shared/Animated';

export default function WholesaleModule() {
  return (
    <section className="section-pad bg-cta text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,#fff,transparent_60%)]" />
      <FadeUp>
        <div className="container-page text-center relative">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-white/75 font-medium mb-3 sm:mb-5">
            For Businesses &amp; Vendors
          </p>
          <h2 className="font-display font-normal text-[28px] sm:text-[36px] md:text-display-md text-white mb-4 sm:mb-6 leading-[1.05] tracking-[0.02em] uppercase">
            Vendors Welcome
          </h2>
          <p className="text-[15px] sm:text-body-lg md:text-body-xl text-white/85 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed font-light">
            Shop our full 1,000+ catalogue at below-wholesale prices. Perfect for candle
            makers, soap crafters, resellers and fragrance businesses of any size.
            Volume tiers from 50 bottles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold tracking-[0.08em] uppercase text-[12px] sm:text-sm h-12 sm:h-14 px-5 sm:px-8 rounded-sm hover:bg-white hover:text-cta transition-colors w-full sm:w-auto"
            >
              <Download size={16} /> Download Catalogue
            </a>
            <a
              href="https://wa.me/12125551234"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white text-cta font-semibold tracking-[0.08em] uppercase text-[12px] sm:text-sm h-12 sm:h-14 px-5 sm:px-8 rounded-sm hover:bg-cream transition-colors w-full sm:w-auto"
            >
              <MessageCircle size={16} /> WhatsApp Enquiry
            </a>
            <Link
              href="/wholesale"
              className="text-white/80 underline underline-offset-[6px] hover:text-white transition-colors text-body-md mx-auto sm:mx-0"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
