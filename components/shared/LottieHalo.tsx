'use client';
import dynamic from 'next/dynamic';
import haloData from '@/lib/lottie/halo-pulse.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieHaloProps {
  className?: string;
}

export default function LottieHalo({ className }: LottieHaloProps) {
  return (
    <Lottie
      animationData={haloData}
      loop
      autoplay
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
