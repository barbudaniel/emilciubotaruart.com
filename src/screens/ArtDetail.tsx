"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Copy, Facebook, Instagram, Linkedin, Mail, QrCode, Check } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { QRCodeSVG } from "qrcode.react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { useCmsData } from "@/providers/cms-data-provider";
import type { Artwork, MediaAsset } from "@/lib/cms";

interface ArtDetailProps {
  slug: string;
}

const ArtDetail = ({ slug }: ArtDetailProps) => {
  useFadeUpOnScroll();
  const {
    data: {
      artLibrary: { artworks },
    },
  } = useCmsData();

  const artwork = artworks.find((art) => art.slug === slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const galleryAssets: MediaAsset[] = useMemo(() => {
    if (!artwork) {
      return [];
    }
    const assets = [artwork.heroImage, ...artwork.gallery.map((image) => image.asset)];
    const deduped = new Map(assets.map((asset) => [asset.id, asset]));
    return Array.from(deduped.values());
  }, [artwork]);

  const relatedArtworks = useMemo(() => (artwork ? getRelatedArtworks(artwork, artworks) : []), [artwork, artworks]);

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex flex-1 items-center justify-center px-4 text-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Galerie</p>
            <h1 className="mt-3 text-4xl font-bold">Lucrarea nu a fost găsită</h1>
            <p className="mt-2 text-muted-foreground">Se poate să fi fost mutată sau redenumită.</p>
            <Button className="mt-6" asChild>
              <Link href="/painting-art">Înapoi la galerie</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentIndex = artworks.findIndex((art) => art.id === artwork.id);
  const prevArtwork = currentIndex > 0 ? artworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < artworks.length - 1 ? artworks[currentIndex + 1] : null;

  const materials = artwork.materials.join(", ") || "Mixed media";
  const dimensions = `${artwork.dimensions.width}x${artwork.dimensions.height}${artwork.dimensions.unit}`;
  const priceLabel =
    artwork.pricing?.amount && artwork.pricing.isAvailable
      ? formatPrice(artwork.pricing.amount, artwork.pricing.currency)
      : artwork.pricing?.notes || "Disponibil la cerere";

  const handleShare = async (platform: "facebook" | "linkedin" | "instagram" | "copy") => {
    if (platform === "copy") {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const url = encodeURIComponent(window.location.href);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      instagram: url,
    };

    window.open(shareUrls[platform], "_blank");
  };

  const handleSubmitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => {
        setIsDialogOpen(false);
        setFormStatus("idle");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 2000);
    }, 1000);
  };

  const qrValue = artwork.qrCode?.targetUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <Link href="/painting-art">
            <Button variant="ghost" className="mb-8 fade-up">
              <ChevronLeft className="mr-2" />
              Înapoi la galerie
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="fade-up">
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-soft mb-4">
                <Image
                  src={artwork.heroImage.src}
                  alt={artwork.heroImage.alt || artwork.title}
                  fill
                  className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                />
              </div>
              {galleryAssets.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryAssets.map((asset, index) => (
                    <button
                      key={asset.id}
                      type="button"
                      className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <Image src={asset.src} alt={asset.alt || artwork.title} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="fade-up">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {artwork.collection || artwork.category} • {artwork.style || artwork.year}
                </p>
                <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
                <p className="text-xl text-muted-foreground">{artwork.year}</p>
              </div>

              <div className="h-px bg-border my-6" />

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mediu</p>
                    <p className="font-medium">{materials}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dimensiuni</p>
                    <p className="font-medium">{dimensions}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preț</p>
                  <p className="text-2xl font-bold text-primary">{priceLabel}</p>
                </div>
              </div>

              <div className="h-px bg-border my-6" />

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Descriere</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{artwork.summary || "Descriere în curs de actualizare."}</p>
              </div>

              <div className="space-y-4">
                <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)}>
                  <Mail className="mr-2 w-5 h-5" />
                  Solicită informații
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}>
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")}>
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare("instagram")}>
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleShare("copy")}>
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsQRDialogOpen(true)}>
                    <QrCode className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-20 fade-up">
            {prevArtwork ? (
              <Link href={`/art/${prevArtwork.slug}`}>
                <Button variant="outline">
                  <ChevronLeft className="mr-2" />
                  {prevArtwork.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextArtwork ? (
              <Link href={`/art/${nextArtwork.slug}`}>
                <Button variant="outline">
                  {nextArtwork.title}
                  <ChevronRight className="ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-20 fade-up">
            <h2 className="text-3xl font-bold mb-8">Lucrări similare</h2>
            {relatedArtworks.length === 0 ? (
              <p className="text-muted-foreground">Nu există încă lucrări similare configurate.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArtworks.map((art) => (
                  <Link key={art.id} href={`/art/${art.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square overflow-hidden">
                        <Image src={art.heroImage.src} alt={art.heroImage.alt || art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">{art.collection || art.category}</p>
                        <h3 className="font-semibold">{art.title}</h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryAssets.map((asset) => ({ src: asset.src }))}
      />

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cod QR</DialogTitle>
            <DialogDescription>Printează sau distribuie codul pentru această lucrare.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <QRCodeSVG value={qrValue} size={256} level="H" includeMargin />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicită informații</DialogTitle>
            <DialogDescription>Completează formularul pentru a primi detalii suplimentare.</DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded">
                <Image src={artwork.heroImage.src} alt={artwork.heroImage.alt || artwork.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {artwork.year} • {materials}
                </p>
                <p className="text-sm font-semibold text-primary mt-1">{priceLabel}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div>
              <Label htmlFor="inquiry-name">Nume*</Label>
              <Input
                id="inquiry-name"
                required
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="mt-1.5"
                disabled={formStatus === "sending"}
              />
            </div>
            <div>
              <Label htmlFor="inquiry-email">Email*</Label>
              <Input
                id="inquiry-email"
                type="email"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="mt-1.5"
                disabled={formStatus === "sending"}
              />
            </div>
            <div>
              <Label htmlFor="inquiry-phone">Telefon</Label>
              <Input
                id="inquiry-phone"
                type="tel"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="mt-1.5"
                disabled={formStatus === "sending"}
              />
            </div>
            <div>
              <Label htmlFor="inquiry-message">Mesaj*</Label>
              <Textarea
                id="inquiry-message"
                required
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                placeholder="Spune-ne mai multe despre interesul tău pentru această lucrare..."
                className="mt-1.5 min-h-[100px]"
                disabled={formStatus === "sending"}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1" disabled={formStatus === "sending"}>
                Anulează
              </Button>
              <Button type="submit" className="flex-1" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Se trimite..." : formStatus === "success" ? "Trimis!" : "Trimite"}
              </Button>
            </div>
            {formStatus === "success" && <p className="text-sm text-green-600 text-center">Mesajul a fost trimis cu succes.</p>}
            {formStatus === "error" && <p className="text-sm text-red-600 text-center">A apărut o eroare. Încercă din nou.</p>}
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ArtDetail;

function getRelatedArtworks(artwork: Artwork, artworks: Artwork[]) {
  if (artwork.related.mode === "manual" && artwork.related.manualIds.length > 0) {
    return artwork.related.manualIds
      .map((id) => artworks.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is Artwork => Boolean(candidate));
  }

  const autoTags = artwork.related.autoTags.map((tag) => tag.toLowerCase());
  return artworks
    .filter(
      (candidate) =>
        candidate.id !== artwork.id &&
        (candidate.collection === artwork.collection ||
          candidate.style === artwork.style ||
          autoTags.some((tag) => candidate.collection?.toLowerCase().includes(tag) || candidate.style?.toLowerCase().includes(tag))),
    )
    .slice(0, 3);
}

function formatPrice(amount: number, currencyCode = "EUR") {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: currencyCode }).format(amount);
}
