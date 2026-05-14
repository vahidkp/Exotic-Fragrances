'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function EditorialHero({ imageSrc }: { imageSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <div ref={ref} className="relative overflow-hidden h-[360px] sm:h-[480px] md:h-[640px] w-full max-w-full">
      <motion.div
        className="absolute inset-0 scale-110"
        style={reduced ? undefined : { y }}
      >
        <Image
          src={imageSrc}
          alt="Editorial composition"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}
