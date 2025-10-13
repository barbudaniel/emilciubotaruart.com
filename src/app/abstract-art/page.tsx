import { Suspense } from 'react';
import AbstractArt from '@/screens/AbstractArt';
import { Loader } from '@/components/Loader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artă Abstractă - Emil Ciubotaru',
  description: 'Lorem ipsum dolor sit amet. Explorați colecția de artă abstractă și contemporană',
  openGraph: {
    title: 'Artă Abstractă - Emil Ciubotaru',
    description: 'Colecție de artă abstractă',
    type: 'website',
  },
};

export default function AbstractArtPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AbstractArt />
    </Suspense>
  );
}

