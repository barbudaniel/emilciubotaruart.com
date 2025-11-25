import { getSupabaseClient } from "./client";

export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }
  const { data } = await client.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}
