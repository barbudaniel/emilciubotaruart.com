import About from '@/screens/About';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Despre Artist - Emil Ciubotaru',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Afla mai multe despre artist si cariera sa',
  openGraph: {
    title: 'Despre Artist - Emil Ciubotaru',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    type: 'profile',
  },
};

export default function AboutPage() {
  return <About />;
}

