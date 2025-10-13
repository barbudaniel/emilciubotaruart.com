import Home from '@/screens/Home';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Emil Ciubotaru - Artist & Pictor',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explorați colecția de picturi și lucrări abstract',
  keywords: ['artă', 'pictură', 'Emil Ciubotaru', 'galerie', 'artist'],
  openGraph: {
    title: 'Emil Ciubotaru - Artist & Pictor',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    type: 'website',
  },
};

export default function HomePage() {
  return <Home />;
}
