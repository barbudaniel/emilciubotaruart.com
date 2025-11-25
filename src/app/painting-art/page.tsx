import { Suspense } from 'react';
import PaintingArt from '@/screens/PaintingArt';
import { Loader } from '@/components/Loader';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artă Pictură - Emil Ciubotaru',
  description: 'Selecție de peisaje, flori și scene figurative în care culoarea devine poveste și memoria respiră prin fiecare tușă.',
  openGraph: {
    title: 'Artă Pictură - Emil Ciubotaru',
    description: 'Descoperă picturile figurative și poetice ale lui Emil Ciubotaru, realizate în ulei, acrilic și tehnici mixte.',
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

