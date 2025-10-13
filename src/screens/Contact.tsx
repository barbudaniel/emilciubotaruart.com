'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { useFadeUpOnScroll } from '@/hooks/useFadeUpOnScroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    regarding: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useFadeUpOnScroll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        regarding: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
                CONTACT
              </h1>
              <OrnamentalDivider />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sunt încântat să discut despre artă și să răspund întrebărilor dumneavoastră
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8 fade-up">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Informații de Contact</h2>
                  <OrnamentalDivider />
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:contact@emilciubotaru.ro" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@emilciubotaru.ro
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold mb-1">Telefon</h3>
                      <a href="tel:+40123456789" className="text-muted-foreground hover:text-primary transition-colors">
                        +40 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-semibold mb-1">Atelier</h3>
                      <p className="text-muted-foreground">
                        București, România
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Social Media</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Program de Vizitare</h3>
                  <p className="text-muted-foreground text-sm">
                    Atelierul poate fi vizitat doar cu programare prealabilă. 
                    Vă rugăm să mă contactați pentru a stabili o întâlnire.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="fade-up">
                <div className="bg-card p-8 rounded-lg shadow-soft border">
                  <h2 className="text-2xl font-bold mb-6">Trimite un Mesaj</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nume*</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Adresă Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Număr de Telefon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="regarding">În legătură cu*</Label>
                        <Input
                          id="regarding"
                          required
                          value={formData.regarding}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, regarding: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Mesaj*</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                        className="mt-2 min-h-[150px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Se trimite...' : 'Trimite Mesajul'}
                    </Button>

                    {status === 'success' && (
                      <p className="text-green-600 text-center">
                        Mesajul a fost trimis cu succes! Vă mulțumesc!
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="text-red-600 text-center">
                        A apărut o eroare. Vă rugăm să încercați din nou.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
