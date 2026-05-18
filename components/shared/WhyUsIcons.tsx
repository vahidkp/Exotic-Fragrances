'use client';
import { motion, useReducedMotion } from 'framer-motion';

const BRAND = '#1A1A1A';
const CTA = '#C4763A';
const GOLD = '#D4A843';

type IconProps = { className?: string };

export function DropletIcon({ className }: IconProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <motion.g
        animate={reduced ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '40px 40px' }}
      >
        <path
          d="M40 14 C30 28, 24 38, 24 48 A16 16 0 0 0 56 48 C56 38, 50 28, 40 14 Z"
          fill={GOLD}
          fillOpacity="0.18"
          stroke={CTA}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <motion.path
          d="M34 44 C34 38, 36 33, 38 30"
          stroke={GOLD}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          animate={reduced ? undefined : { opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {[
        { cx: 22, cy: 22, r: 1.6, delay: 0 },
        { cx: 58, cy: 28, r: 1.2, delay: 0.6 },
        { cx: 60, cy: 60, r: 1.4, delay: 1.2 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={GOLD}
          animate={
            reduced ? undefined : { opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
        />
      ))}
    </svg>
  );
}

export function BottlesIcon({ className }: IconProps) {
  const reduced = useReducedMotion();
  const bottles = [
    { x: 14, h: 26, capH: 5 },
    { x: 32, h: 34, capH: 6 },
    { x: 52, h: 22, capH: 5 },
  ];
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {bottles.map((b, i) => {
        const bodyTop = 62 - b.h;
        const capTop = bodyTop - b.capH;
        return (
          <g key={i}>
            <motion.path
              d={`M${b.x + 6} ${capTop - 2} C${b.x + 7} ${capTop - 8}, ${b.x + 7} ${
                capTop - 14
              }, ${b.x + 6} ${capTop - 18}`}
              stroke={GOLD}
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              animate={
                reduced
                  ? undefined
                  : { opacity: [0, 0.7, 0], y: [0, -4, -8], pathLength: [0.2, 1, 1] }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
            />
            <rect
              x={b.x + 4}
              y={capTop}
              width="4"
              height={b.capH}
              rx="0.8"
              fill={GOLD}
            />
            <rect
              x={b.x}
              y={bodyTop}
              width="12"
              height={b.h}
              rx="2"
              fill={CTA}
              fillOpacity="0.18"
              stroke={CTA}
              strokeWidth="1.4"
            />
            <rect
              x={b.x + 2.5}
              y={bodyTop + 6}
              width="3"
              height={b.h * 0.35}
              rx="0.6"
              fill={GOLD}
              fillOpacity="0.55"
            />
          </g>
        );
      })}

      <line
        x1="8"
        y1="63"
        x2="72"
        y2="63"
        stroke={BRAND}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function PriceTagIcon({ className }: IconProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <motion.g
        animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '34px 30px' }}
      >
        <path
          d="M14 14 L36 14 L60 38 L38 60 L14 36 Z"
          fill={GOLD}
          fillOpacity="0.18"
          stroke={CTA}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="3" fill={CTA} />
        <text
          x="40"
          y="42"
          fontSize="13"
          fontWeight="700"
          fill={CTA}
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
        >
          $
        </text>
      </motion.g>

      <motion.g
        animate={reduced ? undefined : { y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line
          x1="62"
          y1="46"
          x2="62"
          y2="64"
          stroke={GOLD}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M56 58 L62 66 L68 58"
          stroke={GOLD}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[
        { y: 28, w: 10, delay: 0 },
        { y: 38, w: 14, delay: 0.3 },
        { y: 48, w: 8, delay: 0.6 },
      ].map((l, i) => (
        <motion.line
          key={i}
          x1="6"
          y1={l.y}
          x2={6 + l.w}
          y2={l.y}
          stroke={CTA}
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={
            reduced ? undefined : { opacity: [0, 0.8, 0], x: [-4, 0, 4] }
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: l.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.g
        animate={reduced ? undefined : { x: [0, 1.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="22"
          y="22"
          width="28"
          height="26"
          rx="2"
          fill={GOLD}
          fillOpacity="0.18"
          stroke={CTA}
          strokeWidth="1.6"
        />
        <path
          d="M50 30 L62 30 L70 38 L70 48 L50 48 Z"
          fill={GOLD}
          fillOpacity="0.18"
          stroke={CTA}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <rect x="54" y="33" width="10" height="7" rx="1" fill={GOLD} fillOpacity="0.5" />

        <motion.g
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '32px 54px' }}
        >
          <circle cx="32" cy="54" r="5" fill={BRAND} />
          <circle cx="32" cy="54" r="1.6" fill={GOLD} />
          <line
            x1="32"
            y1="50"
            x2="32"
            y2="58"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.7"
          />
        </motion.g>
        <motion.g
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '60px 54px' }}
        >
          <circle cx="60" cy="54" r="5" fill={BRAND} />
          <circle cx="60" cy="54" r="1.6" fill={GOLD} />
          <line
            x1="60"
            y1="50"
            x2="60"
            y2="58"
            stroke={GOLD}
            strokeWidth="1"
            opacity="0.7"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}
