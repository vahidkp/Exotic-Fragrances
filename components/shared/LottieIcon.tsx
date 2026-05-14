'use client';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieIconProps {
  data: object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieIcon({
  data,
  className,
  loop = true,
  autoplay = true,
}: LottieIconProps) {
  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
