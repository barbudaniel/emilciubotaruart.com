'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Facebook, Linkedin, Instagram, Copy, Check, Mail, QrCode } from 'lucide-react';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { QRCodeSVG } from 'qrcode.react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Mock data
const allArtworks = [
  { 
    id: 1, 
    slug: 'peisaj-romanesc', 
    title: 'Peisaj Românesc', 
    category: 'Pictură', 
    subcategory: 'Peisaj',
    year: '2024', 
    medium: 'Ulei pe pânză', 
    size: '100x80cm',
    price: '2500 EUR',
    description: 'O capturare a frumuseții peisajelor românești în culori calde și vibrante.',
    longDescription: 'Această lucrare explorează frumusețea inconfundabilă a peisajelor românești, cu dealurile sale ondulate și vegetația luxuriantă. Tehnica folosită combină aplicarea stratificată a culorii pentru a crea profunzime și textură.',
    image: '/artwork-landscape-1.jpg',
    additionalImages: ['/artwork-landscape-1.jpg', '/artwork-still-life-1.jpg'],
  },
  {
    id: 2,
    slug: 'golden-textures',
    title: 'Golden Textures',
    category: 'Abstract',
    subcategory: 'Impasto',
    year: '2024',
    medium: 'Ulei pe pânză',
    size: '100x100cm',
    price: '3000 EUR',
    description: 'Lucrare abstractă cu texturi bogate și nuanțe aurii.',
    longDescription: 'O explorare a tehnicii impasto cu aplicații generoase de culoare, creând o suprafață sculptată și texturată care joacă cu lumina.',
    image: '/artwork-impasto-1.jpg',
    additionalImages: ['/artwork-impasto-1.jpg', '/artwork-fluid-1.jpg'],
  },
];

interface ArtDetailProps {
  slug: string;
}

const ArtDetail = ({ slug }: ArtDetailProps) => {
  const router = useRouter();
  const artwork = allArtworks.find(art => art.slug === slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  useFadeUpOnScroll();

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Lucrarea nu a fost găsită</h1>
          <Link href="/painting-art">
            <Button>Înapoi la galerie</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allArtworks.findIndex(art => art.slug === slug);
  const prevArtwork = currentIndex > 0 ? allArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < allArtworks.length - 1 ? allArtworks[currentIndex + 1] : null;

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `${artwork.title} de Emil Ciubotaru`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      instagram: url,
    };
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    // Simulate form submission - in production, this would send to your backend
    setTimeout(() => {
      console.log('Inquiry submitted:', {
        ...formData,
        artwork: {
          title: artwork.title,
          slug: artwork.slug,
          price: artwork.price,
        },
      });
      setFormStatus('success');
      setTimeout(() => {
        setIsDialogOpen(false);
        setFormStatus('idle');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          {/* Back Button */}
          <Link href="/painting-art">
            <Button variant="ghost" className="mb-8 fade-up">
              <ChevronLeft className="mr-2" />
              Înapoi la galerie
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="fade-up">
              <div className="aspect-square overflow-hidden rounded-lg shadow-soft mb-4 cursor-pointer" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {artwork.additionalImages && artwork.additionalImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {artwork.additionalImages.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg cursor-pointer border-2 hover:border-primary transition-colors">
                      <img
                        src={img}
                        alt={`${artwork.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="fade-up">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{artwork.category} • {artwork.subcategory}</p>
                <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
                <p className="text-xl text-muted-foreground">{artwork.year}</p>
              </div>

              <div className="h-px bg-border my-6" />

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mediu</p>
                    <p className="font-medium">{artwork.medium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dimensiuni</p>
                    <p className="font-medium">{artwork.size}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preț</p>
                  <p className="text-2xl font-bold text-primary">{artwork.price}</p>
                </div>
              </div>

              <div className="h-px bg-border my-6" />

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Descriere</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div className="space-y-4">
                <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)}>
                  <Mail className="mr-2 w-5 h-5" />
                  Solicită Informații
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('instagram')}>
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsQRDialogOpen(true)}>
                    <QrCode className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-20 fade-up">
            {prevArtwork ? (
              <Link href={`/art/${prevArtwork.slug}`}>
                <Button variant="outline">
                  <ChevronLeft className="mr-2" />
                  {prevArtwork.title}
                </Button>
              </Link>
            ) : <div />}
            
            {nextArtwork ? (
              <Link href={`/art/${nextArtwork.slug}`}>
                <Button variant="outline">
                  {nextArtwork.title}
                  <ChevronRight className="ml-2" />
                </Button>
              </Link>
            ) : <div />}
          </div>

          {/* Related Works */}
          <div className="mt-20 fade-up">
            <h2 className="text-3xl font-bold mb-8">Lucrări Similare</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {allArtworks
                .filter(art => art.id !== artwork.id)
                .slice(0, 3)
                .map(art => (
                  <Link key={art.id} href={`/art/${art.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">{art.category}</p>
                        <h3 className="font-semibold">{art.title}</h3>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={artwork.additionalImages?.map(img => ({ src: img })) || [{ src: artwork.image }]}
      />

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scanează codul QR pentru a accesa această lucrare direct
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <QRCodeSVG
              value={typeof window !== 'undefined' ? window.location.href : ''}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicită Informații</DialogTitle>
            <DialogDescription>
              Completează formularul pentru a solicita mai multe informații despre această lucrare.
            </DialogDescription>
          </DialogHeader>

          {/* Artwork Summary */}
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex gap-4">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">{artwork.year} • {artwork.medium}</p>
                <p className="text-sm font-semibold text-primary mt-1">{artwork.price}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div>
              <Label htmlFor="inquiry-name">Nume*</Label>
              <Input
                id="inquiry-name"
                required
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1.5"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div>
              <Label htmlFor="inquiry-email">Email*</Label>
              <Input
                id="inquiry-email"
                type="email"
                required
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1.5"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div>
              <Label htmlFor="inquiry-phone">Telefon</Label>
              <Input
                id="inquiry-phone"
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1.5"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div>
              <Label htmlFor="inquiry-message">Mesaj*</Label>
              <Textarea
                id="inquiry-message"
                required
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Spune-ne mai multe despre interesul tău pentru această lucrare..."
                className="mt-1.5 min-h-[100px]"
                disabled={formStatus === 'sending'}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                disabled={formStatus === 'sending'}
              >
                Anulează
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Se trimite...' : 
                 formStatus === 'success' ? 'Trimis!' : 
                 'Trimite'}
              </Button>
            </div>

            {formStatus === 'success' && (
              <p className="text-sm text-green-600 text-center">
                Mesajul a fost trimis cu succes! Vă mulțumim!
              </p>
            )}
            {formStatus === 'error' && (
              <p className="text-sm text-red-600 text-center">
                A apărut o eroare. Vă rugăm să încercați din nou.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ArtDetail;
