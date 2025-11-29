"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/utils";
import type { AboutContent } from "@/lib/cms";
import { useCmsData } from "@/providers/cms-data-provider";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const AboutPanel = () => {
  const {
    data: {
      homepage: { about },
    },
    updateHomepage,
  } = useCmsData();

  const handleAboutChange = (patch: Partial<AboutContent>) => {
    updateHomepage((prev) => ({
      ...prev,
      about: { ...prev.about, ...patch },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Emil Ciubotaru</CardTitle>
        <CardDescription>Editează textul biografic și imaginea de prezentare.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Headline</label>
            <Input 
              value={about.headline} 
              onChange={(event) => handleAboutChange({ headline: event.target.value })} 
              placeholder="ex: Despre Artist"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Rezumat (opțional)</label>
            <Input 
              value={about.summary} 
              onChange={(event) => handleAboutChange({ summary: event.target.value })} 
              placeholder="Scurtă descriere pentru homepage..."
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Biografie / Content</label>
            <Textarea 
              value={about.content} 
              onChange={(event) => handleAboutChange({ content: event.target.value })} 
              className="min-h-[500px] font-mono text-base"
              placeholder="Scrie povestea aici..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">Imagine Profil</label>
            <div className="overflow-hidden rounded-lg border bg-muted/40">
              {about.image?.src ? (
                <div className="relative aspect-[3/4] w-full">
                  <Image 
                    src={about.image.src} 
                    alt={about.image.alt || "Portrait"} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center text-sm text-muted-foreground">
                  Fără imagine
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={about.image?.src ?? ""}
                onChange={(event) =>
                  handleAboutChange({
                    image: event.target.value
                      ? {
                          id: about.image?.id ?? createId("about-image"),
                          type: "image",
                          src: event.target.value,
                          alt: about.image?.alt ?? "Portrait",
                        }
                      : undefined,
                  })
                }
                placeholder="URL imagine..."
                className="flex-1"
              />
              <MediaUploader
                label="Upload"
                directory="about"
                onUploaded={(url) =>
                  handleAboutChange({
                    image: {
                      id: about.image?.id ?? createId("about-image"),
                      type: "image",
                      src: url,
                      alt: about.image?.alt ?? "Portrait",
                    },
                  })
                }
              />
            </div>
            
            {about.image && (
               <Button
                  variant="outline"
                  onClick={() => handleAboutChange({ image: undefined })}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Șterge imaginea
                </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
