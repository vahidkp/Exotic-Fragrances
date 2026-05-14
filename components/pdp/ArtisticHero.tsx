import Image from 'next/image';

export default function ArtisticHero({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative overflow-hidden h-[520px]">
      <Image
        src={imageSrc}
        alt="Artistic editorial composition"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
}
