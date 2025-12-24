import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { getServiceRoleClient } from "@/lib/supabase/service-client";

const contactSchema = z.object({
  name: z.string().min(1, "Numele este obligatoriu"),
  email: z.string().email("Email invalid"),
  phone: z.string().max(50).optional(),
  regarding: z.string().min(1, "Subiectul este obligatoriu"),
  message: z.string().min(10, "Mesajul trebuie să aibă cel puțin 10 caractere"),
});

export async function POST(request: Request) {
  try {
    const payload = contactSchema.parse(await request.json());
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || null,
        regarding: payload.regarding.trim(),
        message: payload.message.trim(),
        status: "unread",
      })
      .select("*")
      .single();

    if (error) {
      console.error("[api/contact] Supabase insert failed:", error);
      return NextResponse.json({ error: "Nu s-a putut trimite mesajul. Încercați din nou." }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors.map((issue) => issue.message).join(", ") }, { status: 400 });
    }

    console.error("[api/contact] Unexpected error:", error);
    return NextResponse.json({ error: "A apărut o eroare neașteptată. Încercați din nou." }, { status: 500 });
  }
}






