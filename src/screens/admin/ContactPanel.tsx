"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCmsData } from "@/providers/cms-data-provider";
import { contactSchema } from "@/lib/cms";
import { z } from "zod";
import { createId } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const contactFormSchema = contactSchema;

const channelTypeOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefon" },
  { value: "location", label: "Adresă" },
  { value: "social", label: "Social" },
  { value: "other", label: "Alt tip" },
];

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactPanel = () => {
  const { data, status, updateSiteIdentity } = useCmsData();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: data.siteIdentity.contact,
  });

  const channelFieldArray = useFieldArray({
    control: form.control,
    name: "channels",
  });

  const studioFieldArray = useFieldArray({
    control: form.control,
    name: "studioHours",
  });

  useEffect(() => {
    form.reset(data.siteIdentity.contact);
  }, [data.siteIdentity.contact, form]);

  const handleSubmit = (values: ContactFormValues) => {
    updateSiteIdentity((prev) => ({
      ...prev,
      contact: values,
    }));

    toast({
      title: "Salvat",
      description: "Pagina de contact a fost actualizată.",
    });
  };

  const isDisabled = status !== "ready" || form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagina de Contact</CardTitle>
        <CardDescription>Editează headline-ul, canalele de contact și programul atelierului.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titlu principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Contactează atelierul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subheading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitlu</FormLabel>
                    <FormControl>
                      <Input placeholder="Disponibil pentru comenzi, expoziții și colaborări" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mapEmbedUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embed Google Maps (opțional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.google.com/maps/embed?..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Canale de contact</h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    channelFieldArray.append({
                      id: createId("channel"),
                      type: "email",
                      label: "Email",
                      value: "",
                      note: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă canal
                </Button>
              </div>

              {channelFieldArray.fields.length === 0 && (
                <p className="text-sm text-muted-foreground">Nu există canale configurate momentan.</p>
              )}

              <div className="space-y-4">
                {channelFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <FormField
                        control={form.control}
                        name={`channels.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="min-w-[160px] flex-1">
                            <FormLabel>Tip</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Alege tipul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {channelTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => channelFieldArray.remove(index)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Elimină
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`channels.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`channels.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valoare</FormLabel>
                            <FormControl>
                              <Input placeholder="hello@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`channels.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notă (opțional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Răspund rapid" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Program atelier</h4>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    studioFieldArray.append({
                      id: createId("hours"),
                      label: "Interval",
                      value: "10:00 - 18:00",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă interval
                </Button>
              </div>

              {studioFieldArray.fields.length === 0 && <p className="text-sm text-muted-foreground">Nu există intervale definite.</p>}

              <div className="space-y-4">
                {studioFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`studioHours.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Luni - Vineri" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name={`studioHours.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Interval</FormLabel>
                            <FormControl>
                              <Input placeholder="10:00 - 18:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => studioFieldArray.remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isDisabled}>
              Salvează pagina de contact
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

