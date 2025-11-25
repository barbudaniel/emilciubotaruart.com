"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Mail, Phone, User, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPageActions } from "@/components/admin/AdminPageActions";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  regarding: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  notes?: string;
  created_at: string;
  updated_at: string;
  date: string; // Normalized date string for grouping if needed
};

export default function MessagesPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const loadSubmissions = useCallback(
    async (retainSelectedId?: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/contact-submissions", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Nu s-au putut încărca mesajele.");
        }

        const fetched = (result.data as ContactSubmission[]) || [];
        setSubmissions(fetched);

        if (fetched.length === 0) {
          setSelectedSubmission(null);
          setEditingNotes("");
          return;
        }

        const selectionId = retainSelectedId ?? fetched[0]?.id;
        const nextSelection = fetched.find((submission) => submission.id === selectionId) ?? fetched[0];
        setSelectedSubmission(nextSelection ?? null);
        setEditingNotes(nextSelection?.notes || "");
      } catch (error) {
        console.error("[ContactSubmissions] Load error:", error);
        toast({
          title: "Eroare la încărcarea mesajelor",
          description:
            error instanceof Error
              ? error.message
              : "Nu s-au putut încărca mesajele. Verificați dacă sunteți autentificat ca admin.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const updateSubmission = async (
    id: string,
    payload: { status: ContactSubmission["status"]; notes?: string },
    successMessage: { title: string; description: string },
  ) => {
    setUpdatingStatus(true);
    try {
      const body: Record<string, unknown> = { status: payload.status };
      if (payload.notes !== undefined) {
        body.notes = payload.notes;
      }

      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Nu s-a putut actualiza mesajul.");
      }

      const updated = result.data as ContactSubmission;
      setSubmissions((prev) => prev.map((submission) => (submission.id === id ? updated : submission)));
      setSelectedSubmission(updated);
      setEditingNotes(updated.notes || "");
      toast(successMessage);
      return true;
    } catch (error) {
      toast({
        title: "Eroare",
        description:
          error instanceof Error ? error.message : "Nu s-a putut actualiza mesajul. Verificați conexiunea și încercați din nou.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateSubmission(
      id,
      { status: newStatus as ContactSubmission["status"] },
      {
        title: "Actualizat",
        description: "Statusul a fost actualizat cu succes.",
      },
    );
  };

  const handleSaveNotes = async (id: string, status: string) => {
    const success = await updateSubmission(
      id,
      { status: status as ContactSubmission["status"], notes: editingNotes },
      {
        title: "Salvat",
        description: "Notițele au fost salvate cu succes.",
      },
    );

    if (!success) {
      await loadSubmissions(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-500";
      case "read":
        return "bg-yellow-500";
      case "replied":
        return "bg-green-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "unread":
        return "Necitit";
      case "read":
        return "Citit";
      case "replied":
        return "Răspuns";
      case "archived":
        return "Arhivat";
      default:
        return status;
    }
  };

  const headerSubtitle =
    submissions.length === 0
      ? "Gestionează mesajele primite prin formularul de contact."
      : `${submissions.length} ${submissions.length === 1 ? "mesaj" : "mesaje"} în căsuță`;

  return (
    <>
      <AdminHeader
        title="Mesaje de Contact"
        subtitle={headerSubtitle}
        actions={<AdminPageActions />}
      />
      <div className="p-6">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Submissions List */}
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">Nu există mesaje de contact</p>
                  </CardContent>
                </Card>
              ) : (
                submissions.map((submission) => (
                  <Card
                    key={submission.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedSubmission?.id === submission.id ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setEditingNotes(submission.notes || "");
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-4 w-4" />
                            {submission.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{submission.email}</p>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {getStatusLabel(submission.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-sm font-semibold">Subiect: {submission.regarding}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{submission.message}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(submission.created_at), {
                            addSuffix: true,
                            locale: ro,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Submission Details */}
            <div className="sticky top-6 h-fit">
              {selectedSubmission ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Detalii Mesaj</CardTitle>
                      <Badge className={getStatusColor(selectedSubmission.status)}>
                        {getStatusLabel(selectedSubmission.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Nume:</span>
                        <span>{selectedSubmission.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Email:</span>
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                      {selectedSubmission.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Telefon:</span>
                          <a
                            href={`tel:${selectedSubmission.phone}`}
                            className="text-primary hover:underline"
                          >
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Subiect:</span>
                        <span>{selectedSubmission.regarding}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <Label className="mb-2 block text-sm font-semibold">Mesaj:</Label>
                      <p className="whitespace-pre-wrap text-sm">{selectedSubmission.message}</p>
                    </div>

                    {/* Status Update */}
                    <div className="border-t pt-4">
                      <Label htmlFor="status" className="mb-2 block">
                        Actualizează Status
                      </Label>
                      <Select
                        value={selectedSubmission.status}
                        onValueChange={(value) =>
                          handleStatusChange(selectedSubmission.id, value)
                        }
                        disabled={updatingStatus}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unread">Necitit</SelectItem>
                          <SelectItem value="read">Citit</SelectItem>
                          <SelectItem value="replied">Răspuns</SelectItem>
                          <SelectItem value="archived">Arhivat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="mb-2 block">
                        Notițe
                      </Label>
                      <Textarea
                        id="notes"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Adaugă notițe despre acest mesaj..."
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={() =>
                          handleSaveNotes(selectedSubmission.id, selectedSubmission.status)
                        }
                        disabled={updatingStatus}
                        className="mt-2"
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Se salvează...
                          </>
                        ) : (
                          "Salvează Notițele"
                        )}
                      </Button>
                    </div>

                    {/* Timestamps */}
                    <div className="border-t pt-4 text-xs text-muted-foreground">
                      <p>
                        Creat:{" "}
                        {formatDistanceToNow(new Date(selectedSubmission.created_at), {
                          addSuffix: true,
                          locale: ro,
                        })}
                      </p>
                      <p>
                        Actualizat:{" "}
                        {formatDistanceToNow(new Date(selectedSubmission.updated_at), {
                          addSuffix: true,
                          locale: ro,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">
                      Selectează un mesaj pentru a vedea detaliile
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
