'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

const exhibitions = [
  {
    id: 1,
    title: 'Lumini și Umbre',
    description: 'O expoziție dedicată explorării contrastului în pictura tradițională românească.',
    date: '15 Martie 2024 - 30 Aprilie 2024',
    location: 'Galeria Națională de Artă, București',
    status: 'upcoming',
    image: '/artwork-landscape-1.jpg',
  },
  {
    id: 2,
    title: 'Abstract Emotions',
    description: 'Lucrări abstracte care explorează emoțiile umane prin culoare și textură.',
    date: '10 Ianuarie 2024 - 28 Februarie 2024',
    location: 'Muzeul de Artă Contemporană, Cluj',
    status: 'ongoing',
    image: '/artwork-fluid-1.jpg',
  },
  {
    id: 3,
    title: 'Peisaje Românești',
    description: 'Retrospectivă dedicată frumuseții peisajelor din România.',
    date: '5 Octombrie 2023 - 20 Decembrie 2023',
    location: 'Galeria de Artă Modernă, Brașov',
    status: 'past',
    image: '/artwork-still-life-1.jpg',
  },
];

const Exhibitions = () => {
  useFadeUpOnScroll();

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { text: 'În curând', class: 'bg-blue-100 text-blue-800' },
      ongoing: { text: 'În desfășurare', class: 'bg-green-100 text-green-800' },
      past: { text: 'Încheiat', class: 'bg-gray-100 text-gray-800' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16 fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
              EXPOZIȚII & ACTIVITĂȚI
            </h1>
            <OrnamentalDivider />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperiți expozițiile curente și viitoare, precum și activitățile artistice
            </p>
          </div>

          <div className="space-y-8">
            {exhibitions.map((exhibition) => (
              <Card key={exhibition.id} className="overflow-hidden fade-up">
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={exhibition.image}
                      alt={exhibition.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:col-span-3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold">{exhibition.title}</h3>
                        {getStatusBadge(exhibition.status)}
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {exhibition.description}
                      </p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>{exhibition.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{exhibition.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Upcoming Events Section */}
          <div className="mt-20 fade-up">
            <h2 className="text-3xl font-bold mb-8 text-center">Evenimente Viitoare</h2>
            <OrnamentalDivider />
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Workshop de Pictură</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Învață tehnici de pictură în ulei alături de mine într-un atelier interactiv.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="w-4 h-4" />
                      <span>20 Martie 2024, 14:00</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sesiune de Semnare</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Întâlnire cu colecționarii și iubitorii de artă pentru semnarea lucrărilor.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Clock className="w-4 h-4" />
                      <span>5 Aprilie 2024, 18:00</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exhibitions;
