import { Suspense } from 'react';
import PaintingArt from '@/screens/PaintingArt';
import { Loader } from '@/components/Loader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artă Pictură - Emil Ciubotaru',
  description: 'Lorem ipsum dolor sit amet. Explorați colecția de picturi tradiționale',
  openGraph: {
    title: 'Artă Pictură - Emil Ciubotaru',
    description: 'Colecție de picturi tradiționale',
    type: 'website',
  },
};

export default function PaintingArtPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaintingArt />
    </Suspense>
  );
}

