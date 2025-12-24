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
     

      <Button variant="outline" size="sm" asChild>
        <Link href="/" target="_blank">
          <ExternalLink className="mr-2 h-4 w-4" />
          Vezi site-ul
        </Link>
      </Button>
    </div>
  );
};






