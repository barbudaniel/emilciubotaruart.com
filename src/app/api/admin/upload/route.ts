import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
             // No need to set cookies here
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Handle Upload
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const path = formData.get("path") as string;

    if (!file || !bucket || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Upload using Service Role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

