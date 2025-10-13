import Exhibitions from '@/screens/Exhibitions';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Expoziții - Emil Ciubotaru',
  description: 'Lorem ipsum dolor sit amet. Descoperiți expozițiile și evenimentele artistului',
  openGraph: {
    title: 'Expoziții - Emil Ciubotaru',
    description: 'Expoziții și evenimente',
    type: 'website',
  },
};

export default function ExhibitionsPage() {
  return <Exhibitions />;
}

