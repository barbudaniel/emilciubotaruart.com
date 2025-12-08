#!/usr/bin/env tsx

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { ensureAdminUser } from "@/lib/supabase/admin-utils";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before running this script.");
    process.exit(1);
  }

  try {
    await ensureAdminUser({ email, password });
    console.log(`✅ Admin user ensured: ${email}`);
  } catch (error) {
    console.error("❌ Failed to seed admin user:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();



