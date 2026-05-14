'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

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
          src="/images/hero_final.jpg"
          alt="Exotic Fragrances — luxury fragrance oil composition"
          fill
          priority
          quality={100}
          className="object-cover object-[60%_top] md:object-[70%_top]"
          sizes="100vw"
        />
      </motion.div>
      {/* Bottom-anchored gradient — keeps top of image fully visible, darkens only the lower band where text lives */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent md:from-black/50 md:via-transparent md:to-transparent" />
      {/* Left-side darkening (desktop only) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

      {/* Content — bottom-anchored on both mobile and desktop */}
      <div className="absolute inset-0 flex items-end pb-10 sm:pb-14 md:pb-24">
        <div className="container-page w-full">
          <div className="max-w-[640px] w-full">
            {/* Eyebrow */}
            <motion.p
              {...reveal(0.05)}
              className="text-[10px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.32em] uppercase text-gold font-medium mb-5 sm:mb-7 flex items-center gap-2.5 sm:gap-3"
            >
              <span className="inline-block w-6 sm:w-8 h-px bg-gold/60" aria-hidden />
              Pure Fragrance Oils
            </motion.p>

            {/* Headline */}
            <motion.h1
              {...reveal(0.15)}
              className="font-display font-normal text-white leading-[1.06] tracking-[0.005em] text-[clamp(30px,8vw,60px)] uppercase mb-6 sm:mb-8"
            >
              Discover your
              <br />
              <em className="italic font-light text-gold-light">exotic</em> signature
            </motion.h1>

            {/* Description */}
            <motion.p
              {...reveal(0.3)}
              className="text-[14px] sm:text-body-lg text-white/85 leading-[1.65] mb-8 sm:mb-10 font-light max-w-md"
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
                className="text-[12px] sm:text-[13px] text-white/90 underline underline-offset-[6px] hover:text-white transition-colors self-start sm:self-auto"
              >
                Wholesale Enquiry →
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              {...reveal(0.6)}
              className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-white/65"
            >
              <span>★ 4.9/5 Reviews</span>
              <span className="text-white/25">·</span>
              <span>1,000+ Scents</span>
              <span className="text-white/25">·</span>
              <span>Ships in 24h</span>
            </motion.div>
          </div>
        </div>
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
