'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MESSAGES = [
  'All orders processed and dispatched within 24 hours across the USA',
  'Complimentary shipping on US orders over $50',
  'Vendors welcome — download our wholesale catalogue',
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center h-10 px-10 sm:px-12 bg-cta text-white text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase font-medium text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="truncate max-w-full"
        >
          {MESSAGES[idx]}
        </motion.span>
      </AnimatePresence>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 sm:right-4 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
