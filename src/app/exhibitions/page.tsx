import Exhibitions from '@/screens/Exhibitions';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Expoziții - Emil Ciubotaru',
  description: 'Calendarul expozițiilor, instalațiilor și evenimentelor la care participă Emil Ciubotaru în țară și în străinătate.',
  openGraph: {
    title: 'Expoziții - Emil Ciubotaru',
    description: 'Urmărește expozițiile actuale și trecute ale lui Emil Ciubotaru.',
    type: 'website',
  },
};

export default function ExhibitionsPage() {
  return <Exhibitions />;
}

