import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      className="container-page text-center py-32"
      style={{ marginTop: 'calc(40px + 72px)' }}
    >
      <p className="text-label text-cta mb-5">404 · Lost in the woods</p>
      <h1 className="font-display font-medium text-display-md text-brand mb-6 leading-[1.1]">
        This page <em className="italic font-normal">drifted away.</em>
      </h1>
      <p className="text-body-lg text-muted max-w-md mx-auto mb-10 font-light">
        The fragrance you were looking for may have evaporated. Try the collection
        instead.
      </p>
      <Link href="/shop" className="btn-primary">
        Browse the Collection
      </Link>
    </section>
  );
}
