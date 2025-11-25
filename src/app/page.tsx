import Home from '@/screens/Home';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Emil Ciubotaru - Artist & Pictor',
  description: 'Explorați universul cromatic al lui Emil Ciubotaru: picturi figurative, abstracții vibrante și povești pictate în straturi bogate.',
  keywords: ['artă', 'pictură', 'Emil Ciubotaru', 'galerie', 'artist'],
  openGraph: {
    title: 'Emil Ciubotaru - Artist & Pictor',
    description: 'Galeria oficială a lui Emil Ciubotaru îmbină pictura figurativă cu experimente abstracte pline de texturi și lumină.',
    type: 'website',
  },
};

export default function HomePage() {
  return <Home />;
}
