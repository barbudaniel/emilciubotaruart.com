"use client";

import { useState, type ComponentType } from "react";
import { Mail, Phone, MapPin, MessageSquare, Instagram, Dribbble, Linkedin, Facebook, Twitter, Globe, Youtube } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { useFadeUpOnScroll } from "@/hooks/useFadeUpOnScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCmsData } from "@/providers/cms-data-provider";
import { useToast } from "@/components/ui/use-toast";

const socialIconMap: Record<string, ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  behance: Dribbble,
  dribbble: Dribbble,
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    regarding: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const {
    data: {
      siteIdentity: { contact, socialLinks },
    },
  } = useCmsData();

  useFadeUpOnScroll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        toast({
          title: "Mesaj trimis cu succes!",
          description: "Vă vom răspunde cât mai curând posibil.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          regarding: "",
          message: "",
        });

        // Reset success status after 5 seconds
        setTimeout(() => {
          setStatus("idle");
        }, 5000);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Nu s-a putut trimite mesajul. Încercați din nou.");
        toast({
          title: "Eroare la trimiterea mesajului",
          description: result.error || "Nu s-a putut trimite mesajul. Încercați din nou.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("A apărut o eroare neașteptată. Vă rugăm să încercați din nou.");
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">{contact.headline || "Contact"}</h1>
              <OrnamentalDivider />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {contact.subheading || "Sunt încântat să discut despre artă și să răspund întrebărilor tale."}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8 fade-up">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Informații de Contact</h2>
                  <OrnamentalDivider />
                </div>

                <div className="space-y-6">
                  {contact.channels.map((channel) => (
                    <div key={channel.id} className="flex items-start gap-4">
                      {getChannelIcon(channel.type)}
                      <div>
                        <h3 className="font-semibold mb-1">{channel.label}</h3>
                        {channel.type === "email" ? (
                          <a href={`mailto:${channel.value}`} className="text-muted-foreground hover:text-primary transition-colors">
                            {channel.value}
                          </a>
                        ) : channel.type === "phone" ? (
                          <a href={`tel:${channel.value}`} className="text-muted-foreground hover:text-primary transition-colors">
                            {channel.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{channel.value}</p>
                        )}
                        {channel.note && <p className="text-xs text-muted-foreground mt-1">{channel.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Social Media</h3>
                  <div className="flex gap-3 flex-wrap">
                    {socialLinks
                      .filter((link) => link.isVisible)
                      .map((link) => {
                        const Icon = socialIconMap[link.platform.toLowerCase()] ?? Globe;
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label={link.label}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{link.label}</span>
                          </a>
                        );
                      })}
                  </div>
                </div>

                {/* <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Program de Vizitare</h3>
                  <p className="text-muted-foreground text-sm">Atelierul poate fi vizitat doar cu programare prealabilă.</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {contact.studioHours.map((entry) => (
                      <li key={entry.id} className="flex items-center justify-between">
                        <span>{entry.label}</span>
                        <span>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                </div> */}

                {/* {contact.mapEmbedUrl && (
                  <div className="rounded-lg overflow-hidden border">
                    <iframe src={contact.mapEmbedUrl} title="Locație atelier" className="w-full h-64" loading="lazy" allowFullScreen />
                  </div>
                )} */}
              </div>

              <div className="fade-up">
                <div className="bg-card p-8 rounded-lg shadow-soft border">
                  <h2 className="text-2xl font-bold mb-6">Trimite un Mesaj</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nume*</Label>
                        <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="email">Adresă Email*</Label>
                        <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Număr de Telefon</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="regarding">În legătură cu*</Label>
                        <Input id="regarding" required value={formData.regarding} onChange={(e) => setFormData({ ...formData, regarding: e.target.value })} className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Mesaj*</Label>
                      <Textarea id="message" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="mt-2 min-h-[150px]" />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
                      {status === "sending" ? "Se trimite..." : "Trimite Mesajul"}
                    </Button>

                    {status === "success" && <p className="text-green-600 text-center font-semibold">✓ Mesajul a fost trimis cu succes! Vă vom răspunde în curând.</p>}
                    {status === "error" && errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
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

function getChannelIcon(type: string) {
  const classes = "w-6 h-6 mt-1 text-primary";
  if (type === "email") return <Mail className={classes} />;
  if (type === "phone") return <Phone className={classes} />;
  if (type === "location") return <MapPin className={classes} />;
  return <MessageSquare className={classes} />;
}
