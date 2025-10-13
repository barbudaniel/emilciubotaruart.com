import Contact from '@/screens/Contact';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact - Emil Ciubotaru',
  description: 'Lorem ipsum dolor sit amet. Contactează artistul pentru comenzi și colaborări',
  openGraph: {
    title: 'Contact - Emil Ciubotaru',
    description: 'Contactează artistul',
    type: 'website',
  },
};

export default function ContactPage() {
  return <Contact />;
}

