"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";

type MediaUploaderProps = {
  onUploaded: (url: string) => void;
  directory?: string;
  label?: string;
  accept?: string;
};

const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || process.env.SUPABASE_BUCKET_NAME || "artwork-images";

export const MediaUploader = ({ onUploaded, directory = "media", label = "Încarcă imagine", accept = "image/*" }: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const client = getSupabaseClient();
    if (!client || !bucket) {
      toast({ title: "Supabase nu este configurat", description: "Adaugă cheile NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY.", variant: "destructive" });
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });
      // Sanitize filename: remove special chars, replace spaces, normalize
      const sanitizedName = compressed.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[''""`,;:!?()[\]{}]/g, "") // Remove quotes and punctuation
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/[^a-zA-Z0-9._-]/g, "") // Keep only safe chars
        .replace(/-+/g, "-") // Collapse multiple dashes
        .replace(/^-|-$/g, ""); // Trim leading/trailing dashes
      const filePath = `${directory}/${Date.now()}-${sanitizedName || "image"}`;

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("bucket", bucket);
      formData.append("path", filePath);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { url } = await response.json();

      onUploaded(url);
      toast({ title: "Fișier încărcat", description: "Link-ul a fost aplicat automat." });
    } catch (err) {
      console.error(err);
      toast({ title: "Încărcarea a eșuat", description: err instanceof Error ? err.message : "Încearcă din nou.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" asChild disabled={isUploading}>
        <label className="cursor-pointer">
          <input type="file" className="sr-only" accept={accept} onChange={handleChange} />
          <span className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            {isUploading ? "Se încarcă..." : label}
          </span>
        </label>
      </Button>
    </div>
  );
};
