'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus, ShieldCheck, ArrowRight } from 'lucide-react';
import { FadeUp } from '@/components/shared/Animated';

interface FAQItem {
  q: string;
  a: React.ReactNode;
  tag?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    tag: 'Authenticity',
    q: 'Are these real fragrance oils?',
    a: (
      <>
        <p>
          Yes — 100% pure, undiluted Grade A fragrance oils. No alcohol, no water, no
          fillers. Each oil is sourced from the same parent fragrance houses (IFF,
          Givaudan, Firmenich, Symrise) that supply the world&apos;s leading designer
          perfumes, then blended to capture the signature accord.
        </p>
        <p className="mt-2">
          You&apos;ll receive the concentrated oil itself — apply directly to skin
          (after a patch test) or use it to create your own perfume, candle, or body
          product at home.
        </p>
      </>
    ),
  },
  {
    tag: 'Comparison',
    q: 'Will it smell exactly like the original designer fragrance?',
    a: (
      <>
        <p>
          We&apos;re honest with you: <strong>the top notes will smell 95–98%
          identical</strong> — that&apos;s the first impression most people associate
          with a scent. The dry-down (after 2+ hours on skin) can differ slightly
          because our oils don&apos;t contain the alcohol carrier that designer
          perfumes use to project.
        </p>
        <p className="mt-2">
          Many of our customers tell us they actually prefer our oil version — it sits
          closer to the skin, lasts longer, and feels more intimate. We always
          recommend the <strong>0.5oz Sample</strong> first so you can decide for
          yourself.
        </p>
      </>
    ),
  },
  {
    tag: 'Legal',
    q: 'Are designer-inspired fragrance oils legal?',
    a: (
      <>
        <p>
          Absolutely. We never reproduce or sell trademarked perfumes. What we sell
          are our own <strong>interpretations inspired by</strong> popular designer
          accords — a long-established and entirely legal practice across the
          fragrance industry, used by independent perfumers, candle makers, and
          niche brands worldwide.
        </p>
        <p className="mt-2">
          You&apos;ll always see &ldquo;Inspired by [Designer Name]&rdquo; on our
          product pages. We don&apos;t print designer logos, brand names, or
          trademarked artwork on any of our bottles or packaging.
        </p>
      </>
    ),
  },
  {
    tag: 'Performance',
    q: 'How long does each fragrance last on skin?',
    a: (
      <p>
        Because our oils are undiluted, longevity is typically <strong>6–12
        hours</strong> per application — significantly longer than most designer
        eau-de-parfums (which use alcohol that evaporates within hours). Every PDP
        shows a longevity score (1–5 scale) so you know what to expect before you
        buy. Skin chemistry and climate also play a role.
      </p>
    ),
  },
  {
    tag: 'Safety',
    q: 'Are the oils safe to apply directly to skin?',
    a: (
      <>
        <p>
          Yes, when diluted appropriately. We recommend a{' '}
          <strong>20–30% dilution in a carrier oil</strong> (jojoba, sweet almond,
          or fractionated coconut) for skin application. Always patch-test on the
          inside of your wrist first — wait 24 hours before broader use.
        </p>
        <p className="mt-2 text-muted text-[13px]">
          Not intended for use during pregnancy without consulting a healthcare
          provider. Keep out of reach of children. Avoid contact with eyes.
        </p>
      </>
    ),
  },
  {
    tag: 'Shipping',
    q: 'How fast will my order arrive?',
    a: (
      <p>
        Every order is processed and dispatched from our New York facility{' '}
        <strong>within 24 hours</strong>. Standard US shipping arrives in{' '}
        <strong>3–7 business days</strong>; express in 1–2 days. Free standard
        shipping on US orders over $50.
      </p>
    ),
  },
  {
    tag: 'Returns',
    q: 'What if I don’t like the scent?',
    a: (
      <p>
        Reach out within 30 days. <strong>Unopened bottles</strong> are eligible
        for a full refund or exchange. Opened fragrance oils are non-returnable
        for hygiene reasons, but if there&apos;s ever a quality issue we&apos;ll
        replace it — no questions asked. That&apos;s why we recommend starting
        with the 0.5oz Sample.
      </p>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-pad bg-cream w-full max-w-full overflow-hidden">
      <div className="container-page">
        <FadeUp className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <p className="text-[11px] sm:text-[12px] tracking-[0.24em] sm:tracking-[0.28em] uppercase text-cta font-medium mb-3 sm:mb-4">
            Questions, answered
          </p>
          <h2 className="font-display font-normal text-[26px] sm:text-[32px] md:text-display-md text-brand tracking-[0.03em] uppercase mb-4">
            Before You Buy
          </h2>
          <p className="text-[14px] sm:text-body-md text-brand/60 leading-relaxed font-light">
            The honest answers to the questions every first-time fragrance-oil
            customer asks us. No fine print, no hedging.
          </p>
        </FadeUp>

        <div className="max-w-3xl mx-auto bg-white rounded-sm shadow-card border border-border/60">
          <ul className="divide-y divide-border">
            {FAQ_ITEMS.map((item, i) => {
              const open = openIndex === i;
              return (
                <li key={item.q}>
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-start gap-4 px-5 sm:px-7 py-5 sm:py-6 text-left transition-colors hover:bg-warm-white/50"
                    aria-expanded={open}
                  >
                    <span className="flex-1 min-w-0">
                      {item.tag && (
                        <span className="block text-[10px] tracking-[0.2em] uppercase text-cta font-semibold mb-1.5">
                          {item.tag}
                        </span>
                      )}
                      <span className="block font-display text-[16px] sm:text-[18px] text-brand leading-snug">
                        {item.q}
                      </span>
                    </span>
                    <span
                      className={`mt-1 sm:mt-1.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        open
                          ? 'bg-cta text-white'
                          : 'bg-cream text-brand'
                      }`}
                      aria-hidden
                    >
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-7 pb-6 sm:pb-7 text-[14px] sm:text-[15px] text-brand/75 leading-[1.7] font-light max-w-2xl space-y-2">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Reassurance footer card */}
        <FadeUp className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-white border border-border/60 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-success" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-[16px] sm:text-[18px] text-brand mb-1">
              Still unsure? Start with a sample.
            </p>
            <p className="text-[13px] sm:text-[14px] text-brand/65 leading-relaxed">
              Every fragrance is available in a 0.5oz sample from $11. Try before
              you commit — most customers do.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cta border-b border-cta/40 hover:border-cta hover:text-cta-hover transition-colors pb-1 font-semibold whitespace-nowrap"
          >
            Browse Samples <ArrowRight size={13} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
