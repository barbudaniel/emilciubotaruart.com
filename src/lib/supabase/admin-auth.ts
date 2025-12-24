import type { User } from "@supabase/supabase-js";

import { createClient } from "./server-client";

export class AdminAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireAdminUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AdminAuthError(401, "Autentificare necesară");
  }

  if ((user.user_metadata?.role as string | undefined) !== "admin") {
    throw new AdminAuthError(403, "Acces restricționat");
  }

  return user;
}






