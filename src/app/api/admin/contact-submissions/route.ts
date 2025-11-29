import { NextResponse } from "next/server";

import { AdminAuthError, requireAdminUser } from "@/lib/supabase/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase/service-client";

export async function GET() {
  try {
    await requireAdminUser();
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/admin/contact-submissions] Supabase error:", error);
      return NextResponse.json({ error: "Nu s-au putut încărca mesajele." }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[api/admin/contact-submissions] Unexpected error:", error);
    return NextResponse.json({ error: "A apărut o eroare neașteptată." }, { status: 500 });
  }
}


