import { Suspense } from 'react';
import AbstractArt from '@/screens/AbstractArt';
import { Loader } from '@/components/Loader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artă Abstractă - Emil Ciubotaru',
  description: 'Texturi dense, straturi vibrante și abstracții care transformă emoțiile lui Emil Ciubotaru în hărți de culoare.',
  openGraph: {
    title: 'Artă Abstractă - Emil Ciubotaru',
    description: 'Explorați universul abstract al lui Emil Ciubotaru, unde culorile devin ritm și memorie.',
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

