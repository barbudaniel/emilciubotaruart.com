import { getServiceRoleClient } from "./service-client";

type EnsureAdminUserOptions = {
  email: string;
  password: string;
};

export async function ensureAdminUser({ email, password }: EnsureAdminUserOptions) {
  if (!email || !password) {
    throw new Error("Missing admin credentials. Provide both ADMIN_EMAIL and ADMIN_PASSWORD.");
  }

  const client = getServiceRoleClient();

  const existing = await client.auth.admin.getUserByEmail(email);

  if (existing.data?.user) {
    console.info(`[admin-utils] Admin user already exists: ${email}`);
    return existing.data.user;
  }

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "admin",
    },
  });

  if (error) {
    throw new Error(`[admin-utils] Failed to create admin user: ${error.message}`);
  }

  console.info(`[admin-utils] Admin user created: ${email}`);
  return data.user;
}
