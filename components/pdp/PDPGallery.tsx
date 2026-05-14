'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProductImage } from '@/types';

export default function PDPGallery({
  images,
  productTitle,
}: {
  images: ProductImage[];
  productTitle: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const main = images[active];
  const thumbs = images.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative group rounded-sm overflow-hidden bg-cream cursor-zoom-in aspect-square"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={main?.url ?? ''}
          alt={productTitle}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/85 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} className="text-brand" />
        </button>
      </div>

      {/* 2×2 thumbnail grid */}
      {thumbs.length > 1 && (
        <div className="grid grid-cols-2 gap-4">
          {thumbs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative rounded-sm overflow-hidden bg-cream transition-all duration-200 aspect-square ${
                active === i
                  ? 'ring-2 ring-cta ring-offset-2 ring-offset-warm-white'
                  : 'opacity-95 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productTitle} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-square"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
            >
              <Image
                src={main?.url ?? ''}
                alt={productTitle}
                fill
                className="object-contain"
                sizes="800px"
              />
            </motion.div>
            <button
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
