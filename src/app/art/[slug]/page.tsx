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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    openGraph: {
      title: `${title} - Emil Ciubotaru`,
      description: 'Lucrare de artă de Emil Ciubotaru',
      type: 'article',
    },
  };
}

export default async function ArtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArtDetail slug={slug} />;
}

