---
name: exotic-fragrances-animations
description: Implement all Framer Motion animations for the ExoticFragrances site — scroll-triggered section reveals, staggered product card entrances, page transitions, hero parallax, hover interactions, and the AnimatePresence layout wrapper. Use after all three pages are structurally complete. Triggers on: "add animations", "add scroll animations", "add page transitions", "animate the homepage", "add motion", "animate product cards", "add parallax", "add hover animations", or any request to implement movement, transitions, or scroll effects on ExoticFragrances. Requires all three pages to be built first.
---

# ExoticFragrances — Animations Skill

Adds all Framer Motion animations. Run this skill after pages are structurally complete. All animations respect `prefers-reduced-motion`.

---

## 1. Shared Animation Variants (`lib/animations.ts`)

```typescript
import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.0, 0.0, 0.2, 1.0] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.0, 0.0, 0.2, 1.0] } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.0, 0.0, 0.2, 1.0] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.0, 0.0, 0.2, 1.0] } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1.0] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0.0, 1.0, 1.0] } },
};
```

---

## 2. Reusable Animated Wrappers (`components/shared/Animated.tsx`)

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, slideInLeft, slideInRight, scaleIn } from '@/lib/animations';

interface AnimProps { children: React.ReactNode; className?: string; delay?: number; }

// Fade up on scroll
export function FadeUp({ children, className, delay = 0 }: AnimProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? {} : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container
export function StaggerGroup({ children, className }: AnimProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? {} : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

// Stagger child item (use inside StaggerGroup)
export function StaggerItem({ children, className }: AnimProps) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

// Slide in from left
export function SlideLeft({ children, className }: AnimProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? {} : slideInLeft}
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
      {children}
    </motion.div>
  );
}

// Slide in from right
export function SlideRight({ children, className }: AnimProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? {} : slideInRight}
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
      {children}
    </motion.div>
  );
}

// Scale in (for images)
export function ScaleIn({ children, className }: AnimProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} variants={reduced ? {} : scaleIn}
      initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {children}
    </motion.div>
  );
}
```

---

## 3. Page Transition Layout (`app/template.tsx`)

```tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

---

## 4. Apply Animations to Homepage Sections

### HeroSection — entrance sequence
Wrap the content block inside the hero in a stagger container:

```tsx
// In HeroSection.tsx — replace static content div with:
<StaggerGroup className="container-page relative z-10 max-w-2xl">
  <StaggerItem><p className="text-label ...">PURE FRAGRANCE OILS</p></StaggerItem>
  <StaggerItem><h1 className="font-display ...">DISCOVER YOUR<br/>EXOTIC SIGNATURE</h1></StaggerItem>
  <StaggerItem><p className="text-body-xl ...">Over 1,000 Grade A oils ...</p></StaggerItem>
  <StaggerItem><div className="flex flex-col ...">/* CTAs */</div></StaggerItem>
  <StaggerItem><div className="flex ...">/* Trust strip */</div></StaggerItem>
</StaggerGroup>
```

### TrustStrip — stagger icons
```tsx
<StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {ITEMS.map(({ icon: Icon, label }) => (
    <StaggerItem key={label}>
      <div className="flex items-center gap-3">...</div>
    </StaggerItem>
  ))}
</StaggerGroup>
```

### CategoryGrid — stagger tiles
```tsx
<StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {cats.map(cat => (
    <StaggerItem key={cat.slug}>
      <Link ...>{/* tile content */}</Link>
    </StaggerItem>
  ))}
</StaggerGroup>
```

### ScentStory — slide in text and image from opposite sides
```tsx
// Text block (left variant):
<SlideLeft className="flex-1 flex items-center ...">
  {/* text content */}
</SlideLeft>
// Image block:
<SlideRight className="flex-1 relative ...">
  {/* image */}
</SlideRight>

// Reverse variant: use SlideRight for text, SlideLeft for image
```

### WhyUs tiles — stagger
```tsx
<StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-10">
  {ITEMS.map(item => (
    <StaggerItem key={item.heading}>
      <div className="flex flex-col items-center ...">...</div>
    </StaggerItem>
  ))}
</StaggerGroup>
```

### Testimonials — stagger
```tsx
<StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {REVIEWS.map(r => (
    <StaggerItem key={r.name}><div className="bg-white/5 ...">...</div></StaggerItem>
  ))}
</StaggerGroup>
```

---

## 5. Apply Animations to Shop Page

### Product Grid — stagger cards on load
```tsx
// In ProductGrid.tsx:
import { StaggerGroup, StaggerItem } from '@/components/shared/Animated';

<StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-6">
  {products.map(p => (
    <StaggerItem key={p.id}>
      <ProductCard product={p} />
    </StaggerItem>
  ))}
</StaggerGroup>
```

---

## 6. Apply Animations to PDP

### PDP Info Panel — fade up on load
```tsx
// Wrap the entire PDPInfo return in:
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}>
  {/* all content */}
</motion.div>
```

### Editorial Tagline — fade up
```tsx
// In EditorialTagline.tsx:
<FadeUp className="container-page max-w-2xl mx-auto text-center">
  {/* content */}
</FadeUp>
```

### Product Story — slide from sides
```tsx
// Text column:
<SlideRight className="flex-1 flex items-center ...">
```

---

## 7. Number Counter Animation (WhyUs section)

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Usage in WhyUs: <CountUp target={1000} suffix="+" />
```

---

## Verification

- [ ] Page transitions: navigate between pages — content fades out then new page fades in
- [ ] Hero text entrance: each line staggers in from below on first load
- [ ] Category tiles stagger in as you scroll to the grid
- [ ] ScentStory text slides in from left, image from right (or vice versa for reverse)
- [ ] Product cards stagger in when the grid enters the viewport
- [ ] WhyUs icon cards stagger with count-up animation on numbers
- [ ] PDPInfo panel fades up when the PDP loads
- [ ] Parallax on EditorialHero — image shifts slightly on scroll
- [ ] Cart drawer and modal animations work correctly
- [ ] All animations are suppressed with `prefers-reduced-motion: reduce` enabled

**Next skill:** `exotic-fragrances-ecommerce`
