"use client";

import Link from "next/link";
import { ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsData } from "@/providers/cms-data-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AdminPageActions = () => {
  const { reset } = useCmsData();

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetează datele
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va anula toate modificările locale care nu au fost încă sincronizate sau va reîncărca datele de pe server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>Confirmă resetarea</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="outline" size="sm" asChild>
        <Link href="/" target="_blank">
          <ExternalLink className="mr-2 h-4 w-4" />
          Vezi site-ul
        </Link>
      </Button>
    </div>
  );
};


