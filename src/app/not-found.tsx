import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Pagina nu a fost găsită</h2>
        <p className="text-muted-foreground mb-8">
          Ne pare rău, dar pagina pe care o căutați nu există.
        </p>
        <Link href="/">
          <Button>Înapoi la pagina principală</Button>
        </Link>
      </div>
    </div>
  );
}

