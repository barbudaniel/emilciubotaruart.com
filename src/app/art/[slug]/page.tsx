import ArtDetail from '@/screens/ArtDetail';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${title} - Emil Ciubotaru`,
    description: `Descoperă detaliile lucrării „${title}” semnată de Emil Ciubotaru: materiale, dimensiuni și povestea culorilor sale.`,
    openGraph: {
      title: `${title} - Emil Ciubotaru`,
      description: `Lucrare originală de Emil Ciubotaru din seria sa de picturi și abstracții picturale.`,
      type: 'article',
    },
  };
}

export default async function ArtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArtDetail slug={slug} />;
}

