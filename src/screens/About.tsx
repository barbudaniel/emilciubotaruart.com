'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const About = () => {
  useFadeUpOnScroll();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          {/* Hero Portrait */}
          <div className="flex justify-center mb-12 fade-up">
            <div className="relative w-96 h-96 rounded-full overflow-hidden shadow-soft">
              <img
                src="/portrait.jpg"
                alt="Emil Ciubotaru"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 fade-up tracking-wide">
            SALUT!
          </h1>
          
          <OrnamentalDivider />

          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto fade-up text-muted-foreground">
              <p className="text-xl leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4 text-foreground">Despre Mine</h2>
              <OrnamentalDivider />
              
              <p className="leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <p className="leading-relaxed mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4 text-foreground">Filozofia Mea</h2>
              <OrnamentalDivider />
              
              <p className="leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-4 text-foreground">Expoziții & Recunoașteri</h2>
              <OrnamentalDivider />
              
              <ul className="list-disc list-inside space-y-2 mb-8">
                <li>Lorem ipsum dolor - Sit amet consectetur (2023)</li>
                <li>Adipiscing elit sed - Do eiusmod tempor (2022)</li>
                <li>Incididunt ut labore - Et dolore magna aliqua (2021)</li>
                <li>Ut enim ad minim - Veniam quis nostrud (2020)</li>
              </ul>

              <div className="mt-12 text-center fade-up">
                <Button size="lg">
                  <Download className="mr-2" />
                  Descarcă CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
