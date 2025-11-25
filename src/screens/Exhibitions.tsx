"use client";

import Image from "next/image";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useCmsData } from "@/providers/cms-data-provider";

const statusCopy: Record<string, { text: string; className: string }> = {
  upcoming: { text: "În curând", className: "bg-blue-100 text-blue-800" },
  current: { text: "În desfășurare", className: "bg-green-100 text-green-800" },
  archived: { text: "Încheiat", className: "bg-gray-100 text-gray-800" },
};

const Exhibitions = () => {
  useFadeUpOnScroll();
  const {
    data: { expositions },
  } = useCmsData();

  const sorted = [...expositions].sort((a, b) => (a.startDate > b.startDate ? -1 : 1));
  const upcoming = sorted.filter((expo) => expo.status === "upcoming");

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16 fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">EXPOZIȚII & ACTIVITĂȚI</h1>
            <OrnamentalDivider />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperă traseul expozițional, colaborările curatoriale și evenimentele speciale din calendarul meu artistic.
            </p>
          </div>

          <div className="space-y-8">
            {sorted.map((exhibition) => (
              <Card key={exhibition.id} className="overflow-hidden fade-up">
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="relative md:col-span-2 aspect-video md:aspect-auto overflow-hidden">
                    {exhibition.heroImage ? (
                      <Image
                        src={exhibition.heroImage.src}
                        alt={exhibition.heroImage.alt || exhibition.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted" />
                    )}
                  </div>
                  <div className="md:col-span-3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold">{exhibition.title}</h3>
                        <StatusBadge status={exhibition.status} />
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{exhibition.description}</p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>
                          {formatDate(exhibition.startDate)} – {formatDate(exhibition.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>
                          {exhibition.venue}, {exhibition.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-20 fade-up">
            <h2 className="text-3xl font-bold mb-8 text-center">Evenimente Viitoare</h2>
            <OrnamentalDivider />

            {upcoming.length === 0 ? (
              <p className="text-center text-muted-foreground mt-10">Nu sunt programate evenimente viitoare în acest moment.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                {upcoming.map((event) => (
                  <Card key={event.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(event.startDate)} • {event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exhibitions;

const StatusBadge = ({ status }: { status: string }) => {
  const meta = statusCopy[status] ?? statusCopy.archived;
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${meta.className}`}>{meta.text}</span>;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric" });
}
