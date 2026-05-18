'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, FlaskConical, Truck } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Star, label: '4.9/5 Reviews' },
  { icon: FlaskConical, label: '1,000+ Scents' },
  { icon: Truck, label: 'Ships in 24h' },
];

export default function HeroSection() {
  const reduced = useReducedMotion();
  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0, 0, 0.2, 1] as const },
        };

  return (
    <section className="relative h-[calc(100vh-40px)] h-[calc(100svh-40px)] min-h-[600px] md:min-h-[640px] w-full max-w-full overflow-hidden bg-[#3a2418]">
      {/* Background — slow Ken Burns zoom for ambient motion */}
      <motion.div
        className="absolute inset-0"
        initial={reduced ? {} : { scale: 1.08 }}
        animate={reduced ? {} : { scale: 1 }}
        transition={{ duration: 12, ease: 'easeOut' }}
      >
        <Image
          src="/images/collection_bottles_amber.png"
          alt="Exotic Fragrances — luxury fragrance oil composition"
          fill
          priority
          quality={100}
          className="object-cover object-[60%_top] md:object-[70%_top]"
          sizes="100vw"
        />
      </motion.div>
      {/* Bottom-anchored gradient on mobile, left-anchored on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent md:from-black/50 md:via-transparent md:to-transparent" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

      {/* Content — flex column with trust strip pinned to bottom */}
      <div className="absolute inset-0 flex flex-col justify-end pb-6 sm:pb-8 md:pb-24">
        <div className="container-page w-full">
          <div className="max-w-[640px] w-full">
            {/* Eyebrow — text on top, full-width hairline below */}
            <motion.div {...reveal(0.05)} className="mb-5 sm:mb-7">
              <p className="text-[10px] sm:text-[12px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-gold font-medium mb-2.5">
                Pure Fragrance Oils
              </p>
              <span className="block w-full max-w-[300px] sm:max-w-[340px] h-px bg-gold/50" aria-hidden />
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...reveal(0.15)}
              className="font-display font-normal text-white leading-[1.05] tracking-[0.005em] text-[clamp(34px,9vw,60px)] uppercase mb-5 sm:mb-7"
            >
              Discover your
              <br />
              <em className="italic font-light text-gold-light">exotic</em> signature
            </motion.h1>

            {/* Description */}
            <motion.p
              {...reveal(0.3)}
              className="text-[14px] sm:text-body-lg text-white/85 leading-[1.65] mb-7 sm:mb-10 font-light max-w-md"
            >
              Over 1,000 Grade A oils inspired by the world&apos;s greatest perfumes —
              shipped across the USA in 24 hours, below wholesale prices.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...reveal(0.45)}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-7 sm:gap-y-4 mb-8 sm:mb-10"
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-cta text-white text-[11px] sm:text-[12px] tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold px-6 sm:px-8 h-12 sm:h-14 rounded-sm hover:bg-cta-hover transition-colors shadow-[0_6px_20px_rgba(196,118,58,0.35)] w-full sm:w-auto sm:min-w-[230px] max-w-full"
              >
                Explore the Collection
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white text-[11px] sm:text-[12px] tracking-[0.16em] sm:tracking-[0.2em] uppercase font-semibold px-6 sm:px-8 h-12 sm:h-14 rounded-sm hover:bg-white/10 transition-all duration-300 w-full sm:w-auto sm:min-w-[230px] max-w-full"
              >
                Wholesale Enquiry
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Trust strip — pinned just above the bottom of the hero with icon + label + vertical dividers */}
        <motion.div {...reveal(0.6)} className="container-page w-full mt-2 sm:mt-3 md:mt-0">
          <div className="grid grid-cols-3 gap-0 sm:max-w-md md:max-w-lg pt-5 sm:pt-6 border-t border-white/15">
            {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center text-center gap-2 sm:gap-2.5 px-1 sm:px-3 ${
                  i > 0 ? 'border-l border-white/15' : ''
                }`}
              >
                <Icon
                  size={20}
                  className="text-gold flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/75 font-medium leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Editorial scroll indicator — desktop only */}
      <motion.div
        initial={reduced ? {} : { opacity: 0 }}
        animate={reduced ? {} : { opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="hidden md:flex absolute bottom-10 right-10 lg:right-16 items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-white/55"
      >
        <span>Scroll</span>
        <div className="relative w-px h-12 bg-white/20 overflow-hidden">
          <motion.span
            className="absolute top-0 left-0 w-px h-4 bg-gold"
            animate={
              reduced
                ? {}
                : { y: [-16, 48], opacity: [0, 1, 1, 0] }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.2, 0.8, 1],
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
