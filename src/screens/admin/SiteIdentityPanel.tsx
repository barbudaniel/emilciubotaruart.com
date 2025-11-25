"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { createId } from "@/lib/utils";
import { SiteIdentity, siteIdentitySchema } from "@/lib/cms";
import { useCmsData } from "@/providers/cms-data-provider";

import { NavigationEditor } from "./components/NavigationEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";

const siteIdentityFormSchema = siteIdentitySchema.pick({
  logo: true,
  socialLinks: true,
});

type SiteIdentityFormValues = z.infer<typeof siteIdentityFormSchema>;

export const SiteIdentityPanel = () => {
  const { data, status, updateSiteIdentity } = useCmsData();

  const form = useForm<SiteIdentityFormValues>({
    resolver: zodResolver(siteIdentityFormSchema),
    mode: "onChange",
    defaultValues: extractEditableValues(data.siteIdentity),
  });

  const socialFieldArray = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  useEffect(() => {
    form.reset(extractEditableValues(data.siteIdentity));
  }, [data.siteIdentity, form]);

  const handleSubmit = (values: SiteIdentityFormValues) => {
    updateSiteIdentity((prev) => ({
      ...prev,
      logo: values.logo,
      socialLinks: values.socialLinks,
    }));

    toast({
      title: "Salvat",
      description: "Site Identity a fost actualizat în draftul local.",
    });
  };

  const isDisabled = status !== "ready" || form.formState.isSubmitting;

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
          <CardDescription>Se încarcă datele din spațiul local...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Controlează lockup-ul, tagline-ul și imaginea principală.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[320px,1fr]">
              <div className="rounded-lg border bg-muted/30 p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-40">
                  <Image
                    src={form.watch("logo.src") || "/logo.svg"}
                    alt={form.watch("logo.alt") || "Previzualizare logo"}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{form.watch("logo.lockupText") || "Previzualizare logo"}</p>
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="logo.lockupText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lockup text</FormLabel>
                      <FormControl>
                        <Input placeholder="Emil Ciubotaru" {...field} />
                      </FormControl>
                      <FormDescription>Apare lângă siglă.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo.tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input placeholder="Pictură & Artă Abstractă" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="logo.src"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagine Logo</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="/logo.svg" {...field} className="flex-1" />
                        </FormControl>
                        <MediaUploader
                          label="Upload"
                          directory="logo"
                          onUploaded={(url) => form.setValue("logo.src", url, { shouldDirty: true })}
                        />
                      </div>
                      <FormDescription>URL sau calea din /public.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="logo.alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt text</FormLabel>
                        <FormControl>
                          <Input placeholder="Logo Emil Ciubotaru" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={isDisabled}>
                Salvează identitatea
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social media</CardTitle>
              <CardDescription>Adaugă sau ascunde link-urile către platformele active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialFieldArray.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-medium">{form.watch(`socialLinks.${index}.label`) || "Platformă"}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Vizibil</span>
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.isVisible`}
                        render={({ field }) => (
                          <FormItem className="mb-0 flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive hover:text-destructive"
                      onClick={() => socialFieldArray.remove(index)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Elimină
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platformă</FormLabel>
                          <FormControl>
                            <Input placeholder="Instagram" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Instagram" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.handle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Handle (opțional)</FormLabel>
                          <FormControl>
                            <Input placeholder="@emil" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  socialFieldArray.append({
                    id: createId("social"),
                    platform: "Platformă",
                    label: "Nou link",
                    url: "https://",
                    handle: "",
                    isVisible: true,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adaugă link
              </Button>
            </CardContent>
          </Card>

        </form>
      </Form>

      <NavigationEditor
        items={data.siteIdentity.navigation}
        onChange={(next) =>
          updateSiteIdentity((prev) => ({
            ...prev,
            navigation: next,
          }))
        }
      />
    </div>
  );
};

function extractEditableValues(siteIdentity: SiteIdentity): SiteIdentityFormValues {
  return {
    logo: siteIdentity.logo,
    socialLinks: siteIdentity.socialLinks,
  };
}
