import About from '@/screens/About';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Despre Artist - Emil Ciubotaru',
  description: 'Biografia și manifestul artistic al lui Emil Ciubotaru: povești pictate în straturi bogate, florile care nu se ofilesc și orașele scăldate în lumină.',
  openGraph: {
    title: 'Despre Artist - Emil Ciubotaru',
    description: 'Descoperă povestea, tehnica și inspirațiile lui Emil Ciubotaru, artist vizual din România.',
    type: 'profile',
  },
};

export default function AboutPage() {
  return <About />;
}

