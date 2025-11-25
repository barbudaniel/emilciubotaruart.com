import Contact from '@/screens/Contact';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact - Emil Ciubotaru',
  description: 'Programează o vizită în atelier, solicită o lucrare personalizată sau cere detalii despre o piesă semnată de Emil Ciubotaru.',
  openGraph: {
    title: 'Contact - Emil Ciubotaru',
    description: 'Ia legătura cu atelierul lui Emil Ciubotaru pentru comenzi, expoziții și colaborări artistice.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <Contact />;
}

