import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { AdminAuthError, requireAdminUser } from "@/lib/supabase/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase/service-client";

const updateSchema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"]),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();

    const { id: submissionId } = await params;
    
    if (!submissionId) {
      return NextResponse.json({ error: "ID-ul mesajului lipsește." }, { status: 400 });
    }

    const payload = updateSchema.parse(await request.json());
    const supabase = getServiceRoleClient();
    const updates: Record<string, unknown> = { status: payload.status };

    if (payload.notes !== undefined) {
      const trimmedNotes = payload.notes.trim();
      updates.notes = trimmedNotes.length > 0 ? trimmedNotes : null;
    }

    const { data, error } = await supabase
      .from("contact_submissions")
      .update(updates)
      .eq("id", submissionId)
      .select("*")
      .single();

    if (error) {
      console.error("[api/admin/contact-submissions/:id] Supabase error:", error);
      return NextResponse.json({ error: "Nu s-a putut actualiza mesajul." }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors.map((issue) => issue.message).join(", ") }, { status: 400 });
    }

    console.error("[api/admin/contact-submissions/:id] Unexpected error:", error);
    return NextResponse.json({ error: "A apărut o eroare neașteptată." }, { status: 500 });
  }
}
