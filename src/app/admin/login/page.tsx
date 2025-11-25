"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>();
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabaseConfigured) {
      setError("Supabase nu este configurat încă. Adaugă NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setStatus("loading");
    setError(undefined);
    
    try {
      const supabase = getSupabaseClient();
      
      if (!supabase) {
        throw new Error("Supabase client is not available");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("error");
        setError(error.message);
        setStatus("idle");
        return;
      }

      // Use window.location.href for a full page reload to ensure cookies are picked up
      window.location.href = "/admin";
    } catch (err) {
      console.error("[handleSubmit] Exception during login:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Nu s-a putut finaliza autentificarea.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Autentificare admin</CardTitle>
            <CardDescription>Folosește adresa și parola configurate în Supabase Auth.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parolă</Label>
                <Input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Se autentifică..." : "Autentifică-te"}
              </Button>
            </form>
            {!supabaseConfigured && (
              <p className="mt-4 text-xs text-muted-foreground">
                Pentru a activa autentificarea, configurează variabilele <code>NEXT_PUBLIC_SUPABASE_URL</code> și{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
